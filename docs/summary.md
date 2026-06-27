# 📝 Project Summary - MindSync AI

MindSync AI is an AI-powered Student Digital Well-being Decision Support Platform built for the IEEE DataPort Hackathon evaluation.

---

## 🚀 Key Accomplishments

1. **Decoupled 3-Tier Architecture:** Built a clean, professional React (TS + Vite) frontend and a modular, type-safe FastAPI backend.
2. **Dynamic ML Pipeline:** Built a pipeline (`ml/train.py`) that preprocesses the Egypt Social Media Addiction dataset, trains regressors/classifiers, and persists model binaries.
3. **Explainable AI (XAI):** Integrated prediction explanation models detailing top feature impact weights (SHAP values) returned directly in API endpoints.
4. **Decision-Support Simulator:** Implemented an interactive Habit Simulator sandbox enabling students to slide usage hours and view projected cognitive, sleep, and academic deltas computed dynamically by the trained XGBoost models.
5. **Printable Wellness Reports:** Implemented an asynchronous PDF generator using ReportLab that outputs color-coded KPI tables, XAI weight summaries, and personalized action lists.
6. **E2E Validation:** Built a programmatic endpoint verification script checking and confirming the success of all backend routes under simulated loads.
