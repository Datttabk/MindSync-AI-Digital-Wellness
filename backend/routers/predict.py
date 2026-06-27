from fastapi import APIRouter
from schemas.models import PredictRequest, PredictResponse
from services import ml_service

router = APIRouter()

@router.post("/predict", response_model=PredictResponse, tags=["Prediction"])
async def predict_wellness(request: PredictRequest):
    res = ml_service.get_predictions(request)
    return PredictResponse(
        risk_level=res["risk_level"],
        risk_probability=res["risk_probability"],
        sleep_disruption_index=res["sleep_disruption_index"],
        cognitive_focus_index=res["cognitive_focus_index"],
        recommendations=res["recommendations"],
        top_features=res["top_features"],
        explanation=res["explanation"]
    )
