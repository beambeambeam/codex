from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Callable

from .service import CollectionService
from ...db import get_db
from ..user.dependencies import get_current_user
from ..models.user import User
from ..models.enum import CollectionPermissionEnum


def get_collection_service(db: Session = Depends(get_db)) -> CollectionService:
    """Get collection service instance."""
    return CollectionService(db)


def has_permission(required_permission: CollectionPermissionEnum) -> Callable:
    def permission_checker(
        collection_id: str,
        current_user: User = Depends(get_current_user),
        collection_service: CollectionService = Depends(get_collection_service),
    ) -> None:
        """Check if user has required permission for the collection."""
        if not collection_service.has_permission(
            current_user.id, collection_id, required_permission
        ):
            permission_names = {
                CollectionPermissionEnum.READ: "read",
                CollectionPermissionEnum.EDIT: "edit",
                CollectionPermissionEnum.OWNER: "owner",
            }
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. {permission_names[required_permission].title()} access required.",
            )
        return None

    return permission_checker


def has_read_permission(
    collection_id: str,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> None:
    """Check if user has READ permission for the collection."""
    if not collection_service.has_permission(
        current_user.id, collection_id, CollectionPermissionEnum.READ
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Read access required.",
        )
    return None


def has_edit_permission(
    collection_id: str,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> None:
    """Check if user has EDIT permission for the collection."""
    if not collection_service.has_permission(
        current_user.id, collection_id, CollectionPermissionEnum.EDIT
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Edit access required.",
        )
    return None


def has_owner_permission(
    collection_id: str,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> None:
    """Check if user has OWNER permission for the collection."""
    if not collection_service.has_permission(
        current_user.id, collection_id, CollectionPermissionEnum.OWNER
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Owner access required.",
        )
    return None
