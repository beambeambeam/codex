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


@lru_cache
def get_settings() -> Settings:
    """Get cached application settings."""
    return Settings()
