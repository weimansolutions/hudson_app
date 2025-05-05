from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class HudsonRecordBase(BaseModel):
    name: str
    value: Optional[str]

class HudsonRecordCreate(HudsonRecordBase):
    pass

class HudsonRecord(HudsonRecordBase):
    id: int
    created_at: Optional[datetime]

    class Config:
        orm_mode = True