from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict
from datetime import date

from app.db.database import get_db
from app.schemas.hudson import HudsonRecord, HudsonRecordCreate
from app.crud.hudson import (
    create_record, get_records,
    stock_actual, get_pedidos,
    get_seguimiento_pedidos_logistica
)


router = APIRouter()

@router.post("/", response_model=HudsonRecord)
def add_record(
    record: HudsonRecordCreate,
    db: Session = Depends(get_db)
):
    return create_record(db, record)

@router.get("/", response_model=List[HudsonRecord])
def list_records(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    db: Session = Depends(get_db)
):
    return get_records(db, skip, limit)

# Consultas heredadas
@router.get("/stock", response_model=List[Dict])
def endpoint_stock_actual():
    return stock_actual()

@router.get("/pedidos", response_model=List[Dict])
def endpoint_get_pedidos():
    return get_pedidos()

@router.get("/seguimiento", response_model=List[Dict])
def endpoint_seguimiento(
    fecha_desde: date = Query(..., description="Fecha inicio YYYY-MM-DD"),
    fecha_hasta: date = Query(..., description="Fecha fin   YYYY-MM-DD")
):
    results = get_seguimiento_pedidos_logistica(fecha_desde, fecha_hasta)
    if not results:
        raise HTTPException(status_code=404, detail="No se encontraron registros en ese rango de fechas")
    return results