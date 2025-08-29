from typing import Generic, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class CommonResponse(BaseModel, Generic[T]):
    message: str
    detail: Optional[T]
