# Technical Concept

## Header
- **Title:** Contact Form
- **Status:** `ready`
- **Date:** 2026-04-24

---

## Overview
- **Technical summary:** Replace the hello world frontend UI with a contact form component. Add a `POST /api/contact` endpoint to the API that validates the submission and sends an email. Email delivery uses `nodemailer` with a transport selected by environment variable: SMTP for production, a console/file logger for development. All email settings come from environment variables.
- **Key constraints:** Email sending is synchronous within the request cycle (no queue). Dev mode requires no external mail server. No new infrastructure services; all changes are in existing modules.
- **Core design principle:** Keep the implementation simple and layered: thin HTTP controller, clear domain validation, isolated mailer adapter. Use existing module structure and conventions without adding ceremony.

---

## Repository Alignment
- **Relevant repository guidance used during design:**
  - `CLAUDE.md` defines the four module boundaries explicitly — this feature touches `contact-api`, `contact-frontend`, and `contact-ops`; nginx requires no changes.
  - Backend must use a hexagonal-architecture-inspired structure: HTTP concerns stay in controllers, business rules stay in domain, infrastructure concerns in infra.
  - Frontend uses MUI and React; keep components simple and followable.
  - Environment variables must be centralized in a config module; no scattered `process.env` reads.
  - No env config exposed to the browser.
- **Important architectural or organizational constraints from agent-facing instructions:**
  - Do not introduce abstraction layers that have no real purpose. Use domain/infra split only where it improves clarity — the mailer is a genuine infra concern.
  - The backend never trusts frontend validation alone.
  - Internal errors must not be surfaced to the user.
- **Local conventions or preferred patterns that materially shape the solution:**
  - `contact-api`: CommonJS (`require`/`module.exports`), single `config.js` at `src/config.js`, controllers in `src/controllers/`, tests in `src/__tests__/` using Jest + Supertest.
  - `contact-frontend`: ES modules, Vite + React 18 + MUI v6, Vitest + Testing Library, config in `src/config.js`.
  - `contact-ops`: single `docker-compose.yml`, `.env.example` documents all env vars.

---

## Architecture
- **Main components / units:**
  - `contact-api/src/controllers/contact.controller.js` — handles `POST /api/contact`, calls domain validation and mailer, returns responses.
  - `contact-api/src/domain/contact.js` — pure validation logic: validates name, email, message; returns a structured errors object.
  - `contact-api/src/infra/mailer.js` — creates and exports a mailer factory; selects transport (SMTP or dev) from config; exposes a single `sendContactEmail(submission)` function.
  - `contact-api/src/config.js` — extended with all email-related settings.
  - `contact-frontend/src/App.jsx` — replaced with the contact form UI (or delegates to a `ContactForm` component); handles form state, validation, submission, and result display.
- **Responsibility split:**
  - Controller: parse request, call domain, call mailer, map to HTTP response. No business logic.
  - Domain: stateless validation rules only. No HTTP, no I/O.
  - Mailer infra: transport creation and email sending. No business logic.
  - Frontend: controlled form state, client-side validation mirroring backend rules, API call, result rendering.
- **System boundaries:**
  - Frontend → nginx → API (`POST /api/contact`).
  - API → nodemailer → SMTP server (production) or console/file (development).
  - nginx configuration is unchanged; `/api/` already proxies to the API.

---

## Flow
- **End-to-end technical flow:**
  1. User fills in the form; frontend validates on submit.
  2. If frontend validation fails, errors are shown inline; no request is made.
  3. If valid, frontend sends `POST /api/contact` with `{ name, email, message }`.
  4. Controller calls domain validator; if invalid, returns `422` with structured field errors.
  5. Controller calls `mailer.sendContactEmail(submission)`; on failure, returns `500` with a generic message.
  6. On success, controller returns `200 { success: true }`.
  7. Frontend receives response: success → show success alert, reset form; 422 → show field errors; 500 / network error → show generic error alert.
- **Key processing steps:**
  - Domain validation runs before any I/O.
  - Mailer errors are caught in the controller; the original error is logged server-side but never forwarded to the client.
  - Dev transport logs the full email payload to stdout (or a file if `EMAIL_LOG_FILE` is set) and resolves successfully.

---

## Interfaces
- **External APIs / contracts:**
  - `POST /api/contact`
    - Request body: `{ name: string, email: string, message: string }`
    - `200`: `{ success: true }`
    - `422`: `{ errors: { name?: string, email?: string, message?: string } }`
    - `500`: `{ error: 'Failed to send message' }`
- **Key internal interfaces (if relevant):**
  - `domain/contact.js` exports `validateContact(body)` → `{ valid: boolean, errors: object }`.
  - `infra/mailer.js` exports `sendContactEmail({ name, email, message })` → Promise. Rejects on send failure.

---

## Data & Validation
- **Core data structures (high-level):**
  - Submission payload: `{ name: string, email: string, message: string }`
  - Validation errors: `{ name?: string, email?: string, message?: string }` — one error string per failing field.
- **Validation rules (applied on both frontend and backend):**
  - `name`: required (non-empty after trim), max 200 characters.
  - `email`: required, must match a standard email format.
  - `message`: required (at least 1 non-whitespace character), max 2000 characters.
- **Error model:**
  - `422` is returned when any field fails backend validation; the `errors` object contains only the failing fields.
  - `500` is returned on email send failure; the body contains only a generic `error` string.
  - Frontend displays field-level errors from `422` responses inline, and a generic alert for `500` or network errors.

---

## Frontend / Backend Notes
- **Key frontend behavior:**
  - `App.jsx` is replaced with the contact form. The hello world fetch is removed.
  - Form state: controlled inputs for name, email, message; separate error state per field; submission loading flag; top-level success/error state.
  - Validation is run on submit, not on every keystroke, to keep the UX simple.
  - On success: display a MUI `Alert severity="success"` at the top of the form; reset all fields and clear errors.
  - On error: display a MUI `Alert severity="error"` at the top; keep form values so the user can retry.
  - The submit button is disabled while a request is in flight.
- **Backend responsibilities / orchestration:**
  - `app.js` is extended with `express.json()` middleware and the new contact route (`POST /api/contact`).
  - `config.js` is extended with email settings: `emailTransport`, `smtpHost`, `smtpPort`, `smtpSecure`, `smtpUser`, `smtpPass`, `contactFromEmail`, `contactToEmail`, `emailLogFile`.
  - `EMAIL_TRANSPORT` controls the active transport: `smtp` uses nodemailer SMTP; `console` (default for dev) logs via `nodemailer`'s `jsonTransport` + `console.log`; `file` writes to `EMAIL_LOG_FILE`.

---

## Testing Notes
- **Integration testing expectations:**
  - Backend: Supertest integration test for `POST /api/contact` covering: valid submission (mock mailer), validation failure per field, mailer failure → 500. The mailer infra is injected or mocked at the module level.
  - Frontend: Vitest + Testing Library tests for: form renders correctly, submit with empty fields shows errors, successful submission shows alert and resets form, API error shows error alert.
- **Manual testing considerations:**
  - Verify the full flow with `docker compose up` — submit a valid form in the browser and confirm the email appears in the console log of the api container.
  - Verify inline errors appear on the frontend for each invalid field.
- **Performance / load testing considerations:** Not applicable for this feature scope.
- **Known risk areas requiring validation:**
  - Nodemailer SMTP errors may leak SMTP config details in their error messages — must confirm the controller catches and drops the original error before responding.
  - Vite build strips `VITE_`-prefixed env vars into the bundle; confirm no SMTP or recipient config is accidentally exposed.

---

## Risks & Trade-offs
- **Major risks:**
  - SMTP errors could expose configuration details if not caught carefully. Mitigated by catching in controller and logging server-side only.
  - Frontend validation duplication — frontend and backend share the same rules but in separate implementations. Acceptable given the small rule set and project scope.
- **Important decisions:**
  - **Nodemailer selected** over alternatives: standard, well-documented, supports both SMTP and custom transports with no extra infrastructure.
  - **Dev transport is console/file via jsonTransport** rather than a local SMTP server (e.g. MailHog): simpler setup, no additional Docker service, matches PRD intent.
  - **Synchronous email send** (no background job): keeps the implementation simple; acceptable per PRD.
  - **Reply-To header set to submitted email**: low cost, useful convenience for the site owner; included as standard behavior.

---

## Notes
- **Assumptions:**
  - `nodemailer` will be added to `contact-api` dependencies.
  - The hello world `GET /api/hello` endpoint and its test remain in place; only the frontend UI is replaced.
  - `EMAIL_TRANSPORT` defaults to `console` when not set, so the dev environment works without any additional configuration.
- **Non-goals:** Database persistence, attachment support, multiple recipients, background delivery queue.
- **Deferred decisions:** None.

---

## Out of Scope
- Authentication or authorization.
- Storing submissions.
- Background job queue for email delivery.
- MailHog or other local SMTP container.
- Rate limiting (stretch idea in PRD, deferred).
- CAPTCHA or spam protection (stretch idea in PRD, deferred).

---

## Updates

Append-only list of **Specification Updates** added after the baseline Technical Concept reaches `ready`.

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
