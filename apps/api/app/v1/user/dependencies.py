from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from ...config import get_settings
from ...db import get_db
from ..models.user import User
from .service import UserService


def get_user_service(db: Session = Depends(get_db)) -> UserService:
    """Get user service instance."""

    settings = get_settings()
    return UserService(db, settings.SECRET_KEY)


def get_current_user(
    request: Request,
    user_service: UserService = Depends(get_user_service),
) -> User:
    """Get current user from session cookie."""
    session_id = request.cookies.get("session_id")

    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    return user_service.get_current_user(session_id)
