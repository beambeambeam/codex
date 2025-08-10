from enum import Enum


class CollectionActionEnum(str, Enum):
    CREATE = "CREATE"
    ARCHIVE = "ARCHIVE"
    UPDATE = "UPDATE"
    DELETE = "DELETE"


class DocumentActionEnum(str, Enum):
    CREATE = "CREATE"
    UPDATE = "UPDATE"
    DELETE = "DELETE"


class CollectionPermissionEnum(str, Enum):
    READ = "READ"
    EDIT = "EDIT"
    OWNER = "OWNER"
