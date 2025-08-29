from fastapi import Depends

from ...db import get_db
from .service import DocumentService


def get_document_service(db=Depends(get_db)) -> DocumentService:
    """Get document service instance."""
    return DocumentService(db)
