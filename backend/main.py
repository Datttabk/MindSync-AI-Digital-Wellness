import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from routers import health, predict, simulate, analytics, report, assistant

app = FastAPI(
    title=settings.APP_NAME,
    description="MindSync AI student wellness decision support REST services.",
    version="1.0.0",
    debug=settings.DEBUG
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers directly to match exact API contracts
app.include_router(health.router)
app.include_router(predict.router)
app.include_router(simulate.router)
app.include_router(analytics.router)
app.include_router(report.router)
app.include_router(assistant.router)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
