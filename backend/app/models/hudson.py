from ..db.database import Base
from sqlalchemy import Column, Integer, String, DateTime

class HudsonRecord(Base):
    __tablename__ = "hudson_records"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    value = Column(String(100), nullable=True)
    created_at = Column(DateTime)