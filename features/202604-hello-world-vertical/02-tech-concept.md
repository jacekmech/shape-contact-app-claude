# Technical Concept

## Header
- **Title:** Hello World Vertical Slice
- **Status:** `ready`
- **Date:** 2026-04-24

---

## Overview
- **Technical summary:** Scaffold all four modules (API, frontend, nginx, ops) with the minimum working code that proves end-to-end connectivity. The API reads `HELLO_MESSAGE` from its environment and returns it via `GET /api/hello`. The frontend fetches that endpoint on mount and renders the message. nginx proxies all requests, routing `/api/` to the API and everything else to the frontend.
- **Key constraints:** All modules are currently empty. Every module must be bootstrapped from scratch. The solution must be runnable with a single `docker compose up` from `contact-ops`.
- **Core design principle:** Keep each module's scaffold minimal but production-shaped — correct structure and conventions from the start, no throwaway code.

---

## Repository Alignment
- **Relevant repository guidance used during design:**
  - `CLAUDE.md` defines the four module responsibilities and their boundaries explicitly.
  - Backend should use a hexagonal-architecture-inspired structure (`controllers`, `domain`, `infra`, `lib`) applied pragmatically — only introduce layers that improve clarity.
  - Frontend should use MUI-based UI with a simple React structure.
  - Environment variables must be centralized in a configuration module per module; no scattered `process.env` reads.
  - Frontend must not expose backend service URLs as hardcoded strings; use `VITE_` env vars instead.
  - Local dev defaults must align with Docker Compose and nginx setup.
- **Important architectural or organizational constraints from agent-facing instructions:**
  - nginx handles all routing; the browser never contacts the API port directly.
  - `contact-ops` owns Docker Compose and environment wiring between modules.
  - Responsibilities must not leak across module boundaries.
- **Local conventions or preferred patterns that materially shape the solution:**
  - Single quotes, semicolons, trailing commas, `const` by default.
  - One default export pattern per module.
  - Prefer explicit control flow over compact cleverness.

---

## Architecture
- **Main components / units:**
  - `contact-api` — Express.js Node.js application
  - `contact-frontend` — Vite + React application with MUI
  - `contact-middleware-nginx` — nginx reverse proxy
  - `contact-ops` — Docker Compose orchestration
- **Responsibility split:**
  - `contact-api`: reads `HELLO_MESSAGE`, exposes `GET /api/hello`, returns JSON
  - `contact-frontend`: calls `GET /api/hello` on mount, renders message or error
  - `contact-middleware-nginx`: routes `/api/` to the API service, everything else to the frontend
  - `contact-ops`: defines services, ports, environment variables, and inter-service networking
- **System boundaries:**
  - Browser → nginx (port 80) → frontend container (port 3000) or API container (port 3001)
  - Frontend container calls nginx at `/api/hello` (same origin, no cross-origin concerns)
  - API container reads `HELLO_MESSAGE` from its own environment only

---

## Flow
- **End-to-end technical flow:**
  1. `docker compose up` starts nginx, frontend, and API containers on a shared Docker network.
  2. Browser opens `http://localhost`.
  3. nginx serves the frontend static assets (or proxies the Vite dev server).
  4. React app mounts; `useEffect` fires `GET /api/hello`.
  5. nginx matches `/api/` prefix and proxies to the API container.
  6. API controller reads `config.helloMessage` (sourced from `HELLO_MESSAGE` env var, defaulting to `"Hello, world!"`).
  7. API responds with `200 { "message": "<value>" }`.
  8. Frontend renders the message string inside a MUI component.
- **Key processing steps:**
  - API config module reads and exports `HELLO_MESSAGE` at startup — single point of access.
  - Frontend config module reads and exports `VITE_API_BASE_URL` — passed through Docker Compose as a build/runtime arg.
  - nginx `location /api/` block strips or preserves the prefix consistently with the API's route definition.

---

## Interfaces

- **External APIs / contracts:**

  ```
  GET /api/hello
  → 200 OK
    { "message": "<string>" }
  ```

  No error response contract needed: the endpoint always succeeds (env var has a hardcoded default).

- **Key internal interfaces (if relevant):**
  - `contact-api/src/config.js` exports `{ helloMessage }` — consumed only by the hello controller.
  - `contact-frontend/src/config.js` exports `{ apiBaseUrl }` — consumed by the API fetch utility.

---

## Data & Validation
- **Core data structures (high-level):**
  - API response: `{ message: string }`
  - No request body or query parameters.
- **Validation rules:**
  - No input validation required — the endpoint takes no user input.
  - `HELLO_MESSAGE` is treated as a trusted environment value; no sanitization needed for this slice.
- **Error model:**
  - API: no error responses defined for this endpoint (always returns 200).
  - Frontend: catches network/fetch errors and renders a static error string ("Could not load message.").

---

## Frontend / Backend Notes
- **Key frontend behavior (if relevant):**
  - Single page; no routing required.
  - `useEffect` with an empty dependency array triggers the fetch once on mount.
  - State: `{ message: string | null, error: boolean }` — drives the conditional render.
  - MUI `Typography` or `Alert` components for display; no custom design work.
  - `VITE_API_BASE_URL` defaults to an empty string (same-origin) so the browser always hits nginx.
- **Backend responsibilities / orchestration:**
  - Express app with a single router mounted at `/api`.
  - Hello controller: reads config, returns JSON. No service layer needed — the logic is trivial.
  - `src/app.js` wires up Express middleware and routes.
  - `src/index.js` starts the HTTP server on the port from config.

---

## Testing Notes
- **Integration testing expectations:**
  - API: one integration test — `GET /api/hello` returns `200` with a `message` field.
  - Frontend: one component test — renders the message when the fetch resolves, renders error text when the fetch rejects.
- **Manual testing considerations:**
  - Start the stack with `docker compose up`, confirm the message appears in the browser.
  - Change `HELLO_MESSAGE` in the `.env` file, restart the API container, confirm the updated message appears.
  - Stop the API container while the frontend is running, reload the page, confirm the error state appears.
- **Performance / load testing considerations:** None for this slice.
- **Known risk areas requiring validation:**
  - nginx prefix stripping: confirm that `/api/hello` on the API side matches the nginx proxy configuration.
  - Vite dev server proxying vs. static build: Docker Compose may run the Vite dev server or serve a built bundle — the approach must be consistent with the nginx config.

---

## Risks & Trade-offs
- **Major risks:**
  - Running the Vite dev server inside Docker for local development adds complexity (HMR, file watching). Alternative: build the frontend and serve static files via nginx directly. Decision: run the Vite dev server in the frontend container for local development to keep the developer workflow simple; nginx proxies to it.
- **Important decisions:**
  - nginx listens on port 80 externally; the API and frontend are on internal Docker network ports only (3001 and 3000 respectively).
  - The frontend always calls `/api/hello` as a relative URL — no absolute API URL needed in development or production-like local setup.

---

## Notes
- **Assumptions:**
  - Node.js version: 20 LTS (current stable at time of writing).
  - Package manager: npm (no pnpm or yarn unless the user specifies otherwise).
  - Express 4.x for the API.
  - React 18 + Vite 5 for the frontend.
  - MUI v6 for component library.
- **Non-goals:** This slice does not establish any pattern for form handling, submission, or async side effects beyond a simple fetch.
- **Deferred decisions:** Linting and formatting tooling (ESLint, Prettier) configuration — can be added in this slice or deferred to the contact form feature.

---

## Out of Scope
- Any form, submission flow, or write operation.
- Authentication, authorization, sessions.
- Database or persistence layer.
- Production nginx TLS configuration.
- CI/CD pipeline setup.

---

## Updates

Append-only list of **Specification Updates** added after the baseline Technical Concept reaches `ready`.

Only Updates with status `ready` are considered effective.

### Update Template

#### Update: <name>
- **Status:** `draft | ready`
- **Date:** `YYYY-MM-DD`

**Context**
- 

**Change / decision**
- 

**Impact**
- 
