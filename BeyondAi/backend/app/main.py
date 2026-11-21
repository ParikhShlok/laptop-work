from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.core.config import settings
from app.core.database import engine, Base
from app.core.logging import setup_logging
from app.api import auth, targets, scans, audit_logs

# Initialize logging configuration
setup_logging()

# Auto-create tables in development (SQLite)
# In production, migrations are preferred
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Authorized Web Application Security Assessment Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redirects to avoid 404 on common index/typo requests
@app.get("/", include_in_schema=False)
def root_redirect():
    return RedirectResponse(url="/docs")

@app.get("/redocs", include_in_schema=False)
def redocs_redirect():
    return RedirectResponse(url="/redoc")

# Register API Routers
app.include_router(auth.router)
app.include_router(targets.router)
app.include_router(scans.router)
app.include_router(audit_logs.router)

@app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
def health_check():
    """
    Health check endpoint for container orchestrators and monitoring tools.
    """
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": "1.0.0"
    }
