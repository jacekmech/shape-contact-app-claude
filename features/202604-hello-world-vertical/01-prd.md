# Hello World Vertical Slice

## Header
- **Title:** Hello World Vertical Slice
- **Status:** `ready`
- **Date:** 2026-04-16

---

## Goal
- **Problem:** The repository modules are empty scaffolds with no running code. There is no proven end-to-end path from backend to frontend yet.
- **User value:** A developer can start the application locally and immediately confirm that the full stack is wired up and responding correctly — backend serving data, frontend consuming and displaying it.
- **Expected outcome:** A single working vertical: the API reads a message from a configured variable and exposes it via an HTTP endpoint; the frontend fetches that endpoint and renders the message on screen.

---

## Flow
- **Main flow (happy path):** Developer starts the app locally. Frontend loads in the browser, calls the `/api/hello` endpoint, receives a JSON message, and displays it on the page.
- **Key alternative / error paths:** If the API is unreachable the frontend should show a clear error state rather than a blank page or silent failure.
- **Final states:** Message displayed (success) or error notice displayed (API unreachable or unexpected response).

---

## Requirements

### Functional Requirements
- The API exposes a `GET /api/hello` endpoint. The backend owns the full `/api/hello` path; nginx proxies the request without stripping the prefix.
- The endpoint returns a JSON response containing a `message` field.
- The message value is sourced from a runtime environment variable (not hardcoded in application logic). The variable must be documented, and a default value must be provided so the app works out of the box in the local development environment without any manual env setup.
- The frontend fetches `GET /api/hello` on load.
- The frontend renders the returned message in the UI.
- The frontend renders an error state if the request fails.

### Business Rules / Constraints
- The message environment variable must be documented (name, purpose, default value).
- The default value must be set such that no manual env configuration is required to run the app locally — out of the box means working with zero additional steps.
- No authentication or authorization is required for this endpoint.
- This feature is read-only — no user input, no form submission, no persistence.

---

## Acceptance Criteria
- `GET /api/hello` returns `200 OK` with `{ "message": "<value>" }`.
- The message value reflects the configured environment variable.
- The frontend displays the message when the API responds successfully.
- The frontend displays an error notice when the API is unreachable or returns an unexpected response.
- The application starts via Docker Compose from `contact-ops` with no manual environment setup required — all variables have working defaults for local development.
- The nginx reverse proxy routes `/api/` to the backend and `/` to the frontend correctly.

---

## UX Notes
- **Inputs / interactions:** None — the page is read-only on load.
- **Feedback (success / error):** Message text shown on success; simple inline error message on failure.
- **Optional link to detailed UX:** N/A — this is a minimal scaffold, not a designed UI.

---

## Non-Functional Requirements
- **Performance / latency:** No special requirements for a demo scaffold.
- **Reliability:** The app should start cleanly every time via Docker Compose.
- **Dependencies (if product-relevant):** Requires nginx reverse proxy routing to work correctly end-to-end.

---

## Notes
- **Assumptions:** The monorepo module structure (contact-frontend, contact-api, contact-ops, contact-middleware-nginx) is the correct layout per CLAUDE.md.
- **Open questions:** None at this stage.
- **Optional / stretch ideas:** N/A.

---

## Out of Scope
- Any form of user input or data submission.
- Persistence of any kind.
- Authentication or authorization.
- Any contact form functionality (that is a future feature).
- Production deployment configuration.

---

## Updates

Append-only list of **Specification Updates** added after the baseline PRD reaches `ready`.

Only Updates with status `ready` are considered effective.
