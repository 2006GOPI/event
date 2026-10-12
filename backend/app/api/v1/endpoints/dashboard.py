from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.activity import ActivityResponse
from app.schemas.dashboard import (
    ActivityTimelinePoint,
    DashboardOverviewResponse,
    DashboardSummary,
    StatusBreakdownItem,
)
from app.services.dashboard_service import DashboardService

router = APIRouter()


@router.get("/overview", response_model=DashboardOverviewResponse)
def get_dashboard_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return DashboardService.get_dashboard_overview(db=db, current_user=current_user)


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    overview = DashboardService.get_dashboard_overview(db=db, current_user=current_user)
    return overview.summary


@router.get("/activity", response_model=List[ActivityTimelinePoint])
def get_dashboard_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    overview = DashboardService.get_dashboard_overview(db=db, current_user=current_user)
    return overview.activity_timeline


@router.get("/status-breakdown", response_model=List[StatusBreakdownItem])
def get_dashboard_status_breakdown(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    overview = DashboardService.get_dashboard_overview(db=db, current_user=current_user)
    return overview.status_breakdown


@router.get("/recent-activity", response_model=List[ActivityResponse])
def get_dashboard_recent_activity(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    overview = DashboardService.get_dashboard_overview(db=db, current_user=current_user)
    return overview.recent_activities
