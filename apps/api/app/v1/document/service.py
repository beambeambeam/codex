from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from ..models.document import Document
from ..models.file import File
from ..models.user import User
from .schemas import DocumentCreateRequest, DocumentResponse
from ..models.document import DocumentAudit
from ..storage.service import StorageService
from ..models.enum import DocumentActionEnum
from datetime import datetime, timezone
from typing import Optional, List
from uuid import UUID
import uuid


class DocumentService:
    """Service for managing documents and related operations."""

    def __init__(self, db: Session):
        """Initialize document service."""
        self.db = db
        self.audit = DocumentAuditService(db)

    def create_document(
        self, document_create: DocumentCreateRequest
    ) -> DocumentResponse:
        """Create a new document and return response schema with user display and file info. Also audit the creation."""

        file_exists = (
            self.db.query(File).filter(File.id == document_create.file_id).first()
        )
        if not file_exists:
            raise ValueError(f"File with id {document_create.file_id} not found")

        if document_create.user_id:
            user_exists = (
                self.db.query(User).filter(User.id == document_create.user_id).first()
            )
            if not user_exists:
                raise ValueError(f"User with id {document_create.user_id} not found")

        try:
            doc_data = document_create.model_dump(exclude_unset=True)
            document = Document(**doc_data)
            self.db.add(document)
            self.db.flush()

            self.audit.create_audit(
                document_id=str(document.id),
                action=DocumentActionEnum.CREATE,
                user_id=str(document_create.user_id)
                if document_create.user_id
                else None,
                old_values=None,
                new_values=doc_data,
            )

            self.db.commit()

            document = (
                self.db.query(Document)
                .options(joinedload(Document.user), joinedload(Document.file))
                .filter(Document.id == document.id)
                .first()
            )

            user_info = None
            if document.user:
                from ..user.schemas import UserInfoSchema

                user_info = UserInfoSchema(
                    display=document.user.display or document.user.username or "",
                    username=document.user.username or "",
                    email=document.user.email or "",
                )

            file_response = None
            if document.file:
                file_response = StorageService(self.db)._file_to_response(document.file)

            return DocumentResponse(
                id=document.id,
                user=user_info,
                file=file_response,
                title=document.title,
                description=document.description,
                summary=document.summary,
                is_vectorized=document.is_vectorized,
                is_graph_extracted=document.is_graph_extracted,
                knowledge_graph=document.knowledge_graph,
            )

        except IntegrityError as e:
            self.db.rollback()
            raise ValueError(f"Database integrity error: {str(e)}")


# DocumentAuditService similar to CollectionAuditService
class DocumentAuditService:
    @staticmethod
    def _stringify_uuids(obj):
        """Recursively convert UUIDs in dicts/lists to strings for JSON serialization."""
        if isinstance(obj, dict):
            return {k: DocumentAuditService._stringify_uuids(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [DocumentAuditService._stringify_uuids(i) for i in obj]
        elif isinstance(obj, UUID):
            return str(obj)
        else:
            return obj

    """Service for handling document audits."""

    def __init__(self, db: Session):
        self.db = db

    def create_audit(
        self,
        document_id: str,
        action: DocumentActionEnum,
        user_id: Optional[str] = None,
        old_values: Optional[dict] = None,
        new_values: Optional[dict] = None,
    ) -> DocumentAudit:
        """Create a new audit record for a document action."""

        audit = DocumentAudit(
            id=uuid.uuid4(),
            document_id=UUID(document_id)
            if isinstance(document_id, str)
            else document_id,
            user_id=UUID(user_id) if user_id and isinstance(user_id, str) else None,
            old_values=self._stringify_uuids(old_values) if old_values else None,
            new_values=self._stringify_uuids(new_values) if new_values else None,
            action_type=action,
            timestamp=datetime.now(timezone.utc),
        )
        self.db.add(audit)
        # Don't commit here - let the calling service handle the transaction
        return audit

    def get_audits_for_document(self, document_id: str) -> List[DocumentAudit]:
        """Retrieve all audit records for a given document."""

        return (
            self.db.query(DocumentAudit)
            .filter(DocumentAudit.document_id == document_id)
            .order_by(DocumentAudit.timestamp.desc())
            .all()
        )
