from fastapi import Depends
from .service import StorageService
from ...db import get_db


def get_storage_service(db=Depends(get_db)) -> StorageService:
    """Get storage service instance."""
    return StorageService(db)
