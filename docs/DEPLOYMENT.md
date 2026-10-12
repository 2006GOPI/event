# ATLAS Workspace — Deployment Guide

This guide describes how to run and deploy **ATLAS Workspace SaaS** across local development, Docker containers, and production cloud infrastructure.

---

## 1. System Architecture

The ATLAS Workspace stack consists of:
1. **Frontend**: React 18/19 SPA built with Vite, TypeScript, Tailwind CSS, Recharts, and Zustand.
2. **Backend**: FastAPI asynchronous Python service implementing REST endpoints, Argon2 authentication, role-based authorization, and AI intelligence.
3. **Database**: PostgreSQL (production) with persistent Docker volume, or SQLite (zero-config local development).

```
   [ Browser Client ]
           |
       (Port 5174)
           v
    [ Vite / Nginx ]
           |
     HTTP REST API
       (Port 8000)
           v
  [ FastAPI Backend ]
       /          \
      v            v
[ PostgreSQL ]  [ Optional External AI ]
  (Port 5432)   (Gemini API / Provider)
```

---

## 2. Option A: Docker Compose Deployment (Recommended)

Orchestrates PostgreSQL 16, FastAPI backend, and Vite frontend in isolated containers with health checks and persistent volume storage.

### Prerequisites
- Docker Engine 24+ & Docker Compose v2.20+

### Steps
1. Clone or open the repository root.
2. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```
3. Build and launch all services:
   ```powershell
   docker compose up --build -d
   ```
4. Verify running containers:
   ```powershell
   docker compose ps
   ```
5. Run the database seed inside the backend container:
   ```powershell
   docker compose exec backend python -m app.db.seed
   ```
6. Access applications:
   - **Frontend**: `http://localhost:5174`
   - **Backend API**: `http://localhost:8000/api/v1`
   - **Interactive API Docs**: `http://localhost:8000/api/v1/docs`

---

## 3. Option B: Local Standalone Development (Windows PowerShell)

If Docker is not running on your machine, you can run the backend and frontend services directly on Windows using PowerShell.

### Step 1: Backend Setup
Open a PowerShell terminal:
```powershell
# Navigate to workspace root
cd c:\Users\gopiv\OneDrive\Desktop\ata\backend

# Install dependencies
python -m pip install -r requirements.txt

# Run migrations (creates atlas.db)
python -m alembic upgrade head

# Seed deterministic demo dataset
python -m app.db.seed

# Start FastAPI server on port 8000
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 2: Frontend Setup
Open a second PowerShell terminal:
```powershell
# Navigate to frontend directory
cd c:\Users\gopiv\OneDrive\Desktop\ata\frontend

# Install node dependencies
npm install

# Start Vite dev server on port 5174
npm run dev
```

### Step 3: Open Browser
Navigate to:
- **Application URL**: `http://localhost:5174`
- **Demo Credentials**:
  - Email: `demo@atlasworkspace.io`
  - Password: `AtlasDemo2026!`

---

## 4. Production Security & Hardening Checklist

1. **SECRET_KEY**: Generate a cryptographically secure 256-bit key:
   ```powershell
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
2. **CORS_ORIGINS**: Set strictly to your production domain (e.g. `https://workspace.yourdomain.com`).
3. **Database URL**: Configure managed PostgreSQL (e.g. Azure Database for PostgreSQL, Supabase, or AWS RDS).
4. **HTTPS / SSL**: Terminate TLS using Nginx or Cloudflare. Set `ENVIRONMENT=production` in backend `.env` so auth cookies are marked `Secure`.
5. **No Frontend Secrets**: Never place database credentials or private AI API keys in frontend `.env` files. External AI requests are brokered exclusively through the backend.
