from typing import Generic, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar("T")


class CommonResponse(BaseModel, Generic[T]):
    message: str
    detail: Optional[T]
