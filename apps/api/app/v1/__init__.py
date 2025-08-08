from fastapi import APIRouter
from .health.router import router as health_router
from .user.router import router as user_router


api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(health_router)
api_v1_router.include_router(user_router)

app_v1_route = api_v1_router
