import json
from typing import Optional
from fastapi import HTTPException, status
from minio import Minio
from minio.error import S3Error
from sqlalchemy.orm import Session

from ...config import get_settings


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
