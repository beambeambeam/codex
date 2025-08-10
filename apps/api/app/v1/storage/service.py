import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
from fastapi import HTTPException, status, UploadFile
from minio import Minio
from minio.error import S3Error
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from ...config import get_settings
from .schemas import FileResponse
from ..models.file import File


class StorageService:
    """Service for file storage operations using MinIO."""

    def __init__(self, db: Session):
        self.settings = get_settings()
        self._client = None
        self.db = db

    @property
    def client(self) -> Minio:
        if self._client is None:
            self._client = Minio(
                endpoint=self.settings.MINIO_ENDPOINT,
                access_key=self.settings.MINIO_ACCESS_KEY,
                secret_key=self.settings.MINIO_SECRET_KEY,
                secure=self.settings.MINIO_SECURE,
            )
        return self._client

    def ensure_bucket_exists(self, bucket_name: Optional[str] = None) -> None:
        bucket_name = bucket_name or self.settings.MINIO_BUCKET_NAME
        try:
            if not self.client.bucket_exists(bucket_name):
                self.client.make_bucket(bucket_name)
                try:
                    policy_json = json.dumps(self.settings.MINIO_POLICY)
                    self.client.set_bucket_policy(bucket_name, policy_json)
                    logging.info(
                        f"Success: Read-only policy set for bucket '{bucket_name}'."
                    )
                except S3Error as e:
                    logging.critical(f"Error setting bucket policy: {e}")
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Failed to set bucket policy",
                    ) from e
                except Exception as e:
                    logging.critical(f"Unexpected error setting bucket policy: {e}")
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Unexpected error while setting bucket policy",
                    ) from e
        except S3Error as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create bucket: {e}",
            ) from e

    def _get_display_name(self, file: File) -> Optional[str]:
        """Resolve display name from uploader."""
        if file.uploader:
            return (
                file.uploader.display or file.uploader.username or str(file.upload_by)
            )
        return str(file.upload_by) if file.upload_by else None

    def _file_to_response(self, file: File) -> FileResponse:
        """Convert File model to FileResponse."""
        resp = FileResponse.model_validate(file)
        resp.upload_by = self._get_display_name(file)
        scheme = "https" if self.settings.MINIO_SECURE else "http"
        resp.url = f"{scheme}://{self.settings.MINIO_ENDPOINT}/{file.url}"
        return resp

    async def upload_file_to_storage(
        self,
        file: UploadFile,
        user_id: UUID,
        object_name: Optional[str] = None,
        bucket_name: Optional[str] = None,
    ) -> FileResponse:
        bucket_name = bucket_name or self.settings.MINIO_BUCKET_NAME
        self.ensure_bucket_exists(bucket_name)
        object_name = object_name or f"{uuid.uuid4()}"

        try:
            # Get file size by seeking to the end of the file-like object
            file.file.seek(0, 2)
            file_size = file.file.tell()
            file.file.seek(0)  # Rewind to the start for reading

            self.client.put_object(
                bucket_name=bucket_name,
                object_name=object_name,
                data=file.file,
                length=file_size,
                content_type=file.content_type,
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload file to storage: {e}",
            ) from e

        new_file = File(
            upload_by=user_id,
            upload_at=datetime.now(timezone.utc),
            name=file.filename,
            size=file_size,
            type=file.content_type,
            url=f"{bucket_name}/{object_name}",
        )
        self.db.add(new_file)
        self.db.commit()
        self.db.refresh(new_file)
        return self._file_to_response(new_file)

    def get_user_files(self, user_id: UUID) -> list[FileResponse]:
        try:
            files = self.db.query(File).filter(File.upload_by == user_id).all()
            return [self._file_to_response(f) for f in files]
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {e}",
            ) from e

    def get_file_by_id(self, file_id: str, user_id: UUID) -> FileResponse:
        try:
            file_uuid = UUID(file_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file ID format"
            )

        try:
            file = (
                self.db.query(File)
                .filter(File.id == file_uuid, File.upload_by == user_id)
                .first()
            )
            if not file:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
                )
            return self._file_to_response(file)
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {e}",
            ) from e

    def delete_file(self, file_id: str, user_id: UUID) -> None:
        try:
            file_uuid = UUID(file_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file ID format"
            )

        try:
            file = (
                self.db.query(File)
                .filter(File.id == file_uuid, File.upload_by == user_id)
                .first()
            )
            if not file:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
                )

            try:
                bucket_name, object_name = file.url.split("/", 1)
                self.client.remove_object(bucket_name, object_name)
            except S3Error as e:
                self.db.rollback()
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to delete file from storage: {e}",
                ) from e

            self.db.delete(file)
            self.db.commit()
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {e}",
            ) from e
