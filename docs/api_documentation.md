# 🔌 API Documentation - MindSync AI

The backend REST service is built with FastAPI. It handles validation, serves predictions, runs simulator algorithms, and generates printable wellness reports.

Default Host: `http://localhost:8000`

---

## 1. Endpoints Overview

### [GET] `/health`
- **Purpose:** Health check verification.
- **Request Example:** None (no body required).
- **Response Example (200 OK):**
  ```json
  {
    "status": "healthy",
    "service": "MindSync AI Decision Support API",
    "version": "1.0.0"
  }
  ```

---

### [GET] `/analytics`
- **Purpose:** Fetch aggregate student digital wellness metrics compiled dynamically from the dataset.
- **Request Example:** None.
- **Response Example (200 OK):**
  ```json
  {
    "average_screen_time": 6.4,
    "average_sleep_duration": 6.8,
    "risk_distribution": {
      "Low": 64,
      "Moderate": 48,
      "High": 30
    },
    "focus_by_study_year": {
      "Undergraduate": 58.2,
      "Graduate": 72.1,
      "High School": 68.5
    },
    "total_assessments": 12038
  }
  ```

---

### [POST] `/predict`
- **Purpose:** Analyze student digital questionnaire values and return risk classification, focus score, explainable AI features, and recommendations.
- **Request Body (JSON):**
  ```json
  {
    "name": "Alex",
    "age": 20,
    "study_year": 3,
    "screen_time": 6.5,
    "social_media_time": 3.5,
    "gaming_time": 1.0,
    "sleep_duration": 7.0,
    "study_hours": 4.0,
    "concentration": 3,
    "phone_urge": 4,
    "sleep_disturbance": "yes",
    "academic_satisfaction": 3
  }
  ```
- **Response Body (200 OK):**
  ```json
  {
    "risk_level": "Moderate",
    "risk_probability": 0.58,
    "sleep_disruption_index": 12.5,
    "cognitive_focus_index": 68.5,
    "recommendations": [
      "Reduce daily social media usage by 1.5 hours to recover focus time.",
      "Keep phone outside study spaces to build impulse control."
    ],
    "top_features": [
      {
        "feature": "Social Media Usage",
        "impact": 0.53,
        "description": "Daily screen duration spent on social networks."
      },
      {
        "feature": "Phone Checking Urge",
        "impact": 0.48,
        "description": "Self-reported urge index to unlock device."
      }
    ],
    "explanation": "Your Digital Addiction risk is primarily influenced by your social media usage, followed by your phone checking urge."
  }
  ```

---

### [POST] `/simulate`
- **Purpose:** Compare a student's current routine against a modified simulated lifestyle scenario and return delta gains.
- **Request Body (JSON):**
  ```json
  {
    "current_habits": { ...PredictRequest... },
    "simulated_habits": { ...PredictRequest... }
  }
  ```
- **Response Body (200 OK):**
  ```json
  {
    "current_focus_index": 61.0,
    "simulated_focus_index": 75.0,
    "current_sleep_quality": 55.0,
    "simulated_sleep_quality": 80.0,
    "current_academic_index": 65.0,
    "simulated_academic_index": 72.0,
    "focus_delta": 14.0,
    "sleep_delta": 25.0,
    "academic_delta": 7.0
  }
  ```

---

### [POST] `/generate-report`
- **Purpose:** Accept student profiles and results and return a printable PDF report file attachment.
- **Request Body (JSON):**
  ```json
  {
    "student_name": "Alex",
    "assessment_data": { ...PredictRequest... },
    "results": { ...PredictResponse... }
  }
  ```
- **Response Header:** `Content-Type: application/pdf`
- **Response Body:** File binary stream (`mindsync_wellness_report_Alex.pdf`).

---

## 2. Validation & Error Codes

Pydantic handles automatic schema checks. In case of invalid inputs, it responds with:
- **Status Code 422 Unprocessable Entity:**
  ```json
  {
    "detail": [
      {
        "loc": ["body", "age"],
        "msg": "Input should be less than or equal to 30",
        "type": "less_than_equal"
      }
    ]
  }
  ```
- **Status Code 500 Internal Server Error:** Occurs when ML models fail to load. MindSync AI implements automatic fallbacks to rule-based algorithms to guarantee API availability.
