from sqlalchemy import Column, String, Numeric, Boolean, Integer,Float, Date
from sqlalchemy.ext.declarative import declarative_base
from app.db.database import Base

class Inventario(Base):
    __tablename__ = "appStock"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String, index=True)
    id_externo = Column('id externo',String, index=True)
    nombre = Column(String)
    precio = Column(Float)
    activo = Column(Boolean)
    codigo_barras = Column('codigo de barras',String)
    unidad_por_bulto = Column('unidad por bulto',Float)
    forzar_multiplos = Column('forzar multiplos',Float)
    categoria1_id_externo = Column('Categoria 1 (id externo)',Integer)
    stock = Column(Float)
    stock_isis = Column(Float)
    pendiente = Column(Float)
    categoria = Column(String, index=True)
    estado = Column(String, index=True)
    descr_deposito = Column('DescrDeposito',String, index=True)

class PedidoCabecera(Base):
    __tablename__  = "zmcLogisticaSeguimientoDetalle"      # el nombre real de tu vista
    
    pedido               = Column("pedido", Integer, primary_key=True)
    cliente              = Column("cliente", String)
    razonsocial          = Column("razonsocial", String)
    sucursal             = Column("sucursal", String)
    fecha_pedido         = Column("fecha_pedido", Date)
    fecha_administracion = Column("fecha_administracion", Date)
    zona                 = Column("zona", String)
    NombreVendedor       = Column("NombreVendedor", String)
    facturas             = Column("facturas", String)
    remitos              = Column("remitos", String)
    Total_PedCliCab      = Column("Total_PedCliCab", Numeric)
    importe_factura      = Column("importe_factura", Numeric)
    canped1              = Column("canped1", Integer)
    canped2              = Column("canped2", Integer)
    canent1              = Column("canent1", Integer)
    canent2              = Column("canent2", Integer)

