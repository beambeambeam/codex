from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import List
from uuid import UUID


from .schemas import DocumentCreateRequest, DocumentResponse, PaginatedDocumentResponse
from .service import DocumentService
from .dependencies import get_document_service
from ..user.dependencies import get_current_user
from ..models.user import User
from ..storage.service import StorageService
from ..storage.dependencies import get_storage_service
from ..models import FileResouceEnum

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post(
    "/uploads",
    response_model=List[DocumentResponse],
    status_code=status.HTTP_201_CREATED,
)
async def bulk_upload_documents(
    files: List[UploadFile] = File(...),
    titles: List[str] = Form([]),
    descriptions: List[str] = Form([]),
    collection_id: UUID = Form(default=None),
    current_user: User = Depends(get_current_user),
    storage_service: StorageService = Depends(get_storage_service),
    document_service: DocumentService = Depends(get_document_service),
):
    """Bulk upload multiple files to the same collection. Each file can have its own title and description."""
    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No files provided"
        )

    created_documents = []
    failed_uploads = []

    for i, file in enumerate(files):
        try:
            if not file.filename:
                failed_uploads.append(
                    {"index": i, "filename": "unknown", "error": "No filename provided"}
                )
                continue

            # Upload file to storage
            file_response = await storage_service.upload_file_to_storage(
                file=file,
                user_id=current_user.id,
                resource=FileResouceEnum.DOCUMENT,
            )

            title = titles[i] if i < len(titles) and titles[i] else None
            description = (
                descriptions[i] if i < len(descriptions) and descriptions[i] else None
            )

            document_data = DocumentCreateRequest(
                user_id=current_user.id,
                collection_id=collection_id,
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
                    "filename": file.filename or "unknown",
                    "error": str(e),
                }
            )

    if not created_documents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="All file uploads failed"
        )

    return created_documents


@router.get(
    "/{collection_id}/table",
    response_model=PaginatedDocumentResponse,
    status_code=status.HTTP_200_OK,
)
async def get_documents_table(
    collection_id: str,
    page: int = 1,
    per_page: int = 10,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Get all documents in a collection with pagination for table display."""
    try:
        return document_service.get_documents_by_collection_paginated(
            collection_id=collection_id, page=page, per_page=per_page
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


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
