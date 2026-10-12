from typing import Dict, List
from pydantic import BaseModel
from app.schemas.activity import ActivityResponse


class MetricChange(BaseModel):
    value: float
    is_positive: bool
    label: str


class DashboardSummary(BaseModel):
    total_records: int
    active_tasks: int
    completed_items: int
    completion_rate: float
    total_records_change: MetricChange
    active_tasks_change: MetricChange
    completed_items_change: MetricChange
    completion_rate_change: MetricChange


class ActivityTimelinePoint(BaseModel):
    date: str
    records_created: int
    records_completed: int
    total_activity: int


class StatusBreakdownItem(BaseModel):
    status: str
    count: int
    percentage: float
    color: str


class DashboardOverviewResponse(BaseModel):
    summary: DashboardSummary
    status_breakdown: List[StatusBreakdownItem]
    activity_timeline: List[ActivityTimelinePoint]
    recent_activities: List[ActivityResponse]
