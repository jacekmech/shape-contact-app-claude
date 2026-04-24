# PRD

## Header
- **Title:** Hello World Vertical Slice
- **Status:** `ready`
- **Date:** 2026-04-24

---

## Goal
- **Problem:** The application has no working code in any module. Before building the contact form feature, the full vertical stack needs to be established and proven end-to-end: frontend, API, nginx routing, and local orchestration.
- **User value:** Developers can confirm the stack is wired correctly and runnable locally before investing in real feature work.
- **Expected outcome:** A running local environment where the frontend displays a message that originated as an environment variable on the backend, flowing through the API and nginx.

---

## Flow
- **Main flow (happy path):**
  1. Developer starts the local environment via Docker Compose.
  2. Developer opens the app in a browser.
  3. The frontend loads and calls the API's hello endpoint.
  4. The API reads `HELLO_MESSAGE` from its environment and returns it as a JSON response.
  5. The frontend displays the message on screen.
- **Key alternative / error paths:**
  - If the API is unavailable, the frontend displays a generic error state (e.g. "Could not load message.").
  - If `HELLO_MESSAGE` is not set, the API falls back to a default message.
- **Final states:**
  - Success: message is displayed on the page.
  - Error: a clear error state is shown on the page.

---

## Requirements
### Functional Requirements
- The API must expose a `GET /api/hello` endpoint.
- The endpoint must return a JSON response containing a `message` field.
- The `message` value must be read from the `HELLO_MESSAGE` environment variable.
- If `HELLO_MESSAGE` is not set, the API must return a hardcoded default message.
- The frontend must call `GET /api/hello` on page load.
- The frontend must display the returned message when the call succeeds.
- The frontend must display a readable error state when the call fails.
- Requests from the browser must be routed through nginx to the API (no direct API port access from the browser).

### Business Rules / Constraints
- The `HELLO_MESSAGE` variable is the only configurable input; no user interaction is involved.
- The feature is read-only: no form submission, no writes, no side effects.
- The feature is intentionally minimal — its purpose is infrastructure validation, not user-facing value.

---

## Acceptance Criteria
- `docker compose up` in `contact-ops` starts all services without errors.
- Opening the app in a browser at the local development URL shows the hello message on screen.
- Changing `HELLO_MESSAGE` in the environment and restarting the API causes the new message to appear.
- If the API is unreachable, the frontend shows an error state rather than a blank screen or crash.
- No hardcoded service hostnames or ports appear in frontend source code.

---

## UX Notes
- **Inputs / interactions:** None. The page is fully passive — no user input required.
- **Feedback (success / error):** The message is displayed when loaded. A plain text error message is shown if the API call fails (no complex error UI needed for this slice).
- **Optional link to detailed UX:** N/A — basic display only.

---

## Non-Functional Requirements
- **Performance / latency:** No specific requirement. The endpoint should respond within a normal synchronous Node.js response time.
- **Reliability:** No retry logic required for this slice.
- **Dependencies (if product-relevant):** Requires Docker Compose to be installed locally. No external services.

---

## Notes
- **Assumptions:**
  - All four modules (frontend, API, nginx, ops) will be scaffolded as part of this feature.
  - The nginx proxy config will route `/api/` to the API service and everything else to the frontend.
  - `.env` files or Docker Compose environment declarations will supply `HELLO_MESSAGE` to the API container.
- **Open questions:** None — scope is intentionally fixed.
- **Optional / stretch ideas:** None for this slice.

---

## Out of Scope
- Any form, submission, or write operation.
- Authentication or authorization.
- Database or persistence layer.
- Email or external integrations.
- Production deployment configuration.
- Advanced error handling beyond a simple error state.

---

## Updates

Append-only list of **Specification Updates** added after the baseline PRD reaches `ready`.

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
