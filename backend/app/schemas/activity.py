from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict, Field


class ActivityBase(BaseModel):
    action_type: str
    description: str
    action_metadata: Dict[str, Any] = Field(default_factory=dict)
    record_id: Optional[int] = None


class ActivityCreate(ActivityBase):
    user_id: int


class ActivityResponse(BaseModel):
    id: int
    user_id: int
    record_id: Optional[int]
    action_type: str
    description: str
    action_metadata: Dict[str, Any]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
