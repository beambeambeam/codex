from sqlalchemy.orm import Session
from .schemas import (
    CollectionCreateRequest,
    CollectionResponse,
    CollectionPermissionResponse,
)
from ..models.collection import (
    Collection,
    CollectionAudit,
    CollectionPermission,
    CollectionPermissionAudit,
)
from ..models.enum import CollectionActionEnum, CollectionPermissionEnum
from uuid import uuid4
from datetime import datetime, timezone
from typing import Optional, List


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

            return CollectionResponse.model_validate(collection)
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
            action=CollectionActionEnum.DELETE,
            user_id=user_id,
        )
        self.db.commit()
        return True

    def get_collection_audits(self, collection_id: str):
        """Get audits for a collection by ID."""
        return self.audit.get_audits_for_collection(collection_id)

    def get_collection(self, collection_id: str) -> Optional[CollectionResponse]:
        """Get a collection by ID."""

        collection = (
            self.db.query(Collection).filter(Collection.id == collection_id).first()
        )
        if collection:
            return CollectionResponse.model_validate(collection)
        return None

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

        return [CollectionResponse.model_validate(c) for c in collections]

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
