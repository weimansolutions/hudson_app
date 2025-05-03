from fastapi import FastAPI
from app.api.v1.api import api_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Fast API - Roles and Permissions API")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],            # o el dominio de tu frontend
  allow_methods=["*"],
  allow_headers=["*"],
)


app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Welcome to Fast API - Roles and Permissions API"}