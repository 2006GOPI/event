# ATLAS Workspace — Enterprise SaaS Application

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-teal.svg)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688.svg)](https://fastapi.tiangolo.com/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red.svg)](https://www.sqlalchemy.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-yellow.svg)](https://www.python.org/)

**ATLAS Workspace** is a production-minded SaaS web application for creating, organizing, tracking, reviewing, and analyzing enterprise records with built-in AI assistant intelligence.

---

## 1. Visual References & Design System

The application strictly implements the clean enterprise design specifications:

- **Theme**: Light-only modern enterprise SaaS palette.
- **Color Palette**:
  - Main Background: `#F7FAF9`
  - Cards & Panels: `#FFFFFF`
  - Soft Mint: `#DDF4E8` (hover `#BEE8D4`, dark `#146152`)
  - Primary Teal: `#219C85` (hover `#1B826F`)
  - Typography: Dark navy (`#16313B`) with secondary slate gray (`#64748B`).
  - Borders: Subtle cool gray (`#E2E8F0`).
  - Charts: Teal (`#219C85`), Blue (`#3B82F6`), Emerald (`#10B981`), Violet (`#8B5CF6`), Amber (`#F59E0B`), and Red (`#EF4444`).
- **Typography**: Inter with subtle letter-spacing and tabular numerical alignment.
- **Elevations**: Subtle `shadow-card` with soft hover elevations.

> **Visual Assets Note**: As per instructions, the local file system was inspected for the reference mockups (`ATLAS SaaS Login Workspace-2.png`, `ATLAS Workspace Dashboard Mockup-1.png`, `ATLAS Records Management Dashboard-3.png`, `ATLAS Record Creation Dashboard-4.png`). Because these images were not physically bundled on disk, this limitation was documented and all screens were constructed in faithful accordance with the visual and functional specifications.

---

## 2. Core Screens & Feature Architecture

### 1. Split-Screen Authentication (`/login`, `/register`, `/forgot-password`)
- **Left Hero Area**: "One Platform for Every Challenge" with 4 feature cards: **Plan**, **Build**, **Analyze**, and **Solve**, plus soft mint decorative background accents.
- **Right Login Card**: "Welcome back" card, email & password validation, password reveal toggle, remember-me checkbox, forgot password modal, and **one-click demo account filler**.
- **Floating AI Assistant**: Active on the login page to answer onboarding questions.

### 2. Workspace Dashboard (`/dashboard`)
- **Welcome Banner**: "Your workspace, organized." with direct Create Record and View Records actions.
- **4 Metric Cards**: Total Records, Active Tasks, Completed Items, and Completion Rate computed directly from database queries.
- **Overview Activity Velocity Chart**: Recharts area chart illustrating records created vs. completed over 7-day/30-day timeframes with custom tooltips.
- **Status Breakdown Donut**: Recharts pie chart displaying distribution across Open, In Progress, Completed, Draft, and Archived states.
- **Recent Activity Audit Feed**: Real-time team audit log of creations, status modifications, and data exports.
- **Quick Actions & Task Watchlist**: Quick launch buttons and upcoming priority deadlines widget.

### 3. Records Management Workspace (`/records`)
- **Header & Metric Summaries**: Total Records, In Progress, Completed, and High Priority counts.
- **Search & Multi-Filters**: Instant keyword search (title, description, tags), Status filter, Category filter, Priority filter, Sort By selector, and pagination.
- **Records Table**: Checkbox selection, row action menus (view details, edit record, quick status update, delete), and responsive horizontal scrolling.
- **Slide-out Details Drawer**: Right-side drawer revealing full record details, checklist tasks with interactive completion toggles, tags, metadata, and edit/delete controls.
- **Bulk Operations & Export**: Select-all checkbox, bulk delete with confirmation, and instant RFC 4180 compliant CSV dataset export.

### 4. Create Record Multi-Step Workspace (`/create-record`)
- **3-Step Stepper**:
  1. *Basic Information*: Record title, description, category, and target due date.
  2. *Classification & Tasks*: Priority (Low, Medium, High, Urgent), Status (Draft, Open, In Progress, Completed), interactive tag creator, and milestone checklist task adder.
  3. *Review & Submit*: Complete structured summary with section-by-section edit links.
- **Right Contextual Live Preview Panel**:
  - Live record preview card that updates in real time as the user types.
  - Form completion readiness gauge.
  - Helpful input guidelines and next steps explainer.
- **Actions**: Save Draft, Continue, Submit Record, and Unsaved Changes protection dialog.

### 5. Persistent Floating AI Assistant
- Launcher bot button present on bottom-right of every primary page.
- Expandable chat dialog with status indicator, minimize, and clear history.
- Suggested prompt pills:
  - *"Summarize my workspace."*
  - *"Which records need attention?"*
  - *"Help me create a record."*
  - *"Explain the current dashboard."*
- **Dual-Engine Architecture**:
  - **Live AI Provider Mode**: Connects to external Gemini API when `AI_PROVIDER` and `AI_API_KEY` are configured in `.env`.
  - **Deterministic Local Engine Fallback**: When no external AI key is set, the assistant queries the live database and provides accurate, data-grounded answers without hallucination.

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18.3 with Vite 5.4
- **Language**: TypeScript (strict type checking enabled)
- **Styling**: Tailwind CSS 3.4 with custom design tokens
- **Icons**: Lucide React
- **Data Visualization**: Recharts 2.12
- **Forms & Validation**: React Hook Form with Zod schemas
- **State Management**: Zustand
- **Unit Testing**: Vitest with React Testing Library

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM**: SQLAlchemy 2.0
- **Database Migrations**: Alembic
- **Database**: PostgreSQL 16 (production) / SQLite (development zero-config)
- **Security & Password Hashing**: Argon2 (with passlib & bcrypt fallback)
- **Session Tokens**: JWT with HTTP Authorization headers & HttpOnly cookies
- **Testing**: Pytest with HTTPX

---

## 4. Development Credentials

The deterministic development seed script configures:

| Role | Email | Password | Display Name |
|---|---|---|---|
| **Admin** | `demo@atlasworkspace.io` | `AtlasDemo2026!` | Alex Mercer |
| **Member** | `sarah.chen@atlasworkspace.io` | `AtlasDemo2026!` | Sarah Chen |

---

## 5. Quickstart & Installation (Windows PowerShell)

### Step 1: Backend Setup & Seeding

Open a PowerShell terminal:

```powershell
# Navigate to backend directory
cd c:\Users\gopiv\OneDrive\Desktop\ata\backend

# 1. Install Python dependencies
python -m pip install -r requirements.txt

# 2. Run database migrations
python -m alembic upgrade head

# 3. Seed deterministic demo data (users, records, activities, chat)
python -m app.db.seed

# 4. Start FastAPI server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be operational at:  
👉 **API Root**: `http://localhost:8000/api/v1`  
👉 **Swagger Docs**: `http://localhost:8000/api/v1/docs`

---

### Step 2: Frontend Setup

Open a second PowerShell terminal:

```powershell
# Navigate to frontend directory
cd c:\Users\gopiv\OneDrive\Desktop\ata\frontend

# 1. Install Node dependencies
npm install

# 2. Start Vite development server
npm run dev
```

Frontend will be operational at:  
👉 **Web Application**: `http://localhost:5174`

---

## 6. Running Automated Tests & Production Build

### Backend Pytest Suite
```powershell
cd c:\Users\gopiv\OneDrive\Desktop\ata
python -m pytest backend/app/tests -v
```
*(19/19 tests passing: covers health, registration, login, password hashing, ownership enforcement, record CRUD, CSV export, dashboard aggregation, and AI fallback).*

### Frontend Vitest Suite
```powershell
cd c:\Users\gopiv\OneDrive\Desktop\ata\frontend
npm run test
```
*(11/11 tests passing: covers auth form validation, demo fill, records table badges, empty state, assistant launcher, and multi-step form navigation).*

### Frontend Typecheck & Production Build
```powershell
cd c:\Users\gopiv\OneDrive\Desktop\ata\frontend
npm run build
```
*(Transpiles and bundles 2,450 modules into optimized minified assets in `frontend/dist`).*

---

## 7. Docker Deployment

To launch the entire platform in Docker containers:

```powershell
# In project root
docker compose up --build -d

# Seed database inside backend container
docker compose exec backend python -m app.db.seed
```

Services:
- **Frontend**: `http://localhost:5174`
- **FastAPI**: `http://localhost:8000`
- **PostgreSQL**: `localhost:5432` (User: `atlas_user`, DB: `atlas_workspace`)

---

## 8. Repository Structure

```
atlas-workspace/
├── README.md                      # Master documentation
├── .gitignore                     # Git exclusions
├── .env.example                   # Root environment configuration
├── docker-compose.yml             # Full-stack Docker orchestration
├── docs/
│   ├── API.md                     # REST API reference
│   ├── DATABASE.md                # Relational schemas & migrations
│   └── DEPLOYMENT.md              # Production deployment guide
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css              # Design tokens & color system
│       ├── types/                 # TypeScript interfaces
│       ├── utils/                 # cn, formatters, storage, CSV export
│       ├── schemas/               # Zod validation schemas
│       ├── services/              # Typed API clients
│       ├── store/                 # Zustand state stores
│       ├── routes/                # ProtectedRoute & AppRouter
│       ├── layouts/               # WorkspaceLayout & AuthLayout
│       ├── pages/                 # Login, Dashboard, Records, CreateRecord, etc.
│       ├── components/
│       │   ├── ui/                # Button, Input, Select, Badge, Card, Dialog, Drawer, etc.
│       │   ├── layout/            # Sidebar, Topbar, GlobalSearch, NotificationsPopover
│       │   ├── dashboard/         # MetricCards, ActivityChart, StatusDonutChart, etc.
│       │   ├── records/           # RecordsTable, RecordFilters, RecordDetailsDrawer, etc.
│       │   ├── create-record/     # StepIndicator, LivePreviewSidebar, form steps
│       │   └── assistant/         # FloatingAssistant & chat panel
│       └── test/                  # Vitest & RTL test suites
└── backend/
    ├── requirements.txt
    ├── pyproject.toml
    ├── alembic.ini
    ├── Dockerfile
    ├── alembic/                   # Alembic migration scripts
    └── app/
        ├── main.py                # FastAPI entry point & CORS
        ├── core/                  # config, security, deps, database
        ├── db/                    # base, session, seed
        ├── models/                # User, Record, Activity, ChatMessage
        ├── schemas/               # Pydantic v2 schemas
        ├── services/              # auth, records, dashboard, assistant
        ├── api/v1/                # endpoints (auth, records, dashboard, assistant, health)
        └── tests/                 # Pytest test suite
```
