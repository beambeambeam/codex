from typing import Callable

from fastapi import Depends, HTTPException, status

from ...db import get_db
from ..models.enum import CollectionPermissionEnum
from ..models.user import User
from ..user.dependencies import get_current_user
from .service import CollectionService


def get_collection_service(db=Depends(get_db)) -> CollectionService:
    return CollectionService(db)


def has_permission(required_permission: CollectionPermissionEnum) -> Callable:
    def permission_checker(
        collection_id: str,
        current_user: User = Depends(get_current_user),
        collection_service: CollectionService = Depends(get_collection_service),
    ) -> None:
        if not collection_service.has_permission(
            str(current_user.id), collection_id, required_permission
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. {required_permission.value.title()} access required.",
            )

    return permission_checker
