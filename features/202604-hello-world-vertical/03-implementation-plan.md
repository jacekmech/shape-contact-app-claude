# Implementation Plan: Hello World Vertical Slice

## Header
- **Title:** Hello World Vertical Slice
- **Status:** `ready`
- **Date:** `2026-04-23`

---

## Objective
- **What is being delivered:** A fully wired vertical slice across all four modules — API endpoint serving a configured greeting message, React frontend fetching and rendering it, nginx routing, and Docker Compose orchestration — confirming the full stack integrates correctly.
- **Key constraints:** Read-only, no persistence, no user input. Each module starts from a stub. Message sourced from `HELLO_MESSAGE` env var with default `"Hello, World!"`. Vite dev server used in local Docker Compose (no static build step).

---

## Slices

- [ ] Slice 1 — contact-api: Express scaffold, config module, hello route, unit test
- [ ] Slice 2 — contact-frontend: Vite/React scaffold, config module, HelloMessage component, component test
- [ ] Slice 3 — Stack wiring: contact-ops Docker Compose, contact-middleware-nginx config, full-stack smoke verification

---

## Execution Order

- [ ] Slice 1 — contact-api scaffold
  *(tasks to be defined in prepare slice)*

- [ ] Slice 2 — contact-frontend scaffold
  *(tasks to be defined in prepare slice)*

- [ ] Slice 3 — Stack wiring
  *(tasks to be defined in prepare slice)*

---

## Important Decisions

- Three slices chosen to keep each session focused on one concern: backend, frontend, integration. Given the feature's small size, a single session could cover all three if the developer prefers to consolidate.

---

## Relevant Files

- `contact-api/` — to be created: `package.json`, `src/config.js`, `src/controllers/helloController.js`, `src/app.js`, `src/server.js`
- `contact-frontend/` — to be created: `package.json`, `vite.config.js`, `src/config.js`, `src/components/HelloMessage.jsx`, `src/App.jsx`
- `contact-ops/` — to be created: `docker-compose.yml`, `.env.example`
- `contact-middleware-nginx/` — to be created: `nginx.conf`

---

## Notes
- Slice 3 depends on Slices 1 and 2 being complete. Slices 1 and 2 are independent and could be done in either order.
- Next step: `prepare slice` for Slice 1 (or consolidate all three if preferred).
