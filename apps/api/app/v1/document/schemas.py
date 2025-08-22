# All imports at the top, no duplicates
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field
from datetime import datetime
from ..storage.schemas import FileResponse
from ..schemas.graph import KnowledgeGraph
from ..user.schemas import UserInfoSchema
from ..models.enum import DocumentActionEnum


# Tag schemas
class TagCreateRequest(BaseModel):
    collection_id: UUID = Field(
        ..., description="ID of the collection that owns the tag"
    )
    title: str = Field(..., description="Title of the tag")
    color: str = Field(..., description="Color of the tag (hex code)")


class TagUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, description="Title of the tag")
    color: Optional[str] = Field(None, description="Color of the tag (hex code)")


class TagResponse(BaseModel):
    id: UUID
    collection_id: UUID
    title: str
    color: str

    class Config:
        from_attributes = True


# Document tag schemas
class DocumentTagCreateRequest(BaseModel):
    document_id: UUID = Field(..., description="ID of the document")
    tag_id: UUID = Field(..., description="ID of the tag")


class DocumentTagUpdateRequest(BaseModel):
    document_id: UUID = Field(..., description="ID of the document")
    tag_ids: List[str] = Field(
        ...,
        description="List of tag IDs (UUIDs) or tag titles (strings) to assign to the document",
    )


class DocumentTagResponse(BaseModel):
    id: UUID
    document_id: UUID
    tag: TagResponse

    class Config:
        from_attributes = True


# DocumentAudit schema for audit API responses
class DocumentAudit(BaseModel):
    id: UUID
    document_id: UUID
    user_id: Optional[UUID] = None
    old_values: Optional[dict] = None
    new_values: Optional[dict] = None
    action_type: DocumentActionEnum
    timestamp: datetime

    class Config:
        from_attributes = True


class DocumentCreateRequest(BaseModel):
    user_id: Optional[UUID] = Field(
        None, description="ID of the user who owns the document"
    )
    collection_id: Optional[UUID] = Field(
        None, description="ID of the collection that contains the document"
    )
    file_id: UUID = Field(
        ..., description="ID of the file associated with the document"
    )
    title: Optional[str] = Field(None, description="Title of the document")
    description: Optional[str] = Field(None, description="Description of the document")
    summary: Optional[str] = Field(None, description="Summary of the document")


class DocumentResponse(BaseModel):
    id: UUID
    collection_id: Optional[UUID] = None
    user: Optional[UserInfoSchema] = None
    file: Optional[FileResponse] = None
    title: Optional[str]
    description: Optional[str]
    summary: Optional[str]
    is_vectorized: bool
    is_graph_extracted: bool
    knowledge_graph: Optional[KnowledgeGraph]
    tags: Optional[List[TagResponse]] = None

    class Config:
        from_attributes = True


class PaginatedDocumentResponse(BaseModel):
    documents: List[DocumentResponse]
    total: int
    page: int
    per_page: int
    total_pages: int

    class Config:
        from_attributes = True
