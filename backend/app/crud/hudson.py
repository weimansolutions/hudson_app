from sqlalchemy.orm import Session
from datetime import datetime, date
from typing import List, Dict

from ..models.hudson import HudsonRecord
from ..schemas.hudson import HudsonRecordCreate
from ..db.database import get_connection


def create_record(db: Session, record_in: HudsonRecordCreate):
    db_record = HudsonRecord(
        name=record_in.name,
        value=record_in.value,
        created_at=datetime.utcnow()
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


def get_records(db: Session, skip: int = 0, limit: int = 100):
    return db.query(HudsonRecord).offset(skip).limit(limit).all()


def stock_actual() -> List[Dict]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM appStock")
    columns = [col[0] for col in cursor.description]
    rows = cursor.fetchall()
    conn.close()
    return [dict(zip(columns, row)) for row in rows]


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
    query = """
        SELECT *
        FROM zmcLogisticaSeguimientoDetalle
        WHERE fecha_pedido >= ? AND fecha_pedido <= ?
        ORDER BY fecha_pedido ASC;
    """
    cursor.execute(query, (fecha_desde, fecha_hasta))
    columns = [col[0] for col in cursor.description]
    rows = cursor.fetchall()
    conn.close()
    return [dict(zip(columns, row)) for row in rows]