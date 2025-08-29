from fastapi import Depends

from ...db import get_db
from .service import StorageService


def get_storage_service(db=Depends(get_db)) -> StorageService:
    """Get storage service instance."""
    return StorageService(db)
