from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from .schemas import CollectionCreateRequest, CollectionResponse
from .service import CollectionService
from .dependencies import get_collection_service
from ..user.dependencies import get_current_user
from ..models.user import User


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
    """Get all collections."""

    collections = collection_service.get_collections()

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

    collection = collection_service.get_collection(collection_id)

    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found"
        )

    return collection


@router.get(
    "/{collection_id}",
    response_model=CollectionResponse,
    status_code=status.HTTP_200_OK,
)
def get_collection_audit(
    collection_id: str,
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
