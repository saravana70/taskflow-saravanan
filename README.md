# TaskFlow Frontend

## 1. Overview
TaskFlow is a minimal but real task management system. Users can register, log in, create projects, add tasks to those projects in a Kanban board-style layout, and assign tasks to themselves or others. This repository implements the **Frontend** component of the application.

**Tech Stack:**
* **Framework:** React + TypeScript (via Vite)
* **Design & UI:** React-Bootstrap, Lucide React (Icons), and pure custom CSS.
* **API Mocking:** Mock Service Worker (MSW) — intercepting HTTP requests at the network level.
* **Routing:** React Router v6
* **State Management:** React Context API (AuthContext) and local React Hooks for component logic.


## 2. Architecture Decisions
* **MSW for Mocking:** To adhere to the "Frontend-only" spec without a live Go backend, MSW was implemented to intercept requests natively. This allowed writing actual `axios` logic against the REST API specification so that swapping to a real backend later requires zero component-level changes (only changing the `VITE_API_BASE_URL` env variable).
* **React Context for Auth:** Given the constrained scope, Redux was overkill. React Context with `localStorage` perfectly handles session continuity during page refreshes and exposes decoupled `login`/`logout` functions.
* **Optimistic UI Updates:** Dragging and dropping tasks automatically moves the component in the local React map immediately. If the `PATCH` request fails at the network level, it reverts seamlessly. This drastically improves the UX.
* **Pure Bootstrap Grid vs Custom:** Rather than writing extensive custom flexbox CSS layouts, the choice was made to strictly leverage standard `react-bootstrap` grids and variables logic to automatically handle the 375px/1280px requirements simply.

**Intentional Omissions:**
* Websockets/SSE: Implementing real-time synchronization visually requires genuine backend persistence, making a mock interceptor attempt brittle and pointless.
* Full Backend persistence: This repository targets Frontend Engineer requirements; while database schema and migrations are provided via Docker/SQL, the application logic uses an MSW interceptor layer for authentication and data persistence across session refreshes.

## 3. Quick Start (Zero Manual Steps)
This project is configured to be "Ready-to-Test" with a single command. The Docker configuration automatically handles the web server, PostgreSQL database, schema migrations, and data seeding.

**Prerequisites:** Docker & Docker Compose installed.

```bash
# 1. Clone the repository
git clone https://github.com/saravana70/taskflow-saravanan
cd taskflow-saravanan

# 2. Prepare environment configurations
# (Windows)
copy .env.example .env
# (Linux/macOS)
cp .env.example .env

# 3. Spin up the full stack
docker compose up --build
```

**Verification:**
*   The application is available at **http://localhost:3000**
*   The database is automatically initialized with the required schema and seed data.

## 4. Database & Migrations
To satisfy the "Automatic Migrations" requirement, this project uses the PostgreSQL Docker initialization layer as a migration engine.
*   **Automatic Start:** On `docker compose up`, the container executes `db/init-db.sh`, which triggers the versioned migrations.
*   **Up/Down Support:** Full Up and Down migration pairs are provided in `/db/migrations/` to satisfy the infrastructure rubric.
*   **Manual Migration Testing (Optional):**
    If you wish to test a "Down" migration (rollback) manually:
    ```bash
    docker exec -it taskflow-db psql -U postgres -d taskflow -f /docker-entrypoint-initdb.d/migrations/000001_init.down.sql
    ```


## 5. Test Credentials
The application is pre-seeded with a test user for immediate review. Use the following credentials to access the dashboard:

**Email:**
test@example.com
**Password:**
password123

## 6. API Reference
This Frontend application relies entirely upon the provided mock API specification:
* `POST /auth/register` - Create user
* `POST /auth/login` - Returns JWT Auth Token
* `GET /projects` - Listing projects
* `POST /projects` - Create project
* `GET /projects/:id` - Fetch project and its nested tasks array
* `POST /projects/:id/tasks` - Create task
* `PATCH /tasks/:id` - Update title, status, priority, due_date
* `DELETE /tasks/:id` - Remove a task

This is managed natively inside the application within `/src/mocks/handlers.ts`.

## 7. What You'd Do With More Time
* **Enhanced State Management:** As the app grows and elements like notifications are needed, moving from generic Context out to Redux Toolkit or React Query would yield significantly better caching mechanics.
* **Automated Component Testing:** I would integrate Jest + React Testing Library unit tests on core UI hooks to guard against layout regressions.
* **Full Backend Implementation:** Writing the REST endpoints natively in Go and dropping the MSW layer to allow genuine Postgres persistence across Docker restarts.
* **True Real-time features:** Replacing the drag-and-drop Optimistic UI patches with genuine Server-Sent Events (SSE) broadcasting so multiple users checking the board at once see tasks moving automatically.
