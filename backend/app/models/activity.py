from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship
from app.db.base import Base


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    record_id = Column(Integer, ForeignKey("records.id", ondelete="CASCADE"), nullable=True, index=True)
    action_type = Column(String(50), nullable=False)  # create, update, status_change, delete, export, login
    description = Column(Text, nullable=False)
    action_metadata = Column(JSON, default=dict, nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True
    )

    user = relationship("User", back_populates="activities")
    record = relationship("Record", back_populates="activities")
