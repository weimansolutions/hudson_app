# tests/conftest.py
import os
import sys

# 1) Asegura que el paquete `app` sea importable
proj_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, proj_root)

# 2) Monkey-patch de permission_required ANTES de importar FastAPI app o endpoints
import app.utils.dependencies as deps

def dummy_permission_required(permission_name: str):
    # este inner será el callable que FastAPI inyecte como dependencia
    def _dummy():
        return True
    return _dummy

# Sobrescribimos la función original
deps.permission_required = dummy_permission_required

# 3) Ahora importamos lo que necesitemos para el TestClient
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.main import app
from app.utils.dependencies import get_db

# Configuración de BD en memoria
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)

# Override de get_db para usar la BD en memoria
def override_get_db():
    # crea tablas en memoria la primera vez
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Aplica los overrides en la app de FastAPI
app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c
