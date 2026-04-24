# Implementation Plan

## Header
- **Title:** Contact Form
- **Status:** `ready`
- **Date:** 2026-04-24

---

## Objective
- **What is being delivered:** A working contact form — name, email, and message fields — that validates input on both frontend and backend, sends an email to a configured recipient via nodemailer, and provides clear success and error feedback to the user. Dev mode routes email to console or file with no SMTP server required.
- **Key constraints:** Email sending is synchronous in the request cycle. No new Docker services. Existing module structure and conventions apply throughout. The hello world endpoint and its tests are kept as-is.

---

## Slices

- **Slice 1: API — contact submission endpoint**
  - **Goal:** Add `POST /api/contact` to `contact-api`. Includes: nodemailer dependency, config extension with email settings, domain validation module, mailer infra with console/file/SMTP transport selection, contact controller, app wiring (express.json middleware + route), and tests (unit for domain validation, integration for the endpoint).
  - **Status:** `draft`

- **Slice 2: Frontend — contact form UI**
  - **Goal:** Replace the hello world UI in `contact-frontend` with the contact form. Includes: controlled form inputs for name, email, and message; client-side validation mirroring backend rules; API call to `POST /api/contact`; success alert at top with form reset; inline field errors for validation failures; generic error alert for system errors; and component tests.
  - **Status:** `draft`

- **Slice 3: Ops wiring & end-to-end smoke test**
  - **Goal:** Extend `contact-ops` docker-compose.yml and `.env.example` with email environment variables for the api service. Verify the full flow works with `docker compose up` — submit the form in a browser and confirm the email payload appears in the api container logs.
  - **Status:** `draft`

---

## Execution Order

- Slice 1: API — contact submission endpoint (`draft`)
- Slice 2: Frontend — contact form UI (`draft`)
- Slice 3: Ops wiring & end-to-end smoke test (`draft`)

---

## Important Decisions

---

## Relevant Files

- `contact-api/src/app.js` — add express.json middleware and contact route
- `contact-api/src/config.js` — extend with email settings
- `contact-api/src/controllers/contact.controller.js` — new file
- `contact-api/src/domain/contact.js` — new file (validation)
- `contact-api/src/infra/mailer.js` — new file (transport factory)
- `contact-api/src/__tests__/contact.test.js` — new file
- `contact-api/package.json` — add nodemailer dependency
- `contact-frontend/src/App.jsx` — replaced with contact form
- `contact-frontend/src/__tests__/App.test.jsx` — updated for new UI
- `contact-ops/docker-compose.yml` — add email env vars to api service
- `contact-ops/.env.example` — document email env vars

---

## Notes
- Each slice is sized for a focused single-session execution.
- Slice 3 is intentionally small — its value is the end-to-end verification step.
- Fresh sessions should begin with `pick up feature` unless the active feature is already unambiguous.
