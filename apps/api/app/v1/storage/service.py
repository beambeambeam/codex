import json
import uuid
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
import io
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
        """Initialize storage service."""
        self.settings = get_settings()
        self._client = None
        self.db = db

    @property
    def client(self) -> Minio:
        """Get MinIO client instance."""
        if self._client is None:
            self._client = Minio(
                endpoint=self.settings.MINIO_ENDPOINT,
                access_key=self.settings.MINIO_ACCESS_KEY,
                secret_key=self.settings.MINIO_SECRET_KEY,
                secure=self.settings.MINIO_SECURE,
            )

        return self._client

    def ensure_bucket_exists(self, bucket_name: Optional[str] = None) -> None:
        """Ensure the bucket exists."""
        if bucket_name is None:
            bucket_name = self.settings.MINIO_BUCKET_NAME

        try:
            if not self.client.bucket_exists(bucket_name):
                self.client.make_bucket(bucket_name)

                # Set bucket policy for read-only access
                try:
                    policy_json = json.dumps(self.settings.MINIO_POLICY)
                    self.client.set_bucket_policy(bucket_name, policy_json)
                    print(f"Success: Read-only policy set for bucket '{bucket_name}'.")
                except Exception as e:
                    print(f"Error: {e}")

        except S3Error as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create bucket: {e}",
            ) from e

    async def upload_file_to_storage(
        self,
        file: UploadFile,
        user_id: UUID,
        object_name: Optional[str] = None,
        bucket_name: Optional[str] = None,
    ) -> FileResponse:
        """
        Upload a file to MinIO storage and create a DB record in a transaction.

        Args:
            file: The file to upload
            user_id: The ID of the user uploading the file (required)
            object_name: The name to store the file as (defaults to file.filename)
            bucket_name: The bucket to upload to (defaults to settings bucket)

        Returns:
            FileResponse: The uploaded file's metadata
        """
        if bucket_name is None:
            bucket_name = self.settings.MINIO_BUCKET_NAME
        self.ensure_bucket_exists(bucket_name)

        if object_name is None:
            object_name = f"{uuid.uuid4()}"

        try:
            file_content = await file.read()
            file_like = io.BytesIO(file_content)
            self.client.put_object(
                bucket_name=bucket_name,
                object_name=object_name,
                data=file_like,
                length=len(file_content),
                content_type=file.content_type,
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to upload file to storage: {e}",
            ) from e

        db_url = f"{bucket_name}/{object_name}"
        new_file = File(
            upload_by=user_id,
            upload_at=datetime.now(timezone.utc),
            name=file.filename,
            size=len(file_content),
            type=file.content_type,
            url=db_url,
        )
        self.db.add(new_file)
        self.db.commit()
        self.db.refresh(new_file)

        display_name = None
        if new_file.uploader and new_file.uploader.display:
            display_name = new_file.uploader.display
        elif new_file.uploader and new_file.uploader.username:
            display_name = new_file.uploader.username
        else:
            display_name = str(new_file.upload_by) if new_file.upload_by else None

        file_dict = new_file.__dict__.copy()
        file_dict["upload_by"] = str(new_file.upload_by) if new_file.upload_by else None
        file_dict["url"] = f"{self.settings.MINIO_ENDPOINT}/{db_url}"
        resp = FileResponse.model_validate(file_dict)
        resp.upload_by = display_name

        return resp

    def get_user_files(self, user_id: UUID) -> list[FileResponse]:
        """Get all files uploaded by a specific user."""
        try:
            files = self.db.query(File).filter(File.upload_by == user_id).all()

            file_responses = []
            for file in files:
                # Get display name for response
                display_name = None
                if file.uploader and file.uploader.display:
                    display_name = file.uploader.display
                elif file.uploader and file.uploader.username:
                    display_name = file.uploader.username
                else:
                    display_name = str(file.upload_by) if file.upload_by else None

                file_dict = file.__dict__.copy()
                file_dict["url"] = f"{self.settings.MINIO_ENDPOINT}/{file.url}"
                file_dict["upload_by"] = str(file.upload_by) if file.upload_by else None
                resp = FileResponse.model_validate(file_dict)
                resp.upload_by = display_name
                file_responses.append(resp)

            return file_responses
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {e}",
            ) from e

    def get_file_by_id(self, file_id: str, user_id: UUID) -> FileResponse:
        """Get a specific file by ID that belongs to the user."""
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

            # Get display name for response
            display_name = None
            if file.uploader and file.uploader.display:
                display_name = file.uploader.display
            elif file.uploader and file.uploader.username:
                display_name = file.uploader.username
            else:
                display_name = str(file.upload_by) if file.upload_by else None

            file_dict = file.__dict__.copy()
            file_dict["url"] = f"{self.settings.MINIO_ENDPOINT}/{file.url}"
            file_dict["upload_by"] = str(file.upload_by) if file.upload_by else None
            resp = FileResponse.model_validate(file_dict)
            resp.upload_by = display_name
            return resp
        except SQLAlchemyError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {e}",
            ) from e

    def delete_file(self, file_id: str, user_id: UUID) -> None:
        """Delete a file by ID if it belongs to the user."""
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

            # TODO: Also delete from MinIO storage
            # For now, just delete from database
            self.db.delete(file)
            self.db.commit()
        except SQLAlchemyError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {e}",
            ) from e
