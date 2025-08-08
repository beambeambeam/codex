from typing import Generic, TypeVar, Optional
from pydantic.generics import GenericModel

T = TypeVar("T")


class CommonResponse(GenericModel, Generic[T]):
    message: str
    detail: Optional[T]
