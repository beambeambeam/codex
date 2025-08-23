from fastapi import APIRouter, Depends, HTTPException, status, Response, Request

from .schemas import (
    UserRegisterRequest,
    UserRegisterResponse,
    UserLoginRequest,
    UserLoginResponse,
    AuthStatusResponse,
    UserEditRequest,
    UserEditResponse,
    UserAiPreferenceResponse,
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
            username=user.username or "",
            email=user.email or "",
            display=user.display or "",
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
        email=login_data.email,
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
            username=user.username or "",
            email=user.email or "",
            display=user.display or "",
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
            username=current_user.username or "",
            email=current_user.email or "",
            display=current_user.display or "",
        ),
    )


@router.get(
    "/check-auth",
    response_model=CommonResponse[AuthStatusResponse],
    status_code=status.HTTP_200_OK,
)
def check_auth_status(
    request: Request,
    user_service: UserService = Depends(get_user_service),
) -> CommonResponse[AuthStatusResponse]:
    """Check if user is currently logged in based on session cookie."""

    session_id = request.cookies.get("session_id")

    if not session_id:
        return CommonResponse[AuthStatusResponse](
            message="Not authenticated",
            detail=AuthStatusResponse(logged_in=False),
        )

    try:
        # Try to get current user to validate session
        user_service.get_current_user(session_id)
        return CommonResponse[AuthStatusResponse](
            message="User is authenticated",
            detail=AuthStatusResponse(logged_in=True),
        )
    except HTTPException:
        return CommonResponse[AuthStatusResponse](
            message="Session invalid or expired",
            detail=AuthStatusResponse(logged_in=False),
        )


@router.put(
    "/edit",
    response_model=CommonResponse[UserEditResponse],
    status_code=status.HTTP_200_OK,
)
def edit_user(
    user_data: UserEditRequest,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
) -> CommonResponse[UserEditResponse]:
    """Edit current user information."""

    updated_user = user_service.edit_user(
        user_id=str(current_user.id),
        display=user_data.display,
    )

    return CommonResponse[UserEditResponse](
        message="User updated successfully",
        detail=UserEditResponse(
            display=updated_user.display or "",
        ),
    )


@router.get(
    "/ai-preferences",
    response_model=CommonResponse[UserAiPreferenceResponse],
    status_code=status.HTTP_200_OK,
)
def get_user_ai_preferences(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
) -> CommonResponse[UserAiPreferenceResponse]:
    """Get current user AI preferences."""

    preference = user_service.get_user_ai_preference(str(current_user.id))

    if not preference:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI preferences not found",
        )

    return CommonResponse[UserAiPreferenceResponse](
        message="AI preferences retrieved successfully",
        detail=UserAiPreferenceResponse(
            id=str(preference.id),
            user_id=str(preference.user_id),
            call=preference.call,
            skillset=preference.skillset,
            depth_of_explanation=preference.depth_of_explanation,
            language_preference=preference.language_preference,
            stopwords=preference.stopwords,
            created_at=preference.created_at.isoformat(),
            updated_at=preference.updated_at.isoformat(),
        ),
    )
