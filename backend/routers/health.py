from fastapi import APIRouter

router = APIRouter()

@router.get("/health", tags=["Health"])
async def get_health():
    return {
        "status": "healthy",
        "service": "MindSync AI Decision Support API",
        "version": "1.0.0"
    }
