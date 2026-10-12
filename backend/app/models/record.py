from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship
from app.db.base import Base


class Record(Base):
    __tablename__ = "records"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    description = Column(Text, default="", nullable=False)
    category = Column(String(100), index=True, default="General", nullable=False)
    priority = Column(String(50), index=True, default="Medium", nullable=False)  # Low, Medium, High, Urgent
    status = Column(String(50), index=True, default="Open", nullable=False)  # Draft, Open, In Progress, Completed, Archived
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    tags = Column(JSON, default=list, nullable=False)
    due_date = Column(DateTime, nullable=True)
    checklist = Column(JSON, default=list, nullable=False)  # [{"id": "1", "text": "Task", "completed": False}]
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    owner = relationship("User", back_populates="records")
    activities = relationship("Activity", back_populates="record", cascade="all, delete-orphan")
