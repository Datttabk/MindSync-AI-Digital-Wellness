from pydantic import BaseModel, Field

class PredictRequest(BaseModel):
    name: str = Field(..., example="Alex")
    age: int = Field(..., ge=15, le=30, example=20)
    study_year: int = Field(..., ge=1, le=5, example=3)
    screen_time: float = Field(..., ge=0.0, le=24.0, description="Total screen time in hours", example=6.5)
    social_media_time: float = Field(..., ge=0.0, le=24.0, description="Social media active time in hours", example=3.5)
    gaming_time: float = Field(..., ge=0.0, le=24.0, description="Active gaming hours", example=1.0)
    sleep_duration: float = Field(..., ge=0.0, le=24.0, description="Sleep duration in hours", example=7.0)
    study_hours: float = Field(..., ge=0.0, le=24.0, description="Self-study hours outside class", example=4.0)
    concentration: int = Field(..., ge=1, le=5, description="Self-rated concentration 1-5", example=3)
    phone_urge: int = Field(..., ge=1, le=5, description="Urge to check phone index 1-5", example=4)
    sleep_disturbance: str = Field(..., description="'yes' or 'no' sleep notifications disruption", example="yes")
    academic_satisfaction: int = Field(..., ge=1, le=5, description="Satisfaction with academic performance 1-5", example=3)

class PredictResponse(BaseModel):
    risk_level: str = Field(..., description="Digital addiction risk level: Low, Moderate, or High", example="Moderate")
    risk_probability: float = Field(..., description="Addiction probability percentage", example=0.58)
    sleep_disruption_index: float = Field(..., description="Sleep disruption percentage index", example=42.0)
    cognitive_focus_index: float = Field(..., description="Cognitive Focus Index", example=61.0)
    recommendations: list[str] = Field(..., description="List of behavioral recommendations")
    top_features: list[dict] = Field(default=[], description="SHAP feature contributions list")
    explanation: str = Field(default="", description="Textual explanation summary of prediction")

class SimulateRequest(BaseModel):
    current_habits: PredictRequest
    simulated_habits: PredictRequest

class SimulateResponse(BaseModel):
    current_focus_index: float = Field(..., example=61.0)
    simulated_focus_index: float = Field(..., example=75.0)
    current_sleep_quality: float = Field(..., example=55.0)
    simulated_sleep_quality: float = Field(..., example=80.0)
    current_academic_index: float = Field(..., example=65.0)
    simulated_academic_index: float = Field(..., example=72.0)
    focus_delta: float = Field(..., example=14.0)
    sleep_delta: float = Field(..., example=25.0)
    academic_delta: float = Field(..., example=7.0)

class AnalyticsResponse(BaseModel):
    average_screen_time: float = Field(..., example=6.4)
    average_sleep_duration: float = Field(..., example=6.8)
    risk_distribution: dict[str, int] = Field(..., description="Count of assessments by risk category")
    focus_by_study_year: dict[str, float] = Field(..., description="Average focus score by year of study")
    total_assessments: int = Field(..., example=142)

class ReportRequest(BaseModel):
    student_name: str
    assessment_data: PredictRequest
    results: PredictResponse

class ChatRequest(BaseModel):
    user_message: str = Field(..., example="Why is my addiction score high?")
    assessment_data: PredictRequest | None = None
    results: PredictResponse | None = None

class ChatResponse(BaseModel):
    assistant_message: str = Field(..., example="Your predicted addiction score is primarily influenced by your daily usage hours...")
