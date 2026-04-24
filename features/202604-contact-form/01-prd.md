# PRD

## Header
- **Title:** Contact Form
- **Status:** `ready`
- **Date:** 2026-04-24

---

## Goal
- **Problem:** The application is scaffolded but has no real functionality. Visitors have no way to reach the site owner directly from the app.
- **User value:** Any visitor can send a message to the site owner by filling in a simple form — no need to know an email address or leave the app.
- **Expected outcome:** A working contact form that accepts a name, email, and message, validates the input on both sides, and delivers the submission to a configured recipient email address.

---

## Flow
- **Main flow (happy path):**
  1. User opens the app and sees the contact form.
  2. User fills in name, email address, and message.
  3. User submits the form.
  4. Frontend validates the input; submission proceeds only if valid.
  5. API receives the submission, validates it server-side.
  6. API sends an email with the submission details to the configured recipient address.
  7. User sees a success confirmation.

- **Key alternative / error paths:**
  - Frontend validation fails: user sees inline field-level error messages; form is not submitted.
  - API validation fails (e.g. request bypassed frontend): API returns a structured error response; user sees field-level or general error feedback.
  - Email sending fails: API returns an error response; user sees a generic error message without technical details.

- **Final states:**
  - Success: user sees a clear confirmation that their message was sent.
  - Validation failure: user sees clear per-field error messages and can correct and resubmit.
  - System error: user sees a generic error message; the form remains usable for retry.

---

## Requirements
### Functional Requirements
- The contact form must include three fields: name (text), email address (email), and message (multi-line text).
- All three fields are required.
- The frontend must validate fields before submission and show inline error messages for empty or invalid inputs.
- The backend must independently validate all fields and return structured errors if invalid.
- On successful validation, the backend sends an email containing the submission details to a preconfigured recipient address.
- The recipient email address is server-side configuration; it is never exposed to or supplied by the user.
- The email server connection details (host, port, credentials, from address, recipient address) must be configurable via environment variables.
- In development, an alternative email transport must be available that captures or logs outgoing emails to the console or a file instead of sending them via SMTP. This avoids the need for a real mail server during local development.
- The form can be resubmitted after an error without a page reload.

### Business Rules / Constraints
- Email address field must be validated as a properly formatted email address.
- Name field must be non-empty and no longer than 200 characters.
- Message field must have a minimum meaningful length (at least 1 non-whitespace character) and a maximum length to prevent abuse (e.g. 2000 characters).
- The backend never trusts frontend validation alone.
- Internal errors (stack traces, SMTP errors, env variable names) must never be surfaced to the user.

---

## Acceptance Criteria
- Submitting the form with all valid fields results in a success confirmation and an email delivered to the configured recipient (or logged in dev mode).
- Submitting with any empty field shows a validation error on the relevant field without submitting.
- Submitting with an invalid email format shows a validation error on the email field.
- The API independently rejects a request with missing or invalid fields with a structured error response.
- A simulated email send failure results in a user-visible generic error message; the form remains active.
- In development, outgoing emails appear in the console or a configured file — no SMTP server required.
- All email server settings are read from environment variables; no credentials are hardcoded.
- No environment configuration is exposed to the browser.

---

## UX Notes
- **Inputs / interactions:** Three inputs — Name (single-line text), Email (email input), Message (textarea, multi-line). A Submit button triggers validation and submission.
- **Feedback (success / error):**
  - Inline field-level error messages for validation failures.
  - A success message displayed at the top of the form after a confirmed submission; the form fields are reset so the user could submit again.
  - A non-blocking general error message for system errors (e.g. email sending failure), with the form still accessible for retry.
- **Optional link to detailed UX:** n/a — standard MUI-based form using existing component patterns from the hello world slice.

---

## Non-Functional Requirements
- **Performance / latency:** The form submission should complete within a few seconds under normal conditions. Email sending is synchronous within the request cycle for simplicity; no background job required.
- **Reliability:** Email send failures should be handled gracefully with a clear user-facing error. The system should not crash or expose internals on transient SMTP errors.
- **Dependencies (if product-relevant):** Requires an SMTP server for production use. Dev mode eliminates this dependency by using a local console or file transport.

---

## Notes
- **Assumptions:**
  - A single fixed recipient address is sufficient; no dynamic routing or multiple recipients needed.
  - The sender ("from") address in the outgoing email is configured server-side, not taken from the user's submitted email.
  - The user's submitted email address is included in the email body or as a Reply-To header so the site owner can respond.
- **Open questions:** None.
- **Optional / stretch ideas:**
  - Reply-To header set to the submitted email address for convenience.
  - Basic rate limiting on the submission endpoint.
  - CAPTCHA or honeypot field for spam protection.

---

## Out of Scope
- Authentication or authorization of any kind.
- Storing submissions in a database.
- Background job queue for email delivery.
- File attachments.
- Admin panel to review submissions.
- Multiple recipients or dynamic routing.
- Advanced spam protection (rate limiting and CAPTCHA are stretch only).
- Production infrastructure beyond local Docker Compose.

---

## Updates

Append-only list of **Specification Updates** added after the baseline PRD reaches `ready`.

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
