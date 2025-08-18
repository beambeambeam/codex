from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from ..models.document import Document
from ..models.file import File
from ..models.user import User
from ..models.collection import Collection
from .schemas import DocumentCreateRequest, DocumentResponse
from ..models.document import DocumentAudit
from ..storage.service import StorageService
from ..models.enum import DocumentActionEnum
from ..storage.schemas import FileResponse
from datetime import datetime, timezone
from typing import Optional, List
from uuid import UUID
import uuid
from ..user.schemas import UserInfoSchema


class DocumentService:
    """Service for managing documents and related operations."""

    def __init__(self, db: Session):
        """Initialize document service."""
        self.db = db
        self.audit = DocumentAuditService(db)

    def _user_to_user_info(self, user: User) -> UserInfoSchema:
        """Convert a User model instance to UserInfoSchema."""
        return UserInfoSchema(
            display=user.display or user.username or "",
            username=user.username or "",
            email=user.email or "",
        )

    def _file_to_file_response(self, file: File) -> Optional[FileResponse]:
        """Convert a File model instance to FileResponse using StorageService."""
        if not file:
            return None
        return StorageService(self.db)._file_to_response(file)

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

        # Validate collection exists if collection_id is provided
        if hasattr(document_create, "collection_id") and document_create.collection_id:
            collection_exists = (
                self.db.query(Collection)
                .filter(Collection.id == document_create.collection_id)
                .first()
            )
            if not collection_exists:
                raise ValueError(
                    f"Collection with id {document_create.collection_id} not found"
                )

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
                .options(
                    joinedload(Document.user),
                    joinedload(Document.file),
                    joinedload(Document.collection),
                )
                .filter(Document.id == document.id)
                .first()
            )

            user_info = (
                self._user_to_user_info(document.user) if document.user else None
            )

            file_response = self._file_to_file_response(document.file)

            return DocumentResponse(
                id=document.id,
                collection_id=document.collection_id,
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

    def delete_document(self, document_id: str, user_id: Optional[str] = None) -> None:
        """Delete a document by ID, audit the deletion, and commit the transaction."""

        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise ValueError(f"Document with id {document_id} not found")

        # Prepare old values for audit
        old_values = {
            c.name: getattr(document, c.name) for c in document.__table__.columns
        }

        # Audit the deletion BEFORE removing the document
        self.audit.create_audit(
            document_id=str(document_id),
            action=DocumentActionEnum.DELETE,
            user_id=str(user_id) if user_id else None,
            old_values=old_values,
            new_values=None,
        )

        # Now remove the document
        self.db.delete(document)

        self.db.commit()

    def get_document(self, document_id: str) -> DocumentResponse:
        """Retrieve a document by ID and return response schema with user display and file info."""
        document = (
            self.db.query(Document)
            .options(
                joinedload(Document.user),
                joinedload(Document.file),
                joinedload(Document.collection),
            )
            .filter(Document.id == document_id)
            .first()
        )
        if not document:
            raise ValueError(f"Document with id {document_id} not found")

        user_info = self._user_to_user_info(document.user) if document.user else None
        file_response = self._file_to_file_response(document.file)

        return DocumentResponse(
            id=document.id,
            collection_id=document.collection_id,
            user=user_info,
            file=file_response,
            title=document.title,
            description=document.description,
            summary=document.summary,
            is_vectorized=document.is_vectorized,
            is_graph_extracted=document.is_graph_extracted,
            knowledge_graph=document.knowledge_graph,
        )

    def get_documents_by_collection(self, collection_id: str) -> List[DocumentResponse]:
        """Retrieve all documents for a specific collection."""
        documents = (
            self.db.query(Document)
            .options(
                joinedload(Document.user),
                joinedload(Document.file),
                joinedload(Document.collection),
            )
            .filter(Document.collection_id == collection_id)
            .all()
        )

        result = []
        for document in documents:
            user_info = (
                self._user_to_user_info(document.user) if document.user else None
            )
            file_response = self._file_to_file_response(document.file)

            result.append(
                DocumentResponse(
                    id=document.id,
                    collection_id=document.collection_id,
                    user=user_info,
                    file=file_response,
                    title=document.title,
                    description=document.description,
                    summary=document.summary,
                    is_vectorized=document.is_vectorized,
                    is_graph_extracted=document.is_graph_extracted,
                    knowledge_graph=document.knowledge_graph,
                )
            )

        return result

    def update_document_collection(
        self,
        document_id: str,
        collection_id: Optional[str],
        user_id: Optional[str] = None,
    ) -> DocumentResponse:
        """Update the collection assignment for a document."""
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise ValueError(f"Document with id {document_id} not found")

        # Validate collection exists if collection_id is provided
        if collection_id:
            collection_exists = (
                self.db.query(Collection).filter(Collection.id == collection_id).first()
            )
            if not collection_exists:
                raise ValueError(f"Collection with id {collection_id} not found")

        # Prepare old values for audit
        old_values = {
            c.name: getattr(document, c.name) for c in document.__table__.columns
        }

        # Update the collection
        document.collection_id = collection_id

        # Prepare new values for audit
        new_values = {
            c.name: getattr(document, c.name) for c in document.__table__.columns
        }

        # Audit the update
        self.audit.create_audit(
            document_id=str(document_id),
            action=DocumentActionEnum.UPDATE,
            user_id=str(user_id) if user_id else None,
            old_values=old_values,
            new_values=new_values,
        )

        self.db.commit()

        return self.get_document(document_id)

    def remove_from_collection(
        self, document_id: str, user_id: Optional[str] = None
    ) -> DocumentResponse:
        """Remove a document from its collection (set collection_id to None)."""
        return self.update_document_collection(document_id, None, user_id)

    def move_to_collection(
        self, document_id: str, collection_id: str, user_id: Optional[str] = None
    ) -> DocumentResponse:
        """Move a document to a different collection."""
        return self.update_document_collection(document_id, collection_id, user_id)

    def get_documents_without_collection(self) -> List[DocumentResponse]:
        """Retrieve all documents that are not assigned to any collection."""
        documents = (
            self.db.query(Document)
            .options(
                joinedload(Document.user),
                joinedload(Document.file),
                joinedload(Document.collection),
            )
            .filter(Document.collection_id.is_(None))
            .all()
        )

        result = []
        for document in documents:
            user_info = (
                self._user_to_user_info(document.user) if document.user else None
            )
            file_response = self._file_to_file_response(document.file)

            result.append(
                DocumentResponse(
                    id=document.id,
                    collection_id=document.collection_id,
                    user=user_info,
                    file=file_response,
                    title=document.title,
                    description=document.description,
                    summary=document.summary,
                    is_vectorized=document.is_vectorized,
                    is_graph_extracted=document.is_graph_extracted,
                    knowledge_graph=document.knowledge_graph,
                )
            )

        return result


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
