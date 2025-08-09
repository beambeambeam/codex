from pydantic import BaseModel, Field
from typing import Optional


class CollectionCreateRequest(BaseModel):
    """Collection Create request payload"""

    title: Optional[str] = Field(None, example="My Collection")
    description: Optional[str] = Field(None, example="A description of the collection")


class CollectionResponse(BaseModel):
    """Collection response payload"""

    id: str
    title: Optional[str]
    description: Optional[str]
    summary: Optional[str]

    class Config:
        from_attributes = True
