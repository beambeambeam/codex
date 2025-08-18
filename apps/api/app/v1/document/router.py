from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel


from .schemas import DocumentCreateRequest, DocumentResponse
from .service import DocumentService
from .dependencies import get_document_service
from ..user.dependencies import get_current_user
from ..models.user import User
from ..storage.service import StorageService
from ..storage.dependencies import get_storage_service
from ..models import FileResouceEnum

router = APIRouter(prefix="/documents", tags=["documents"])


class DocumentUploadItem(BaseModel):
    file: UploadFile = File(...)
    title: Optional[str] = None
    description: Optional[str] = None


@router.post(
    "/uploads",
    response_model=List[DocumentResponse],
    status_code=status.HTTP_201_CREATED,
)
async def bulk_upload_documents(
    items: List[DocumentUploadItem] = Form(..., media_type="multipart/form-data"),
    collection_id: Optional[str] = Form(default=None),
    current_user: User = Depends(get_current_user),
    storage_service: StorageService = Depends(get_storage_service),
    document_service: DocumentService = Depends(get_document_service),
):
    """Bulk upload multiple files to the same collection. Each file can have its own title and description."""
    if not items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No items provided"
        )

    # Validate collection exists if provided
    collection_uuid = None
    if collection_id:
        try:
            collection_uuid = UUID(collection_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid collection ID format",
            )

    created_documents = []
    failed_uploads = []

    for i, item in enumerate(items):
        try:
            if not item.file.filename:
                failed_uploads.append(
                    {"index": i, "filename": "unknown", "error": "No filename provided"}
                )
                continue

            # Upload file to storage
            file_response = await storage_service.upload_file_to_storage(
                file=item.file,
                user_id=current_user.id,
                resource=FileResouceEnum.DOCUMENT,
            )

            # Use provided title or filename as fallback
            title = item.title if item.title else item.file.filename
            description = item.description

            # Create document with individual title and description
            document_data = DocumentCreateRequest(
                user_id=current_user.id,
                collection_id=collection_uuid,
                file_id=file_response.id,
                title=title,
                description=description,
                summary=None,
            )

            document = document_service.create_document(document_data)
            created_documents.append(document)

        except Exception as e:
            failed_uploads.append(
                {
                    "index": i,
                    "filename": item.file.filename or "unknown",
                    "error": str(e),
                }
            )

    if not created_documents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="All file uploads failed"
        )

    return created_documents


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
