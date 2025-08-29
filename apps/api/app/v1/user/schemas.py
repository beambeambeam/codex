"""Authentication request/response schemas."""

from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from ..models.enum import DepthOfExplanationEnum


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


class LanguagePreferenceModel(BaseModel):
    """Language preference model"""

    LANGUAGE: List[str] = Field(..., example=["EN", "TH"])


class StopwordsModel(BaseModel):
    """Stopwords model"""

    STOP: List[str] = Field(..., example=["is", "bad word"])


class UserAiPreferenceRequest(BaseModel):
    """User AI preference request payload"""

    call: Optional[str] = Field(None, example="You are a helpful assistant")
    skillset: Optional[str] = Field(None, example="Python, JavaScript, React")
    depth_of_explanation: Optional[DepthOfExplanationEnum] = Field(
        None, example=DepthOfExplanationEnum.MEDIUM
    )
    language_preference: Optional[LanguagePreferenceModel] = Field(None)
    stopwords: Optional[StopwordsModel] = Field(None)


class UserAiPreferenceResponse(BaseModel):
    """User AI preference response payload"""

    id: str = Field(..., example="123e4567-e89b-12d3-a456-426614174000")
    user_id: str = Field(..., example="123e4567-e89b-12d3-a456-426614174000")
    call: Optional[str] = Field(None, example="You are a helpful assistant")
    skillset: Optional[str] = Field(None, example="Python, JavaScript, React")
    depth_of_explanation: Optional[DepthOfExplanationEnum] = Field(
        None, example=DepthOfExplanationEnum.MEDIUM
    )
    language_preference: Optional[LanguagePreferenceModel] = Field(None)
    stopwords: Optional[StopwordsModel] = Field(None)
    created_at: str = Field(..., example="2024-01-01T00:00:00Z")
    updated_at: str = Field(..., example="2024-01-01T00:00:00Z")
