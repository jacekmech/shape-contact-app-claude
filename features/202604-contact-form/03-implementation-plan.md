# Implementation Plan: Contact Form

## Header
- **Title:** Contact Form
- **Status:** `ready`
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
  - _Tasks to be defined during prepare-slice_

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

---

## Relevant Files

- `contact-api/src/config.js` — extend with email config vars
- `contact-api/src/app.js` — mount contact route
- `contact-api/src/controllers/contactController.js` — new
- `contact-api/src/domain/contactService.js` — new
- `contact-api/src/infra/mailer.js` — new
- `contact-frontend/src/App.jsx` — update to render ContactForm
- `contact-frontend/src/components/ContactForm.jsx` — new
- `contact-ops/docker-compose.yml` — extend with email env vars
- `contact-ops/.env.example` — document new vars

---

## Notes
- Next step: `prepare slice` for Slice 1.
