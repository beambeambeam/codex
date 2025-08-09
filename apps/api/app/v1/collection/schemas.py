from pydantic import BaseModel, Field
from typing import Optional
import uuid
from ..models.enum import CollectionPermissionEnum


class CollectionCreateRequest(BaseModel):
    """Collection Create request payload"""

    title: str = Field(..., example="My Collection")
    description: Optional[str] = Field(None, example="A description of the collection")


class CollectionResponse(BaseModel):
    """Collection response payload"""

    id: uuid.UUID
    title: Optional[str]
    description: Optional[str]
    summary: Optional[str]

    class Config:
        from_attributes = True


class CollectionAuditResponse(BaseModel):
    """Collection audit response payload"""

    id: uuid.UUID
    collection_id: uuid.UUID
    performed_by: Optional[uuid.UUID]
    performed_at: str
    action: str

    class Config:
        from_attributes = True


class CollectionPermissionRequest(BaseModel):
    """Collection permission request payload"""

    user_id: str = Field(..., example="123e4567-e89b-12d3-a456-426614174000")
    permission_level: CollectionPermissionEnum = Field(..., example="READ")


class CollectionPermissionResponse(BaseModel):
    """Collection permission response payload"""

    id: uuid.UUID
    collection_id: uuid.UUID
    user_id: uuid.UUID
    permission_level: CollectionPermissionEnum

    class Config:
        from_attributes = True


class CollectionPermissionAuditResponse(BaseModel):
    """Collection permission audit response payload"""

    id: uuid.UUID
    collection_permission_id: uuid.UUID
    performed_by: Optional[str]
    performed_at: str
    old_permission: Optional[CollectionPermissionEnum]
    new_permission: Optional[CollectionPermissionEnum]

    class Config:
        from_attributes = True
