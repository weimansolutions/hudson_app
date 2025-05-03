from sqlalchemy.orm import Session
from typing import List
from datetime import date

from app.crud.water import (
    create_client, get_client, list_clients, update_client, delete_client,
    create_sampling_point, get_sampling_point, list_sampling_points, update_sampling_point, delete_sampling_point,
    create_study, get_study, list_studies, update_study, delete_study,
    create_analysis, get_analysis, list_analyses, update_analysis, delete_analysis,
    create_analysis_result, get_analysis_result, list_analysis_results, update_analysis_result, delete_analysis_result,
    create_report, get_report, list_reports, update_report, delete_report
)


# --- Client Service ---
def create_new_client(db: Session, name: str, address: str = None, contact_email: str = None):
    return create_client(db, name=name, address=address, contact_email=contact_email)


def retrieve_client(db: Session, client_id: int):
    client = get_client(db, client_id)
    if not client:
        raise ValueError(f"Client {client_id} not found")
    return client


def retrieve_all_clients(db: Session):
    return list_clients(db)


def modify_client(db: Session, client_id: int, **kwargs):
    client = update_client(db, client_id, **kwargs)
    if not client:
        raise ValueError(f"Client {client_id} not found")
    return client


def remove_client(db: Session, client_id: int):
    delete_client(db, client_id)
    return None


# --- SamplingPoint Service ---
def add_sampling_point(db: Session, client_id: int, code: str, location: str = None):
    # validate client exists
    retrieve_client(db, client_id)
    return create_sampling_point(db, client_id=client_id, code=code, location=location)


def retrieve_point(db: Session, sp_id: int):
    point = get_sampling_point(db, sp_id)
    if not point:
        raise ValueError(f"SamplingPoint {sp_id} not found")
    return point


def retrieve_all_points(db: Session):
    return list_sampling_points(db)


def modify_point(db: Session, sp_id: int, **kwargs):
    point = update_sampling_point(db, sp_id, **kwargs)
    if not point:
        raise ValueError(f"SamplingPoint {sp_id} not found")
    return point


def remove_point(db: Session, sp_id: int):
    delete_sampling_point(db, sp_id)
    return None


# --- Study Service ---
def initiate_study(db: Session, client_id: int, name: str, requested_on: date, performed_on: date = None):
    retrieve_client(db, client_id)
    return create_study(db, client_id=client_id, name=name, requested_on=requested_on, performed_on=performed_on)


def retrieve_study_details(db: Session, study_id: int):
    study = get_study(db, study_id)
    if not study:
        raise ValueError(f"Study {study_id} not found")
    return study


def retrieve_all_studies(db: Session):
    return list_studies(db)


def modify_study(db: Session, study_id: int, **kwargs):
    study = update_study(db, study_id, **kwargs)
    if not study:
        raise ValueError(f"Study {study_id} not found")
    return study


def remove_study(db: Session, study_id: int):
    delete_study(db, study_id)
    return None


# --- Analysis Service ---
def add_analysis(db: Session, study_id: int, sampling_point_id: int, parameter: str, method: str = None):
    retrieve_study_details(db, study_id)
    retrieve_point(db, sampling_point_id)
    return create_analysis(db, study_id=study_id, sampling_point_id=sampling_point_id, parameter=parameter, method=method)


def retrieve_analysis(db: Session, analysis_id: int):
    analysis = get_analysis(db, analysis_id)
    if not analysis:
        raise ValueError(f"Analysis {analysis_id} not found")
    return analysis


def retrieve_all_analyses(db: Session):
    return list_analyses(db)


def modify_analysis(db: Session, analysis_id: int, **kwargs):
    analysis = update_analysis(db, analysis_id, **kwargs)
    if not analysis:
        raise ValueError(f"Analysis {analysis_id} not found")
    return analysis


def remove_analysis(db: Session, analysis_id: int):
    delete_analysis(db, analysis_id)
    return None


# --- AnalysisResult Service ---
def record_result(db: Session, analysis_id: int, value: str, unit: str = None):
    retrieve_analysis(db, analysis_id)
    return create_analysis_result(db, analysis_id=analysis_id, value=value, unit=unit)


def retrieve_result(db: Session, result_id: int):
    result = get_analysis_result(db, result_id)
    if not result:
        raise ValueError(f"AnalysisResult {result_id} not found")
    return result


def retrieve_all_results(db: Session):
    return list_analysis_results(db)


def modify_result(db: Session, result_id: int, **kwargs):
    result = update_analysis_result(db, result_id, **kwargs)
    if not result:
        raise ValueError(f"AnalysisResult {result_id} not found")
    return result


def remove_result(db: Session, result_id: int):
    delete_analysis_result(db, result_id)
    return None


# --- Report Service ---
def draft_report(db: Session, study_id: int, author_id: int, conclusions: str):
    retrieve_study_details(db, study_id)
    # author check omitted; ensure user exists and has role 'asesor'
    return create_report(db, study_id=study_id, author_id=author_id, conclusions=conclusions)


def retrieve_report(db: Session, report_id: int):
    report = get_report(db, report_id)
    if not report:
        raise ValueError(f"Report {report_id} not found")
    return report


def retrieve_all_reports(db: Session):
    return list_reports(db)


def modify_report(db: Session, report_id: int, **kwargs):
    report = update_report(db, report_id, **kwargs)
    if not report:
        raise ValueError(f"Report {report_id} not found")
    return report


def remove_report(db: Session, report_id: int):
    delete_report(db, report_id)
    return None
