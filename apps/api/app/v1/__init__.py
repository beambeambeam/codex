from fastapi import APIRouter

from .collection.router import router as collection_router
from .document.router import router as document_router
from .health.router import router as health_router
from .storage.router import router as storage_router
from .user.router import router as user_router

api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(health_router)
api_v1_router.include_router(user_router)
api_v1_router.include_router(collection_router)
api_v1_router.include_router(storage_router)
api_v1_router.include_router(document_router)

app_v1_route = api_v1_router
