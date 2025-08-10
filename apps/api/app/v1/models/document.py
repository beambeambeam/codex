from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import TIMESTAMP, ForeignKey, Text, Boolean, JSON, event
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from .base import Base
from .knowledge_graph import validate_knowledge_graph
import uuid

if TYPE_CHECKING:
    from .user import User
    from .file import File


class Document(Base):
    __tablename__ = "document"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    file_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("files.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_vectorized: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_graph_extracted: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False
    )
    knowledge_graph: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )

    user: Mapped[Optional["User"]] = relationship("User", back_populates="documents")
    file: Mapped["File"] = relationship("File", back_populates="documents")

    def validate_knowledge_graph_data(
        self, knowledge_graph_data: Optional[dict]
    ) -> None:
        """Validate knowledge graph data against the schema."""
        validate_knowledge_graph(knowledge_graph_data)

    def set_knowledge_graph(self, knowledge_graph_data: Optional[dict]) -> None:
        """Set knowledge graph with validation."""
        self.validate_knowledge_graph_data(knowledge_graph_data)
        self.knowledge_graph = knowledge_graph_data


# SQLAlchemy event to validate knowledge_graph on insert/update
@event.listens_for(Document, "before_insert")
@event.listens_for(Document, "before_update")
def validate_knowledge_graph_on_save(mapper, connection, target):
    """Validate knowledge graph before saving to database."""
    validate_knowledge_graph(target.knowledge_graph)
