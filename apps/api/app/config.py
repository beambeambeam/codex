import os
from functools import lru_cache


class Settings:
    """Application settings."""

    # Database settings
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "root_admin")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "root_admin")

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+psycopg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@localhost:3002/postgres"

    SECRET_KEY: str = os.getenv("SECRET_KEY", "SECRET_KEY_IN_PRODUCTION")

    MINIO_ENDPOINT: str = os.getenv("MINIO_ENDPOINT", "localhost:9000")
    MINIO_ACCESS_KEY: str = os.getenv("MINIO_ROOT_USER", "root_admin")
    MINIO_SECRET_KEY: str = os.getenv("MINIO_ROOT_PASSWORD", "root_admin")
    MINIO_SECURE: bool = os.getenv("MINIO_SECURE", "false").lower() == "true"
    MINIO_BUCKET_NAME: str = os.getenv("MINIO_BUCKET_NAME", "files")

    @property
    def MINIO_POLICY(self):
        return {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"AWS": "*"},
                    "Action": ["s3:GetBucketLocation", "s3:ListBucket"],
                    "Resource": f"arn:aws:s3:::{self.MINIO_BUCKET_NAME}",
                },
                {
                    "Effect": "Allow",
                    "Principal": {"AWS": "*"},
                    "Action": "s3:GetObject",
                    "Resource": f"arn:aws:s3:::{self.MINIO_BUCKET_NAME}/*",
                },
            ],
        }


@lru_cache
def get_settings() -> Settings:
    """Get cached application settings."""
    return Settings()
