from fastapi import Depends, HTTPException, status
from .service import DocumentService
from ...db import get_db
from .schemas import DocumentCreateRequest
from ..models.user import User
from ..user.dependencies import get_current_user


def get_document_service(db=Depends(get_db)) -> DocumentService:
    """Get document service instance."""
    return DocumentService(db)


def can_create_document_for_user(
    document_data: DocumentCreateRequest = Depends(),
    current_user: User = Depends(get_current_user),
):
    """Dependency to ensure user can only create documents for themselves."""
    if document_data.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only create documents for yourself",
        )
