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

- [ ] Slice 1 — contact-api: contact endpoint, validation, mailer infra, tests
- [ ] Slice 2 — contact-frontend: ContactForm component, App.jsx update, component tests
- [ ] Slice 3 — Stack wiring: Docker Compose env extension, smoke verification

---

## Execution Order

- [ ] Slice 1 — contact-api
  - [x] Extend `src/config.js` with email config vars: `contactRecipient`, `emailTransport`, `smtpHost`, `smtpPort`, `smtpUser`, `smtpPass`, `smtpFrom`
  - [x] Add `nodemailer` to `contact-api` dependencies
  - [x] Create `src/infra/mailer.js` — factory: console transport logs formatted email to stdout; SMTP transport uses nodemailer. Export `send({ name, email, message })`
  - [x] Create `src/domain/contactService.js` — validate `name`, `email`, `message`; call `mailer.send()`; return structured result
  - [x] Create `src/controllers/contactController.js` — parse request body, call `contactService`, map result to `200 / 422 / 500`
  - [x] Mount `POST /api/contact` in `src/app.js`; add `express.json()` middleware if not already present
  - [x] Write integration tests in `src/__tests__/contact.test.js` — valid payload → 200, missing/invalid fields → 422 with field errors, mailer failure → 500; stub mailer via `jest.mock`
  - [x] Verify `npm test` passes and `node src/server.js` responds correctly to a manual POST

- [ ] Slice 2 — contact-frontend
  - _Tasks to be defined during prepare-slice_

- [ ] Slice 3 — Stack wiring
  - _Tasks to be defined during prepare-slice_

---

## Important Decisions

- Console transport is the default for local dev; no external mail service required during development.
- Reply-To is set to the submitter's email address.
- `GET /api/hello` and `HelloMessage` component are left in place; not retired by this feature.
- Transport selected once at module load time (not per-request) to keep business code free of branching.
- Mailer is stubbed in tests via `jest.mock('src/infra/mailer')` — no dependency injection in production code.

---

## Relevant Files

- `contact-api/src/config.js` — extended with email config vars
- `contact-api/src/infra/mailer.js` — console and SMTP transports
- `contact-api/src/app.js` — mount contact route (upcoming)
- `contact-api/src/controllers/contactController.js` — new (upcoming)
- `contact-api/src/domain/contactService.js` — new (upcoming)
- `contact-frontend/src/App.jsx` — update to render ContactForm
- `contact-frontend/src/components/ContactForm.jsx` — new
- `contact-ops/docker-compose.yml` — extend with email env vars
- `contact-ops/.env.example` — document new vars

---

## Notes
- Next step: `implement batch` for Slice 1.
