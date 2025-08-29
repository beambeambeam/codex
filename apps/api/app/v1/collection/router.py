from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List

from .schemas import (
    CollectionCreateRequest,
    CollectionResponse,
    CollectionAuditResponse,
    CollectionPermissionRequest,
    CollectionPermissionResponse,
    CollectionAiPreferenceRequest,
    CollectionAiPreferenceResponse,
)
from .service import CollectionService
from .dependencies import (
    get_collection_service,
    has_permission,
)
from ..user.dependencies import get_current_user
from ..models.user import User
from ..models.enum import CollectionPermissionEnum


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
        user_id=str(current_user.id),
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

    collections = collection_service.get_user_collections(str(current_user.id))

    return collections


@router.get(
    "/search",
    response_model=List[CollectionResponse],
    status_code=status.HTTP_200_OK,
)
def search_collections(
    word: str = "",
    page: int = 1,
    per_page: int = 5,
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> List[CollectionResponse]:
    """Search collections by title with optional fuzzy matching and pagination."""

    return collection_service.permission.search_collections(
        user_id=str(current_user.id), word=word, page=page, per_page=per_page
    )


@router.get(
    "/{collection_id}",
    response_model=CollectionResponse,
    status_code=status.HTTP_200_OK,
)
def get_collection(
    collection_id: str,
    _: None = Depends(has_permission(CollectionPermissionEnum.READ)),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> CollectionResponse:
    """Get a collection by ID."""

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
    _: None = Depends(has_permission(CollectionPermissionEnum.READ)),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> List[CollectionAuditResponse]:
    """Get audits for a collection by ID."""

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
    _: None = Depends(has_permission(CollectionPermissionEnum.EDIT)),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> CollectionResponse:
    """Update a collection by ID."""

    updated = collection_service.update_collection(
        collection_id, collection_data, user_id=str(current_user.id)
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
    _: None = Depends(has_permission(CollectionPermissionEnum.OWNER)),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Delete a collection by ID."""

    deleted = collection_service.delete_collection(collection_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found"
        )
    return None


@router.get(
    "/{collection_id}/ai-preferences",
    response_model=CollectionAiPreferenceResponse,
    status_code=status.HTTP_200_OK,
)
def get_collection_ai_preferences(
    collection_id: str,
    _: None = Depends(has_permission(CollectionPermissionEnum.READ)),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> CollectionAiPreferenceResponse:
    """Get collection AI preferences."""

    preference = collection_service.get_collection_ai_preference(collection_id)

    if not preference:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI preferences not found",
        )

    return CollectionAiPreferenceResponse(
        id=str(preference.id),
        collection_id=str(preference.collection_id),
        tones_and_style=preference.tones_and_style,
        skillset=preference.skillset,
        sensitivity=preference.sensitivity,
        created_at=preference.created_at.isoformat(),
        updated_at=preference.updated_at.isoformat(),
    )


@router.put(
    "/{collection_id}/ai-preferences",
    response_model=CollectionAiPreferenceResponse,
    status_code=status.HTTP_200_OK,
)
def update_collection_ai_preferences(
    collection_id: str,
    preference_data: CollectionAiPreferenceRequest,
    _: None = Depends(has_permission(CollectionPermissionEnum.EDIT)),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> CollectionAiPreferenceResponse:
    """Update collection AI preferences. Creates if doesn't exist."""

    updated_preference = collection_service.upsert_collection_ai_preference(
        collection_id=collection_id,
        preference_data=preference_data,
    )

    return CollectionAiPreferenceResponse(
        id=str(updated_preference.id),
        collection_id=str(updated_preference.collection_id),
        tones_and_style=updated_preference.tones_and_style,
        skillset=updated_preference.skillset,
        sensitivity=updated_preference.sensitivity,
        created_at=updated_preference.created_at.isoformat(),
        updated_at=updated_preference.updated_at.isoformat(),
    )


@router.delete(
    "/{collection_id}/ai-preferences",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_collection_ai_preferences(
    collection_id: str,
    _: None = Depends(has_permission(CollectionPermissionEnum.EDIT)),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Delete collection AI preferences."""

    collection_service.delete_collection_ai_preference(collection_id)
    return None


@router.get(
    "/{collection_id}/permissions",
    response_model=List[CollectionPermissionResponse],
    status_code=status.HTTP_200_OK,
)
def get_collection_permissions(
    collection_id: str,
    _: None = Depends(has_permission(CollectionPermissionEnum.READ)),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> List[CollectionPermissionResponse]:
    """Get all permissions for a collection."""

    return collection_service.get_collection_permissions(collection_id)


@router.post(
    "/{collection_id}/permissions",
    response_model=CollectionPermissionResponse,
    status_code=status.HTTP_201_CREATED,
)
def grant_collection_permission(
    collection_id: str,
    permission_data: CollectionPermissionRequest,
    _: None = Depends(has_permission(CollectionPermissionEnum.OWNER)),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> CollectionPermissionResponse:
    """Grant permission to a user for a collection."""

    return collection_service.grant_permission(
        collection_id=collection_id,
        user_id=permission_data.user_id,
        permission_level=permission_data.permission_level,
        granted_by=str(current_user.id),
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
    _: None = Depends(has_permission(CollectionPermissionEnum.OWNER)),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
) -> CollectionPermissionResponse:
    """Update permission for a user on a collection."""

    updated_permission = collection_service.update_permission(
        collection_id=collection_id,
        user_id=user_id,
        permission_level=permission_data.permission_level,
        updated_by=str(current_user.id),
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
    _: None = Depends(has_permission(CollectionPermissionEnum.OWNER)),
    current_user: User = Depends(get_current_user),
    collection_service: CollectionService = Depends(get_collection_service),
):
    """Revoke permission for a user on a collection."""

    revoked = collection_service.revoke_permission(
        collection_id=collection_id,
        user_id=user_id,
        revoked_by=str(current_user.id),
    )

    if not revoked:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Permission not found for this user",
        )

    return None
