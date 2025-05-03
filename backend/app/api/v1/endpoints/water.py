from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.services.water_service import (
    create_new_client, retrieve_client, retrieve_all_clients, modify_client, remove_client,
    add_sampling_point, retrieve_point, retrieve_all_points, modify_point, remove_point,
    initiate_study, retrieve_study_details, retrieve_all_studies, modify_study, remove_study,
    add_analysis, retrieve_analysis, retrieve_all_analyses, modify_analysis, remove_analysis,
    record_result, retrieve_result, retrieve_all_results, modify_result, remove_result,
    draft_report, retrieve_report, retrieve_all_reports, modify_report, remove_report
)
from app.schemas.water import (
    ClientCreate, ClientRead,
    SamplingPointCreate, SamplingPointRead,
    StudyCreate, StudyRead,
    AnalysisCreate, AnalysisRead,
    AnalysisResultCreate, AnalysisResultRead,
    ReportCreate, ReportRead
)
from app.utils.dependencies import get_db, permission_required

router = APIRouter()

# --- Clients ---
@router.post(
    "/clients/",
    response_model=ClientRead,
    dependencies=[Depends(permission_required("crear_clientes"))]
)
def create_client_endpoint(payload: ClientCreate, db: Session = Depends(get_db)):
    return create_new_client(db, **payload.dict())

@router.get(
    "/clients/",
    response_model=List[ClientRead],
    dependencies=[Depends(permission_required("leer_clientes"))]
)
def list_clients_endpoint(db: Session = Depends(get_db)):
    return retrieve_all_clients(db)

@router.get(
    "/clients/{client_id}",
    response_model=ClientRead,
    dependencies=[Depends(permission_required("leer_clientes"))]
)
def get_client_endpoint(client_id: int, db: Session = Depends(get_db)):
    try:
        return retrieve_client(db, client_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put(
    "/clients/{client_id}",
    response_model=ClientRead,
    dependencies=[Depends(permission_required("actualizar_clientes"))]
)
def update_client_endpoint(client_id: int, payload: ClientCreate, db: Session = Depends(get_db)):
    try:
        return modify_client(db, client_id, **payload.dict())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete(
    "/clients/{client_id}",
    dependencies=[Depends(permission_required("borrar_clientes"))]
)
def delete_client_endpoint(client_id: int, db: Session = Depends(get_db)):
    try:
        remove_client(db, client_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Client not found")
    return {"detail": "Client deleted"}


# --- Sampling Points ---
@router.post(
    "/sampling_points/",
    response_model=SamplingPointRead,
    dependencies=[Depends(permission_required("crear_punto_muestreo"))]
)
def create_point_endpoint(payload: SamplingPointCreate, db: Session = Depends(get_db)):
    try:
        return add_sampling_point(db, **payload.dict())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get(
    "/sampling_points/",
    response_model=List[SamplingPointRead],
    dependencies=[Depends(permission_required("leer_punto_muestreo"))]
)
def list_points_endpoint(db: Session = Depends(get_db)):
    return retrieve_all_points(db)

@router.get(
    "/sampling_points/{sp_id}",
    response_model=SamplingPointRead,
    dependencies=[Depends(permission_required("leer_punto_muestreo"))]
)
def get_point_endpoint(sp_id: int, db: Session = Depends(get_db)):
    try:
        return retrieve_point(db, sp_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put(
    "/sampling_points/{sp_id}",
    response_model=SamplingPointRead,
    dependencies=[Depends(permission_required("actualizar_punto_muestreo"))]
)
def update_point_endpoint(sp_id: int, payload: SamplingPointCreate, db: Session = Depends(get_db)):
    try:
        return modify_point(db, sp_id, **payload.dict())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete(
    "/sampling_points/{sp_id}",
    dependencies=[Depends(permission_required("borrar_punto_muestreo"))]
)
def delete_point_endpoint(sp_id: int, db: Session = Depends(get_db)):
    try:
        remove_point(db, sp_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Sampling point not found")
    return {"detail": "Sampling point deleted"}


# --- Studies ---
@router.post(
    "/studies/",
    response_model=StudyRead,
    dependencies=[Depends(permission_required("crear_estudios"))]
)
def create_study_endpoint(payload: StudyCreate, db: Session = Depends(get_db)):
    try:
        return initiate_study(db, **payload.dict())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get(
    "/studies/",
    response_model=List[StudyRead],
    dependencies=[Depends(permission_required("leer_estudios"))]
)
def list_studies_endpoint(db: Session = Depends(get_db)):
    return retrieve_all_studies(db)

@router.get(
    "/studies/{study_id}",
    response_model=StudyRead,
    dependencies=[Depends(permission_required("leer_estudios"))]
)
def get_study_endpoint(study_id: int, db: Session = Depends(get_db)):
    try:
        return retrieve_study_details(db, study_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put(
    "/studies/{study_id}",
    response_model=StudyRead,
    dependencies=[Depends(permission_required("actualizar_estudios"))]
)
def update_study_endpoint(study_id: int, payload: StudyCreate, db: Session = Depends(get_db)):
    try:
        return modify_study(db, study_id, **payload.dict())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete(
    "/studies/{study_id}",
    dependencies=[Depends(permission_required("borrar_estudios"))]
)
def delete_study_endpoint(study_id: int, db: Session = Depends(get_db)):
    try:
        remove_study(db, study_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Study not found")
    return {"detail": "Study deleted"}


# --- Analyses ---
@router.post(
    "/analyses/",
    response_model=AnalysisRead,
    dependencies=[Depends(permission_required("crear_analisis"))]
)
def create_analysis_endpoint(payload: AnalysisCreate, db: Session = Depends(get_db)):
    try:
        return add_analysis(db, **payload.dict())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get(
    "/analyses/",
    response_model=List[AnalysisRead],
    dependencies=[Depends(permission_required("leer_analisis"))]
)
def list_analyses_endpoint(db: Session = Depends(get_db)):
    return retrieve_all_analyses(db)

@router.get(
    "/analyses/{analysis_id}",
    response_model=AnalysisRead,
    dependencies=[Depends(permission_required("leer_analisis"))]
)
def get_analysis_endpoint(analysis_id: int, db: Session = Depends(get_db)):
    try:
        return retrieve_analysis(db, analysis_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put(
    "/analyses/{analysis_id}",
    response_model=AnalysisRead,
    dependencies=[Depends(permission_required("actualizar_analisis"))]
)
def update_analysis_endpoint(analysis_id: int, payload: AnalysisCreate, db: Session = Depends(get_db)):
    try:
        return modify_analysis(db, analysis_id, **payload.dict())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete(
    "/analyses/{analysis_id}",
    dependencies=[Depends(permission_required("borrar_analisis"))]
)
def delete_analysis_endpoint(analysis_id: int, db: Session = Depends(get_db)):
    try:
        remove_analysis(db, analysis_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return {"detail": "Analysis deleted"}


# --- Analysis Results ---
@router.post(
    "/results/",
    response_model=AnalysisResultRead,
    dependencies=[Depends(permission_required("crear_resultado_analisis"))]
)
def create_result_endpoint(payload: AnalysisResultCreate, db: Session = Depends(get_db)):
    try:
        return record_result(db, **payload.dict())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get(
    "/results/",
    response_model=List[AnalysisResultRead],
    dependencies=[Depends(permission_required("leer_resultado_analisis"))]
)
def list_results_endpoint(db: Session = Depends(get_db)):
    return retrieve_all_results(db)

@router.get(
    "/results/{result_id}",
    response_model=AnalysisResultRead,
    dependencies=[Depends(permission_required("leer_resultado_analisis"))]
)
def get_result_endpoint(result_id: int, db: Session = Depends(get_db)):
    try:
        return retrieve_result(db, result_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put(
    "/results/{result_id}",
    response_model=AnalysisResultRead,
    dependencies=[Depends(permission_required("actualizar_resultado_analisis"))]
)
def update_result_endpoint(result_id: int, payload: AnalysisResultCreate, db: Session = Depends(get_db)):
    try:
        return modify_result(db, result_id, **payload.dict())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete(
    "/results/{result_id}",
    dependencies=[Depends(permission_required("borrar_resultado_analisis"))]
)
def delete_result_endpoint(result_id: int, db: Session = Depends(get_db)):
    try:
        remove_result(db, result_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Result not found")
    return {"detail": "Result deleted"}


# --- Reports ---
@router.post(
    "/reports/",
    response_model=ReportRead,
    dependencies=[Depends(permission_required("crear_reporte"))]
)
def create_report_endpoint(payload: ReportCreate, db: Session = Depends(get_db)):
    try:
        return draft_report(db, **payload.dict())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get(
    "/reports/",
    response_model=List[ReportRead],
    dependencies=[Depends(permission_required("leer_reporte"))]
)
def list_reports_endpoint(db: Session = Depends(get_db)):
    return retrieve_all_reports(db)

@router.get(
    "/reports/{report_id}",
    response_model=ReportRead,
    dependencies=[Depends(permission_required("leer_reporte"))]
)
def get_report_endpoint(report_id: int, db: Session = Depends(get_db)):
    try:
        return retrieve_report(db, report_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put(
    "/reports/{report_id}",
    response_model=ReportRead,
    dependencies=[Depends(permission_required("actualizar_reporte"))]
)
def update_report_endpoint(report_id: int, payload: ReportCreate, db: Session = Depends(get_db)):
    try:
        return modify_report(db, report_id, **payload.dict())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete(
    "/reports/{report_id}",
    dependencies=[Depends(permission_required("borrar_reporte"))]
)
def delete_report_endpoint(report_id: int, db: Session = Depends(get_db)):
    try:
        remove_report(db, report_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"detail": "Report deleted"}
