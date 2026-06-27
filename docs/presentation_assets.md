# 📊 Hackathon Presentation Assets - MindSync AI

This document provides visual outlines, research gaps, innovation briefs, and timelines to be copied directly into the hackathon presentation deck.

---

## 1. The Core Innovation
MindSync AI bridges the gap between **static screen metrics** and **actionable student wellness guidelines**.
- Traditional tools only show *usage metrics* (e.g. iOS Screen Time).
- **MindSync AI** predicts the *cognitive and academic impact* of those metrics using machine learning and offers an interactive *simulator sandbox* so students can test behavior adjustments and see projected focus/sleep gains before implementing them.

---

## 2. Research Gap Summary
- **Existing Solutions:** Screen trackers are passive, observational, and lack context. They do not correlate screen exposure with sleep quality or academic grades.
- **The Gap:** There is a lack of localized predictive models mapping digital habits directly to clinical smartphone addiction scales (like SAS-SV) and academic outcome risks.
- **Our Solution:** A predictive 3-tier support platform integrating XGBoost regressors and logistic classifiers trained on real student surveys to provide explainable digital wellness predictions.

---

## 3. Technology Stack Slide
- **Frontend UI:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Framer Motion, Recharts.
- **Backend API:** FastAPI, Python, Pydantic, Uvicorn, Gunicorn.
- **Data & ML Tier:** Pandas, NumPy, Scikit-Learn (ColumnTransformer, StandardScaler), XGBoost, Joblib, SHAP (Explainable AI), ReportLab (PDF rendering).

---

## 4. Systems Pipelines Diagrams

### ML Training Pipeline:
```text
[Dataset CSVs] ──> [Median/Mode Imputation] ──> [StandardScaler & OneHot] ──> [XGBoost/LR] ──> [joblib export]
```

### Inference Workflow:
```text
[Form input] ──> [JSON POST] ──> [Scaler/OneHot Transform] ──> [Model predicts] ──> [SHAP explanations] ──> [UI display]
```

---

## 5. Feature Importance Chart Summary
Based on XGBoost model coefficients and SHAP values, the top three features determining a student's smartphone addiction score are:
1. **Avg Daily Usage Hours:** Strong positive impact (weight +0.75).
2. **Conflicts Over Device:** High impact (weight +0.48), indicating social friction.
3. **Sleep Hours Per Night:** Negative impact (weight -0.20), showing sleep deprivation link.

---

## 6. Project Roadmap & Future Scope
- **Q3 2026:** Build localized dataset adaptors to pull screen metrics directly from Apple Screen Time / Android Digital Wellbeing APIs.
- **Q4 2026:** Integrate LLM-based conversational coaches (Gemini API) to converse with students regarding their custom recommendations.
- **Q1 2027:** Formulate academic advisor dashboards allowing university counselors to identify high-risk student cohorts.
