from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os,pyodbc, platform, urllib


if platform.system() == "Windows":
    driver_name = "ODBC Driver 18 for SQL Server"
else:
    driver_name = "ODBC Driver 17 for SQL Server"

# Carga variables de entorno (puedes usar python-dotenv)
DB_USER = os.getenv("SQL_USER", "sa")
DB_PASS = os.getenv("SQL_PASS", "YourPassword")
DB_HOST = os.getenv("SQL_HOST", "localhost")
DB_NAME = os.getenv("SQL_NAME", "YourDatabase")

odbc_str = (
    f"Driver={{{driver_name}}};"
    f"Server={DB_HOST};"
    f"Database={DB_NAME};"
    f"UID={DB_USER};"
    f"PWD={DB_PASS};"
    "TrustServerCertificate=yes;"
)
params = urllib.parse.quote_plus(odbc_str)

SQLSERVER_URL = f"mssql+pyodbc:///?odbc_connect={params}"

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