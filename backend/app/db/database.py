from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os,pyodbc

# Carga variables de entorno (puedes usar python-dotenv)
DB_USER = os.getenv("SQL_USER", "sa")
DB_PASS = os.getenv("SQL_PASS", "YourPassword")
DB_HOST = os.getenv("SQL_HOST", "localhost")
DB_NAME = os.getenv("SQL_NAME", "YourDatabase")

SQLSERVER_URL = (
    f"mssql+pyodbc://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"
    "?driver=ODBC+Driver+17+for+SQL+Server"
)

engine = create_engine(SQLSERVER_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency para FastAPI
from fastapi import Depends
from sqlalchemy.orm import Session

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_connection():
    return engine.raw_connection()