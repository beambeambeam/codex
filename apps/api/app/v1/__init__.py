from fastapi import APIRouter
from .health.router import router as health_router


api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(health_router)

app_v1_route = api_v1_router
