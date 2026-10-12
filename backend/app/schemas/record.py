from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class ChecklistItem(BaseModel):
    id: str
    text: str
    completed: bool = False


class RecordBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = ""
    category: str = "General"
    priority: str = "Medium"  # Low, Medium, High, Urgent
    status: str = "Open"      # Draft, Open, In Progress, Completed, Archived
    tags: List[str] = Field(default_factory=list)
    due_date: Optional[datetime] = None
    checklist: List[ChecklistItem] = Field(default_factory=list)

    @field_validator("due_date", mode="before")
    @classmethod
    def parse_due_date(cls, v: Any) -> Optional[datetime]:
        if v == "" or v is None:
            return None
        return v


class RecordCreate(RecordBase):
    pass


class RecordUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    tags: Optional[List[str]] = None
    due_date: Optional[datetime] = None
    checklist: Optional[List[ChecklistItem]] = None

    @field_validator("due_date", mode="before")
    @classmethod
    def parse_due_date_update(cls, v: Any) -> Optional[datetime]:
        if v == "" or v is None:
            return None
        return v


class RecordOwner(BaseModel):
    id: int
    full_name: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class RecordResponse(RecordBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime
    owner: Optional[RecordOwner] = None

    model_config = ConfigDict(from_attributes=True)


class RecordListResponse(BaseModel):
    items: List[RecordResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
