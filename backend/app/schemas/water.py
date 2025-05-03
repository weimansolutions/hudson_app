from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date

# --- Client Schemas ---
class ClientBase(BaseModel):
    name: str
    address: Optional[str] = None
    contact_email: Optional[EmailStr] = None

class ClientCreate(ClientBase):
    pass

class ClientRead(ClientBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- SamplingPoint Schemas ---
class SamplingPointBase(BaseModel):
    client_id: int
    code: str
    location: Optional[str] = None

class SamplingPointCreate(SamplingPointBase):
    pass

class SamplingPointRead(SamplingPointBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Study Schemas ---
class StudyBase(BaseModel):
    client_id: int
    name: str
    requested_on: date
    performed_on: Optional[date] = None

class StudyCreate(StudyBase):
    pass

class StudyRead(StudyBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Analysis Schemas ---
class AnalysisBase(BaseModel):
    study_id: int
    sampling_point_id: int
    parameter: str
    method: Optional[str] = None

class AnalysisCreate(AnalysisBase):
    pass

class AnalysisRead(AnalysisBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- AnalysisResult Schemas ---
class AnalysisResultBase(BaseModel):
    analysis_id: int
    value: str
    unit: Optional[str] = None

class AnalysisResultCreate(AnalysisResultBase):
    pass

class AnalysisResultRead(AnalysisResultBase):
    id: int
    measured_at: datetime

    class Config:
        from_attributes = True

# --- Report Schemas ---
class ReportBase(BaseModel):
    study_id: int
    author_id: Optional[int] = None
    conclusions: str

class ReportCreate(ReportBase):
    pass

class ReportRead(ReportBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True