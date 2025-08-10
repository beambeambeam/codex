from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field
from ..storage.schemas import FileResponse
from ..schemas.graph import KnowledgeGraph
from ..user.schemas import UserInfoSchema


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
