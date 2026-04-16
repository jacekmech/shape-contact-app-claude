# Contact Form — Technical Concept

## Header
- **Title:** Contact Form — Technical Concept
- **Status:** `ready`
- **Date:** 2026-04-16

---

## Overview
- **Technical summary:** Extends the existing hello world scaffold into a working contact form. `contact-api` gains a `POST /api/contact` endpoint with backend validation and nodemailer-based SMTP email delivery. `contact-frontend` gains a form component with client-side validation, three terminal states (field error / success / server error), and a POST to the API. `contact-ops` adds Mailhog as a dev email service. `contact-middleware-nginx` requires no changes — existing routing covers the new endpoint automatically.
- **Key constraints:** Backend validation is authoritative. Field validation errors keep the form active; success and server errors replace the form (no resubmit without refresh). All SMTP config has working defaults pointing at the local Mailhog service.
- **Core design principle:** Extend what exists without replacing it. The hello world endpoint stays. The new domain and infra modules are added alongside, not as replacements.

---

## Repository Alignment
- **Relevant repository guidance used during design:** CLAUDE.md — hexagonal-inspired backend structure (`controllers`, `domain`, `infra`); centralised config; MUI-based frontend; Docker Compose orchestration from `contact-ops`; nginx routes `/api/*` to the backend without prefix stripping.
- **Important architectural or organizational constraints from agent-facing instructions:** Keep HTTP concerns in controllers. Keep business rules in domain. Keep infrastructure adapters in infra. Do not force abstraction layers that add ceremony without improving clarity. Config module is the only place env vars are read.
- **Local conventions or preferred patterns that materially shape the solution:** JS with semicolons, single quotes, `const` by default. CommonJS in `contact-api`. ES modules in `contact-frontend`. Each module owns its ESLint/Prettier config. Tests proportional to the logic being tested.

---

## Architecture

- **Main components / units:**
  - `contact-api/src/controllers/contactController.js` — HTTP layer for `POST /api/contact`.
  - `contact-api/src/domain/contact.js` — validation rules (pure functions, no I/O). This is the first real use of the `domain/` placeholder.
  - `contact-api/src/infra/mailer.js` — nodemailer SMTP adapter. Creates and exports a `sendContactEmail(data)` function.
  - `contact-api/src/config.js` — extended with SMTP and email address config.
  - `contact-frontend/src/components/ContactForm.jsx` — form component with field state, validation, submission, and all three terminal states.
  - `contact-frontend/src/App.jsx` — updated to render `ContactForm` instead of the hello world fetch.
  - `contact-ops/docker-compose.yml` — extended with a `contact-mailhog` service.

- **Responsibility split:**
  - Controller: parse request body, call domain validation, call mailer, return response.
  - Domain: validate name/email/message, return errors map or null.
  - Infra/mailer: create nodemailer transport from config, send email, surface transport errors.
  - Config: single source for all env vars including SMTP settings.
  - ContactForm: own form state, client-side validation, submission lifecycle, terminal state rendering.

- **System boundaries:**
  - Browser → nginx → contact-api: `POST /api/contact` with JSON body.
  - contact-api → Mailhog (dev) or external SMTP (other envs): SMTP on port 1025 / configurable.
  - contact-api → contact-mailhog: internal Docker network, no exposed SMTP port needed externally.
  - Mailhog web UI: exposed on `http://localhost:8025` for manual dev verification.

---

## Flow

- **End-to-end technical flow:**
  1. User fills in name, email, message and clicks Submit.
  2. Frontend validates fields; if invalid, sets inline errors, does not submit.
  3. Frontend POSTs `{ name, email, message }` as JSON to `/api/contact`, sets status to `submitting`.
  4. nginx forwards request to `contact-api`.
  5. Controller parses body, calls `domain/contact.validate(data)`.
  6. If validation fails → 422 response with `{ success: false, errors: { field: message } }`.
  7. If validation passes → controller calls `infra/mailer.sendContactEmail(data)`.
  8. Mailer sends email via SMTP to configured recipient; on success → 200 `{ success: true }`.
  9. Mailer throws → controller catches → 500 `{ success: false, error: 'Failed to send message' }`.
  10. Frontend receives response:
      - 200 → replace form with success confirmation.
      - 422 → set field errors, keep form active.
      - 5xx / network error → replace form with general error notice.

- **Key processing steps:**
  - Backend validation runs before any I/O.
  - Email send is the only I/O side-effect.
  - No state is mutated or persisted anywhere in the flow.

---

## Interfaces

- **External APIs / contracts:**
  - `POST /api/contact`
    - Request body: `{ name: string, email: string, message: string }` (JSON)
    - Success (200): `{ "success": true }`
    - Validation error (422): `{ "success": false, "errors": { "name"?: string, "email"?: string, "message"?: string } }`
    - Server error (500): `{ "success": false, "error": "Failed to send message" }`

- **Key internal interfaces (if relevant):**
  - `domain/contact.validate(data)` → returns `null` (valid) or `{ field: errorMessage }` map.
  - `infra/mailer.sendContactEmail({ name, email, message })` → returns a Promise; throws on SMTP failure.
  - `config.js` exports extended object: `{ smtp: { host, port, secure, user, pass }, email: { from, to }, ... }`.

---

## Data & Validation

- **Core data structures (high-level):**
  - Request body: `{ name: string, email: string, message: string }`.
  - Validation errors map: `{ [field]: string }` — only fields with errors are included.
  - API success response: `{ success: true }`.
  - API error response: `{ success: false, errors?: object, error?: string }`.

- **Validation rules:**
  - `name`: required, non-empty after trimming whitespace.
  - `email`: required, non-empty, must match a standard email format (simple regex — no external library needed).
  - `message`: required, non-empty after trimming whitespace.
  - Rules live in `domain/contact.js` only — not duplicated in the controller.
  - Frontend applies the same logical rules for UX, but independently (not shared code).

- **Error model:**
  - 422 for field validation failures — response includes `errors` map with per-field messages.
  - 500 for SMTP/delivery failures — response includes generic `error` string; no internal detail exposed.
  - Frontend distinguishes: 422 → field errors inline; 5xx or network error → replace form with error state.

---

## Frontend / Backend Notes

- **Key frontend behavior:**
  - `ContactForm` component owns all state: `values` (field values), `errors` (field-level), `status` (`'idle' | 'submitting' | 'success' | 'error'`).
  - On submit: run client-side validation; if errors, set `errors` state and stop. If clean, set `status = 'submitting'` and POST.
  - On 200: set `status = 'success'` → render confirmation in place of the form.
  - On 422: parse `errors` from response body, set `errors` state, reset `status` to `'idle'` → form stays active.
  - On 5xx / network error: set `status = 'error'` → render error notice in place of the form.
  - Submit button: disabled when `status === 'submitting'`.
  - `App.jsx` is updated to render `ContactForm` directly, replacing the hello world fetch component.

- **Backend responsibilities / orchestration:**
  - Controller is thin: parse, validate, send, respond.
  - Validation logic lives entirely in `domain/contact.js`.
  - SMTP transport is created once at module load in `infra/mailer.js` using config values.
  - Controller does not know about nodemailer — it only calls `sendContactEmail`.

---

## Testing Notes

- **Integration testing expectations:**
  - Backend: unit tests for `domain/contact.js` — covers all validation cases (missing fields, invalid email, valid input).
  - Backend: integration tests for `POST /api/contact` via Supertest — valid submission (mock mailer), 422 on invalid input, 500 on mailer failure (mock mailer throw).
  - Frontend: component tests for `ContactForm` — renders fields; shows field errors on invalid submit; shows success state after 200; shows error state after network/5xx error; shows inline errors after 422; submit disabled during submission.

- **Manual testing considerations:**
  - Submit a valid form via `http://localhost`, open Mailhog at `http://localhost:8025`, confirm the email was received with correct name, email, and message.
  - Submit with empty fields and confirm inline errors appear without a network request.
  - Stop the API container, submit, confirm the error state appears.

- **Performance / load testing considerations:** None.

- **Known risk areas requiring validation:**
  - Mailhog container must be healthy before `contact-api` attempts to connect on startup. Docker Compose `depends_on` with a health check or simple retry in the mailer would mitigate cold-start failures.
  - nodemailer SMTP connection errors at send time must be caught and converted to a 500 — not allowed to propagate as unhandled exceptions.

---

## Risks & Trade-offs

- **Major risks:**
  - **SMTP cold-start (known limitation):** if a form submission arrives before Mailhog has fully started, the send will fail and the user will see the server error state. This is acceptable for a local demo. No retry logic is in scope. Starting Docker Compose and waiting a few seconds before submitting avoids the issue in practice.
  - nodemailer version: nodemailer v6 is the current stable; v7 may have breaking changes if npm resolves unexpectedly.

- **Important decisions:**
  - **Mailhog** chosen as dev email server — Docker image `mailhog/mailhog`, SMTP on 1025, web UI on 8025. Provides a browser-accessible inbox for manual verification without any configuration.
  - **No shared validation code** between frontend and backend — each layer validates independently for the right reason (UX vs correctness). The rules are simple enough that duplication is not a maintenance risk.
  - **nodemailer** chosen for SMTP — standard Node.js email library, no provider lock-in, straightforward SMTP transport config.
  - **Inline email validation via regex** — no external validator library added; keeps deps minimal.
  - **`App.jsx` replaces the hello world component** — the hello world fetch is removed in this feature. The scaffold has served its purpose.

---

## Notes

- **Assumptions:**
  - Docker Compose runs with the `contact-mailhog` service added — no other local SMTP setup needed.
  - `contact-middleware-nginx` nginx config is unchanged — `/api/` already routes to the backend.
  - The hello world `GET /api/hello` endpoint remains in the codebase; it is not removed.

- **Non-goals:**
  - Email template HTML — plain text email is sufficient.
  - SMTP authentication in dev — Mailhog accepts unauthenticated connections.
  - Retry logic, queuing, or async delivery.

- **Deferred decisions:**
  - Production SMTP provider — out of scope; env vars are the extension point.

---

## Out of Scope
- Persistence of contact submissions.
- Email templates or HTML email.
- Anti-spam or rate limiting.
- Production SMTP configuration.
- The hello world endpoint is not removed.

---

## Updates

Append-only list of **Specification Updates** added after the baseline Technical Concept reaches `ready`.

Only Updates with status `ready` are considered effective.
