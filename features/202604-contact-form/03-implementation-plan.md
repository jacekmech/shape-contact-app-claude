# Contact Form — Implementation Plan

## Header
- **Title:** Contact Form — Implementation Plan
- **Status:** `ready`
- **Date:** 2026-04-16

---

## Objective
- **What is being delivered:** A working contact form that collects name, email, and message from a visitor, validates input on both frontend and backend, sends an email via SMTP (Mailhog in local dev), and returns clear success or error feedback to the user.
- **Key constraints:** Backend validation is authoritative. No persistence. All SMTP config defaults to local Mailhog. The hello world endpoint stays. `contact-middleware-nginx` is unchanged — existing routing already covers `/api/contact`.

---

## Slices

- [x] Slice 1 — Backend core
- [x] Slice 2 — Backend tests
- [x] Slice 3 — Frontend
- [ ] Slice 4 — Ops

---

## Execution Order

### Slice 1 — Backend core

Extend the backend with the domain validation module, mailer infra adapter, contact controller, and wired route. Extends config and env example with SMTP settings. Adds nodemailer as a runtime dependency.

- [x] Install `nodemailer@^6` as a runtime dependency in `contact-api` (`npm install nodemailer@^6`)
- [x] Extend `contact-api/src/config.js` with a `smtp` block (`host` → `SMTP_HOST` default `'localhost'`, `port` → `SMTP_PORT` default `1025`, `secure` → `SMTP_SECURE` default `false`, `user` → `SMTP_USER` default `''`, `pass` → `SMTP_PASS` default `''`) and an `email` block (`from` → `EMAIL_FROM` default `'contact@localhost'`, `to` → `EMAIL_TO` default `'owner@localhost'`)
- [x] Create `contact-api/src/domain/contact.js` — exports `validate(data)`; trims name and message before checking; returns `null` when all fields are valid, or an errors object `{ name?, email?, message? }` with messages: `'Name is required'`, `'Email is required'` / `'Invalid email address'`, `'Message is required'`
- [x] Create `contact-api/src/infra/` directory and `contact-api/src/infra/mailer.js` — creates nodemailer transport once at module load using `config.smtp`; exports `sendContactEmail({ name, email, message })` which sends a plain-text email to `config.email.to`; propagates SMTP errors as thrown exceptions
- [x] Create `contact-api/src/controllers/contactController.js` — exports `postContact(req, res)`; calls `domain/contact.validate`, returns `422 { success: false, errors }` on failure; calls `infra/mailer.sendContactEmail`, returns `200 { success: true }` on success or `500 { success: false, error: 'Failed to send message' }` on mailer throw
- [x] Wire `POST /api/contact` to `contactController.postContact` in `contact-api/src/app.js`
- [x] Update `contact-api/.env.example` — append documented entries for `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `EMAIL_TO` with Mailhog defaults

### Slice 2 — Backend tests

Add unit and integration test coverage for the backend contact flow.

- [x] Create `contact-api/tests/contact.domain.test.js` — unit tests for `src/domain/contact.js`; cases: missing name returns `errors.name`, whitespace-only name returns `errors.name` (trim check), missing email returns `errors.email`, invalid email format returns `errors.email`, missing message returns `errors.message`, whitespace-only message returns `errors.message` (trim check), all fields valid returns `null`, multiple invalid fields returns all errors in one object
- [x] Create `contact-api/tests/contact.api.test.js` — Supertest tests for `POST /api/contact`; mock `../src/infra/mailer` with `jest.mock`; cases: valid body + mailer resolves → 200 `{ success: true }`, all fields missing → 422 `{ success: false, errors }` with all three field keys present, invalid email only → 422 with `errors.email`, mailer throws → 500 `{ success: false, error: 'Failed to send message' }`

### Slice 3 — Frontend

Implement the ContactForm component with all three terminal states and replace the hello world component in App.jsx. Add component tests.

- [x] Create `contact-frontend/src/components/ContactForm.jsx` — state: `values` (`name/email/message`), `errors` (field-level object), `status` (`'idle'|'submitting'|'success'|'error'`); on submit: client-side validate (name non-empty, email format, message non-empty), set errors and abort if invalid; POST `JSON.stringify(values)` to `${config.apiBaseUrl}/api/contact`; on 200 set `status='success'` and render confirmation in place of form; on 422 parse `errors` from body, set field errors, reset `status='idle'`; on 5xx/network error set `status='error'` and render error notice; submit `Button` disabled when `status==='submitting'`; use MUI `Box`, `TextField` (with `error`/`helperText` props), `Button`, `Typography`
- [x] Update `contact-frontend/src/App.jsx` — remove hello world fetch logic, render `<ContactForm />` only; delete `contact-frontend/src/test/App.test.jsx` (tests hello world fetch behavior that no longer exists)
- [x] Create `contact-frontend/src/test/ContactForm.test.jsx` — use Vitest + `@testing-library/react` + `fireEvent`; mock `fetch` via `vi.stubGlobal`; cases: (1) renders name/email/message fields and submit button, (2) shows inline field errors when submitted empty (no fetch call), (3) replaces form with success confirmation after 200 response, (4) replaces form with error notice after network failure, (5) sets inline field errors and keeps form active after 422 response, (6) submit button disabled while `status==='submitting'`

### Slice 4 — Ops

Complete the local dev stack by adding Mailhog to Docker Compose and wiring SMTP environment variables to the contact-api service.

- [ ] Add `contact-mailhog` service to `contact-ops/docker-compose.yml` — image `mailhog/mailhog`; SMTP port 1025 internal only (`expose: ["1025"]`); web UI published to host (`ports: ["8025:8025"]`); no environment variables needed
- [ ] Update `contact-api` service in `docker-compose.yml` — add `depends_on: [contact-mailhog]`; extend `environment` block with `SMTP_HOST: contact-mailhog` (Docker service name, not localhost), `SMTP_PORT: 1025`, `SMTP_SECURE: "false"`, `SMTP_USER: ""`, `SMTP_PASS: ""`, `EMAIL_FROM: ${EMAIL_FROM:-contact@localhost}`, `EMAIL_TO: ${EMAIL_TO:-owner@localhost}`
- [ ] Update `contact-ops/.env.example` — append `EMAIL_FROM` and `EMAIL_TO` with default values and a note that SMTP vars are hardcoded in compose to point at the internal Mailhog service

---

## Important Decisions

- **Mailhog** chosen as local dev email server — no external SMTP required, browser-accessible inbox at `http://localhost:8025`. Acceptable cold-start race condition for a local demo.
- **No shared validation code** between frontend and backend — each layer validates independently.
- **`App.jsx` replaces the hello world component** — the hello world fetch is removed; the `GET /api/hello` endpoint stays.
- **nodemailer transport created once at module load** in `infra/mailer.js` — no per-request transport creation.

---

## Relevant Files

**Slice 4 — Ops**
```
contact-ops/docker-compose.yml                     update — add contact-mailhog, wire contact-api env
contact-ops/.env.example                           update — document EMAIL_FROM, EMAIL_TO overrides
```

---

## Notes
- Fresh sessions for Slice 2 onward should begin with `pick up feature`.
- Slices are intended to be independent and committed separately.
- nodemailer version: use v6 (`nodemailer@^6`) — v7 may have breaking changes.
