from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.routes import api_router
from app.api.pilot_routes import router as pilot_router

app = FastAPI(
    title=settings.APP_NAME,
    description="The secure AI workspace for 5–15 person SaaS teams.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS is intentionally explicit. Wildcard origins must not be used with
# authenticated browser requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

# Friendly error handler (Section 36: Never expose raw stack traces to users)
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    print(f"[Internal Error] {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Something went wrong on our end. Our engineering team has been notified."}
    )

# Mount API
app.include_router(api_router)
app.include_router(pilot_router)

@app.get("/")
def root():
    return {
        "service": "BUILDORA Enterprise AI Workspace API",
        "tagline": "AI assists. AI prepares. You approve. AI acts. Everything is logged.",
        "version": settings.VERSION,
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
