import math
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session
from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import MessageResponse
from app.schemas.record import (
    RecordCreate,
    RecordListResponse,
    RecordResponse,
    RecordUpdate,
)
from app.services.record_service import RecordService

router = APIRouter()


@router.get("", response_model=RecordListResponse)
def list_records(
    search: Optional[str] = Query(None, description="Search across title, description, or category"),
    status: Optional[str] = Query(None, description="Filter by status (Draft, Open, In Progress, Completed, Archived)"),
    category: Optional[str] = Query(None, description="Filter by category"),
    priority: Optional[str] = Query(None, description="Filter by priority (Low, Medium, High, Urgent)"),
    sort_by: str = Query("updated_at", description="Field to sort by (title, updated_at, created_at, priority)"),
    sort_order: str = Query("desc", description="Sort order: asc or desc"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    records, total = RecordService.get_records(
        db=db,
        current_user=current_user,
        search=search,
        status_filter=status,
        category_filter=category,
        priority_filter=priority,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        page_size=page_size,
    )

    total_pages = math.ceil(total / page_size) if total > 0 else 1
    items = [RecordResponse.model_validate(r) for r in records]

    return RecordListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.post("", response_model=RecordResponse, status_code=status.HTTP_201_CREATED)
def create_record(
    record_in: RecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = RecordService.create_record(
        db=db, current_user=current_user, record_in=record_in
    )
    return RecordResponse.model_validate(record)


@router.get("/export")
def export_records_csv(
    search: Optional[str] = None,
    status: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    csv_content = RecordService.export_records_to_csv(
        db=db,
        current_user=current_user,
        search=search,
        status_filter=status,
        category_filter=category,
        priority_filter=priority,
    )
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=atlas_records_export.csv"},
    )


@router.post("/bulk-delete", response_model=MessageResponse)
def bulk_delete_records(
    record_ids: List[int],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    count = RecordService.bulk_delete_records(
        db=db, current_user=current_user, record_ids=record_ids
    )
    return MessageResponse(message=f"Successfully deleted {count} records")


@router.get("/{record_id}", response_model=RecordResponse)
def get_record(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = RecordService.get_record_by_id(
        db=db, current_user=current_user, record_id=record_id
    )
    return RecordResponse.model_validate(record)


@router.patch("/{record_id}", response_model=RecordResponse)
def update_record(
    record_id: int,
    record_in: RecordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = RecordService.update_record(
        db=db, current_user=current_user, record_id=record_id, record_in=record_in
    )
    return RecordResponse.model_validate(record)


@router.delete("/{record_id}", response_model=MessageResponse)
def delete_record(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    RecordService.delete_record(db=db, current_user=current_user, record_id=record_id)
    return MessageResponse(message=f"Record {record_id} successfully deleted")
