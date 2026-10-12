from fastapi import APIRouter
from app.api.v1.endpoints import assistant, auth, dashboard, health, records

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(records.router, prefix="/records", tags=["Records"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(assistant.router, prefix="/assistant", tags=["Assistant"])
