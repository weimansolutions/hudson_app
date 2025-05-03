from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base


class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(Text)
    contact_email = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    sampling_points = relationship("SamplingPoint", back_populates="client", cascade="all, delete")
    studies = relationship("Study", back_populates="client", cascade="all, delete")


class SamplingPoint(Base):
    __tablename__ = "sampling_points"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False)
    code = Column(String, nullable=False)
    location = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Client", back_populates="sampling_points")
    analyses = relationship("Analysis", back_populates="sampling_point", cascade="all, delete")


class Study(Base):
    __tablename__ = "studies"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    requested_on = Column(Date, nullable=False)
    performed_on = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Client", back_populates="studies")
    analyses = relationship("Analysis", back_populates="study", cascade="all, delete")
    reports = relationship("Report", back_populates="study", cascade="all, delete")


class Analysis(Base):
    __tablename__ = "analyses"
    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, ForeignKey("studies.id", ondelete="CASCADE"), nullable=False)
    sampling_point_id = Column(Integer, ForeignKey("sampling_points.id", ondelete="CASCADE"), nullable=False)
    parameter = Column(String, nullable=False)
    method = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    study = relationship("Study", back_populates="analyses")
    sampling_point = relationship("SamplingPoint", back_populates="analyses")
    results = relationship("AnalysisResult", back_populates="analysis", cascade="all, delete")


class AnalysisResult(Base):
    __tablename__ = "analysis_results"
    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False)
    value = Column(String, nullable=False)
    unit = Column(String)
    measured_at = Column(DateTime, default=datetime.utcnow)

    analysis = relationship("Analysis", back_populates="results")


class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, ForeignKey("studies.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    conclusions = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    study = relationship("Study", back_populates="reports")
    author = relationship("app.models.user.User", backref="reports")
