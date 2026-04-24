# Implementation Plan

## Header
- **Title:** Contact Form
- **Status:** `in progress`
- **Date:** 2026-04-24

---

## Objective
- **What is being delivered:** A working contact form — name, email, and message fields — that validates input on both frontend and backend, sends an email to a configured recipient via nodemailer, and provides clear success and error feedback to the user. Dev mode routes email to console or file with no SMTP server required.
- **Key constraints:** Email sending is synchronous in the request cycle. No new Docker services. Existing module structure and conventions apply throughout. The hello world endpoint and its tests are kept as-is.

---

## Slices

- **Slice 1: API — contact submission endpoint**
  - **Goal:** Add `POST /api/contact` to `contact-api`. Includes: nodemailer dependency, config extension with email settings, domain validation module, mailer infra with console/file/SMTP transport selection, contact controller, app wiring (express.json middleware + route), and tests (unit for domain validation, integration for the endpoint).
  - **Status:** `done`

- **Slice 2: Frontend — contact form UI**
  - **Goal:** Replace the hello world UI in `contact-frontend` with the contact form. Includes: controlled form inputs for name, email, and message; client-side validation mirroring backend rules; API call to `POST /api/contact`; success alert at top with form reset; inline field errors for validation failures; generic error alert for system errors; and component tests.
  - **Status:** `in progress`

- **Slice 3: Ops wiring & end-to-end smoke test**
  - **Goal:** Extend `contact-ops` docker-compose.yml and `.env.example` with email environment variables for the api service. Verify the full flow works with `docker compose up` — submit the form in a browser and confirm the email payload appears in the api container logs.
  - **Status:** `draft`

---

## Execution Order

- Slice 1: API — contact submission endpoint (`done`)
  - [x] Add `nodemailer` to `contact-api/package.json` dependencies
  - [x] Extend `contact-api/src/config.js` with email settings: `emailTransport`, `smtpHost`, `smtpPort`, `smtpSecure`, `smtpUser`, `smtpPass`, `contactFromEmail`, `contactToEmail`, `emailLogFile`
  - [x] Create `contact-api/src/domain/contact.js` — `validateContact(body)` returning `{ valid, errors }`
  - [x] Create `contact-api/src/infra/mailer.js` — `sendContactEmail(submission)` selecting transport from config (console / file / smtp)
  - [x] Create `contact-api/src/controllers/contact.controller.js` — thin HTTP handler
  - [x] Update `contact-api/src/app.js` — add `express.json()` middleware and wire `POST /api/contact`
  - [x] Add unit tests for domain validation in `contact-api/src/__tests__/contact.domain.test.js`
  - [x] Add integration tests for `POST /api/contact` in `contact-api/src/__tests__/contact.test.js` — mailer mocked via `jest.mock`
- Slice 2: Frontend — contact form UI (`in progress`)
  - [x] Replace `contact-frontend/src/App.jsx` with the contact form — controlled inputs for name, email, and message; local field error state; submit handler with client-side validation mirroring backend rules
  - [x] Add API integration to `App.jsx` — `POST /api/contact` via `config.apiBaseUrl`; success alert at top + form reset; inline field errors from 422 responses; generic error alert from 500/network errors; submit button disabled while in flight
  - [ ] Replace `contact-frontend/src/__tests__/App.test.jsx` with component tests — form renders all three fields, empty submit shows inline errors, valid submit shows success alert and resets form, API error shows generic error alert
- Slice 3: Ops wiring & end-to-end smoke test (`draft`)

---

## Important Decisions

- Integration tests mock the mailer module (`jest.mock('../infra/mailer')`) so the test suite has no transport dependency and no real emails are sent during CI.
- `App.jsx` fully replaces the hello world fetch — the `GET /api/hello` endpoint remains in the API but the frontend no longer uses it.

---

## Relevant Files

- `contact-frontend/src/App.jsx` — replace with contact form UI
- `contact-frontend/src/__tests__/App.test.jsx` — update for new UI
- `contact-frontend/package.json` — no new deps expected
- `contact-api/src/domain/contact.js` — validation rules to mirror on the frontend
- `contact-ops/docker-compose.yml` — add email env vars to api service (Slice 3)
- `contact-ops/.env.example` — document email env vars (Slice 3)

---

## Notes
- Each slice is sized for a focused single-session execution.
- Slice 3 is intentionally small — its value is the end-to-end verification step.
- Fresh sessions should begin with `pick up feature` unless the active feature is already unambiguous.
