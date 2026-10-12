# ATLAS Workspace — API Documentation

This document specifies the REST API endpoints provided by the **ATLAS Workspace SaaS** backend service under the prefix `/api/v1`.

Interactive OpenAPI/Swagger documentation is also hosted locally at:  
`http://localhost:8000/api/v1/docs` (or `/api/v1/redoc`)

---

## 1. Authentication & Security

All protected endpoints expect a standard JSON Web Token (JWT) in the HTTP Authorization header:
```http
Authorization: Bearer <access_token>
```
Alternatively, browser requests containing the HttpOnly `access_token` cookie are accepted and verified automatically.

### Response Codes
- `200 OK` — Request succeeded.
- `201 Created` — Resource created successfully.
- `400 Bad Request` — Invalid input, duplicate record, or inactive user.
- `401 Unauthorized` — Missing, expired, or invalid bearer token.
- `403 Forbidden` — Insufficient permissions (cross-user data protection or admin required).
- `404 Not Found` — Resource does not exist.
- `422 Unprocessable Entity` — Schema validation failed (e.g. invalid email format or missing field).

---

## 2. Health Endpoints

### `GET /api/v1/health`
Checks application readiness, service metadata, and database connection.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "ATLAS Workspace",
  "environment": "development",
  "database": "connected",
  "timestamp": "2026-10-12T00:00:00Z",
  "version": "1.0.0"
}
```

---

## 3. Authentication Endpoints

### `POST /api/v1/auth/register`
Creates a new member account, persists it to the database, logs a registration activity event, and issues access and refresh tokens.

**Request Body:**
```json
{
  "email": "user@company.com",
  "password": "StrongPassword2026!",
  "full_name": "Jordan Lee"
}
```

**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "refresh_token": "eyJhbGciOi...",
  "user": {
    "id": 2,
    "email": "user@company.com",
    "full_name": "Jordan Lee",
    "role": "member",
    "is_active": true,
    "created_at": "2026-10-12T00:00:00Z",
    "updated_at": "2026-10-12T00:00:00Z"
  }
}
```

### `POST /api/v1/auth/login`
Authenticates user using Argon2 password verification, issues session tokens, and sets an HttpOnly cookie.

**Request Body:**
```json
{
  "email": "demo@atlasworkspace.io",
  "password": "AtlasDemo2026!",
  "remember_me": true
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "refresh_token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "email": "demo@atlasworkspace.io",
    "full_name": "Alex Mercer",
    "role": "admin",
    "is_active": true
  }
}
```

### `POST /api/v1/auth/logout`
Clears access cookies and invalidates the browser session.

### `GET /api/v1/auth/me`
Returns current authenticated user profile.

### `POST /api/v1/auth/refresh`
Exchanges a valid refresh token for a newly issued access token.

### `POST /api/v1/auth/forgot-password`
Submits email for password recovery. Follows security best practices by never disclosing user existence.

---

## 4. Records Endpoints

### `GET /api/v1/records`
Fetches paginated records scoped to the current user (or all records if admin).

**Query Parameters:**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `search` | string | null | Text search matching title, description, or category |
| `status` | string | null | Exact status filter (`Open`, `In Progress`, `Completed`, `Draft`, `Archived`) |
| `category` | string | null | Exact category filter (`Engineering`, `Design`, `Product`, etc.) |
| `priority` | string | null | Priority filter (`Low`, `Medium`, `High`, `Urgent`) |
| `sort_by` | string | `updated_at` | Field to sort by (`title`, `updated_at`, `created_at`, `priority`) |
| `sort_order` | string | `desc` | Direction (`asc` or `desc`) |
| `page` | integer | `1` | Page number (1-indexed) |
| `page_size` | integer | `10` | Number of items per page |

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": 1,
      "title": "Cloud Infrastructure Migration Q4",
      "description": "Migrate core microservices from legacy clusters...",
      "category": "Engineering",
      "priority": "Urgent",
      "status": "In Progress",
      "tags": ["DevOps", "Cloud", "Kubernetes"],
      "due_date": "2026-10-26T00:00:00Z",
      "checklist": [
        { "id": "1", "text": "Audit sizing", "completed": true }
      ],
      "owner_id": 1,
      "created_at": "2026-10-06T00:00:00Z",
      "updated_at": "2026-10-12T00:00:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "page_size": 10,
  "total_pages": 1
}
```

### `POST /api/v1/records`
Creates a new record and records an audit activity entry.

**Request Body:**
```json
{
  "title": "Enterprise SSO Integration",
  "description": "Implement Okta and SAML 2.0 flow.",
  "category": "Engineering",
  "priority": "High",
  "status": "In Progress",
  "tags": ["Security", "Auth"],
  "due_date": "2026-10-20T00:00:00Z",
  "checklist": [
    { "id": "c1", "text": "SP metadata setup", "completed": true }
  ]
}
```

### `GET /api/v1/records/{record_id}`
Retrieves a single record. Enforces user ownership.

### `PATCH /api/v1/records/{record_id}`
Partially updates an existing record and logs changes.

### `DELETE /api/v1/records/{record_id}`
Deletes record and logs removal event.

### `POST /api/v1/records/bulk-delete`
Deletes multiple authorized records in a single database transaction.

### `GET /api/v1/records/export`
Exports currently filtered records as an RFC 4180 compliant CSV stream.

---

## 5. Dashboard Endpoints

### `GET /api/v1/dashboard/overview`
Returns complete dashboard state: live summary counts, percentage changes, status donut distribution, 7-day activity timeline, and recent activity logs.

### `GET /api/v1/dashboard/summary`
Returns metric cards: Total Records, Active Tasks, Completed Items, Completion Rate.

### `GET /api/v1/dashboard/activity`
Returns 7-day velocity timeline points: `records_created`, `records_completed`, `total_activity`.

### `GET /api/v1/dashboard/status-breakdown`
Returns status counts and percentages mapped with theme color tokens.

### `GET /api/v1/dashboard/recent-activity`
Returns audit events for creations, updates, deletions, and exports.

---

## 6. AI Assistant Endpoints

### `POST /api/v1/assistant/chat`
Answers questions regarding workspace records, workload summarization, and task guidance.

**Request Body:**
```json
{
  "message": "Summarize my workspace.",
  "conversation_id": "default"
}
```

**Response (200 OK):**
```json
{
  "reply": "📊 **Workspace Summary for Alex Mercer**\n\n- **Total Records:** 10\n- **Active In Progress:** 4\n...",
  "role": "assistant",
  "conversation_id": "default",
  "is_live_model": false,
  "model_name": "ATLAS Rule-Based Assistant (Local Engine)",
  "suggestions": [
    "Which records need attention?",
    "How many records are still in progress?",
    "Explain the current dashboard."
  ]
}
```

### `GET /api/v1/assistant/history`
Fetches conversation history for the current authenticated user.
