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


class FileResouceEnum(str, Enum):
    DOCUMENT = "DOCUMENT"
    PROFILE_IMAGE = "PROFILE_IMAGE"


class DepthOfExplanationEnum(str, Enum):
    SHORT = "SHORT"
    MEDIUM = "MEDIUM"
    DETAIL = "DETAIL"
