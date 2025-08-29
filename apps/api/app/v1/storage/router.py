from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from ..models.user import User
from ..user.dependencies import get_current_user
from .dependencies import get_storage_service
from .schemas import FileResponse
from .service import StorageService

router = APIRouter(prefix="/storage", tags=["storage"])


@router.post(
    "/upload",
    response_model=FileResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_file(
    file: UploadFile = File(...),
    resource: str = File(...),
    current_user: User = Depends(get_current_user),
    storage_service: StorageService = Depends(get_storage_service),
) -> FileResponse:
    """Upload a file to storage."""

    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No file provided"
        )

    return await storage_service.upload_file_to_storage(
        file=file,
        user_id=current_user.id,
        resource=resource,
    )


@router.get(
    "/files",
    response_model=list[FileResponse],
    status_code=status.HTTP_200_OK,
)
def get_user_files(
    current_user: User = Depends(get_current_user),
    storage_service: StorageService = Depends(get_storage_service),
) -> list[FileResponse]:
    """Get all files uploaded by the current user."""

    return storage_service.get_user_files(current_user.id)


@router.get(
    "/files/{file_id}",
    response_model=FileResponse,
    status_code=status.HTTP_200_OK,
)
def get_file(
    file_id: str,
    current_user: User = Depends(get_current_user),
    storage_service: StorageService = Depends(get_storage_service),
) -> FileResponse:
    """Get a specific file by ID."""

    return storage_service.get_file_by_id(file_id, current_user.id)


@router.delete(
    "/files/{file_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_file(
    file_id: str,
    current_user: User = Depends(get_current_user),
    storage_service: StorageService = Depends(get_storage_service),
):
    """Delete a file by ID."""

    storage_service.delete_file(file_id, current_user.id)
    return None
