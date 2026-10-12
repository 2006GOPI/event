import csv
import io
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from fastapi import HTTPException, status
from sqlalchemy import or_, desc, asc
from sqlalchemy.orm import Session
from app.models.activity import Activity
from app.models.record import Record
from app.models.user import User
from app.schemas.record import RecordCreate, RecordUpdate


class RecordService:
    @staticmethod
    def get_records(
        db: Session,
        current_user: User,
        search: Optional[str] = None,
        status_filter: Optional[str] = None,
        category_filter: Optional[str] = None,
        priority_filter: Optional[str] = None,
        sort_by: str = "updated_at",
        sort_order: str = "desc",
        page: int = 1,
        page_size: int = 10,
    ) -> Tuple[List[Record], int]:
        # Enforce user authorization: non-admin users only see their own records
        query = db.query(Record)
        if current_user.role != "admin":
            query = query.filter(Record.owner_id == current_user.id)

        # Search filter
        if search and search.strip():
            term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Record.title.ilike(term),
                    Record.description.ilike(term),
                    Record.category.ilike(term),
                )
            )

        # Exact match filters
        if status_filter and status_filter != "all":
            query = query.filter(Record.status == status_filter)
        if category_filter and category_filter != "all":
            query = query.filter(Record.category == category_filter)
        if priority_filter and priority_filter != "all":
            query = query.filter(Record.priority == priority_filter)

        total = query.count()

        # Sorting
        sort_col = getattr(Record, sort_by, Record.updated_at)
        if sort_order.lower() == "asc":
            query = query.order_by(asc(sort_col))
        else:
            query = query.order_by(desc(sort_col))

        # Pagination
        offset = (page - 1) * page_size
        records = query.offset(offset).limit(page_size).all()
        return records, total

    @staticmethod
    def get_record_by_id(db: Session, current_user: User, record_id: int) -> Record:
        record = db.query(Record).filter(Record.id == record_id).first()
        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Record with ID {record_id} not found",
            )
        # Prevent cross-user access
        if current_user.role != "admin" and record.owner_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this record",
            )
        return record

    @staticmethod
    def create_record(db: Session, current_user: User, record_in: RecordCreate) -> Record:
        # Convert checklist items to dicts
        checklist_data = [item.model_dump() for item in record_in.checklist]

        record = Record(
            title=record_in.title,
            description=record_in.description,
            category=record_in.category,
            priority=record_in.priority,
            status=record_in.status,
            tags=record_in.tags,
            due_date=record_in.due_date,
            checklist=checklist_data,
            owner_id=current_user.id,
        )
        db.add(record)
        db.commit()
        db.refresh(record)

        # Log Activity
        activity = Activity(
            user_id=current_user.id,
            record_id=record.id,
            action_type="create",
            description=f"Created record '{record.title}' in {record.category}.",
            action_metadata={
                "record_id": record.id,
                "title": record.title,
                "status": record.status,
                "priority": record.priority,
            },
        )
        db.add(activity)
        db.commit()

        return record

    @staticmethod
    def update_record(
        db: Session, current_user: User, record_id: int, record_in: RecordUpdate
    ) -> Record:
        record = RecordService.get_record_by_id(db, current_user, record_id)

        old_status = record.status
        update_data = record_in.model_dump(exclude_unset=True)

        if "checklist" in update_data and update_data["checklist"] is not None:
            update_data["checklist"] = [
                item.model_dump() if hasattr(item, "model_dump") else item
                for item in update_data["checklist"]
            ]

        for field, value in update_data.items():
            setattr(record, field, value)

        record.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(record)

        # Log Activity
        action_type = "status_change" if (record.status != old_status) else "update"
        desc = (
            f"Changed status of '{record.title}' from {old_status} to {record.status}."
            if action_type == "status_change"
            else f"Updated record '{record.title}'."
        )

        activity = Activity(
            user_id=current_user.id,
            record_id=record.id,
            action_type=action_type,
            description=desc,
            action_metadata={
                "record_id": record.id,
                "updated_fields": list(update_data.keys()),
            },
        )
        db.add(activity)
        db.commit()

        return record

    @staticmethod
    def delete_record(db: Session, current_user: User, record_id: int) -> bool:
        record = RecordService.get_record_by_id(db, current_user, record_id)

        title = record.title
        db.delete(record)
        db.commit()

        # Log Activity
        activity = Activity(
            user_id=current_user.id,
            record_id=None,
            action_type="delete",
            description=f"Deleted record '{title}'.",
            action_metadata={"deleted_record_id": record_id, "title": title},
        )
        db.add(activity)
        db.commit()

        return True

    @staticmethod
    def bulk_delete_records(
        db: Session, current_user: User, record_ids: List[int]
    ) -> int:
        query = db.query(Record).filter(Record.id.in_(record_ids))
        if current_user.role != "admin":
            query = query.filter(Record.owner_id == current_user.id)

        records_to_delete = query.all()
        count = len(records_to_delete)

        for rec in records_to_delete:
            db.delete(rec)
        db.commit()

        # Log activity
        activity = Activity(
            user_id=current_user.id,
            record_id=None,
            action_type="bulk_delete",
            description=f"Bulk deleted {count} records.",
            action_metadata={"count": count, "ids": record_ids},
        )
        db.add(activity)
        db.commit()

        return count

    @staticmethod
    def export_records_to_csv(
        db: Session,
        current_user: User,
        search: Optional[str] = None,
        status_filter: Optional[str] = None,
        category_filter: Optional[str] = None,
        priority_filter: Optional[str] = None,
    ) -> str:
        records, _ = RecordService.get_records(
            db=db,
            current_user=current_user,
            search=search,
            status_filter=status_filter,
            category_filter=category_filter,
            priority_filter=priority_filter,
            page=1,
            page_size=10000,
        )

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(
            ["ID", "Title", "Category", "Priority", "Status", "Tags", "Due Date", "Created At", "Updated At"]
        )

        for r in records:
            writer.writerow(
                [
                    r.id,
                    r.title,
                    r.category,
                    r.priority,
                    r.status,
                    ", ".join(r.tags) if r.tags else "",
                    r.due_date.isoformat() if r.due_date else "",
                    r.created_at.isoformat() if r.created_at else "",
                    r.updated_at.isoformat() if r.updated_at else "",
                ]
            )

        # Log activity
        activity = Activity(
            user_id=current_user.id,
            record_id=None,
            action_type="export",
            description=f"Exported {len(records)} records as CSV.",
            action_metadata={"count": len(records)},
        )
        db.add(activity)
        db.commit()

        return output.getvalue()
