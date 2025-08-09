from datetime import datetime
from typing import Optional
from sqlalchemy import TIMESTAMP, ForeignKey, Text, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from .base import Base
from .user import User
from .enum import CollectionActionEnum
import uuid


class Collection(Base):
    __tablename__ = "collection"
    id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


class CollectionAudit(Base):
    __tablename__ = "collection_audit"
    id: Mapped[str] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    collection_id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("collection.id", ondelete="CASCADE"),
        nullable=False,
    )
    performed_by: Mapped[str] = mapped_column(
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
