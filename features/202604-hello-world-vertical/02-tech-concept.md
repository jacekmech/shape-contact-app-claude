# Hello World Vertical Slice — Technical Concept

## Header
- **Title:** Hello World Vertical Slice — Technical Concept
- **Status:** `ready`
- **Date:** 2026-04-16

---

## Overview
- **Technical summary:** A minimal read-only vertical that initialises all four modules with just enough code to prove the end-to-end path: env variable → API endpoint → nginx proxy → React frontend render. Each module is set up in a way that the contact form feature can extend rather than replace.
- **Key constraints:** Backend owns the full `/api/hello` path; nginx proxies without prefix stripping. All local defaults must work with zero manual env configuration. No persistence, no auth, no form logic.
- **Core design principle:** Establish the project's real structure once, kept as simple as the feature allows. Prefer patterns that the next feature can build on rather than throwaway scaffold code.

---

## Repository Alignment
- **Relevant repository guidance used during design:** CLAUDE.md — module responsibilities, hexagonal-inspired backend structure (`controllers`, `domain`, `infra`, `lib`), MUI-based React frontend, Docker Compose orchestration from `contact-ops`, nginx for routing in `contact-middleware-nginx`.
- **Important architectural or organizational constraints from agent-facing instructions:** Do not harden abstraction layers that serve no purpose at this scale. Use the hexagonal-inspired structure to improve clarity, not to simulate complexity. Configuration must be centralised — do not scatter env reads across the codebase.
- **Local conventions or preferred patterns that materially shape the solution:** JS with semicolons, single quotes, `const` by default. One config module per application root. Frontend env vars exposed only via a config module. Modules must be independently understandable where practical.

---

## Architecture

- **Main components / units:**
  - `contact-api` — Express.js HTTP server with a single route handler; config module reading env vars.
  - `contact-frontend` — Vite + React app; a single page component that fetches the API on mount and renders the result; config module for API base URL.
  - `contact-ops` — Docker Compose file wiring all four services together with appropriate env vars and port bindings.
  - `contact-middleware-nginx` — nginx config with two upstreams (frontend, API) and two location blocks.

- **Responsibility split:**
  - `contact-api`: owns route definition, env-sourced message value, JSON response shape.
  - `contact-frontend`: owns fetch-on-mount behaviour, success render, error render. Does not know about deployment topology — uses a relative path or a configured base URL.
  - `contact-ops`: owns service naming, port assignments, and env variable defaults for the local runtime.
  - `contact-middleware-nginx`: owns request routing only. No application logic.

- **System boundaries:**
  - Browser ↔ nginx (port 80 locally)
  - nginx ↔ contact-frontend (internal port 5173)
  - nginx ↔ contact-api (internal port 3001)
  - contact-api reads from environment only — no outbound connections.

---

## Flow

- **End-to-end technical flow:**
  1. Developer runs `docker compose up` from `contact-ops`.
  2. All four containers start: nginx, contact-frontend (Vite dev server), contact-api (Express), and any supporting config.
  3. Browser opens `http://localhost` (nginx port 80).
  4. nginx routes `GET /` to contact-frontend → React app loads.
  5. React app mounts, fires `GET /api/hello` (relative path, routed through nginx).
  6. nginx routes `GET /api/hello` to contact-api (full path preserved).
  7. contact-api reads `HELLO_MESSAGE` env var, returns `{ "message": "<value>" }` with status 200.
  8. Frontend renders the message text.
  9. On fetch failure (API down / unexpected response), frontend renders inline error notice.

- **Key processing steps:**
  - contact-api: `GET /api/hello` → config lookup → JSON response.
  - contact-frontend: component mount → fetch → state update → conditional render (message or error).

---

## Interfaces

- **External APIs / contracts:**
  - `GET /api/hello`
    - Response (200): `{ "message": string }`
    - No request body, no query params, no auth headers.
    - Error responses (5xx or network failure) are treated as error state on the frontend; no specific error shape is defined for this endpoint.

- **Key internal interfaces (if relevant):**
  - contact-api config module exports `{ message: string, port: number }` derived from env vars.
  - contact-frontend config module exports `{ apiBaseUrl: string }` — defaults to empty string (relative path) so the app works behind nginx without hardcoded hostnames.

---

## Data & Validation

- **Core data structures (high-level):**
  - API response: `{ message: string }` — flat, no nesting.
  - Frontend state: `{ data: string | null, error: boolean, loading: boolean }`.

- **Validation rules:**
  - No request validation required — `GET /api/hello` accepts no input.
  - Backend does not validate the env variable value beyond ensuring it exists and has a default.

- **Error model:**
  - Any non-2xx response or network error from `GET /api/hello` sets `error: true` in frontend state and renders an inline error notice.
  - No error detail from the API is surfaced to the user.

---

## Frontend / Backend Notes

- **Key frontend behavior:**
  - Fetch fires once on component mount (`useEffect` with empty dependency array).
  - Loading state is tracked but minimal UI treatment is needed (placeholder or nothing).
  - Error state renders a simple inline message — not a modal, not a toast, not a page redirect.
  - MUI `Typography` or equivalent is sufficient; no heavy component design needed.

- **Backend responsibilities / orchestration:**
  - Express app initialised in `src/app.js`; server started in `src/server.js`.
  - Route handler lives in `src/controllers/helloController.js`.
  - Message value read via `src/config.js` — the only place env vars are accessed.
  - No domain logic file needed at this scale; controller reads config directly.
  - `src/domain/` folder can be created as an empty placeholder to establish the pattern for the next feature.

---

## Testing Notes

- **Integration testing expectations:**
  - Backend: one integration test for `GET /api/hello` — verifies 200 status and `{ message }` shape with a known env value.
  - Frontend: one component test — mocks the API fetch, verifies message renders on success, verifies error notice renders on failure.
  - Linting: both modules must pass `eslint` and `prettier --check` as part of the local dev workflow.

- **Manual testing considerations:**
  - Start via Docker Compose, open browser, confirm message renders. Stop the API container, reload, confirm error notice renders.

- **Performance / load testing considerations:** None for this feature.

- **Known risk areas requiring validation:**
  - nginx routing correctness is the main integration risk — easy to misconfigure prefix handling.
  - Vite dev server in Docker requires `--host` flag to bind to `0.0.0.0`; missing this is a common first-time issue.

---

## Risks & Trade-offs

- **Major risks:**
  - nginx misconfiguration (wrong upstream port or accidental prefix stripping) will silently break the vertical. Must be verified manually end-to-end.
  - Vite in Docker: dev server must be configured to listen on all interfaces, not just localhost.

- **Important decisions:**
  - Using Vite dev server in Docker (not a static build) to keep local development fast and hot-reload capable. This is appropriate for a local-only demo.
  - Backend does not define a domain module for this feature — controller reads config directly. The `domain/` folder is scaffolded empty as a convention anchor for future features.
  - Frontend uses relative API paths (`/api/hello`) rather than an absolute base URL, so the frontend build does not need to know the API hostname. nginx handles routing.
  - ESLint and Prettier are configured in both `contact-frontend` and `contact-api` as part of this vertical. Each module gets its own config aligned to CLAUDE.md conventions (semicolons, single quotes, trailing commas). This establishes the baseline linting and formatting contract for all subsequent features.

---

## Notes

- **Assumptions:**
  - Docker and Docker Compose are available on the developer machine.
  - Vite is the frontend build tool (standard for modern React; aligns with lightweight tooling expectation).
  - Express is the backend HTTP framework (standard Node.js choice; no framework overhead at this scale).
  - nginx is the local reverse proxy as declared in `contact-middleware-nginx`.

- **Non-goals:**
  - Production build pipeline.
  - Frontend routing (single page, no React Router needed yet).
  - Any logging beyond default Express/Vite output.
  - Monorepo-level shared ESLint config — each module owns its own config at this scale.

- **Deferred decisions:**
  - Port assignments for future services (e.g., database, email) — not relevant here.
  - ESLint / Prettier config specifics — in scope for this vertical; establishing them now means every subsequent feature starts from a consistent baseline.

---

## Out of Scope
- Any contact form functionality.
- Backend validation beyond env defaults.
- Authentication, persistence, or external service calls.

---

## Updates

Append-only list of **Specification Updates** added after the baseline Technical Concept reaches `ready`.

Only Updates with status `ready` are considered effective.
