from sqlalchemy.orm import Session
from .schemas import CollectionCreateRequest, CollectionResponse
from ..models.collection import Collection, CollectionAudit
from ..models.enum import CollectionActionEnum
from uuid import uuid4
from datetime import datetime, timezone
from typing import Optional, List


class CollectionService:
    """Collection Service"""

    def __init__(self, db: Session):
        """Initialize collection service."""

        self.db = db
        self.audit = CollectionAuditService(db)

    def update_collection(
        self,
        collection_id: str,
        collection_data: CollectionCreateRequest,
        user_id: Optional[str] = None,
    ) -> Optional[CollectionResponse]:
        """Update a collection by ID and audit the action."""
        collection = (
            self.db.query(Collection).filter(Collection.id == collection_id).first()
        )
        if not collection:
            return None
        collection.title = collection_data.title
        collection.description = collection_data.description
        self.audit.create_audit(
            collection_id=collection.id,
            action=CollectionActionEnum.UPDATE,
            user_id=user_id,
        )
        self.db.commit()
        self.db.refresh(collection)
        return CollectionResponse.model_validate(collection)

    def delete_collection(
        self, collection_id: str, user_id: Optional[str] = None
    ) -> bool:
        """Delete a collection by ID and audit the action."""
        collection = (
            self.db.query(Collection).filter(Collection.id == collection_id).first()
        )
        if not collection:
            return False
        self.db.delete(collection)
        self.audit.create_audit(
            collection_id=collection_id,
            action=CollectionActionEnum.ARCHIVE,  # Use ARCHIVE for delete
            user_id=user_id,
        )
        self.db.commit()
        return True

    def get_collection_audits(self, collection_id: str):
        """Get audits for a collection by ID."""
        return self.audit.get_audits_for_collection(collection_id)

    def create_collection(
        self, collection_data: CollectionCreateRequest, user_id: Optional[str] = None
    ) -> CollectionResponse:
        """Create a new collection and audit the action in a transaction."""

        try:
            collection = Collection(
                id=str(uuid4()),
                title=collection_data.title,
                description=collection_data.description,
                summary=None,
            )

            self.db.add(collection)
            self.db.flush()

            self.audit.create_audit(
                collection_id=collection.id,
                action=CollectionActionEnum.CREATE,
                user_id=user_id,
            )

            self.db.commit()
            self.db.refresh(collection)

            return CollectionResponse.model_validate(collection)
        except Exception as e:
            self.db.rollback()
            raise e

    def get_collection(self, collection_id: str) -> Optional[CollectionResponse]:
        """Get a collection by ID."""

        collection = (
            self.db.query(Collection).filter(Collection.id == collection_id).first()
        )
        if collection:
            return CollectionResponse.model_validate(collection)
        return None

    def get_collections(self) -> List[CollectionResponse]:
        """Get all collections."""

        collections = self.db.query(Collection).all()
        return [
            CollectionResponse.model_validate(collection) for collection in collections
        ]


class CollectionAuditService:
    """Service for handling collection audits."""

    def __init__(self, db: Session):
        self.db = db

    def create_audit(
        self,
        collection_id: str,
        action: CollectionActionEnum,
        user_id: Optional[str] = None,
    ) -> CollectionAudit:
        """Create a new audit record for a collection action."""

        audit = CollectionAudit(
            id=str(uuid4()),
            collection_id=collection_id,
            action=action,
            performed_by=user_id,
            performed_at=datetime.now(timezone.utc),
        )
        self.db.add(audit)
        # Don't commit here - let the calling service handle the transaction
        return audit

    def get_audits_for_collection(self, collection_id: str) -> List[CollectionAudit]:
        """Retrieve all audit records for a given collection."""

        return (
            self.db.query(CollectionAudit)
            .filter(CollectionAudit.collection_id == collection_id)
            .order_by(CollectionAudit.performed_at.desc())
            .all()
        )
