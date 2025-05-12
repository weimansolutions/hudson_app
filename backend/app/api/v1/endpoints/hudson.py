from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict,Optional
from datetime import date
from app.db.database import get_db
from app.schemas.hudson import Inventario as InventarioSchema
from app.crud.hudson import get_inventarios
from app.services.hudson_service import stock_logyser, agregar_stock


router = APIRouter()

@router.get("/", response_model=List[InventarioSchema])
def read_inventarios(
    codigo: Optional[str] = None,
    categoria: Optional[str] = None,
    deposito: Optional[str] = None,
    estado: Optional[str] = None,
    db: Session = Depends(get_db),
):
    results = get_inventarios(db, codigo, categoria, deposito, estado)
    if results is None:
        raise HTTPException(status_code=404, detail="No se encontraron registros")
    return results

@router.get("/inventario_logyser")
def read_inventarios_logyser():
    results = stock_logyser()
    if results is None:
        raise HTTPException(status_code=404, detail="No se encontraron registros")
    return results

@router.get("/pedidos", response_model=List[PedidoCabeceraSchema])
def read_pedidos(
    fecha_desde:  date | None = Query(None, alias="desde"),
    fecha_hasta:  date | None = Query(None, alias="hasta"),
    zona:         str  | None = Query(None),
    cliente:      str  | None = Query(None),
    pedido_num:   int  | None = Query(None, alias="pedido"),
    db: Session = Depends(get_db),
):
    resultados = get_pedidos(db, fecha_desde, fecha_hasta, zona, cliente, pedido_num)
    if not resultados:
        raise HTTPException(status_code=404, detail="No se encontraron pedidos")
    return resultados