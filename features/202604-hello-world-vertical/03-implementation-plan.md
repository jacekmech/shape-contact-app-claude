# Implementation Plan

## Header
- **Title:** Hello World Vertical Slice
- **Status:** `in progress`
- **Date:** 2026-04-24

---

## Objective
- **What is being delivered:** A fully running local stack that proves end-to-end connectivity across all four modules. The API reads `HELLO_MESSAGE` from its environment and serves it via `GET /api/hello`. The frontend fetches and displays the message through nginx. Everything starts with a single `docker compose up`.
- **Key constraints:** All modules start empty. Each module must be bootstrapped from scratch with production-shaped structure. No throwaway scaffold code.

---

## Slices

- **Slice 1: API module**
  - **Goal:** Bootstrap the `contact-api` Express application — package setup, config module, hello controller, app wiring, server entry point, Dockerfile, and one integration test for `GET /api/hello`.
  - **Status:** `done`

- **Slice 2: Frontend module**
  - **Goal:** Bootstrap the `contact-frontend` Vite + React + MUI application — package setup, config module, App component with hello fetch on mount, success and error render states, Dockerfile, and one component test.
  - **Status:** `done`

- **Slice 3: Ops & middleware**
  - **Goal:** Wire all services together — nginx config in `contact-middleware-nginx`, Docker Compose in `contact-ops` with service definitions, networking, `.env.example`, and environment wiring. Verified by `docker compose up` and a message visible in the browser.
  - **Status:** `ready`

---

## Execution Order

- Slice 1: API module (`done`)
  - [x] Initialize `contact-api` npm package — `package.json` with Express, Jest, and Supertest; `start` and `test` scripts
  - [x] Add `src/config.js` — reads `HELLO_MESSAGE` and `PORT` from env, exports `{ helloMessage, port }` with defaults
  - [x] Add `src/controllers/hello.controller.js` — request handler that reads `config.helloMessage` and returns `{ message }`
  - [x] Add `src/app.js` — Express app, mounts a router at `/api` with the hello route
  - [x] Add `src/index.js` — starts the HTTP server on `config.port`
  - [x] Add `Dockerfile` — Node 20 Alpine, installs deps, runs `npm start`
  - [x] Add integration test — `GET /api/hello` returns 200 with a `message` field; covers the default value and a custom `HELLO_MESSAGE`

- Slice 2: Frontend module (`done`)
  - [x] Initialize `contact-frontend` project — `package.json` with React 18, Vite 5, MUI v6, Vitest, and React Testing Library; `dev`, `build`, and `test` scripts
  - [x] Add `vite.config.js` — React plugin, dev server on port 3000 with `host: true`, Vitest jsdom environment; add `src/setupTests.js` for Testing Library matchers
  - [x] Add `index.html` and `src/main.jsx` — Vite HTML entry point and React root mount
  - [x] Add `src/config.js` — reads `VITE_API_BASE_URL` from `import.meta.env`, exports `{ apiBaseUrl }` defaulting to `''`
  - [x] Add `src/App.jsx` — fetches `${apiBaseUrl}/api/hello` on mount, manages `{ message, error }` state, renders MUI `Typography` for success and `Alert` for error
  - [x] Add `Dockerfile` — Node 20 Alpine, runs `npm run dev` bound to all interfaces
  - [x] Add component test — mocks `fetch`, asserts message renders on success and error text renders on failure

- Slice 3: Ops & middleware (`ready`)
  - [ ] Add `contact-middleware-nginx/nginx.conf` — listens on port 80; routes `/api/` → `http://api:3001` (prefix preserved); routes everything else → `http://frontend:3000` with WebSocket upgrade headers for Vite HMR
  - [ ] Add `contact-middleware-nginx/Dockerfile` — extends `nginx:alpine`, copies `nginx.conf`
  - [ ] Add `contact-ops/docker-compose.yml` — three services (`api`, `frontend`, `nginx`) on a shared bridge network; nginx maps port 80 externally; `HELLO_MESSAGE` wired to `api` with default fallback
  - [ ] Add `contact-ops/.env.example` — documents `HELLO_MESSAGE` with a default value
  - [ ] Add `contact-ops/.gitignore` — ignores `.env`

---

## Important Decisions

- nginx routes `/api/` to the API container (port 3001) and everything else to the frontend container (port 3000). Both are on internal Docker networking only; nginx is the sole external entry point on port 80.
- The Vite dev server runs inside the frontend container for local development; nginx proxies to it. This avoids a static build step in the local developer loop.
- The frontend calls `/api/hello` as a relative URL (same-origin via nginx). No absolute API URL is needed.
- Frontend test runner is Vitest (not Jest) — integrates directly with the Vite config; standard choice for Vite projects.
- nginx does not strip the `/api/` prefix before proxying — the Express app is mounted at `/api`, so the full path must reach the API container unchanged.

---

## Relevant Files

- `contact-api/src/index.js` — listens on port 3001; service name needed in Docker Compose
- `contact-frontend/vite.config.js` — dev server on port 3000 with `host: true`
- `contact-middleware-nginx/nginx.conf` — to be created; routes /api/ → API, rest → frontend
- `contact-ops/docker-compose.yml` — to be created; wires all three services
- `contact-ops/.env.example` — to be created; documents HELLO_MESSAGE

---

## Notes
- Slices are sequenced API → frontend → ops. The API contract is established first so the frontend can be written against it. Ops wires the two together last and serves as the integration checkpoint.
- Each slice should be executed in a fresh agent session starting with `pick up feature`.
- Linting and formatting tooling (ESLint, Prettier) is deferred — can be added in a later feature if needed.
