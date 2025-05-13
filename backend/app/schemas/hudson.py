from pydantic import BaseModel
from typing import Optional
from datetime import date
from decimal import Decimal

class InventarioBase(BaseModel):
    codigo: Optional[str]
    id_externo: Optional[str]
    nombre: Optional[str]
    precio: Optional[float]
    activo: Optional[bool]
    codigo_barras: Optional[str]
    unidad_por_bulto: Optional[float]
    forzar_multiplos: Optional[float]
    categoria1_id_externo: Optional[int]
    stock: Optional[float]
    stock_isis: Optional[float]
    pendiente: Optional[float]
    disponible_logyser : Optional[float]
    categoria: Optional[str]
    estado: Optional[str]
    descr_deposito: Optional[str]

class Inventario(InventarioBase):
    id: int

    class Config:
        orm_mode = True

class PedidoCabecSchema(BaseModel):
    pedido: int
    cliente: Optional[str] = None
    razonsocial: Optional[str] = None
    sucursal: Optional[str] = None
    fecha_pedido: Optional[date] = None
    fecha_administracion: Optional[date] = None
    zona: Optional[str] = None
    NombreVendedor: Optional[str] = None
    facturas: Optional[str] = None
    remitos: Optional[str] = None
    Total_PedCliCab: Decimal | None
    importe_factura: Decimal | None
    canped1: int
    canped2: int
    canent1: int | None
    canent2: int | None

    class Config:
        from_attributes = True

