from .base import Base
from sqlalchemy import Column, Text, TIMESTAMP, Integer, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid


class File(Base):
    __tablename__ = "files"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    upload_by = Column(
        UUID(as_uuid=True), ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    upload_at = Column(TIMESTAMP, nullable=False, server_default=func.now())
    name = Column(Text, nullable=False)
    size = Column(Integer, nullable=False)  # bytes
    type = Column(Text, nullable=False)
    url = Column(Text, nullable=False)  # file path in db, return as file preview
    resource = Column(Text, nullable=False)

    uploader = relationship("User", back_populates="files_uploaded")
    documents = relationship("Document", back_populates="file")
