# PRD: Hello World Vertical Slice

## Header
- **Title:** Hello World Vertical Slice
- **Status:** `ready`
- **Date:** `2026-04-23`

---

## Goal
- **Problem:** No vertical scaffold exists to confirm the full stack is wired together and can serve data end-to-end before the contact form feature is built.
- **User value:** Gives developers confidence that the monorepo, API, frontend, nginx, and Docker Compose setup all work together correctly from day one.
- **Expected outcome:** A running application where the frontend displays a greeting message fetched from the backend API.

---

## Flow
- **Main flow (happy path):** The user opens the app → the frontend calls `GET /api/hello` on page load → the API reads a message from a configured variable → returns it as JSON → the frontend renders the message on screen.
- **Key alternative / error paths:** If the API call fails, the frontend shows a simple error state.
- **Final states:** Message visible on screen (success), or error message visible (failure).

---

## Requirements
### Functional Requirements
- The backend exposes a `GET /api/hello` endpoint.
- The endpoint returns a JSON response containing a greeting message.
- The message value is sourced from a server-side variable (e.g., an environment variable with a local default).
- The frontend fetches the message on page load and renders it.
- The frontend displays an error state if the fetch fails.

### Business Rules / Constraints
- This is a read-only feature; no user input is involved.
- No persistence, authentication, or external integrations are required.

---

## Acceptance Criteria
- `GET /api/hello` returns `{ "message": "<value>" }` with HTTP 200.
- The frontend renders the message text when the API responds successfully.
- The frontend renders an error indicator when the API is unreachable or returns an error.
- The full stack runs via Docker Compose from `contact-ops` with no manual configuration.

---

## UX Notes
- **Inputs / interactions:** None — page load triggers the fetch automatically.
- **Feedback (success / error):** Message text displayed on screen; brief error text on failure.
- **Optional link to detailed UX:** n/a

---

## Non-Functional Requirements
- **Performance / latency:** No specific requirements; any reasonable response time is acceptable for a demo.
- **Reliability:** Must be consistently reproducible in local Docker Compose setup.
- **Dependencies (if product-relevant):** Relies on nginx reverse proxy routing `/api/*` to the backend.

---

## Notes
- **Assumptions:** The message variable has a sensible local default so the app works out of the box without additional setup.
- **Open questions:** None.
- **Optional / stretch ideas:** None — keep it minimal.

---

## Out of Scope
- User input
- Persistence
- Authentication
- Dynamic message content beyond a single configured variable

---

## Updates

