from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from ..models.document import Document, Tag, DocumentTag
from ..models.file import File
from ..models.user import User
from ..models.collection import Collection
from .schemas import (
    DocumentCreateRequest,
    DocumentUpdateRequest,
    DocumentResponse,
    PaginatedDocumentResponse,
    TagCreateRequest,
    TagUpdateRequest,
    TagResponse,
    DocumentTagCreateRequest,
    DocumentTagResponse,
)
from ..models.document import DocumentAudit
from ..storage.service import StorageService
from ..models.enum import DocumentActionEnum
from ..storage.schemas import FileResponse
from datetime import datetime, timezone
from typing import Optional, List
from uuid import UUID
import uuid
import re
from ..user.schemas import UserInfoSchema
from ..schemas.graph import KnowledgeGraph
import math
from ...utils.color import generateRandomColor

_UUID_PATTERN = re.compile(
    r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
    re.IGNORECASE,
)


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

    def _document_to_response(self, document: Document) -> DocumentResponse:
        """Convert a Document model instance to a DocumentResponse schema."""

        user_info = self._user_to_user_info(document.user) if document.user else None
        file_response = self._file_to_file_response(document.file)

        kg = None
        if getattr(document, "knowledge_graph", None):
            if isinstance(document.knowledge_graph, dict):
                if (
                    "nodes" in document.knowledge_graph
                    and "edges" in document.knowledge_graph
                ):
                    try:
                        if hasattr(KnowledgeGraph, "model_validate"):
                            kg = KnowledgeGraph.model_validate(document.knowledge_graph)
                        else:
                            kg = KnowledgeGraph.parse_obj(document.knowledge_graph)
                    except Exception:
                        kg = None
                else:
                    kg = None
            elif isinstance(document.knowledge_graph, KnowledgeGraph):
                kg = document.knowledge_graph
            else:
                kg = None

        # Get tags for the document
        tags = []
        if hasattr(document, "document_tags") and document.document_tags:
            for doc_tag in document.document_tags:
                if doc_tag.tag:
                    tags.append(
                        TagResponse(
                            id=doc_tag.tag.id,
                            collection_id=doc_tag.tag.collection_id,
                            title=doc_tag.tag.title,
                            color=doc_tag.tag.color,
                        )
                    )

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
            knowledge_graph=kg,
            tags=tags,
        )

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
                    joinedload(Document.document_tags).joinedload(DocumentTag.tag),
                )
                .filter(Document.id == document.id)
                .first()
            )

            return self._document_to_response(document)

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
                joinedload(Document.document_tags).joinedload(DocumentTag.tag),
            )
            .filter(Document.id == document_id)
            .first()
        )
        if not document:
            raise ValueError(f"Document with id {document_id} not found")

        return self._document_to_response(document)

    def get_documents_by_collection(self, collection_id: str) -> List[DocumentResponse]:
        """Retrieve all documents for a specific collection."""
        documents = (
            self.db.query(Document)
            .options(
                joinedload(Document.user),
                joinedload(Document.file),
                joinedload(Document.collection),
                joinedload(Document.document_tags).joinedload(DocumentTag.tag),
            )
            .filter(Document.collection_id == collection_id)
            .all()
        )

        result = []
        for document in documents:
            result.append(self._document_to_response(document))

        return result

    def get_documents_by_collection_paginated(
        self, collection_id: str, page: int = 1, per_page: int = 10
    ) -> PaginatedDocumentResponse:
        """Retrieve documents for a specific collection with pagination support."""

        # Validate page and per_page parameters
        page = max(1, page)
        per_page = max(1, min(per_page, 100))  # Limit max per_page to 100
        offset = (page - 1) * per_page

        # Verify collection exists
        collection_exists = (
            self.db.query(Collection).filter(Collection.id == collection_id).first()
        )
        if not collection_exists:
            raise ValueError(f"Collection with id {collection_id} not found")

        # Get total count for pagination metadata
        total_count = (
            self.db.query(Document)
            .filter(Document.collection_id == collection_id)
            .count()
        )

        # Get paginated documents
        documents = (
            self.db.query(Document)
            .options(
                joinedload(Document.user),
                joinedload(Document.file),
                joinedload(Document.collection),
                joinedload(Document.document_tags).joinedload(DocumentTag.tag),
            )
            .filter(Document.collection_id == collection_id)
            .order_by(Document.title.asc())  # Default ordering by title
            .limit(per_page)
            .offset(offset)
            .all()
        )

        # Convert to response schemas
        document_responses = []
        for document in documents:
            document_responses.append(self._document_to_response(document))

        # Calculate total pages
        total_pages = math.ceil(total_count / per_page) if total_count > 0 else 0

        return PaginatedDocumentResponse(
            documents=document_responses,
            total=total_count,
            page=page,
            per_page=per_page,
            total_pages=total_pages,
        )

    def update_document(
        self,
        document_id: str,
        document_update: DocumentUpdateRequest,
        user_id: Optional[str] = None,
    ) -> DocumentResponse:
        """Update document details (title, description, summary)."""
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise ValueError(f"Document with id {document_id} not found")

        # Prepare old values for audit
        old_values = {
            c.name: getattr(document, c.name) for c in document.__table__.columns
        }

        # Update the document fields
        if document_update.title is not None:
            document.title = document_update.title
        if document_update.description is not None:
            document.description = document_update.description
        if document_update.summary is not None:
            document.summary = document_update.summary

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
                joinedload(Document.document_tags).joinedload(DocumentTag.tag),
            )
            .filter(Document.collection_id.is_(None))
            .all()
        )

        result = []
        for document in documents:
            result.append(self._document_to_response(document))

        return result

    def create_tag(self, tag_create: TagCreateRequest) -> TagResponse:
        """Create a new tag."""
        collection_exists = (
            self.db.query(Collection)
            .filter(Collection.id == tag_create.collection_id)
            .first()
        )
        if not collection_exists:
            raise ValueError(f"Collection with id {tag_create.collection_id} not found")

        # Prevent duplicate tag titles within the same collection
        existing_tag = (
            self.db.query(Tag)
            .filter(
                Tag.title == tag_create.title,
                Tag.collection_id == tag_create.collection_id,
            )
            .first()
        )
        if existing_tag:
            raise ValueError(
                f"Tag with title '{tag_create.title}' already exists in collection {tag_create.collection_id}"
            )

        try:
            tag = Tag(
                collection_id=tag_create.collection_id,
                title=tag_create.title,
                color=tag_create.color,
            )
            self.db.add(tag)
            self.db.commit()
            self.db.refresh(tag)

            return TagResponse(
                id=tag.id,
                collection_id=tag.collection_id,
                title=tag.title,
                color=tag.color,
            )
        except IntegrityError as e:
            self.db.rollback()
            raise ValueError(f"Database integrity error: {str(e)}")

    def get_tags_by_collection(self, collection_id: str) -> List[TagResponse]:
        """Get all tags for a specific collection."""
        tags = self.db.query(Tag).filter(Tag.collection_id == collection_id).all()

        return [
            TagResponse(
                id=tag.id,
                collection_id=tag.collection_id,
                title=tag.title,
                color=tag.color,
            )
            for tag in tags
        ]

    def get_tag(self, tag_id: str) -> TagResponse:
        """Get a tag by ID."""
        tag = self.db.query(Tag).filter(Tag.id == tag_id).first()
        if not tag:
            raise ValueError(f"Tag with id {tag_id} not found")

        return TagResponse(
            id=tag.id, collection_id=tag.collection_id, title=tag.title, color=tag.color
        )

    def get_tag_by_title_and_collection(
        self, title: str, collection_id: str
    ) -> Optional[TagResponse]:
        """Get a tag by title and collection ID."""
        tag = (
            self.db.query(Tag)
            .filter(Tag.title == title, Tag.collection_id == collection_id)
            .first()
        )
        if not tag:
            return None

        return TagResponse(
            id=tag.id,
            collection_id=tag.collection_id,
            title=tag.title,
            color=tag.color,
        )

    def update_tag(self, tag_id: str, tag_update: TagUpdateRequest) -> TagResponse:
        """Update a tag."""
        tag = self.db.query(Tag).filter(Tag.id == tag_id).first()
        if not tag:
            raise ValueError(f"Tag with id {tag_id} not found")

        update_data = tag_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(tag, field, value)

        self.db.commit()
        self.db.refresh(tag)

        return TagResponse(
            id=tag.id, collection_id=tag.collection_id, title=tag.title, color=tag.color
        )

    def delete_tag(self, tag_id: str) -> None:
        """Delete a tag. This will also remove all document associations."""
        tag = self.db.query(Tag).filter(Tag.id == tag_id).first()
        if not tag:
            raise ValueError(f"Tag with id {tag_id} not found")

        self.db.delete(tag)
        self.db.commit()

    # Document tag operations
    def add_tag_to_document(
        self, document_tag_create: DocumentTagCreateRequest
    ) -> DocumentTagResponse:
        """Add a tag to a document."""
        # Verify document exists
        document = (
            self.db.query(Document)
            .filter(Document.id == document_tag_create.document_id)
            .first()
        )
        if not document:
            raise ValueError(
                f"Document with id {document_tag_create.document_id} not found"
            )

        # Verify tag exists
        tag = self.db.query(Tag).filter(Tag.id == document_tag_create.tag_id).first()
        if not tag:
            raise ValueError(f"Tag with id {document_tag_create.tag_id} not found")

        # Check if association already exists
        existing_association = (
            self.db.query(DocumentTag)
            .filter(
                DocumentTag.document_id == document_tag_create.document_id,
                DocumentTag.tag_id == document_tag_create.tag_id,
            )
            .first()
        )
        if existing_association:
            raise ValueError("Tag is already associated with this document")

        try:
            document_tag = DocumentTag(
                document_id=document_tag_create.document_id,
                tag_id=document_tag_create.tag_id,
            )
            self.db.add(document_tag)
            self.db.commit()
            self.db.refresh(document_tag)

            return DocumentTagResponse(
                id=document_tag.id,
                document_id=document_tag.document_id,
                tag=TagResponse(
                    id=tag.id,
                    collection_id=tag.collection_id,
                    title=tag.title,
                    color=tag.color,
                ),
            )
        except IntegrityError as e:
            self.db.rollback()
            raise ValueError(f"Database integrity error: {str(e)}")

    def remove_tag_from_document(self, document_id: str, tag_id: str) -> None:
        """Remove a tag from a document."""
        document_tag = (
            self.db.query(DocumentTag)
            .filter(
                DocumentTag.document_id == document_id, DocumentTag.tag_id == tag_id
            )
            .first()
        )
        if not document_tag:
            raise ValueError("Tag is not associated with this document")

        self.db.delete(document_tag)
        self.db.commit()

    def get_document_tags(self, document_id: str) -> List[TagResponse]:
        """Get all tags for a specific document."""
        document_tags = (
            self.db.query(DocumentTag)
            .options(joinedload(DocumentTag.tag))
            .filter(DocumentTag.document_id == document_id)
            .all()
        )

        return [
            TagResponse(
                id=doc_tag.tag.id,
                collection_id=doc_tag.tag.collection_id,
                title=doc_tag.tag.title,
                color=doc_tag.tag.color,
            )
            for doc_tag in document_tags
            if doc_tag.tag
        ]

    def update_document_tags(
        self, document_id: str, tag_ids: List[str]
    ) -> List[TagResponse]:
        """Update all tags for a document in one operation."""
        try:
            # Get current document tags
            current_document_tags = (
                self.db.query(DocumentTag)
                .filter(DocumentTag.document_id == document_id)
                .all()
            )
            current_tag_ids = {str(dt.tag_id) for dt in current_document_tags}

            # Convert input tag_ids to set for easier comparison
            new_tag_ids = set(str(tag_id) for tag_id in tag_ids)

            # Find tags to add
            tags_to_add = new_tag_ids - current_tag_ids

            # Find tags to remove
            tags_to_remove = current_tag_ids - new_tag_ids

            # Remove tags
            for tag_id in tags_to_remove:
                document_tag = (
                    self.db.query(DocumentTag)
                    .filter(
                        DocumentTag.document_id == document_id,
                        DocumentTag.tag_id == tag_id,
                    )
                    .first()
                )
                if document_tag:
                    self.db.delete(document_tag)

            # Add new tags
            for tag_id in tags_to_add:
                # Verify tag exists
                tag = self.db.query(Tag).filter(Tag.id == tag_id).first()
                if not tag:
                    raise ValueError(f"Tag with ID {tag_id} does not exist")

                document_tag = DocumentTag(
                    document_id=UUID(document_id),
                    tag_id=UUID(tag_id),
                )
                self.db.add(document_tag)

            self.db.commit()

            # Return updated tags
            return self.get_document_tags(document_id)

        except IntegrityError as e:
            self.db.rollback()
            raise ValueError(f"Database integrity error: {str(e)}")
        except Exception as e:
            self.db.rollback()
            raise ValueError(f"Error updating document tags: {str(e)}")

    def replace_document_tags(
        self, document_id: str, tag_items: List[str]
    ) -> List[TagResponse]:
        """Replace all tags for a document.

        Accepts a list of tag identifiers which can be UUID strings or new tag
        titles. New titles will be created within the same collection as the
        document. Returns the updated list of TagResponse objects.
        """
        document = self.db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise ValueError(f"Document with id {document_id} not found")

        collection_id = document.collection_id
        if not collection_id:
            raise ValueError(
                "Cannot create tags for a document without a collection_id"
            )

        existing_tag_ids: List[str] = []
        new_titles: List[str] = []

        for item in tag_items:
            if isinstance(item, str) and _UUID_PATTERN.match(item):
                existing_tag_ids.append(item)
            elif isinstance(item, str):
                new_titles.append(item)
            else:
                existing_tag_ids.append(str(item))

        created_ids: List[str] = []

        for title in new_titles:
            tag = (
                self.db.query(Tag)
                .filter(Tag.title == title, Tag.collection_id == collection_id)
                .first()
            )
            if tag:
                created_ids.append(str(tag.id))
                continue

            # Create tag with basic get-or-create safety: attempt insert, on
            # IntegrityError re-query to handle concurrent creators.
            try:
                new_tag = Tag(
                    collection_id=collection_id,
                    title=title,
                    color=generateRandomColor(),
                )
                self.db.add(new_tag)
                self.db.commit()
                self.db.refresh(new_tag)
                created_ids.append(str(new_tag.id))
            except IntegrityError:
                # Possible race - rollback and re-query
                self.db.rollback()
                tag2 = (
                    self.db.query(Tag)
                    .filter(Tag.title == title, Tag.collection_id == collection_id)
                    .first()
                )
                if tag2:
                    created_ids.append(str(tag2.id))
                else:
                    raise ValueError(f"Unable to create tag '{title}'")

        all_tag_ids = existing_tag_ids + created_ids

        return self.update_document_tags(document_id, all_tag_ids)


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
