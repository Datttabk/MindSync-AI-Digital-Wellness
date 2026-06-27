from fastapi import APIRouter
from schemas.models import SimulateRequest, SimulateResponse
from services import ml_service

router = APIRouter()

@router.post("/simulate", response_model=SimulateResponse, tags=["Simulation"])
async def simulate_habits(request: SimulateRequest):
    curr_res = ml_service.get_predictions(request.current_habits)
    sim_res = ml_service.get_predictions(request.simulated_habits)
    
    # Map metrics to 0-100 scale
    curr_focus = curr_res["cognitive_focus_index"]
    sim_focus = sim_res["cognitive_focus_index"]
    
    # Sleep quality: 100 - sleep_disruption_index
    curr_sleep = 100.0 - curr_res["sleep_disruption_index"]
    sim_sleep = 100.0 - sim_res["sleep_disruption_index"]
    
    # Academic probability: (1.0 - impact_prob) * 100 (where higher means better/positive performance)
    curr_academic = (1.0 - curr_res["academic_impact_probability"]) * 100.0
    sim_academic = (1.0 - sim_res["academic_impact_probability"]) * 100.0
    
    return SimulateResponse(
        current_focus_index=curr_focus,
        simulated_focus_index=sim_focus,
        current_sleep_quality=curr_sleep,
        simulated_sleep_quality=sim_sleep,
        current_academic_index=curr_academic,
        simulated_academic_index=sim_academic,
        focus_delta=round(sim_focus - curr_focus, 1),
        sleep_delta=round(sim_sleep - curr_sleep, 1),
        academic_delta=round(sim_academic - curr_academic, 1)
    )
