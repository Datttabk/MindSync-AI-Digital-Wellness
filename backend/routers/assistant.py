from fastapi import APIRouter
from schemas.models import ChatRequest, ChatResponse
from services import assistant_service

router = APIRouter()

@router.post("/assistant/chat", response_model=ChatResponse, tags=["Assistant"])
async def chat_with_assistant(request: ChatRequest):
    ans = assistant_service.generate_grounded_response(
        user_message=request.user_message,
        req=request.assessment_data,
        res=request.results
    )
    return ChatResponse(assistant_message=ans)
