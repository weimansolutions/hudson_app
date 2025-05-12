from sqlalchemy.orm import Session
from datetime import datetime, date
from typing import List, Dict,Optional
from ..models.hudson import Inventario as InventarioModel, PedidoCabecera

def get_inventarios(
    db: Session,
    codigo: Optional[str] = None,
    categoria: Optional[str] = None,
    deposito: Optional[str] = None,
    estado: Optional[str] = None,
) -> List[InventarioModel]:
    query = db.query(InventarioModel)
    if codigo:
        query = query.filter(InventarioModel.codigo == codigo)
    if categoria:
        query = query.filter(InventarioModel.categoria == categoria)
    if deposito:
        query = query.filter(InventarioModel.descr_deposito == deposito)
    if estado:
        query = query.filter(InventarioModel.estado == estado)
    return query.all()

def get_pedidos(
    db: Session,
    fecha_desde: date | None = None,
    fecha_hasta: date | None = None,
    zona: str | None = None,
    cliente: str | None = None,
    pedido_num: int | None = None,
) -> List[PedidoCabecera]:
    q = db.query(PedidoCabecera)
    if fecha_desde:
        q = q.filter(PedidoCabecera.fecha_pedido >= fecha_desde)
    if fecha_hasta:
        q = q.filter(PedidoCabecera.fecha_pedido <= fecha_hasta)
    if zona:
        q = q.filter(PedidoCabecera.zona == zona)
    if cliente:
        q = q.filter(PedidoCabecera.cliente == cliente)
    if pedido_num:
        q = q.filter(PedidoCabecera.pedido == pedido_num)
    return q.all()

"""
def get_pedidos() -> List[Dict]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM logyser_pedidos_enviados")
    columns = [col[0] for col in cursor.description]
    rows = cursor.fetchall()
    conn.close()
    return [dict(zip(columns, row)) for row in rows]


def get_seguimiento_pedidos_logistica(
    fecha_desde: date, fecha_hasta: date
) -> List[Dict]:
    conn = get_connection()
    cursor = conn.cursor()
    query = "" " ajustar comillas
        SELECT *
        FROM zmcLogisticaSeguimientoDetalle
        WHERE fecha_pedido >= ? AND fecha_pedido <= ?
        ORDER BY fecha_pedido ASC;
    " "" ajustar comillas 
    cursor.execute(query, (fecha_desde, fecha_hasta))
    columns = [col[0] for col in cursor.description]
    rows = cursor.fetchall()
    conn.close()
    return [dict(zip(columns, row)) for row in rows]
"""