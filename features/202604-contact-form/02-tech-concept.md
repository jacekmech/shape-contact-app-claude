# Technical Concept: Contact Form

## Header
- **Title:** Contact Form
- **Status:** `ready`
- **Date:** `2026-04-23`

---

## Overview
- **Technical summary:** Replace the hello-world placeholder with a contact form. The frontend renders a 3-field MUI form; the backend exposes `POST /api/contact`, validates the submission, and sends an email via a transport selected at runtime. In development the transport logs to the console; in production it uses SMTP.
- **Key constraints:** No persistence, no auth. Email configuration must come entirely from environment variables. Console transport must work without any external service.
- **Core design principle:** Keep the transport boundary clean so the send mechanism is swappable without touching the controller or domain code.

---

## Repository Alignment
- **Relevant repository guidance used during design:**
  - CLAUDE.md mandates a hexagonal-architecture-inspired backend: HTTP concerns near controllers, business rules separate from transport, infrastructure adapters separate from domain logic.
  - Frontend must use MUI and a typical small-app React structure.
  - Environment variables must be centralised in a config module per module; no scattered `process.env` reads.
  - Frontend-safe variables only via `import.meta.env`; backend variables via `process.env`.
  - Testing: backend unit/integration tests with Jest + supertest; frontend component tests with Vitest + RTL.
- **Important architectural or organizational constraints from agent-facing instructions:**
  - `contact-api` folders: `controllers`, `domain`, `infra`, `lib` where useful — apply pragmatically.
  - Do not introduce layers that have no real purpose.
  - Keep modules independently understandable.
- **Local conventions or preferred patterns that materially shape the solution:**
  - Single quotes, semicolons, trailing commas, `const` by default.
  - One default export pattern per file.
  - Existing `src/config.js` pattern in both modules already established — extend, not replace.

---

## Architecture

- **Main components / units:**
  - `contact-frontend`: `ContactForm` component (replaces `HelloMessage` as the app's main content)
  - `contact-api`: `POST /api/contact` route → `contactController` → `contactService` (validation) → `mailer` (send)
  - `contact-api`: `mailer.js` in `src/infra/` — factory that returns console or SMTP transport
  - `contact-ops`: extended Docker Compose env wiring for email config
  - `contact-middleware-nginx`: no changes needed; `/api/*` routing already correct

- **Responsibility split:**
  - Controller: parse request, call service, map result to HTTP response.
  - Domain service (`contactService`): run validation rules, call mailer, return result.
  - Infra mailer: construct and send (or log) the email; hide transport details from the domain.
  - Frontend `ContactForm`: manage field state, run client-side validation, call API, render all three states (idle, success, error).

- **System boundaries:**
  - Frontend ↔ Backend: JSON over HTTP (`POST /api/contact`).
  - Backend ↔ Mail: nodemailer abstraction; production uses SMTP, dev uses console logging.

---

## Flow

- **End-to-end technical flow:**
  1. User fills form and submits.
  2. `ContactForm` runs client-side validation; shows field errors and stops if invalid.
  3. `ContactForm` calls `POST /api/contact` with `{ name, email, message }`.
  4. `contactController` receives the request and delegates to `contactService`.
  5. `contactService` validates the payload; returns validation errors if invalid.
  6. On valid payload, `contactService` calls `mailer.send(...)`.
  7. Mailer sends via SMTP or logs to console based on `EMAIL_TRANSPORT` config.
  8. Controller returns `200 { success: true }` or appropriate error response.
  9. `ContactForm` renders success banner and resets fields, or shows error message.

- **Key processing steps:**
  - Validation runs in both frontend (UX) and backend (authoritative).
  - Mailer is selected once at module load time based on config; no conditional branching in business code.
  - Reply-To is set to the submitter's email address for easy reply workflow.

---

## Interfaces

- **External APIs / contracts:**

  `POST /api/contact`

  Request body:
  ```json
  { "name": "string", "email": "string", "message": "string" }
  ```

  Success (`200`):
  ```json
  { "success": true }
  ```

  Validation error (`422`):
  ```json
  {
    "success": false,
    "errors": {
      "name": "Name is required.",
      "email": "A valid email address is required.",
      "message": "Message is required."
    }
  }
  ```

  Server error (`500`):
  ```json
  { "success": false, "message": "Failed to send message. Please try again later." }
  ```

- **Key internal interfaces (if relevant):**
  - `mailer.send({ name, email, message })` → Promise — called by `contactService`; resolves on success, rejects on failure.

---

## Data & Validation

- **Core data structures (high-level):**
  - Submission payload: `{ name: string, email: string, message: string }` — no persistence, processed in memory only.

- **Validation rules (both layers):**
  - `name`: required, non-empty string.
  - `email`: required, matches basic email format (`x@y.z`).
  - `message`: required, non-empty string.

- **Error model:**
  - Validation errors: `422` with a field-keyed `errors` object; only fields that fail are included.
  - Send failure: `500` with a generic user-facing `message`; internal error logged server-side, not exposed to client.

---

## Frontend / Backend Notes

- **Key frontend behavior:**
  - `ContactForm` component manages its own field state and submission state.
  - Client-side validation runs on submit (not on blur) to keep interaction lightweight.
  - On success: show a MUI `Alert` (success severity) above the form; reset all fields.
  - On validation error: show field-level `helperText` on each `TextField`.
  - On server error: show a MUI `Alert` (error severity) above the form.
  - Submit button is disabled while the request is in-flight.
  - `App.jsx` is updated to render `ContactForm` in place of `HelloMessage`.

- **Backend responsibilities / orchestration:**
  - `src/config.js` extended with: `contactRecipient`, `emailTransport`, `smtpHost`, `smtpPort`, `smtpUser`, `smtpPass`, `smtpFrom`.
  - `src/controllers/contactController.js` — handles `POST /api/contact`.
  - `src/domain/contactService.js` — validation logic and mailer invocation.
  - `src/infra/mailer.js` — factory: if `config.emailTransport === 'console'`, returns a console logger; otherwise returns a nodemailer SMTP transporter.
  - Route mounted in `src/app.js` under `/api/contact`.

---

## Testing Notes

- **Integration testing expectations:**
  - Backend: supertest integration test for `POST /api/contact` — valid payload returns `200`, missing fields return `422`, mailer failure returns `500`. Mailer is stubbed in tests.
  - Frontend: RTL component test for `ContactForm` — success path (mock fetch resolves), validation error path (mock fetch returns 422), server error path (mock fetch returns 500).

- **Manual testing considerations:**
  - Run the stack with `docker compose up` from `contact-ops`; verify console shows email log on form submit.
  - Verify field-level errors appear for empty/invalid inputs.
  - Verify success message appears and fields reset on valid submission.

- **Performance / load testing considerations:** N/A for this scope.

- **Known risk areas requiring validation:**
  - nodemailer SMTP config correctness can only be verified against a real SMTP server; keep console transport as the default for local dev to avoid this dependency during development.

---

## Risks & Trade-offs

- **Major risks:**
  - SMTP configuration errors will only surface at runtime when `EMAIL_TRANSPORT=smtp`. Console transport insulates local development from this risk entirely.

- **Important decisions:**
  - Transport selected at config read time (module initialisation) rather than per-request — simpler, no branching in business code.
  - Reply-To set to the submitter's email address — low-effort, high utility for the recipient.
  - `HelloMessage` component is retired; `App.jsx` renders `ContactForm` directly. The hello endpoint (`GET /api/hello`) is left in place as it does not interfere.

---

## Notes

- **Assumptions:**
  - nodemailer is the email library; no alternative libraries evaluated — it is the clear standard for Node.js SMTP.
  - `EMAIL_TRANSPORT=console` is the default in Docker Compose dev setup.
  - A single `From` address (configured via `SMTP_FROM`) is used for all outgoing mail.

- **Non-goals:**
  - Queuing, retries, or async email delivery.
  - Input sanitisation beyond what validation already enforces (no HTML rendering of submitted content).

- **Deferred decisions:** None.

---

## Out of Scope
- Authentication, authorization
- File attachments
- Email delivery tracking
- Rate limiting beyond basic demo-level
- Database persistence
- Multiple recipients

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
