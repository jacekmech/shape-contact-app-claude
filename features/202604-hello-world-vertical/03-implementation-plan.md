# Hello World Vertical Slice — Implementation Plan

## Header
- **Title:** Hello World Vertical Slice — Implementation Plan
- **Status:** `in progress`
- **Date:** 2026-04-16

---

## Objective
- **What is being delivered:** A fully working read-only vertical across all four modules — `contact-api` serves a message from an env variable via `GET /api/hello`, `contact-frontend` fetches and renders it, `contact-middleware-nginx` routes requests, and `contact-ops` orchestrates everything via Docker Compose. ESLint and Prettier are configured in both application modules. The result is a runnable local stack with tests and a proven end-to-end path.
- **Key constraints:** Backend owns the full `/api/hello` path; nginx proxies without prefix stripping. All env variables must have working defaults — zero manual setup to run locally. Each module must be independently understandable. No persistence, auth, or form logic.

---

## Slices

- [x] Slice 1 — Backend: initialise `contact-api` with Express, config, hello endpoint, linting, and test
- [x] Slice 2 — Frontend: initialise `contact-frontend` with Vite + React, config, hello render, linting, and test
- [ ] Slice 3 — Runtime: wire `contact-ops` Docker Compose and `contact-middleware-nginx`, verify end-to-end

---

## Execution Order

- [x] Slice 1 — Backend
  - [x] Task 1: Initialise `contact-api` npm package — `package.json` with name, description, `main`, and script placeholders
  - [x] Task 2: Install Express; create `src/app.js` (app setup, route registration) and `src/server.js` (entry point, starts server on configured port)
  - [x] Task 3: Create `src/config.js` — reads `HELLO_MESSAGE` (default: `'Hello, World!'`) and `PORT` (default: `3001`) from env; exported as a single config object
  - [x] Task 4: Create `src/controllers/helloController.js` — handles `GET /api/hello`, reads message from config, returns `{ message }` as JSON
  - [x] Task 5: Scaffold `src/domain/` — empty placeholder directory with `.gitkeep` to establish the pattern for future features
  - [x] Task 6: Configure ESLint and Prettier — install dev dependencies, add `.eslintrc.js` and `.prettierrc` aligned to CLAUDE.md conventions (semicolons, single quotes, trailing commas), add `lint` and `format` scripts
  - [x] Task 7: Add `.env.example` — documents `HELLO_MESSAGE` variable with its purpose and default value
  - [x] Task 8: Set up Jest and Supertest; write one integration test for `GET /api/hello` — verifies 200 status and `{ message }` shape against a known env value; add `test` script

- [x] Slice 2 — Frontend
  - [x] Task 1: Initialise `contact-frontend` npm package — `package.json` with `"type": "module"`, name, script placeholders; install React, React DOM, Vite, `@vitejs/plugin-react`, and MUI (`@mui/material`, `@emotion/react`, `@emotion/styled`)
  - [x] Task 2: Create Vite config (`vite.config.js`), `index.html`, and `src/main.jsx` entry point — standard Vite + React bootstrap with MUI baseline
  - [x] Task 3: Create `src/config.js` — exports `{ apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '' }`; empty string default means all API calls route through nginx as relative paths
  - [x] Task 4: Create `src/App.jsx` — `useEffect` fetch on mount using `apiBaseUrl + '/api/hello'`, `{ data, loading, error }` state, conditional MUI `Typography` render for success and inline error notice
  - [x] Task 5: Configure ESLint and Prettier — install dev deps including `eslint-plugin-react-hooks`; `eslint.config.js` using ES module syntax (package is `"type": "module"`); `.prettierrc` mirroring contact-api conventions; add `lint`, `format`, `format:check` scripts
  - [x] Task 6: Add `.env.example` — documents `VITE_API_BASE_URL` (optional; empty string default means relative path through nginx)
  - [x] Task 7: Set up Vitest and React Testing Library; write component test for `App` — mock `fetch`, verify message renders on success and error notice renders on failure; add `test` script

- [ ] Slice 3 — Runtime
  *(tasks to be added during `prepare slice`)*

---

## Important Decisions

*(none yet — to be captured during execution)*

---

## Relevant Files

- `contact-api/src/server.js` — port 3001, service name needed in Docker Compose
- `contact-api/src/app.js` — route `/api/hello` to verify nginx proxy target
- `contact-frontend/vite.config.js` — port 5173, `host: true` already set for Docker
- `contact-ops/` — Docker Compose target (Slice 3)
- `contact-middleware-nginx/` — nginx config target (Slice 3)

---

## Notes
- Slice 1 and Slice 2 are independent and could be executed in either order; Slice 3 depends on both.
- Each slice is intended for a single focused agent session. Start each new session with `/pick-up-feature` unless the feature is already active.
