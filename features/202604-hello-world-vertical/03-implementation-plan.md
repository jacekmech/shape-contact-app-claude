# Implementation Plan: Hello World Vertical Slice

## Header
- **Title:** Hello World Vertical Slice
- **Status:** `done`
- **Date:** `2026-04-23`

---

## Objective
- **What is being delivered:** A fully wired vertical slice across all four modules — API endpoint serving a configured greeting message, React frontend fetching and rendering it, nginx routing, and Docker Compose orchestration — confirming the full stack integrates correctly.
- **Key constraints:** Read-only, no persistence, no user input. Each module starts from a stub. Message sourced from `HELLO_MESSAGE` env var with default `"Hello, World!"`. Vite dev server used in local Docker Compose (no static build step).

---

## Slices

- [x] Slice 1 — contact-api: Express scaffold, config module, hello route, unit test
- [x] Slice 2 — contact-frontend: Vite/React scaffold, config module, HelloMessage component, component test
- [x] Slice 3 — Stack wiring: contact-ops Docker Compose, contact-middleware-nginx config, full-stack smoke verification

---

## Execution Order

- [x] Slice 1 — contact-api scaffold
  - [x] Initialize `package.json` with Express and a test runner (Jest + supertest)
  - [x] Add ESLint config aligned to CLAUDE.md style (single quotes, semicolons)
  - [x] Create `src/config.js` reading `HELLO_MESSAGE` from env with default `"Hello, World!"`
  - [x] Create `src/controllers/helloController.js` exporting the GET `/api/hello` handler
  - [x] Create `src/app.js` setting up Express and mounting the hello router under `/api`
  - [x] Create `src/server.js` as the entry point (binds and starts the HTTP server)
  - [x] Write unit/integration test verifying `GET /api/hello` returns `200 { message: string }`
  - [x] Confirm API runs standalone: `node src/server.js` responds correctly

- [x] Slice 2 — contact-frontend scaffold
  - [x] Initialize `package.json` with Vite, React, MUI, and Vitest + React Testing Library
  - [x] Add `vite.config.js` with test environment configured (jsdom)
  - [x] Add ESLint config for JSX/React
  - [x] Create `index.html` (Vite entry point)
  - [x] Create `src/config.js` reading `VITE_API_BASE_URL` from `import.meta.env` with default `/api`
  - [x] Create `src/main.jsx` as the app entry point
  - [x] Create `src/App.jsx` rendering the HelloMessage component
  - [x] Create `src/components/HelloMessage.jsx` — fetches `GET /api/hello` on mount, three states: loading / message / error; rendered with MUI
  - [x] Write component test for HelloMessage: mock fetch, verify message renders on success and error text renders on failure
  - [x] Confirm frontend runs standalone: `npm run dev`

- [x] Slice 3 — Stack wiring
  - [x] Create `contact-api/Dockerfile` (Node 18, runs `node src/server.js`)
  - [x] Create `contact-frontend/Dockerfile` (Node 18, runs Vite dev server with `--host`)
  - [x] Create `contact-middleware-nginx/nginx.conf` — proxies `/api/` to `contact-api:3000`, `/*` to `contact-frontend:5173`
  - [x] Create `contact-ops/docker-compose.yml` — three services on a shared network, nginx exposed on port 80
  - [x] Create `contact-ops/.env.example` documenting configurable vars
  - [x] Verify full stack: `docker compose up` from `contact-ops`, confirm `http://localhost` serves the greeting

---

## Important Decisions

- Three slices chosen to keep each session focused on one concern: backend, frontend, integration. Given the feature's small size, a single session could cover all three if the developer prefers to consolidate.

---

## Relevant Files

- `contact-api/package.json` — Express, Jest, supertest, ESLint
- `contact-api/src/config.js` — reads PORT and HELLO_MESSAGE from env
- `contact-api/src/controllers/helloController.js` — GET /api/hello handler
- `contact-api/src/app.js` — Express app, mounts hello route
- `contact-api/src/server.js` — entry point
- `contact-api/src/__tests__/hello.test.js` — integration test via supertest
- `contact-frontend/package.json` — Vite, React, MUI, Vitest + RTL
- `contact-frontend/vite.config.js` — jsdom test env, globals
- `contact-frontend/src/config.js` — reads VITE_API_BASE_URL from import.meta.env
- `contact-frontend/src/components/HelloMessage.jsx` — fetches /api/hello, loading/message/error states
- `contact-frontend/src/App.jsx` — root, CssBaseline + HelloMessage
- `contact-frontend/src/__tests__/HelloMessage.test.jsx` — 2 tests: success + error
- `contact-api/Dockerfile` — Node 18 alpine, production deps only
- `contact-frontend/Dockerfile` — Node 18 alpine, Vite dev server with --host
- `contact-middleware-nginx/nginx.conf` — proxies /api/ to contact-api:3000, /* to contact-frontend:5173
- `contact-ops/docker-compose.yml` — three services, shared network, nginx on port 80
- `contact-ops/.env.example` — documents HELLO_MESSAGE

---

## Notes
- All three slices completed in a single session.
- Next step: `finish implementation`.
