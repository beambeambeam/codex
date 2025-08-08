from datetime import timedelta
from uuid import uuid4

import bcrypt

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.user import Account, User


class UserService:
    """Authentication service for handling user auth operations."""

    def __init__(self, db: Session, secret_key: str):
        """Initialize auth service."""
        self.db = db
        self.secret_key = secret_key
        self.algorithm = "HS256"

        self.default_session_duration = timedelta(days=7)
        self.remember_me_duration = timedelta(days=30)

    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt."""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

    def verify_password(self, password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))

    def create_user(self, username: str, email: str, password: str) -> User:
        """Create a new user with account."""
        existing_user = (
            self.db.query(User)
            .filter((User.username == username) | (User.email == email))
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already exists",
            )

        clean_username = "".join(
            c.lower() if c.isalnum() or c == " " else "" for c in username
        ).replace(" ", "_")

        user = User(
            id=str(uuid4()), username=clean_username, email=email, display=username
        )
        self.db.add(user)
        self.db.flush()

        account = Account(
            id=str(uuid4()), password=self.hash_password(password), user_id=user.id
        )
        self.db.add(account)
        self.db.commit()
        self.db.refresh(user)

        return user
