from pydantic import BaseModel, Field
from typing import Optional
from ..models.enum import CollectionPermissionEnum


class CollectionCreateRequest(BaseModel):
    """Collection Create request payload"""

    title: str = Field(..., example="My Collection")
    description: Optional[str] = Field(None, example="A description of the collection")


class CollectionResponse(BaseModel):
    """Collection response payload"""

    id: str
    title: Optional[str]
    description: Optional[str]
    summary: Optional[str]

    class Config:
        from_attributes = True


class CollectionAuditResponse(BaseModel):
    """Collection audit response payload"""

    id: str
    collection_id: str
    performed_by: Optional[str]
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

    id: str
    collection_id: str
    user_id: str
    permission_level: CollectionPermissionEnum

    class Config:
        from_attributes = True


class CollectionPermissionAuditResponse(BaseModel):
    """Collection permission audit response payload"""

    id: str
    collection_permission_id: str
    performed_by: Optional[str]
    performed_at: str
    old_permission: Optional[CollectionPermissionEnum]
    new_permission: Optional[CollectionPermissionEnum]

    class Config:
        from_attributes = True
