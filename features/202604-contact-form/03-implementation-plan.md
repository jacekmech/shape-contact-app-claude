# Implementation Plan: Contact Form

## Header
- **Title:** Contact Form
- **Status:** `in progress`
- **Date:** `2026-04-23`

---

## Objective
- **What is being delivered:** A working contact form across the full stack — React frontend with MUI form, backend `POST /api/contact` endpoint with authoritative validation, and an email send via a transport-abstracted mailer (console in dev, SMTP in production). Email config is fully env-driven. The existing hello-world endpoint is left in place.
- **Key constraints:** No persistence. No auth. Console transport used by default in local dev. Email server details come entirely from environment variables.

---

## Slices

- [x] Slice 1 — contact-api: contact endpoint, validation, mailer infra, tests
- [x] Slice 2 — contact-frontend: ContactForm component, App.jsx update, component tests
- [ ] Slice 3 — Stack wiring: Docker Compose env extension, smoke verification

---

## Execution Order

- [x] Slice 1 — contact-api
  - [x] Extend `src/config.js` with email config vars: `contactRecipient`, `emailTransport`, `smtpHost`, `smtpPort`, `smtpUser`, `smtpPass`, `smtpFrom`
  - [x] Add `nodemailer` to `contact-api` dependencies
  - [x] Create `src/infra/mailer.js` — factory: console transport logs formatted email to stdout; SMTP transport uses nodemailer. Export `send({ name, email, message })`
  - [x] Create `src/domain/contactService.js` — validate `name`, `email`, `message`; call `mailer.send()`; return structured result
  - [x] Create `src/controllers/contactController.js` — parse request body, call `contactService`, map result to `200 / 422 / 500`
  - [x] Mount `POST /api/contact` in `src/app.js`; add `express.json()` middleware if not already present
  - [x] Write integration tests in `src/__tests__/contact.test.js` — valid payload → 200, missing/invalid fields → 422 with field errors, mailer failure → 500; stub mailer via `jest.mock`
  - [x] Verify `npm test` passes and `node src/server.js` responds correctly to a manual POST

- [x] Slice 2 — contact-frontend
  - [x] Create `src/components/ContactForm.jsx` — MUI form with name, email, message fields; client-side validation on submit; calls `POST /api/contact`; success Alert + field reset on 200; field-level helperText on 422; error Alert on 500; submit disabled while in-flight
  - [x] Update `src/App.jsx` to render `ContactForm` in place of `HelloMessage`
  - [x] Write component tests in `src/__tests__/ContactForm.test.jsx` — success (200), field errors (422), server error (500); use `vi.stubGlobal('fetch', ...)` and `fireEvent`
  - [x] Verify `npm test` passes

- [ ] Slice 3 — Stack wiring
  - [ ] Extend `contact-api` service in `docker-compose.yml` with email env vars: `CONTACT_RECIPIENT`, `EMAIL_TRANSPORT` (default `console`), `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
  - [ ] Update `contact-ops/.env.example` to document all new email config vars with comments
  - [ ] Smoke verify: `docker compose up` from `contact-ops`, submit the form, confirm API console shows email output

---

## Important Decisions

- Console transport is the default for local dev; no external mail service required during development.
- Reply-To is set to the submitter's email address.
- `GET /api/hello` and `HelloMessage` component are left in place; not retired by this feature.
- Transport selected once at module load time (not per-request) to keep business code free of branching.
- Mailer is stubbed in tests via `jest.mock('src/infra/mailer')` — no dependency injection in production code.
- Frontend tests use `fireEvent` (already in `@testing-library/react`) rather than `@testing-library/user-event` which is not in the dependencies.

---

## Relevant Files

- `contact-api/src/config.js` — email config vars (done)
- `contact-api/src/infra/mailer.js` — console and SMTP transports (done)
- `contact-api/src/domain/contactService.js` — validation and mailer call (done)
- `contact-api/src/controllers/contactController.js` — HTTP handler (done)
- `contact-api/src/app.js` — POST /api/contact mounted (done)
- `contact-frontend/src/App.jsx` — renders ContactForm (done)
- `contact-frontend/src/components/ContactForm.jsx` — MUI form, validation, success/error states (done)
- `contact-ops/docker-compose.yml` — extend with email env vars
- `contact-ops/.env.example` — document new vars
- `contact-middleware-nginx/nginx.conf` — no changes expected

---

## Notes
- Next step: `implement batch` for Slice 3.
