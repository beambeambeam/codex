from fastapi import APIRouter, Depends, status, Response, Request

from .schemas import (
    UserRegisterRequest,
    UserRegisterResponse,
    UserLoginRequest,
    UserLoginResponse,
)
from .service import UserService
from .dependencies import get_user_service, get_current_user
from ..models.user import User
from ...utils.response import CommonResponse

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post(
    "/register",
    response_model=CommonResponse[UserRegisterResponse],
    status_code=status.HTTP_201_CREATED,
)
def register(
    user_data: UserRegisterRequest,
    user_service: UserService = Depends(get_user_service),
) -> CommonResponse[UserRegisterResponse]:
    """Register a new user with enhanced cookie session."""

    user = user_service.create_user(
        username=user_data.username,
        email=user_data.email,
        password=user_data.password,
    )

    return CommonResponse[UserRegisterResponse](
        message="User registered successfully",
        detail=UserRegisterResponse(
            username=user.username, email=user.email, display=user.display
        ),
    )


@router.post(
    "/login",
    response_model=CommonResponse[UserLoginResponse],
    status_code=status.HTTP_200_OK,
)
def login(
    login_data: UserLoginRequest,
    response: Response,
    user_service: UserService = Depends(get_user_service),
) -> CommonResponse[UserLoginResponse]:
    """Login a user to system"""

    user, session_id = user_service.authenticate_user(
        username_or_email=login_data.username_or_email,
        password=login_data.password,
        remember_me=login_data.remember_me or False,
    )

    # Set session cookie
    max_age = (
        60 * 60 * 24 * 30 if login_data.remember_me else 60 * 60 * 24 * 7
    )  # 30 days or 7 days
    response.set_cookie(
        key="session_id",
        value=session_id,
        max_age=max_age,
        httponly=True,
        secure=True,  # Set to False for development without HTTPS
        samesite="lax",
    )

    return CommonResponse[UserLoginResponse](
        message="User logged in successfully",
        detail=UserLoginResponse(
            username=user.username,
            email=user.email,
            display=user.display,
        ),
    )


@router.post(
    "/logout",
    response_model=CommonResponse[dict],
    status_code=status.HTTP_200_OK,
)
def logout(
    request: Request,
    response: Response,
    user_service: UserService = Depends(get_user_service),
) -> CommonResponse[dict]:
    """Logout current user"""

    session_id = request.cookies.get("session_id")
    if session_id:
        user_service.logout_user(session_id)

    # Clear the session cookie
    response.delete_cookie(key="session_id")

    return CommonResponse[dict](
        message="User logged out successfully",
        detail={},
    )


@router.get(
    "/me",
    response_model=CommonResponse[UserLoginResponse],
    status_code=status.HTTP_200_OK,
)
def get_current_user_info(
    current_user: User = Depends(get_current_user),
) -> CommonResponse[UserLoginResponse]:
    """Get current user information"""

    return CommonResponse[UserLoginResponse](
        message="User information retrieved successfully",
        detail=UserLoginResponse(
            username=current_user.username,
            email=current_user.email,
            display=current_user.display,
        ),
    )
