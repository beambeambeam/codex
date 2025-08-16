from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import Optional


from .schemas import DocumentCreateRequest, DocumentResponse
from .service import DocumentService
from .dependencies import get_document_service
from ..user.dependencies import get_current_user
from ..models.user import User
from ..storage.service import StorageService
from ..storage.dependencies import get_storage_service
from ..models import FileResouceEnum

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post(
    "/upload",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_and_create_document(
    file: UploadFile = File(...),
    title: Optional[str] = None,
    description: Optional[str] = None,
    summary: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    storage_service: StorageService = Depends(get_storage_service),
    document_service: DocumentService = Depends(get_document_service),
):
    """Upload a file and create a document in one step."""
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No file provided"
        )

    # Upload file to storage
    file_response = await storage_service.upload_file_to_storage(
        file=file, user_id=current_user.id, resource=FileResouceEnum.DOCUMENT
    )

    try:
        document_data = DocumentCreateRequest(
            user_id=current_user.id,
            file_id=file_response.id,
            title=title,
            description=description,
            summary=summary,
        )
        document = document_service.create_document(document_data)
        return document
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete(
    "/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Delete a document by ID. Only the owner can delete their document."""
    try:
        # Optionally, you could check if the document belongs to the user here
        document_service.delete_document(
            document_id=document_id, user_id=str(current_user.id)
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
