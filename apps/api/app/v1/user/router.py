from fastapi import APIRouter, Response, status

from .schemas import UserRegisterRequest, UserRegisterResponse
from ...utils.response import CommonResponse

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post(
    "/register",
    response_model=UserRegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    user_data: UserRegisterRequest,
    response: Response,
    remember_me: bool = False,
) -> UserRegisterResponse:
    """Register a new user with enhanced cookie session."""

    return CommonResponse[UserRegisterResponse](
        message="User registered successfully",
        detail=UserRegisterResponse(username="john_doe", email="john@example.com"),
    )
