from sqlalchemy.orm import Session
from .schemas import (
    CollectionCreateRequest,
    CollectionResponse,
    CollectionPermissionResponse,
    CollectionAiPreferenceRequest,
    CollectionAiPreferenceResponse,
)
from ..models.collection import (
    Collection,
    CollectionAudit,
    CollectionPermission,
    CollectionPermissionAudit,
    CollectionAiPreference,
)
from ..models.user import User
from ..models.document import Document
from ..models.enum import CollectionActionEnum, CollectionPermissionEnum
from uuid import uuid4
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import func
from fastapi import HTTPException


class CollectionService:
    """Collection Service"""

    def __init__(self, db: Session):
        """Initialize collection service."""

        self.db = db
        self.audit = CollectionAuditService(db)
        self.permission = CollectionPermissionService(db)

    def create_collection(
        self, collection_data: CollectionCreateRequest, user_id: str
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

            # Grant OWNER permission to the creator
            if user_id:
                self.permission.grant_permission(
                    collection_id=collection.id,
                    user_id=user_id,
                    permission_level=CollectionPermissionEnum.OWNER,
                    granted_by=user_id,
                )

            self.audit.create_audit(
                collection_id=collection.id,
                action=CollectionActionEnum.CREATE,
                user_id=user_id,
            )

            self.db.commit()
            self.db.refresh(collection)

            # Get the collection with the new fields populated
            return self.get_collection(collection.id)
        except Exception as e:
            self.db.rollback()
            raise e

    def has_permission(
        self,
        user_id: str,
        collection_id: str,
        required_permission: CollectionPermissionEnum,
    ) -> bool:
        """Check if user has required permission for collection."""
        return self.permission.has_permission(
            user_id, collection_id, required_permission
        )

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
        return self.get_collection(collection.id)

    def delete_collection(self, collection_id: str) -> bool:
        """Delete a collection by ID and clean up related records. Documents are automatically deleted due to CASCADE."""
        collection = (
            self.db.query(Collection).filter(Collection.id == collection_id).first()
        )
        if not collection:
            return False

        try:
            # First audit the deletion
            self.audit.create_audit(
                collection_id=collection_id,
                action=CollectionActionEnum.DELETE,
                user_id=None,
            )

            # Clean up audit records for collection permissions
            permission_ids = (
                self.db.query(CollectionPermission.id)
                .filter(CollectionPermission.collection_id == collection_id)
                .subquery()
            )

            self.db.query(CollectionPermissionAudit).filter(
                CollectionPermissionAudit.collection_permission_id.in_(
                    self.db.query(permission_ids.c.id)
                )
            ).delete(synchronize_session=False)

            # Clean up collection permissions
            self.db.query(CollectionPermission).filter(
                CollectionPermission.collection_id == collection_id
            ).delete(synchronize_session=False)

            # Clean up collection audits
            self.db.query(CollectionAudit).filter(
                CollectionAudit.collection_id == collection_id
            ).delete(synchronize_session=False)

            # Delete the collection (documents will be deleted automatically due to CASCADE)
            self.db.query(Collection).filter(Collection.id == collection_id).delete(
                synchronize_session=False
            )

            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            raise e

    def get_collection_document_count(self, collection_id: str) -> int:
        """Get the number of documents in a collection."""
        return (
            self.db.query(Document)
            .filter(Document.collection_id == collection_id)
            .count()
        )

    def get_collection_audits(self, collection_id: str):
        """Get audits for a collection by ID."""
        return self.audit.get_audits_for_collection(collection_id)

    def get_collection(self, collection_id: str) -> Optional[CollectionResponse]:
        """Get a collection by ID."""

        collection = (
            self.db.query(Collection).filter(Collection.id == collection_id).first()
        )
        if not collection:
            return None

        # Get contributors (users with permissions on this collection)
        contributors = (
            self.db.query(User.display, User.image)
            .join(CollectionPermission, User.id == CollectionPermission.user_id)
            .filter(CollectionPermission.collection_id == collection_id)
            .filter(User.display.isnot(None))
            .distinct()
            .all()
        )
        contributor_list = [
            {"display": display, "imgUrl": image if image else None}
            for display, image in contributors
            if display
        ]

        # Get latest update timestamp from audits
        latest_audit = (
            self.db.query(CollectionAudit.performed_at)
            .filter(CollectionAudit.collection_id == collection_id)
            .order_by(CollectionAudit.performed_at.desc())
            .first()
        )
        latest_update = latest_audit[0] if latest_audit else None

        # Get document count for this collection
        document_count = self.get_collection_document_count(collection_id)

        # Create response with additional fields
        collection_dict = {
            "id": collection.id,
            "title": collection.title,
            "description": collection.description,
            "summary": collection.summary,
            "contributor": contributor_list,
            "latest_update": latest_update,
            "document_count": document_count,
        }

        return CollectionResponse.model_validate(collection_dict)

    # Permission-related methods
    def grant_permission(
        self,
        collection_id: str,
        user_id: str,
        permission_level: CollectionPermissionEnum,
        granted_by: str,
    ) -> CollectionPermissionResponse:
        """Grant permission to a user for a collection."""
        return self.permission.grant_permission(
            collection_id, user_id, permission_level, granted_by
        )

    def update_permission(
        self,
        collection_id: str,
        user_id: str,
        permission_level: CollectionPermissionEnum,
        updated_by: str,
    ) -> Optional[CollectionPermissionResponse]:
        """Update permission for a user on a collection."""
        return self.permission.update_permission(
            collection_id, user_id, permission_level, updated_by
        )

    def revoke_permission(
        self, collection_id: str, user_id: str, revoked_by: str
    ) -> bool:
        """Revoke permission for a user on a collection."""
        return self.permission.revoke_permission(collection_id, user_id, revoked_by)

    def get_collection_permissions(
        self, collection_id: str
    ) -> List[CollectionPermissionResponse]:
        """Get all permissions for a collection."""
        return self.permission.get_collection_permissions(collection_id)

    def get_user_collections(self, user_id: str) -> List[CollectionResponse]:
        """Get all collections a user has access to."""
        return self.permission.get_user_collections(user_id)


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


class CollectionPermissionService:
    """Service for handling collection permissions."""

    def __init__(self, db: Session):
        self.db = db

    def has_permission(
        self,
        user_id: str,
        collection_id: str,
        required_permission: CollectionPermissionEnum,
    ) -> bool:
        """Check if user has required permission for collection."""
        permission = (
            self.db.query(CollectionPermission)
            .filter(
                CollectionPermission.user_id == user_id,
                CollectionPermission.collection_id == collection_id,
            )
            .first()
        )

        if not permission:
            return False

        # Define permission hierarchy: OWNER > EDIT > READ
        permission_levels = {
            CollectionPermissionEnum.READ: 1,
            CollectionPermissionEnum.EDIT: 2,
            CollectionPermissionEnum.OWNER: 3,
        }

        return (
            permission_levels[permission.permission_level]
            >= permission_levels[required_permission]
        )

    def grant_permission(
        self,
        collection_id: str,
        user_id: str,
        permission_level: CollectionPermissionEnum,
        granted_by: str,
    ) -> CollectionPermissionResponse:
        """Grant permission to a user for a collection."""

        # Check if permission already exists
        existing_permission = (
            self.db.query(CollectionPermission)
            .filter(
                CollectionPermission.user_id == user_id,
                CollectionPermission.collection_id == collection_id,
            )
            .first()
        )

        if existing_permission:
            # Update existing permission
            return self.update_permission(
                collection_id, user_id, permission_level, granted_by
            )

        try:
            permission = CollectionPermission(
                id=str(uuid4()),
                collection_id=collection_id,
                user_id=user_id,
                permission_level=permission_level,
            )

            self.db.add(permission)
            self.db.flush()

            # Create audit record
            self._create_permission_audit(
                permission_id=permission.id,
                performed_by=granted_by,
                old_permission=None,
                new_permission=permission_level,
            )

            self.db.commit()
            self.db.refresh(permission)

            return CollectionPermissionResponse.model_validate(permission)
        except Exception as e:
            self.db.rollback()
            raise e

    def update_permission(
        self,
        collection_id: str,
        user_id: str,
        permission_level: CollectionPermissionEnum,
        updated_by: str,
    ) -> Optional[CollectionPermissionResponse]:
        """Update permission for a user on a collection."""

        permission = (
            self.db.query(CollectionPermission)
            .filter(
                CollectionPermission.user_id == user_id,
                CollectionPermission.collection_id == collection_id,
            )
            .first()
        )

        if not permission:
            return None

        try:
            old_permission = permission.permission_level
            permission.permission_level = permission_level

            self.db.flush()

            # Create audit record
            self._create_permission_audit(
                permission_id=permission.id,
                performed_by=updated_by,
                old_permission=old_permission,
                new_permission=permission_level,
            )

            self.db.commit()
            self.db.refresh(permission)

            return CollectionPermissionResponse.model_validate(permission)
        except Exception as e:
            self.db.rollback()
            raise e

    def revoke_permission(
        self, collection_id: str, user_id: str, revoked_by: str
    ) -> bool:
        """Revoke permission for a user on a collection, preventing removal of last owner."""

        permission = (
            self.db.query(CollectionPermission)
            .filter(
                CollectionPermission.user_id == user_id,
                CollectionPermission.collection_id == collection_id,
            )
            .first()
        )

        if not permission:
            return False

        # Prevent removing the last owner
        if permission.permission_level == CollectionPermissionEnum.OWNER:
            owners = (
                self.db.query(CollectionPermission)
                .filter(
                    CollectionPermission.collection_id == collection_id,
                    CollectionPermission.permission_level
                    == CollectionPermissionEnum.OWNER,
                )
                .count()
            )
            if owners <= 1:
                from fastapi import HTTPException, status

                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot remove the last owner of a collection",
                )

        try:
            old_permission = permission.permission_level

            # Create audit record before deletion
            self._create_permission_audit(
                permission_id=permission.id,
                performed_by=revoked_by,
                old_permission=old_permission,
                new_permission=None,
            )

            self.db.delete(permission)
            self.db.commit()

            return True
        except Exception as e:
            self.db.rollback()
            raise e

    def get_collection_permissions(
        self, collection_id: str
    ) -> List[CollectionPermissionResponse]:
        """Get all permissions for a collection."""

        permissions = (
            self.db.query(CollectionPermission)
            .filter(CollectionPermission.collection_id == collection_id)
            .all()
        )

        return [CollectionPermissionResponse.model_validate(p) for p in permissions]

    def get_user_collections(self, user_id: str) -> List[CollectionResponse]:
        """Get all collections a user has access to."""
        collections = (
            self.db.query(Collection)
            .join(CollectionPermission)
            .filter(CollectionPermission.user_id == user_id)
            .all()
        )

        # Delegate enrichment to a helper that batches contributor/latest lookups
        return self._enrich_collections(collections)

    def search_collections(
        self, user_id: str, word: str = "", page: int = 1, per_page: int = 5
    ) -> List[CollectionResponse]:
        """Search collections a user has access to by title.

        Behavior:
        - If `word` is empty, return the first `per_page` collections (ordered by title).
        - If `word` is provided, attempt to use PostgreSQL trigram similarity to rank matches.
          If similarity is not available, fall back to a case-insensitive substring match (ILIKE).
        Pagination via page/per_page.
        """

        page = max(1, page)
        per_page = max(1, min(per_page, 100))
        offset = (page - 1) * per_page

        q = (
            self.db.query(Collection)
            .join(CollectionPermission)
            .filter(CollectionPermission.user_id == user_id)
        )

        if not word or word.strip() == "":
            collections = (
                q.order_by(Collection.title.asc()).limit(per_page).offset(offset).all()
            )
        else:
            try:
                sim = func.similarity(Collection.title, word)
                collections = (
                    q.filter(Collection.title.ilike(f"%{word}%"))
                    .order_by(sim.desc())
                    .limit(per_page)
                    .offset(offset)
                    .all()
                )
            except Exception:
                # If similarity() execution fails (for example pg_trgm extension
                # not installed) the DB transaction can become aborted. Roll
                # back the transaction before running the fallback query so
                # subsequent SELECTs are executed in a clean transaction.
                try:
                    self.db.rollback()
                except Exception:
                    pass

                collections = (
                    q.filter(Collection.title.ilike(f"%{word}%"))
                    .order_by(Collection.title.asc())
                    .limit(per_page)
                    .offset(offset)
                    .all()
                )

        # Enrich collections in bulk to avoid N+1 queries and duplicate logic
        return self._enrich_collections(collections)

    def _enrich_collections(
        self, collections: List[Collection]
    ) -> List[CollectionResponse]:
        """Private helper to attach contributors, latest_update, and document_count to collections.

        This batches the DB queries for contributors, latest audit timestamps, and document counts to
        avoid N+1 queries and centralizes the transformation logic.
        """
        if not collections:
            return []

        collection_ids = [c.id for c in collections]

        # Get contributors
        contributor_rows = (
            self.db.query(CollectionPermission.collection_id, User.display, User.image)
            .join(User, User.id == CollectionPermission.user_id)
            .filter(CollectionPermission.collection_id.in_(collection_ids))
            .filter(User.display.isnot(None))
            .distinct()
            .all()
        )

        contributors_map = {}
        for coll_id, display, image in contributor_rows:
            if not display:
                continue
            contributors_map.setdefault(coll_id, []).append(
                {"display": display, "imgUrl": image if image else None}
            )

        # Get latest audit timestamps
        latest_rows = (
            self.db.query(
                CollectionAudit.collection_id, func.max(CollectionAudit.performed_at)
            )
            .filter(CollectionAudit.collection_id.in_(collection_ids))
            .group_by(CollectionAudit.collection_id)
            .all()
        )
        latest_map = {coll_id: performed_at for coll_id, performed_at in latest_rows}

        # Get document counts
        document_count_rows = (
            self.db.query(Document.collection_id, func.count(Document.id))
            .filter(Document.collection_id.in_(collection_ids))
            .group_by(Document.collection_id)
            .all()
        )
        document_count_map = {coll_id: count for coll_id, count in document_count_rows}

        result: List[CollectionResponse] = []
        for collection in collections:
            contributor_list = contributors_map.get(collection.id, [])
            latest_update = latest_map.get(collection.id)
            document_count = document_count_map.get(collection.id, 0)

            collection_dict = {
                "id": collection.id,
                "title": collection.title,
                "description": collection.description,
                "summary": collection.summary,
                "contributor": contributor_list,
                "latest_update": latest_update,
                "document_count": document_count,
            }

            result.append(CollectionResponse.model_validate(collection_dict))

        return result

    def _create_permission_audit(
        self,
        permission_id: str,
        performed_by: str,
        old_permission: Optional[CollectionPermissionEnum],
        new_permission: Optional[CollectionPermissionEnum],
    ) -> CollectionPermissionAudit:
        """Create a permission audit record."""

        audit = CollectionPermissionAudit(
            id=str(uuid4()),
            collection_permission_id=permission_id,
            performed_by=performed_by,
            performed_at=datetime.now(timezone.utc),
            old_permission=old_permission,
            new_permission=new_permission,
        )

        self.db.add(audit)
        return audit

    def get_collection_ai_preference(
        self, collection_id: str
    ) -> Optional[CollectionAiPreference]:
        """Get collection AI preference by collection ID."""
        return (
            self.db.query(CollectionAiPreference)
            .filter(CollectionAiPreference.collection_id == collection_id)
            .first()
        )

    def create_collection_ai_preference(
        self,
        collection_id: str,
        preference_data: CollectionAiPreferenceRequest,
    ) -> CollectionAiPreference:
        """Create collection AI preference."""

        # Check if collection exists
        collection = (
            self.db.query(Collection).filter(Collection.id == collection_id).first()
        )
        if not collection:
            raise HTTPException(status_code=404, detail="Collection not found")

        preference = CollectionAiPreference(
            id=str(uuid4()),
            collection_id=collection_id,
            tones_and_style=preference_data.tones_and_style,
            skillset=preference_data.skillset,
            sensitivity=preference_data.sensitivity,
        )

        self.db.add(preference)
        self.db.commit()
        self.db.refresh(preference)
        return preference

    def update_collection_ai_preference(
        self,
        collection_id: str,
        preference_data: CollectionAiPreferenceRequest,
    ) -> CollectionAiPreference:
        """Update collection AI preference."""

        preference = self.get_collection_ai_preference(collection_id)
        if not preference:
            raise HTTPException(
                status_code=404,
                detail="Collection AI preference not found",
            )

        preference.tones_and_style = preference_data.tones_and_style
        preference.skillset = preference_data.skillset
        preference.sensitivity = preference_data.sensitivity

        self.db.commit()
        self.db.refresh(preference)
        return preference

    def delete_collection_ai_preference(self, collection_id: str) -> None:
        """Delete collection AI preference."""

        preference = self.get_collection_ai_preference(collection_id)
        if not preference:
            raise HTTPException(
                status_code=404,
                detail="Collection AI preference not found",
            )

        self.db.delete(preference)
        self.db.commit()
