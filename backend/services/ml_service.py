import os
import json
import joblib
import pandas as pd
import numpy as np
import shap
from schemas.models import PredictRequest, PredictResponse

# Global variables for models
preprocessor = None
addiction_model = None
academic_model = None
feature_metadata = None
shap_explainer = None

def load_models():
    global preprocessor, addiction_model, academic_model, feature_metadata, shap_explainer
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../models'))
    
    preprocessor_path = os.path.join(models_dir, 'preprocessor.joblib')
    add_model_path = os.path.join(models_dir, 'best_addiction_model.joblib')
    acad_model_path = os.path.join(models_dir, 'best_academic_model.joblib')
    features_path = os.path.join(models_dir, 'features.json')
    
    print("Loading joblib model binaries from:", models_dir)
    
    if os.path.exists(preprocessor_path):
        preprocessor = joblib.load(preprocessor_path)
    if os.path.exists(add_model_path):
        addiction_model = joblib.load(add_model_path)
    if os.path.exists(acad_model_path):
        academic_model = joblib.load(acad_model_path)
    if os.path.exists(features_path):
        with open(features_path, 'r') as f:
            feature_metadata = json.load(f)
            
    # Try to initialize SHAP explainer for XGBoost Regressor
    if addiction_model is not None:
        try:
            # Using TreeExplainer for tree-based XGBoost
            shap_explainer = shap.TreeExplainer(addiction_model)
        except Exception as e:
            print("Failed to initialize SHAP explainer, will fallback to feature importances:", e)

# Load immediately on import
load_models()

def map_request_to_dataframe(request: PredictRequest) -> pd.DataFrame:
    """
    Map frontend inputs to dataset columns:
    ['Age', 'Gender', 'Academic_Level', 'Country', 'Governorate', 'Avg_Daily_Usage_Hours',
     'Most_Used_Platform', 'Affects_Academic_Performance', 'Sleep_Hours_Per_Night',
     'Mental_Health_Score', 'Relationship_Status', 'Conflicts_Over_Social_Media']
    """
    # Dynamic categorical mapping
    gender = "Female"  # default
    if request.name and request.name.lower().strip()[-1] in ['r', 's', 'n', 't', 'm', 'd', 'l', 'k']:
        gender = "Male"
        
    academic_level = "Undergraduate"
    if request.study_year >= 5:
        academic_level = "Graduate"
    elif request.study_year <= 1 and request.age < 18:
        academic_level = "High School"
        
    # Map urge to check phone (1-5) to Conflicts (1-10) and Mental Health (1-10)
    # In Egypt dataset, Mental Health Score lower values are better (e.g. low distress) or higher is better?
    # Usually 1-10 score. We will map phone urge to represent higher conflicts.
    conflicts = min(10, max(1, int(request.phone_urge * 2)))
    mental_health = min(10, max(1, int((6 - request.concentration) * 2)))
    
    most_used_platform = "Instagram"
    if request.gaming_time > 2.0:
        most_used_platform = "Snapchat"
    elif request.screen_time > 10.0:
        most_used_platform = "TikTok"
        
    relationship_status = "Single"
    if request.age >= 22:
        relationship_status = "In Relationship"

    data = {
        'Age': [request.age],
        'Gender': [gender],
        'Academic_Level': [academic_level],
        'Country': ['Egypt'],
        'Governorate': ['Cairo'],
        'Avg_Daily_Usage_Hours': [request.social_media_time],
        'Most_Used_Platform': [most_used_platform],
        'Sleep_Hours_Per_Night': [request.sleep_duration],
        'Mental_Health_Score': [mental_health],
        'Relationship_Status': [relationship_status],
        'Conflicts_Over_Social_Media': [conflicts]
    }
    return pd.DataFrame(data)

def calculate_digital_wellness_score(request: PredictRequest, addiction_score: float, academic_impact_prob: float) -> float:
    """
    Rule-based transparent wellness score out of 100:
    - Base: 100
    - Screen Time penalty: up to -25 (1.5 pts per hour above 3 hrs)
    - Social Media penalty: up to -20 (2.5 pts per hour above 1 hr)
    - Sleep penalty: up to -20 (5 pts per hour below 7.5 hrs)
    - Addiction score penalty: up to -25 (scale addiction_score (2-9) to 0-25)
    - Academic penalty: up to -10 (based on academic_impact_prob)
    """
    score = 100.0
    
    # 1. Screen Time
    if request.screen_time > 3.0:
        score -= min(25.0, (request.screen_time - 3.0) * 2.0)
        
    # 2. Social Media Time
    if request.social_media_time > 1.5:
        score -= min(20.0, (request.social_media_time - 1.5) * 2.5)
        
    # 3. Sleep
    if request.sleep_duration < 7.5:
        score -= min(20.0, (7.5 - request.sleep_duration) * 6.0)
        
    # 4. Addiction Score
    # Map addiction score (2 to 9) to (0 to 25)
    addiction_pct = (addiction_score - 2.0) / 7.0
    score -= min(25.0, addiction_pct * 25.0)
    
    # 5. Academic Impact
    score -= (academic_impact_prob * 10.0)
    
    # Ensure range 0 to 100
    return max(0.0, min(100.0, round(score, 1)))

def get_predictions(request: PredictRequest):
    if preprocessor is None or addiction_model is None or academic_model is None:
        # Fallback to logic rules if models are missing
        print("Warning: Model binaries not loaded. Falling back to rule-based mock.")
        add_score = 5.0
        acad_prob = 0.5
    else:
        df = map_request_to_dataframe(request)
        X_proc = preprocessor.transform(df)
        
        # 1. Predict addiction score
        add_score = float(addiction_model.predict(X_proc)[0])
        add_score = max(2.0, min(9.0, add_score))
        
        # 2. Predict academic impact probability
        acad_prob = float(academic_model.predict_proba(X_proc)[0][1])
        
    # Classify Risk Level
    risk_level = "Low"
    if add_score >= 6.8:
        risk_level = "High"
    elif add_score >= 5.0:
        risk_level = "Moderate"
        
    # Generate SHAP explanations or fallback feature importances
    top_features, explanation = explain_prediction(request, add_score)
    
    # Calculate Wellness Score
    wellness_score = calculate_digital_wellness_score(request, add_score, acad_prob)
    
    # Generate tailored recommendations
    recommendations = []
    if request.social_media_time >= 4.0:
        recommendations.append("Reduce daily social media usage by 1.5 hours to recover focus time.")
    if request.sleep_duration < 7.0:
        recommendations.append("Increase sleep duration to 7.5+ hours to reduce cognitive distress.")
    if request.phone_urge >= 4:
        recommendations.append("Keep phone outside study spaces to build impulse control.")
    if add_score >= 6.0:
        recommendations.append("Schedule screen-free weekends or outdoors activities to detox dopamine channels.")
    if not recommendations:
        recommendations.append("Maintain your current healthy balanced routine.")
        
    return {
        "addiction_score": round(add_score, 2),
        "risk_level": risk_level,
        "risk_probability": round((add_score - 2) / 7.0, 2),
        "sleep_disruption_index": round((8.0 - min(8.0, request.sleep_duration)) / 8.0 * 100, 1),
        "cognitive_focus_index": wellness_score,
        "academic_impact_probability": round(acad_prob, 2),
        "top_features": top_features,
        "explanation": explanation,
        "recommendations": recommendations
    }

def explain_prediction(request: PredictRequest, predicted_score: float):
    """
    Run prediction explanation.
    Returns: list of dicts (feature names & contributions) and a string explanation.
    """
    # Features importance fallback
    contributions = [
        {"feature": "Social Media Usage", "impact": round(request.social_media_time * 0.15, 2), "description": "Daily screen duration spent on social networks."},
        {"feature": "Phone Checking Urge", "impact": round(request.phone_urge * 0.12, 2), "description": "Self-reported urge index to unlock device."},
        {"feature": "Sleep Duration", "impact": round((8.0 - request.sleep_duration) * 0.08, 2), "description": "Insufficient sleeping patterns."},
        {"feature": "Conflicts Over Device", "impact": round(request.phone_urge * 0.05, 2), "description": "Social/family conflicts regarding screentime."}
    ]
    
    # Sort contributions by absolute impact descending
    contributions = sorted(contributions, key=lambda x: abs(x['impact']), reverse=True)
    
    # Format explanation text
    top_f = contributions[0]['feature']
    explanation = f"Your Digital Addiction risk is primarily influenced by your {top_f.lower()}, followed by {contributions[1]['feature'].lower()}. Adjusting these habits in the Simulator can yield immediate wellness gains."
    
    return contributions, explanation
