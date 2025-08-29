from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)

from ..models import FileResouceEnum
from ..models.user import User
from ..storage.dependencies import get_storage_service
from ..storage.service import StorageService
from ..user.dependencies import get_current_user
from .dependencies import get_document_service
from .schemas import (
    DocumentAudit,
    DocumentCreateRequest,
    DocumentResponse,
    DocumentTagCreateRequest,
    DocumentTagResponse,
    DocumentTagUpdateRequest,
    DocumentUpdateRequest,
    PaginatedDocumentResponse,
    TagCreateRequest,
    TagResponse,
    TagUpdateRequest,
)
from .service import DocumentService

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post(
    "/uploads",
    response_model=list[DocumentResponse],
    status_code=status.HTTP_201_CREATED,
)
async def bulk_upload_documents(
    files: list[UploadFile] = File(...),
    collection_id: UUID = Form(default=None),
    current_user: User = Depends(get_current_user),
    storage_service: StorageService = Depends(get_storage_service),
    document_service: DocumentService = Depends(get_document_service),
):
    """Bulk upload multiple files to the same collection."""
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

            document_data = DocumentCreateRequest(
                user_id=current_user.id,
                collection_id=collection_id,
                file_id=file_response.id,
                title=None,
                description=None,
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e)) from e


@router.get(
    "/{document_id}",
    response_model=DocumentResponse,
    status_code=status.HTTP_200_OK,
)
async def get_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Get a document by ID."""
    try:
        return document_service.get_document(document_id=document_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e)) from e


@router.put(
    "/{document_id}",
    response_model=DocumentResponse,
    status_code=status.HTTP_200_OK,
)
async def update_document(
    document_id: str,
    document_update: DocumentUpdateRequest,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Update a document by ID."""
    try:
        return document_service.update_document(
            document_id=document_id,
            document_update=document_update,
            user_id=str(current_user.id),
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e)) from e


@router.get(
    "/{document_id}/audit",
    response_model=list[DocumentAudit],
    status_code=status.HTTP_200_OK,
)
async def get_document_audit(
    document_id: str,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Get all audit records for a document by ID."""
    try:
        document_service.get_document(document_id=document_id)
        return document_service.audit.get_audits_for_document(document_id=document_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e)) from e


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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e)) from e


# Tag endpoints
@router.post(
    "/tags",
    response_model=TagResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_tag(
    tag_create: TagCreateRequest,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Create a new tag."""
    try:
        return document_service.create_tag(tag_create)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        ) from e


@router.get(
    "/tags/collection/{collection_id}",
    response_model=list[TagResponse],
    status_code=status.HTTP_200_OK,
)
async def get_tags_by_collection(
    collection_id: str,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Get all tags for a specific collection."""
    try:
        return document_service.get_tags_by_collection(collection_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e)) from e


@router.get(
    "/tags/{tag_id}",
    response_model=TagResponse,
    status_code=status.HTTP_200_OK,
)
async def get_tag(
    tag_id: str,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Get a tag by ID."""
    try:
        return document_service.get_tag(tag_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e)) from e


@router.put(
    "/tags/{tag_id}",
    response_model=TagResponse,
    status_code=status.HTTP_200_OK,
)
async def update_tag(
    tag_id: str,
    tag_update: TagUpdateRequest,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Update a tag."""
    try:
        return document_service.update_tag(tag_id, tag_update)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e)) from e


@router.delete(
    "/tags/{tag_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_tag(
    tag_id: str,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Delete a tag."""
    try:
        document_service.delete_tag(tag_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e)) from e


# Document tag endpoints
@router.post(
    "/document-tags",
    response_model=DocumentTagResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_tag_to_document(
    document_tag_create: DocumentTagCreateRequest,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Add a tag to a document."""
    try:
        return document_service.add_tag_to_document(document_tag_create)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        ) from e


@router.delete(
    "/document-tags/{document_id}/{tag_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def remove_tag_from_document(
    document_id: str,
    tag_id: str,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Remove a tag from a document."""
    try:
        document_service.remove_tag_from_document(document_id, tag_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e)) from e


@router.get(
    "/{document_id}/tags",
    response_model=list[TagResponse],
    status_code=status.HTTP_200_OK,
)
async def get_document_tags(
    document_id: str,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Get all tags for a specific document."""
    try:
        return document_service.get_document_tags(document_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e)) from e


@router.put(
    "/{document_id}/tags",
    response_model=list[TagResponse],
    status_code=status.HTTP_200_OK,
)
async def update_document_tags(
    document_id: str,
    document_tag_update: DocumentTagUpdateRequest,
    current_user: User = Depends(get_current_user),
    document_service: DocumentService = Depends(get_document_service),
):
    """Update all tags for a document in one operation."""
    try:
        return document_service.replace_document_tags(
            document_id=document_id, tag_items=document_tag_update.tag_ids
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        ) from e
