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

- [ ] Slice 1 — Backend core
- [ ] Slice 2 — Backend tests
- [ ] Slice 3 — Frontend
- [ ] Slice 4 — Ops

---

## Execution Order

### Slice 1 — Backend core

Extend the backend with the domain validation module, mailer infra adapter, contact controller, and wired route. Extends config and env example with SMTP settings. Adds nodemailer as a runtime dependency.

- [ ] Install `nodemailer@^6` as a runtime dependency in `contact-api` (`npm install nodemailer@^6`)
- [ ] Extend `contact-api/src/config.js` with a `smtp` block (`host` → `SMTP_HOST` default `'localhost'`, `port` → `SMTP_PORT` default `1025`, `secure` → `SMTP_SECURE` default `false`, `user` → `SMTP_USER` default `''`, `pass` → `SMTP_PASS` default `''`) and an `email` block (`from` → `EMAIL_FROM` default `'contact@localhost'`, `to` → `EMAIL_TO` default `'owner@localhost'`)
- [ ] Create `contact-api/src/domain/contact.js` — exports `validate(data)`; trims name and message before checking; returns `null` when all fields are valid, or an errors object `{ name?, email?, message? }` with messages: `'Name is required'`, `'Email is required'` / `'Invalid email address'`, `'Message is required'`
- [ ] Create `contact-api/src/infra/` directory and `contact-api/src/infra/mailer.js` — creates nodemailer transport once at module load using `config.smtp`; exports `sendContactEmail({ name, email, message })` which sends a plain-text email to `config.email.to`; propagates SMTP errors as thrown exceptions
- [ ] Create `contact-api/src/controllers/contactController.js` — exports `postContact(req, res)`; calls `domain/contact.validate`, returns `422 { success: false, errors }` on failure; calls `infra/mailer.sendContactEmail`, returns `200 { success: true }` on success or `500 { success: false, error: 'Failed to send message' }` on mailer throw
- [ ] Wire `POST /api/contact` to `contactController.postContact` in `contact-api/src/app.js`
- [ ] Update `contact-api/.env.example` — append documented entries for `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `EMAIL_TO` with Mailhog defaults

### Slice 2 — Backend tests

Add unit and integration test coverage for the backend contact flow.

- [ ] Create `contact-api/tests/contact.domain.test.js` — unit tests for `domain/contact.js`: missing name, missing email, invalid email format, missing message, all fields valid
- [ ] Create `contact-api/tests/contact.api.test.js` — Supertest integration tests: valid submission (mock mailer returns success), 422 on invalid input, 500 on mailer throw

### Slice 3 — Frontend

Implement the ContactForm component with all three terminal states and replace the hello world component in App.jsx. Add component tests.

- [ ] Create `contact-frontend/src/components/ContactForm.jsx` — manages `values`, `errors`, `status` state; client-side validation; POST to `/api/contact`; renders field errors (idle), success confirmation, or server error notice based on status
- [ ] Update `contact-frontend/src/App.jsx` — replace hello world fetch with `<ContactForm />`
- [ ] Create `contact-frontend/src/test/ContactForm.test.jsx` — renders fields; shows inline errors on invalid submit; shows success state after 200; shows error state after 5xx/network error; shows inline errors after 422; submit disabled during submission

### Slice 4 — Ops

Complete the local dev stack by adding Mailhog to Docker Compose and wiring SMTP environment variables to the contact-api service.

- [ ] Add `contact-mailhog` service to `contact-ops/docker-compose.yml` (image `mailhog/mailhog`, SMTP on 1025 internal, web UI on 8025 exposed)
- [ ] Add `depends_on: contact-mailhog` to `contact-api` service in `docker-compose.yml`
- [ ] Wire SMTP env vars into `contact-api` service environment block in `docker-compose.yml` (defaults pointing at Mailhog)
- [ ] Update `contact-ops/.env.example` with Mailhog-related vars if any ops-level overrides are needed

---

## Important Decisions

- **Mailhog** chosen as local dev email server — no external SMTP required, browser-accessible inbox at `http://localhost:8025`. Acceptable cold-start race condition for a local demo.
- **No shared validation code** between frontend and backend — each layer validates independently.
- **`App.jsx` replaces the hello world component** — the hello world fetch is removed; the `GET /api/hello` endpoint stays.
- **nodemailer transport created once at module load** in `infra/mailer.js` — no per-request transport creation.

---

## Relevant Files

**Slice 1 — Backend core**
```
contact-api/package.json                           add nodemailer dep
contact-api/src/config.js                          extend with smtp + email blocks
contact-api/src/app.js                             wire POST /api/contact
contact-api/src/domain/contact.js                  create — validation rules (pure)
contact-api/src/infra/mailer.js                    create — nodemailer adapter
contact-api/src/controllers/contactController.js   create — HTTP layer
contact-api/src/controllers/helloController.js     read — follow existing pattern
contact-api/.env.example                           extend with SMTP + email vars
```

---

## Notes
- Fresh sessions for Slice 2 onward should begin with `pick up feature`.
- Slices are intended to be independent and committed separately.
- nodemailer version: use v6 (`nodemailer@^6`) — v7 may have breaking changes.
