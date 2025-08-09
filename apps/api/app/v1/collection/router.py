from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from .schemas import (
    CollectionCreateRequest,
    CollectionResponse,
    CollectionAuditResponse,
    CollectionPermissionRequest,
    CollectionPermissionResponse,
)
from .service import CollectionService
from .dependencies import get_collection_service
from ..user.dependencies import get_current_user
from ..models.user import User
from ..models.enum import CollectionPermissionEnum
from fastapi import Body


router = APIRouter(prefix="/collections", tags=["collections"])


@router.post(
    "",
    response_model=CollectionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_collection(
    collection_data: CollectionCreateRequest,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> CollectionResponse:
    """Create a new collection."""

    collection = collection_service.create_collection(
        collection_data=collection_data,
        user_id=current_user.id,
    )

    return collection


@router.get(
    "",
    response_model=List[CollectionResponse],
    status_code=status.HTTP_200_OK,
)
def get_collections(
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> List[CollectionResponse]:
    """Get all collections the user has access to."""

    collections = collection_service.get_user_collections(current_user.id)

    return collections


@router.get(
    "/{collection_id}",
    response_model=CollectionResponse,
    status_code=status.HTTP_200_OK,
)
def get_collection(
    collection_id: str,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> CollectionResponse:
    """Get a collection by ID."""

    # Check if user has READ permission
    if not collection_service.has_permission(
        current_user.id, collection_id, CollectionPermissionEnum.READ
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to view this collection",
        )

    collection = collection_service.get_collection(collection_id)

    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found"
        )

    return collection


@router.get(
    "/{collection_id}/audits",
    response_model=List[CollectionAuditResponse],
    status_code=status.HTTP_200_OK,
)
def get_collection_audits(
    collection_id: str,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> List[CollectionAuditResponse]:
    """Get audits for a collection by ID."""

    # Check if user has READ permission
    if not collection_service.has_permission(
        current_user.id, collection_id, CollectionPermissionEnum.READ
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to view collection audits",
        )

    audits = collection_service.get_collection_audits(collection_id)
    return [CollectionAuditResponse.model_validate(a) for a in audits]


@router.put(
    "/{collection_id}",
    response_model=CollectionResponse,
    status_code=status.HTTP_200_OK,
)
def update_collection(
    collection_id: str,
    collection_data: CollectionCreateRequest = Body(...),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> CollectionResponse:
    """Update a collection by ID."""

    # Check if user has EDIT permission
    if not collection_service.has_permission(
        current_user.id, collection_id, CollectionPermissionEnum.EDIT
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to edit this collection",
        )

    updated = collection_service.update_collection(
        collection_id, collection_data, user_id=current_user.id
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found"
        )
    return updated


@router.delete(
    "/{collection_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_collection(
    collection_id: str,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Delete a collection by ID."""

    # Check if user has OWNER permission
    if not collection_service.has_permission(
        current_user.id, collection_id, CollectionPermissionEnum.OWNER
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owners can delete collections",
        )

    deleted = collection_service.delete_collection(
        collection_id, user_id=current_user.id
    )
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found"
        )
    return None


# Permission endpoints
@router.get(
    "/{collection_id}/permissions",
    response_model=List[CollectionPermissionResponse],
    status_code=status.HTTP_200_OK,
)
def get_collection_permissions(
    collection_id: str,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> List[CollectionPermissionResponse]:
    """Get all permissions for a collection."""
    # Check if user has at least READ permission
    if not collection_service.has_permission(
        current_user.id, collection_id, CollectionPermissionEnum.READ
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions to view collection permissions",
        )

    return collection_service.get_collection_permissions(collection_id)


@router.post(
    "/{collection_id}/permissions",
    response_model=CollectionPermissionResponse,
    status_code=status.HTTP_201_CREATED,
)
def grant_collection_permission(
    collection_id: str,
    permission_data: CollectionPermissionRequest,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> CollectionPermissionResponse:
    """Grant permission to a user for a collection."""
    # Only OWNER can grant permissions
    if not collection_service.has_permission(
        current_user.id, collection_id, CollectionPermissionEnum.OWNER
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owners can grant permissions",
        )

    return collection_service.grant_permission(
        collection_id=collection_id,
        user_id=permission_data.user_id,
        permission_level=permission_data.permission_level,
        granted_by=current_user.id,
    )


@router.put(
    "/{collection_id}/permissions/{user_id}",
    response_model=CollectionPermissionResponse,
    status_code=status.HTTP_200_OK,
)
def update_collection_permission(
    collection_id: str,
    user_id: str,
    permission_data: CollectionPermissionRequest,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> CollectionPermissionResponse:
    """Update permission for a user on a collection."""
    # Only OWNER can update permissions
    if not collection_service.has_permission(
        current_user.id, collection_id, CollectionPermissionEnum.OWNER
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owners can update permissions",
        )

    updated_permission = collection_service.update_permission(
        collection_id=collection_id,
        user_id=user_id,
        permission_level=permission_data.permission_level,
        updated_by=current_user.id,
    )

    if not updated_permission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Permission not found for this user",
        )

    return updated_permission


@router.delete(
    "/{collection_id}/permissions/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def revoke_collection_permission(
    collection_id: str,
    user_id: str,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Revoke permission for a user on a collection."""
    # Only OWNER can revoke permissions
    if not collection_service.has_permission(
        current_user.id, collection_id, CollectionPermissionEnum.OWNER
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owners can revoke permissions",
        )

    # Prevent removing the last owner
    permissions = collection_service.get_collection_permissions(collection_id)
    owner_count = sum(
        1 for p in permissions if p.permission_level == CollectionPermissionEnum.OWNER
    )

    user_permission = next((p for p in permissions if p.user_id == user_id), None)
    if (
        user_permission
        and user_permission.permission_level == CollectionPermissionEnum.OWNER
        and owner_count <= 1
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot remove the last owner of a collection",
        )

    revoked = collection_service.revoke_permission(
        collection_id=collection_id,
        user_id=user_id,
        revoked_by=current_user.id,
    )

    if not revoked:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Permission not found for this user",
        )

    return None


@router.get(
    "/user/collections",
    response_model=List[CollectionResponse],
    status_code=status.HTTP_200_OK,
)
def get_user_collections(
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> List[CollectionResponse]:
    """Get all collections the current user has access to."""
    return collection_service.get_user_collections(current_user.id)
