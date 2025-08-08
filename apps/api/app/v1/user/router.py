from fastapi import APIRouter, Depends, status

from .schemas import UserRegisterRequest, UserRegisterResponse
from .service import UserService
from .dependencies import get_user_service
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
