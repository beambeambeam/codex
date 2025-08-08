from datetime import datetime, timedelta
from uuid import uuid4

import bcrypt

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models.user import Account, User, Session as UserSession


class UserService:
    """Authentication service for handling user auth operations."""

    def __init__(self, db: Session, secret_key: str):
        """Initialize auth service."""
        self.db = db
        self.secret_key = secret_key

        self.default_session_duration = timedelta(days=7)
        self.remember_me_duration = timedelta(days=30)

    def create_session(self, user_id: str, remember_me: bool = False) -> str:
        """Create a new session for the user."""
        session_id = str(uuid4())
        expires_at = datetime.utcnow() + (
            self.remember_me_duration if remember_me else self.default_session_duration
        )

        session = UserSession(id=session_id, user_id=user_id, expires_at=expires_at)

        self.db.add(session)
        self.db.commit()

        return session_id

    def get_session(self, session_id: str) -> UserSession:
        """Get session by ID and validate it's not expired."""
        session = (
            self.db.query(UserSession).filter(UserSession.id == session_id).first()
        )

        if not session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid session",
            )

        if session.expires_at and session.expires_at < datetime.utcnow():
            self.db.delete(session)
            self.db.commit()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired",
            )

        return session

    def delete_session(self, session_id: str) -> None:
        """Delete a session."""
        session = (
            self.db.query(UserSession).filter(UserSession.id == session_id).first()
        )
        if session:
            self.db.delete(session)
            self.db.commit()

    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt with random salt."""
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

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

    def authenticate_user(
        self, username_or_email: str, password: str, remember_me: bool = False
    ) -> tuple[User, str]:
        """Authenticate the user and return user with session ID"""

        user = (
            self.db.query(User)
            .filter(
                (User.username == username_or_email) | (User.email == username_or_email)
            )
            .first()
        )

        if not user or not user.accounts:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username/email or password",
            )

        account = user.accounts[0]
        if not self.verify_password(password, account.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username/email or password",
            )

        session_id = self.create_session(user.id, remember_me)

        return user, session_id

    def get_current_user(self, session_id: str) -> User:
        """Get current user from session ID."""
        session = self.get_session(session_id)

        user = self.db.query(User).filter(User.id == session.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )

        return user

    def logout_user(self, session_id: str) -> None:
        """Logout user by deleting session."""
        self.delete_session(session_id)
