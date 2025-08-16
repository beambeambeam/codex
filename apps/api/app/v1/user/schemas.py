"""Authentication request/response schemas."""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserInfoSchema(BaseModel):
    display: str = Field(..., example="John Doe")
    username: str = Field(..., example="john_doe")
    email: EmailStr = Field(..., example="john@example.com")


class UserRegisterRequest(BaseModel):
    """User registration request payload."""

    username: str = Field(..., example="john_doe")
    email: EmailStr = Field(..., example="john@example.com")
    password: str = Field(..., min_length=8, example="strongpassword123")


class UserLoginRequest(BaseModel):
    """User login request payload."""

    email: EmailStr = Field(..., example="john@example.com")
    password: str = Field(..., example="strongpassword123")
    remember_me: Optional[bool] = Field(False, example=True)


class UserRegisterResponse(UserInfoSchema):
    """User Register response payload"""


class UserLoginResponse(UserInfoSchema):
    """User Login response payload"""


class AuthStatusResponse(BaseModel):
    """Auth status check response payload"""

    logged_in: bool = Field(
        ..., example=True, description="Whether the user is currently logged in"
    )


class UserEditRequest(BaseModel):
    """User edit request payload"""

    display: Optional[str] = Field(None, example="John Doe")


class UserEditResponse(BaseModel):
    """User edit response payload"""

    display: str = Field(..., example="John Doe")
