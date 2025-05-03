from sqlalchemy.orm import Session
from datetime import date

from app.models.water import (
    Client,
    SamplingPoint,
    Study,
    Analysis,
    AnalysisResult,
    Report,
)

# --- Client CRUD ---
def create_client(db: Session, name: str, address: str = None, contact_email: str = None) -> Client:
    client = Client(name=name, address=address, contact_email=contact_email)
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


def get_client(db: Session, client_id: int) -> Client:
    return db.query(Client).filter(Client.id == client_id).first()


def list_clients(db: Session, skip: int = 0, limit: int = 100) -> list[Client]:
    return db.query(Client).offset(skip).limit(limit).all()


def update_client(db: Session, client_id: int, **kwargs) -> Client:
    client = get_client(db, client_id)
    if not client:
        return None
    for key, value in kwargs.items():
        setattr(client, key, value)
    db.commit()
    db.refresh(client)
    return client


def delete_client(db: Session, client_id: int) -> None:
    client = get_client(db, client_id)
    if client:
        db.delete(client)
        db.commit()


# --- SamplingPoint CRUD ---
def create_sampling_point(db: Session, client_id: int, code: str, location: str = None) -> SamplingPoint:
    sp = SamplingPoint(client_id=client_id, code=code, location=location)
    db.add(sp)
    db.commit()
    db.refresh(sp)
    return sp


def get_sampling_point(db: Session, sp_id: int) -> SamplingPoint:
    return db.query(SamplingPoint).filter(SamplingPoint.id == sp_id).first()


def list_sampling_points(db: Session, skip: int = 0, limit: int = 100) -> list[SamplingPoint]:
    return db.query(SamplingPoint).offset(skip).limit(limit).all()


def update_sampling_point(db: Session, sp_id: int, **kwargs) -> SamplingPoint:
    sp = get_sampling_point(db, sp_id)
    if not sp:
        return None
    for key, value in kwargs.items():
        setattr(sp, key, value)
    db.commit()
    db.refresh(sp)
    return sp


def delete_sampling_point(db: Session, sp_id: int) -> None:
    sp = get_sampling_point(db, sp_id)
    if sp:
        db.delete(sp)
        db.commit()


# --- Study CRUD ---
def create_study(db: Session, client_id: int, name: str, requested_on: date, performed_on: date = None) -> Study:
    study = Study(client_id=client_id, name=name, requested_on=requested_on, performed_on=performed_on)
    db.add(study)
    db.commit()
    db.refresh(study)
    return study


def get_study(db: Session, study_id: int) -> Study:
    return db.query(Study).filter(Study.id == study_id).first()


def list_studies(db: Session, skip: int = 0, limit: int = 100) -> list[Study]:
    return db.query(Study).offset(skip).limit(limit).all()


def update_study(db: Session, study_id: int, **kwargs) -> Study:
    study = get_study(db, study_id)
    if not study:
        return None
    for key, value in kwargs.items():
        setattr(study, key, value)
    db.commit()
    db.refresh(study)
    return study


def delete_study(db: Session, study_id: int) -> None:
    study = get_study(db, study_id)
    if study:
        db.delete(study)
        db.commit()


# --- Analysis CRUD ---
def create_analysis(db: Session, study_id: int, sampling_point_id: int, parameter: str, method: str = None) -> Analysis:
    analysis = Analysis(
        study_id=study_id,
        sampling_point_id=sampling_point_id,
        parameter=parameter,
        method=method,
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis


def get_analysis(db: Session, analysis_id: int) -> Analysis:
    return db.query(Analysis).filter(Analysis.id == analysis_id).first()


def list_analyses(db: Session, skip: int = 0, limit: int = 100) -> list[Analysis]:
    return db.query(Analysis).offset(skip).limit(limit).all()


def update_analysis(db: Session, analysis_id: int, **kwargs) -> Analysis:
    analysis = get_analysis(db, analysis_id)
    if not analysis:
        return None
    for key, value in kwargs.items():
        setattr(analysis, key, value)
    db.commit()
    db.refresh(analysis)
    return analysis


def delete_analysis(db: Session, analysis_id: int) -> None:
    analysis = get_analysis(db, analysis_id)
    if analysis:
        db.delete(analysis)
        db.commit()


# --- AnalysisResult CRUD ---
def create_analysis_result(db: Session, analysis_id: int, value: str, unit: str = None) -> AnalysisResult:
    result = AnalysisResult(analysis_id=analysis_id, value=value, unit=unit)
    db.add(result)
    db.commit()
    db.refresh(result)
    return result


def get_analysis_result(db: Session, result_id: int) -> AnalysisResult:
    return db.query(AnalysisResult).filter(AnalysisResult.id == result_id).first()


def list_analysis_results(db: Session, skip: int = 0, limit: int = 100) -> list[AnalysisResult]:
    return db.query(AnalysisResult).offset(skip).limit(limit).all()


def update_analysis_result(db: Session, result_id: int, **kwargs) -> AnalysisResult:
    result = get_analysis_result(db, result_id)
    if not result:
        return None
    for key, value in kwargs.items():
        setattr(result, key, value)
    db.commit()
    db.refresh(result)
    return result


def delete_analysis_result(db: Session, result_id: int) -> None:
    result = get_analysis_result(db, result_id)
    if result:
        db.delete(result)
        db.commit()


# --- Report CRUD ---
def create_report(db: Session, study_id: int, author_id: int, conclusions: str) -> Report:
    report = Report(study_id=study_id, author_id=author_id, conclusions=conclusions)
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def get_report(db: Session, report_id: int) -> Report:
    return db.query(Report).filter(Report.id == report_id).first()


def list_reports(db: Session, skip: int = 0, limit: int = 100) -> list[Report]:
    return db.query(Report).offset(skip).limit(limit).all()


def update_report(db: Session, report_id: int, **kwargs) -> Report:
    report = get_report(db, report_id)
    if not report:
        return None
    for key, value in kwargs.items():
        setattr(report, key, value)
    db.commit()
    db.refresh(report)
    return report


def delete_report(db: Session, report_id: int) -> None:
    report = get_report(db, report_id)
    if report:
        db.delete(report)
        db.commit()
