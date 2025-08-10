from fastapi import Depends
from .service import DocumentService
from ...db import get_db


def get_document_service(db=Depends(get_db)) -> DocumentService:
    """Get document service instance."""
    return DocumentService(db)
