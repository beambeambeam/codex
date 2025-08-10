# All imports at the top, no duplicates
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field
from datetime import datetime
from ..storage.schemas import FileResponse
from ..schemas.graph import KnowledgeGraph
from ..user.schemas import UserInfoSchema
from ..models.enum import DocumentActionEnum


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
    file_id: UUID = Field(
        ..., description="ID of the file associated with the document"
    )
    title: Optional[str] = Field(None, description="Title of the document")
    description: Optional[str] = Field(None, description="Description of the document")
    summary: Optional[str] = Field(None, description="Summary of the document")


class DocumentResponse(BaseModel):
    id: UUID
    user: Optional[UserInfoSchema] = None
    file: Optional[FileResponse] = None
    title: Optional[str]
    description: Optional[str]
    summary: Optional[str]
    is_vectorized: bool
    is_graph_extracted: bool
    knowledge_graph: Optional[KnowledgeGraph]

    class Config:
        from_attributes = True
