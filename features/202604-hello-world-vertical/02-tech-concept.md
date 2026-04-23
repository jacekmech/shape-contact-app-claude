# Technical Concept: Hello World Vertical Slice

## Header
- **Title:** Hello World Vertical Slice
- **Status:** `ready`
- **Date:** `2026-04-23`

---

## Overview
- **Technical summary:** A read-only GET endpoint in the Node.js API reads a greeting message from an environment variable and returns it as JSON. The React frontend fetches it on mount and renders it. nginx routes all `/api/*` traffic to the API and everything else to the frontend. Docker Compose wires the whole stack together.
- **Key constraints:** No persistence, no user input, no authentication. Message is sourced entirely server-side from a configured variable.
- **Core design principle:** Keep all four modules minimal but fully wired. This slice exists to prove the vertical integration works, not to deliver business logic.

---

## Repository Alignment
- **Relevant repository guidance used during design:** CLAUDE.md defines four modules with clear responsibilities: `contact-frontend` (React/MUI UI), `contact-api` (Node.js request handling), `contact-ops` (Docker Compose orchestration), `contact-middleware-nginx` (reverse proxy routing).
- **Important architectural or organizational constraints from agent-facing instructions:** Backend should be inspired by hexagonal architecture applied pragmatically — HTTP concerns near controllers, infrastructure concerns separated. Environment variables must be centralized in a config module, not scattered. Frontend must not hardcode service URLs.
- **Local conventions or preferred patterns that materially shape the solution:** Single quotes, semicolons, `const` by default. One config module per application root. MUI-based frontend. No abstraction layers without real purpose at this scale.

---

## Architecture
- **Main components / units:**
  - `contact-api` — Express.js server with a single GET `/api/hello` route
  - `contact-frontend` — React app with a single component that fetches and renders the message
  - `contact-ops` — Docker Compose file that starts all three services
  - `contact-middleware-nginx` — nginx config routing `/api/*` to the API and `/*` to the frontend

- **Responsibility split:**
  - API owns the message value and returns it; it does not know or care about the frontend
  - Frontend owns fetching and rendering; it does not know the message content
  - nginx owns routing; it does not know application logic
  - Docker Compose owns port assignments and service wiring

- **System boundaries:** Single origin exposed via nginx at `localhost:80`. No cross-origin requests.

---

## Flow
- **End-to-end technical flow:**
  1. `docker compose up` from `contact-ops` starts nginx, contact-api, and contact-frontend
  2. User opens `http://localhost`
  3. nginx serves the frontend
  4. React app mounts; `useEffect` triggers `GET /api/hello`
  5. nginx proxies the request to contact-api
  6. API handler reads `config.helloMessage` (from `HELLO_MESSAGE` env var, default `"Hello, World!"`)
  7. Returns `{ "message": "Hello, World!" }` with HTTP 200
  8. Frontend renders the message text
- **Key processing steps:** No transformation, validation, or business logic. The message flows directly from config to response to render.

---

## Interfaces
- **External APIs / contracts:**
  - `GET /api/hello` → `200 { "message": string }`
  - On unexpected server error: `500 { "error": "Internal server error" }`
- **Key internal interfaces (if relevant):** None beyond the config module exposing `helloMessage`.

---

## Data & Validation
- **Core data structures (high-level):** Response body: `{ message: string }`. No request body or query parameters.
- **Validation rules:** None — no user input exists.
- **Error model:** Frontend distinguishes successful fetch (renders message) from failed fetch (renders error text). API returns 500 only for unexpected errors.

---

## Frontend / Backend Notes
- **Key frontend behavior (if relevant):**
  - A single React component fetches `GET /api/hello` on mount using `useEffect`
  - Manages three local states: loading, message, error
  - Renders message text on success, error text on failure
  - API base URL comes from frontend config (env var `VITE_API_BASE_URL`, default `/api` for nginx-proxied local dev)
- **Backend responsibilities / orchestration:**
  - `src/config.js` reads `HELLO_MESSAGE` from `process.env` with a hardcoded default
  - `src/controllers/helloController.js` exports the route handler
  - `src/app.js` mounts the router under `/api`
  - `src/server.js` is the entry point

---

## Testing Notes
- **Integration testing expectations:** One integration test (or supertest-based handler test) verifying `GET /api/hello` returns 200 with `{ message: string }`.
- **Manual testing considerations:** `docker compose up` from `contact-ops`, navigate to `http://localhost`, verify the message appears.
- **Performance / load testing considerations:** Not applicable for this slice.
- **Known risk areas requiring validation:** nginx proxy routing for `/api/*` — must confirm the path is forwarded correctly without stripping or doubling the prefix.

---

## Risks & Trade-offs
- **Major risks:**
  - nginx misconfiguration (wrong `proxy_pass` target or path rewriting) is the most likely integration failure point
  - Docker Compose service naming misalignment between nginx config and compose service names
- **Important decisions:**
  - Using an env var (`HELLO_MESSAGE`) rather than a hardcoded `const` keeps the pattern consistent with how real config will work in later features
  - Vite used for the frontend dev server (standard for React in 2024+); Docker Compose runs the Vite dev server for local development

---

## Notes
- **Assumptions:** `HELLO_MESSAGE` has a default of `"Hello, World!"` so the stack runs with zero manual env setup.
- **Non-goals:** No static build step for the frontend in this slice; Vite dev server is acceptable for local Docker Compose.
- **Deferred decisions:** Production build pipeline, health checks, logging — all deferred to later features.

---

## Out of Scope
- User input of any kind
- Frontend routing or multiple pages
- Authentication or authorization
- Persistence
- Static build and asset serving (vs. Vite dev server)
- Health check endpoints

---

## Updates

