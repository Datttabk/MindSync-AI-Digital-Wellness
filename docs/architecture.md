# 🏛️ System Architecture - MindSync AI

This document details the system design, data flow, component layouts, and execution workflows of **MindSync AI**.

---

## 1. High-Level Architecture Overview

MindSync AI uses a decoupled, three-tier SaaS layout designed for scalability, security, and independent testing:

```mermaid
graph TD
    UI[React + TypeScript Frontend]
    API[FastAPI Backend REST Service]
    ML[Machine Learning Layer]
    DB[(Dataset & joblib binaries)]

    UI -->|REST JSON over HTTP| API
    API -->|Features Vector| ML
    ML -->|Loads Binaries| DB
    API -->|Streams Report PDF| UI
```

1. **Client Tier (Frontend):** A Single Page Application (SPA) built with React 19, TypeScript, and Vite. Utilizes Tailwind CSS v4 for layout design, Framer Motion for transitions, and Recharts for interactive visualization.
2. **Service Tier (Backend):** A REST API built with FastAPI. Operates as an asynchronous wrapper handling request validation (Pydantic), CORS policies, route mapping, and file streams (PDF rendering via ReportLab).
3. **Intelligence Tier (ML Model):** A joblib-loaded pipeline consisting of a Scikit-Learn data preprocessor, an XGBoost Regressor (predicting Digital Addiction Score), and a Logistic Regression Classifier (predicting Academic Performance disruption probability).

---

## 2. Component Design

```mermaid
classDiagram
    class MainLayout {
        +sidebarOpen: boolean
        +render()
    }
    class AssessmentForm {
        +formData: object
        +handleSubmit()
    }
    class ResultsPage {
        +requestData: object
        +responseData: object
        +handleDownloadPDF()
    }
    class APIClient {
        +predict()
        +simulate()
        +getAnalytics()
        +generateReport()
    }
    class FastAPIApp {
        +CORS()
        +include_routers()
    }
    class MLService {
        +preprocessor
        +addiction_model
        +academic_model
        +get_predictions()
        +explain_prediction()
    }
    
    AssessmentForm --> APIClient : invokes
    ResultsPage --> APIClient : invokes
    APIClient --> FastAPIApp : REST requests
    FastAPIApp --> MLService : delegates
```

---

## 3. Data Flow Diagram (End-to-End Prediction Loop)

```mermaid
sequenceDiagram
    autonumber
    actor User as Student User
    participant FE as React UI
    participant BE as FastAPI Server
    participant MLS as ML Inference Service
    participant PDF as Report Generator

    User->>FE: Fills Assessment Form
    FE->>BE: POST /predict (JSON Payload)
    Note over BE: Pydantic validates inputs
    BE->>MLS: get_predictions(request)
    Note over MLS: Preprocesses inputs using saved Scaler & OneHotEncoder
    Note over MLS: XGBoost Regressor predicts Addiction Score (2-9)
    Note over MLS: Logistic Regression predicts Academic Impact (0 or 1)
    Note over MLS: Calculates feature contributions (XAI)
    MLS-->>BE: Returns prediction indicators + explanations
    BE-->>FE: Return JSON Response
    FE->>User: Displays wellness scores & SHAP feature impacts
    
    User->>FE: Clicks "Download PDF"
    FE->>BE: POST /generate-report (Request + Response JSON)
    BE->>PDF: Generate ReportLab PDF flowables
    PDF-->>BE: Streams PDF bytes
    BE-->>FE: Returns PDF blob stream
    FE->>User: Triggers local browser PDF save
```

---

## 4. Deployment Flow

- **Frontend:** Compiled to static HTML/JS/CSS assets via Rolldown/Vite (`npm run build`). Can be deployed to static hosting providers (Netlify, Vercel, Firebase Hosting).
- **Backend:** Packaged with `requirements.txt` and served using a WSGI/ASGI wrapper such as Gunicorn/Uvicorn on a virtual machine or containerized cloud platform (Google Cloud Run, AWS ECS).
