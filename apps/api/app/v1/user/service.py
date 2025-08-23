from datetime import datetime, timedelta, timezone
from uuid import uuid4

import bcrypt
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from ..models.user import Account, User, Session as UserSession, UserAiPreference


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
        expires_at = datetime.now(timezone.utc) + (
            self.remember_me_duration if remember_me else self.default_session_duration
        )

        session = UserSession(id=session_id, user_id=user_id, expires_at=expires_at)

        # Single operation, no need for transaction block
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

        expires_at = session.expires_at
        if expires_at and expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if expires_at and expires_at < datetime.now(timezone.utc):
            # Expired session — delete it atomically
            with self.db.begin():
                self.db.delete(session)

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
        """Create a new user with account and AI preference."""

        existing_user = (
            self.db.query(User)
            .filter((User.username == username) | (User.email == email))
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed. Please try again with different information.",
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

        ai_preference = UserAiPreference(
            id=str(uuid4()),
            user_id=user.id,
            call=None,
            skillset=None,
            depth_of_explanation=None,
            language_preference=None,
            stopwords=None,
        )
        self.db.add(ai_preference)

        self.db.commit()
        self.db.refresh(user)
        return user

    def authenticate_user(
        self, email: str, password: str, remember_me: bool = False
    ) -> tuple[User, str]:
        """Authenticate the user and return user with session ID"""

        user = (
            self.db.query(User)
            .options(joinedload(User.account))
            .filter(User.email == email)
            .first()
        )

        if not user or not user.account:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        if not self.verify_password(password, user.account.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
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

    def edit_user(
        self,
        user_id: str,
        display: Optional[str] = None,
        username: Optional[str] = None,
        email: Optional[str] = None,
    ) -> User:
        """Edit user information."""
        """Edit user information."""

        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        # Check if email is already taken by another user
        if email and email != user.email:
            existing_user = (
                self.db.query(User)
                .filter(User.email == email, User.id != user_id)
                .first()
            )
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Update failed. Please try again with different information.",
                )

        # Check if username is already taken by another user
        if username and username != user.username:
            clean_username = "".join(
                c.lower() if c.isalnum() or c == " " else "" for c in username
            ).replace(" ", "_")

            existing_user = (
                self.db.query(User)
                .filter(User.username == clean_username, User.id != user_id)
                .first()
            )
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Update failed. Please try again with different information.",
                )
            username = clean_username

        # Update user fields if provided
        if display is not None:
            user.display = display
        if username is not None:
            user.username = username
        if email is not None:
            user.email = email

        self.db.commit()
        self.db.refresh(user)

        return user

    def get_user_ai_preference(self, user_id: str) -> Optional[UserAiPreference]:
        """Get user AI preference by user ID."""
        return (
            self.db.query(UserAiPreference)
            .filter(UserAiPreference.user_id == user_id)
            .first()
        )

    def create_user_ai_preference(
        self,
        user_id: str,
        call: Optional[str] = None,
        skillset: Optional[str] = None,
        depth_of_explanation: Optional[str] = None,
        language_preference: Optional[dict] = None,
        stopwords: Optional[dict] = None,
    ) -> UserAiPreference:
        """Create user AI preference."""

        preference = UserAiPreference(
            id=str(uuid4()),
            user_id=user_id,
            call=call,
            skillset=skillset,
            depth_of_explanation=depth_of_explanation,
            language_preference=language_preference,
            stopwords=stopwords,
        )

        self.db.add(preference)
        self.db.commit()
        self.db.refresh(preference)
        return preference

    def update_user_ai_preference(
        self,
        user_id: str,
        call: Optional[str] = None,
        skillset: Optional[str] = None,
        depth_of_explanation: Optional[str] = None,
        language_preference: Optional[dict] = None,
        stopwords: Optional[dict] = None,
    ) -> UserAiPreference:
        """Update user AI preference."""

        preference = self.get_user_ai_preference(user_id)
        if not preference:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="AI preference not found",
            )

        if call is not None:
            preference.call = call
        if skillset is not None:
            preference.skillset = skillset
        if depth_of_explanation is not None:
            preference.depth_of_explanation = depth_of_explanation
        if language_preference is not None:
            preference.language_preference = language_preference
        if stopwords is not None:
            preference.stopwords = stopwords

        self.db.commit()
        self.db.refresh(preference)
        return preference

    def delete_user_ai_preference(self, user_id: str) -> None:
        """Delete user AI preference."""

        preference = self.get_user_ai_preference(user_id)
        if not preference:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="AI preference not found",
            )

        self.db.delete(preference)
        self.db.commit()
