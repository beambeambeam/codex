from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from ..models.document import Document
from ..models.file import File
from ..models.user import User
from .schemas import DocumentCreateRequest, DocumentResponse
from ..storage.service import StorageService


class DocumentService:
    """Service for managing documents and related operations."""

    def __init__(self, db: Session):
        """Initialize document service."""
        self.db = db

    def create_document(
        self, document_create: DocumentCreateRequest
    ) -> DocumentResponse:
        """Create a new document and return response schema with user display and file info."""

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
            self.db.commit()

            document = (
                self.db.query(Document)
                .options(joinedload(Document.user), joinedload(Document.file))
                .filter(Document.id == document.id)
                .first()
            )

            user_display = None
            if document.user:
                user_display = document.user.username or str(document.user_id)

            file_response = None
            if document.file:
                file_response = StorageService(self.db)._file_to_response(document.file)

            return DocumentResponse(
                id=document.id,
                user=user_display,
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
