from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import TIMESTAMP, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from .base import Base
from .user import User
from .enum import CollectionActionEnum, CollectionPermissionEnum
import uuid

if TYPE_CHECKING:
    from .document import Document


class Collection(Base):
    __tablename__ = "collection"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    documents: Mapped[list["Document"]] = relationship(
        "Document", back_populates="collection", cascade="all, delete-orphan"
    )


class CollectionAudit(Base):
    __tablename__ = "collection_audit"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    collection_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("collection.id", ondelete="CASCADE"),
        nullable=False,
    )
    performed_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    performed_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )
    action: Mapped[CollectionActionEnum] = mapped_column(
        Enum(CollectionActionEnum, name="collection_action_enum"), nullable=False
    )

    collection: Mapped["Collection"] = relationship("Collection", backref="audits")
    user: Mapped["User"] = relationship("User", backref="audits_performed")


class CollectionPermission(Base):
    __tablename__ = "collection_permission"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    collection_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("collection.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
    )
    permission_level: Mapped[CollectionPermissionEnum] = mapped_column(
        Enum(CollectionPermissionEnum, name="collection_permission_enum"),
        nullable=False,
    )

    collection: Mapped["Collection"] = relationship("Collection", backref="permissions")
    user: Mapped["User"] = relationship("User", backref="collection_permissions")


class CollectionPermissionAudit(Base):
    __tablename__ = "collection_permission_audit"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    collection_permission_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("collection_permission.id", ondelete="CASCADE"),
        nullable=False,
    )
    performed_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("user.id", ondelete="SET NULL"),
        nullable=True,
    )
    performed_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )
    old_permission: Mapped[Optional[CollectionPermissionEnum]] = mapped_column(
        Enum(CollectionPermissionEnum, name="collection_permission_enum"),
        nullable=True,
    )
    new_permission: Mapped[Optional[CollectionPermissionEnum]] = mapped_column(
        Enum(CollectionPermissionEnum, name="collection_permission_enum"),
        nullable=True,
    )

    collection_permission: Mapped["CollectionPermission"] = relationship(
        "CollectionPermission", backref="audits"
    )
    user: Mapped["User"] = relationship("User", backref="collection_permission_audits")
