from enum import Enum


class CollectionActionEnum(str, Enum):
    CREATE = "CREATE"
    ARCHIVE = "ARCHIVE"
    UPDATE = "UPDATE"
    DELETE = "DELETE"
