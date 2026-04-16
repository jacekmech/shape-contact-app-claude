# Contact Form

## Header
- **Title:** Contact Form
- **Status:** `ready`
- **Date:** 2026-04-16

---

## Goal
- **Problem:** Visitors to the app have no way to reach the owner. The app currently has no contact functionality — only the hello world scaffold.
- **User value:** A visitor can fill in their name, email address, and a message, submit the form, and know their message was received. The owner receives the message as an email.
- **Expected outcome:** A working contact form that accepts input, validates it, delivers it as an email to a preconfigured recipient address, and gives the user clear feedback on success or failure.

---

## Flow
- **Main flow (happy path):** Visitor opens the app, fills in name, email, and message fields, clicks Submit. The form is validated. On success, the backend sends an email to the configured recipient address and the frontend shows a success confirmation.
- **Key alternative / error paths:**
  - Frontend validation fails: inline field errors shown before submission reaches the backend.
  - Backend validation fails: API returns field-level or general errors; frontend renders them.
  - Email delivery fails: API returns a server error; frontend shows a general error notice.
- **Final states:**
  - **Field validation error:** inline errors shown, form remains active and submittable after correction.
  - **Success:** form replaced by a confirmation message; the user cannot resubmit without a page refresh.
  - **Server / delivery error:** form replaced by a general error notice; the user cannot resubmit without a page refresh.

---

## Requirements

### Functional Requirements
- The form collects three fields: **name** (text), **email** (valid email format), **message** (multi-line text).
- The frontend performs basic validation for user experience before submission.
- The backend performs authoritative validation independently of the frontend.
- On a valid, successfully delivered submission, the API returns a success response and the frontend replaces the form with a confirmation message. The user cannot resubmit without a page refresh.
- On field validation failure, the API returns field-level errors; the frontend renders them inline and the form remains active for correction.
- On a server or delivery error (non-field error), the frontend replaces the form with a general error notice. The user cannot resubmit without a page refresh.
- The backend sends the submitted message as an email to a preconfigured recipient address.
- The recipient address, sender address, and SMTP connection details are all configurable via environment variables.
- All environment variables must have working defaults for the local development environment so the form works out of the box without manual setup.

### Business Rules / Constraints
- Name: required, non-empty.
- Email: required, must be a valid email format.
- Message: required, non-empty.
- The backend never trusts frontend validation alone.
- No message content is persisted — delivery via email is the only output.
- No authentication or authorization is required.

---

## Acceptance Criteria
- The contact form renders with name, email, and message fields plus a submit button.
- Submitting with any required field missing or with an invalid email shows inline field errors on the frontend before the request is sent.
- A valid submission reaches the backend and passes backend validation.
- The backend sends an email to the configured recipient address upon valid submission.
- After a successful submission, the form is replaced by a confirmation message. No resubmission is possible without a page refresh.
- After a field validation error, the form remains active with inline per-field errors; the user corrects and resubmits.
- After a server or delivery error, the form is replaced by a general error notice. No resubmission is possible without a page refresh.
- The submit button is disabled while a submission is in flight.
- In the local development environment, the email is captured by a local dev email server (no real SMTP required) with zero manual setup.
- All email-related configuration is documented in `.env.example` files.

---

## UX Notes
- **Inputs / interactions:** Three fields — name (single-line text), email (email input), message (multi-line textarea). One submit button.
- **Feedback (success / error):** Success: replace the form with a confirmation message (no resubmit without refresh). Field validation errors: inline, per-field, form stays active. Server/delivery error: replace the form with a general error notice (no resubmit without refresh).
- **Optional link to detailed UX:** N/A — standard MUI form components are sufficient.

---

## Non-Functional Requirements
- **Performance / latency:** No special requirements. Email delivery is synchronous from the user's perspective — the API waits for send confirmation before responding.
- **Reliability:** The app must start and the form must be submittable locally via Docker Compose with no manual configuration.
- **Dependencies (if product-relevant):** Requires a local dev email server in Docker Compose for local development. SMTP connection details for any other environment are out of scope.

---

## Notes
- **Assumptions:** The hello world vertical is already in place. This feature extends `contact-api` and `contact-frontend` and adds a dev email service to `contact-ops`.
- **Open questions:** None at this stage.
- **Optional / stretch ideas:** N/A.

---

## Out of Scope
- Persistence of submitted messages.
- Email delivery confirmation or retry logic.
- Anti-spam measures beyond basic field validation.
- Authentication or authorization.
- Production SMTP provider configuration.
- Admin panel or message inbox UI.
- File attachments.

---

## Updates

Append-only list of **Specification Updates** added after the baseline PRD reaches `ready`.

Only Updates with status `ready` are considered effective.
