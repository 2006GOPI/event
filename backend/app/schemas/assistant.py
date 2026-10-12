from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    conversation_id: str = "default"


class ChatResponse(BaseModel):
    reply: str
    role: str = "assistant"
    conversation_id: str
    is_live_model: bool
    model_name: str
    suggestions: List[str] = Field(default_factory=list)


class ChatMessageResponse(BaseModel):
    id: int
    conversation_id: str
    role: str
    content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
