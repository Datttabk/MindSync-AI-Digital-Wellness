# 🚀 Production Deployment Guide - MindSync AI

This document outlines environment variables, requirements, package builds, Gunicorn setup, and CI/CD pipelines for **MindSync AI**.

---

## 1. System Requirements

- **Runtime environments:** Node.js v18+, Python 3.10+
- **Memory footprint:** Minimum 1GB RAM (for loading XGBoost models and SHAP matrices).
- **Target OS:** Linux (Ubuntu/Debian recommended for production), macOS, or Windows (via WSL2).

---

## 2. Environment Variables

Create a `.env` file in `backend/` to override settings:
```ini
APP_NAME="MindSync AI Production API"
DEBUG=False
ALLOWED_CORS_ORIGINS=["https://mindsync.yourdomain.com"]
PORT=8000
```

---

## 3. Production Builds

### Frontend (Static Asset Bundle)
Vite bundles assets to the `dist/` directory, which can be served directly from nginx, Apache, or cloud buckets (S3/GCS):
```bash
cd frontend
npm install --legacy-peer-deps
npm run build
```

### Backend (FastAPI Production Run)
For production, avoid running `python main.py` or uvicorn with `reload=True`. Use **Gunicorn** with **Uvicorn workers** to enable multicore process management:
```bash
cd backend
pip install -r requirements.txt
pip install gunicorn

# Run server with 4 worker processes
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

---

## 4. Dockerization (Production Container)

### Backend Dockerfile (`backend/Dockerfile`):
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

---

## 5. CI/CD Pipeline (GitHub Actions Template)

Create `.github/workflows/main.yml` to automate audits:
```yaml
name: MindSync AI CI Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  frontend-build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up Node
      uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Build Frontend
      run: |
        cd frontend
        npm ci --legacy-peer-deps
        npm run build

  backend-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    - name: Run Imports Check
      run: |
        cd backend
        pip install -r requirements.txt
        PYTHONPATH=. python3 -c "import main"
```
This ensures that any pull requests are fully audited for TypeScript and Python import compilation before merging.
