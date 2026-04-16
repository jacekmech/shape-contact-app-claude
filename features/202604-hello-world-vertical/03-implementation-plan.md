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

- [ ] Slice 1 — Backend: initialise `contact-api` with Express, config, hello endpoint, linting, and test
- [ ] Slice 2 — Frontend: initialise `contact-frontend` with Vite + React, config, hello render, linting, and test
- [ ] Slice 3 — Runtime: wire `contact-ops` Docker Compose and `contact-middleware-nginx`, verify end-to-end

---

## Execution Order

- [ ] Slice 1 — Backend
  - [x] Task 1: Initialise `contact-api` npm package — `package.json` with name, description, `main`, and script placeholders
  - [x] Task 2: Install Express; create `src/app.js` (app setup, route registration) and `src/server.js` (entry point, starts server on configured port)
  - [x] Task 3: Create `src/config.js` — reads `HELLO_MESSAGE` (default: `'Hello, World!'`) and `PORT` (default: `3001`) from env; exported as a single config object
  - [x] Task 4: Create `src/controllers/helloController.js` — handles `GET /api/hello`, reads message from config, returns `{ message }` as JSON
  - [ ] Task 5: Scaffold `src/domain/` — empty placeholder directory with `.gitkeep` to establish the pattern for future features
  - [ ] Task 6: Configure ESLint and Prettier — install dev dependencies, add `.eslintrc.js` and `.prettierrc` aligned to CLAUDE.md conventions (semicolons, single quotes, trailing commas), add `lint` and `format` scripts
  - [ ] Task 7: Add `.env.example` — documents `HELLO_MESSAGE` variable with its purpose and default value
  - [ ] Task 8: Set up Jest and Supertest; write one integration test for `GET /api/hello` — verifies 200 status and `{ message }` shape against a known env value; add `test` script

- [ ] Slice 2 — Frontend
  *(tasks to be added during `prepare slice`)*

- [ ] Slice 3 — Runtime
  *(tasks to be added during `prepare slice`)*

---

## Important Decisions

*(none yet — to be captured during execution)*

---

## Relevant Files

- `contact-api/package.json`
- `contact-api/src/config.js`
- `contact-api/src/app.js`
- `contact-api/src/server.js`
- `contact-api/src/controllers/helloController.js`
- `contact-api/src/domain/` — placeholder directory
- `contact-api/.env.example`
- `contact-api/.eslintrc.js`
- `contact-api/.prettierrc`
- `contact-frontend/` — frontend module root (Slice 2)
- `contact-ops/` — Docker Compose and local orchestration (Slice 3)
- `contact-middleware-nginx/` — nginx reverse proxy config (Slice 3)

---

## Notes
- Slice 1 and Slice 2 are independent and could be executed in either order; Slice 3 depends on both.
- Each slice is intended for a single focused agent session. Start each new session with `/pick-up-feature` unless the feature is already active.
