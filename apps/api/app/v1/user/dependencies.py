from fastapi import Depends
from sqlalchemy.orm import Session

from .service import UserService

from ...db import get_db
from ...config import get_settings


def get_user_service(db: Session = Depends(get_db)) -> UserService:
    """Get user service instance."""

    settings = get_settings()
    return UserService(db, settings.SECRET_KEY)
