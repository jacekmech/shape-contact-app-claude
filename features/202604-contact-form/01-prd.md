# PRD: Contact Form

## Header
- **Title:** Contact Form
- **Status:** `ready`
- **Date:** `2026-04-23`

---

## Goal
- **Problem:** Visitors to the application have no way to contact the site owner directly from the app.
- **User value:** Users can send a message to the site owner without leaving the application.
- **Expected outcome:** User fills in their name, email address, and a message, submits the form, and the system sends the message to a preconfigured recipient email address. The user receives clear feedback on whether the submission succeeded or failed.

---

## Flow
- **Main flow (happy path):**
  1. User opens the contact form.
  2. User fills in name, email, and message fields.
  3. User submits the form.
  4. Frontend performs basic validation; any errors are shown immediately.
  5. If frontend validation passes, the form data is sent to the backend API.
  6. Backend validates the submission authoritatively.
  7. Backend sends an email to the preconfigured recipient address.
  8. Backend returns a success response.
  9. Frontend shows a success confirmation to the user.

- **Key alternative / error paths:**
  - Frontend validation fails → field-level error messages shown; form not submitted.
  - Backend validation fails (e.g. missing or malformed field) → API returns structured error; frontend shows error feedback.
  - Email delivery fails → API returns a 500-level error; frontend shows a generic failure message.

- **Final states:**
  - Success: form cleared or replaced by success message.
  - Failure: error message visible; form remains editable so the user can retry.

---

## Requirements
### Functional Requirements
- The contact form collects three fields: name, email address, and message.
- Frontend performs basic validation before submission (required fields, valid email format).
- Backend validates all fields authoritatively (required fields, valid email format, non-empty message).
- On successful validation, the backend sends an email to a preconfigured recipient address.
- The email includes the submitted name, email address, and message.
- The backend returns a consistent success or error response to the frontend.
- The frontend renders a success state after a successful submission.
- The frontend renders an error state when the submission fails, with a user-understandable message.

### Business Rules / Constraints
- The recipient email address is configured via an environment variable; it must not be hardcoded.
- The email server connection details (host, port, credentials) are configured via environment variables.
- In the development environment, a local dev email server is used that logs received messages to the console instead of delivering them — no real email is sent during local development.

---

## Acceptance Criteria
- Submitting a valid form results in an email being sent to the configured recipient address.
- Submitting with missing or invalid fields results in clear validation errors being shown; no email is sent.
- The backend rejects invalid submissions even when frontend validation is bypassed.
- In local development, email output is visible without connecting to an external mail provider.
- The recipient address and email server settings are configurable through environment variables.

---

## UX Notes
- **Inputs / interactions:**
  - Name: single-line text input, required.
  - Email: email input, required, validated for format.
  - Message: multi-line textarea, required.
  - Submit button: triggers validation and submission.
- **Feedback (success / error):**
  - Success: success message displayed at the top of the form; form fields are reset so the user can submit again.
  - Validation error: field-level messages for invalid or missing inputs.
  - Submission error: generic failure message when the server-side send fails, without exposing internals.
- **Optional link to detailed UX:** N/A

---

## Non-Functional Requirements
- **Performance / latency:** No specific latency target; typical synchronous form submission is acceptable.
- **Reliability:** Email send failures should be surfaced to the user with a clear but non-technical error message.
- **Dependencies (if product-relevant):** Requires a working SMTP-compatible email server or dev mail drop in the runtime environment.

---

## Notes
- **Assumptions:**
  - A single recipient address is sufficient; no CC, BCC, or multiple recipients needed.
  - The sender address (From) can be a configured system address; user's email goes in the message body or Reply-To.
- **Open questions:** None.
- **Optional / stretch ideas:**
  - Reply-To header set to the user's submitted email address to make replies easy.

---

## Out of Scope
- Authentication or authorization
- File attachments
- Email delivery tracking, open receipts, or bounce handling
- Rate limiting beyond basic demo-level protection
- Admin panel or submission history
- Database persistence of submitted messages
- Multiple recipients or dynamic routing

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
