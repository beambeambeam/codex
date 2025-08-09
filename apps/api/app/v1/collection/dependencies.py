from fastapi import Depends
from sqlalchemy.orm import Session

from .service import CollectionService
from ...db import get_db


def get_collection_service(db: Session = Depends(get_db)) -> CollectionService:
    """Get collection service instance."""
    return CollectionService(db)
