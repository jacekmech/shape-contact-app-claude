# CLAUDE.md

## Purpose

This repository is a small public demo used to show how Shape can drive implementation of a realistic but intentionally limited full-stack feature.

The product is a simple contact form application built in a monorepo with a React frontend, a Node.js API, local runtime orchestration, and reverse proxy configuration.

The goal is to keep the codebase clear, reviewable, and representative of good everyday engineering practice. Do not overengineer it. Prefer simple, explicit solutions over clever abstractions.

---

## Scope

This repository implements only a basic contact form flow.

In scope:
- contact form UI
- frontend validation
- backend request handling
- backend validation
- success and error responses
- local development and local runtime orchestration
- reverse proxy configuration needed to run the app

Out of scope unless explicitly requested:
- authentication
- authorization
- database persistence
- background jobs
- email delivery providers
- admin panel
- rate limiting beyond basic demo-level protection
- advanced observability stack
- production infrastructure beyond local Docker Compose setup

---

## Monorepo Structure

This repository is a monorepo with the following modules:

- `contact-frontend` — React application with MUI-based UI
- `contact-api` — Node.js backend application
- `contact-ops` — local runtime setup, especially Docker Compose
- `contact-middleware-nginx` — nginx configuration for local routing and reverse proxying

Keep responsibilities clear and avoid leaking concerns between modules.

---

## Module Responsibilities

### contact-frontend
Responsible for:
- rendering the contact form
- managing user interaction state
- performing basic client-side validation
- calling the API
- displaying success and error states
- providing a clean, simple MUI-based user experience

Should not contain:
- backend business logic
- infrastructure concerns
- secrets
- hardcoded environment-specific service URLs when configuration can be used instead

### contact-api
Responsible for:
- exposing HTTP endpoints
- validating incoming requests
- implementing the contact submission flow
- returning consistent API responses
- organizing backend logic using a hexagonal-architecture-inspired structure where useful

Suggested folders when helpful:
- `controllers` — HTTP layer
- `domain` — core business logic and rules
- `infra` — infrastructure adapters
- `lib` — shared backend utilities

Do not introduce layers that have no real purpose in such a small project. Use the structure to improve clarity, not to simulate complexity.

### contact-ops
Responsible for:
- Docker Compose setup
- local development orchestration
- environment wiring between modules
- runnable local developer workflow

### contact-middleware-nginx
Responsible for:
- reverse proxy configuration
- routing requests between frontend and API in local runtime
- keeping middleware configuration minimal and clear

Should not absorb application logic.

---

## Architecture Guidance

### General
Prefer straightforward implementation. This is a small application and should remain small.

Use simple boundaries:
- frontend handles presentation and user interaction
- API handles request processing and validation
- ops handles runtime orchestration
- nginx handles traffic routing

### Backend
The backend should be inspired by hexagonal architecture, but applied pragmatically.

This means:
- keep HTTP concerns near controllers
- keep business rules separate from transport details
- keep infrastructure concerns separate from domain logic
- use ports/adapters style only where it improves clarity

Do not force abstraction layers that add ceremony without improving maintainability.

### Frontend
Use a typical React structure suitable for a small app. Keep components easy to follow. Prefer MUI defaults and light composition over heavy design-system work.

---

## Environment Variables

Environment variables should be managed at the application roots and made available to runtime code through explicit configuration handling.

Guidance:
- do not scatter environment variable reads across the codebase when a configuration module can centralize them
- do not hardcode ports, base URLs, or service hostnames
- keep frontend and backend configuration explicit
- expose only frontend-safe variables to browser runtime
- keep local development defaults aligned with Docker Compose and nginx setup

Treat runtime configuration as a first-class concern, even in a small demo.

---

## Coding Style

Use typical, widely accepted JavaScript conventions.

General expectations:
- prioritize readability and consistency
- use clear naming
- keep functions focused
- avoid unnecessary nesting
- avoid large files when simple extraction improves readability
- prefer explicit control flow over compact cleverness

Unless a stronger repo-local convention is introduced, follow common modern JavaScript style:
- semicolons
- single quotes
- trailing commas where standard tooling applies
- `const` by default, `let` only when reassignment is needed
- one default pattern for imports and exports within each module

Use formatting and linting tooling appropriate for a standard modern JS/React/Node project.

---

## API and Validation Expectations

Keep the contact flow simple and predictable.

Expected behavior:
- frontend performs basic validation for user experience
- backend performs authoritative validation
- backend never trusts frontend validation alone
- API returns consistent success and error response shapes
- user-facing failures should be understandable and not expose internals

Validation rules should be implemented once per layer for the right reason:
- frontend: usability
- backend: correctness and safety

---

## Testing Expectations

Testing should be practical and proportional.

Recommended approach:
- backend: unit tests for domain or service logic, plus light integration tests for request handling where useful
- frontend: focused component or behavior tests where they provide confidence
- avoid excessive testing ceremony for trivial code
- do not add heavyweight end-to-end coverage unless explicitly requested

A feature is not complete if the core flow is untested.

---

## Local Development Expectations

The application should be runnable locally through Docker Compose from `contact-ops`.

Also prefer keeping modules independently understandable and reasonably runnable in isolation where practical.

Local developer experience should be simple:
- clear startup path
- stable ports and service naming
- minimal manual setup
- environment configuration aligned with the documented workflow

---

## Documentation Discipline

Keep documentation concise and accurate.

When changing behavior, update only the documentation that is actually affected. Do not create documentation noise. Do not invent architecture or workflow claims that the code does not support.

This repository is public and should read as intentional, disciplined engineering work.

---

## Shape workflow

This repository uses the Shape workflow for AI-assisted software delivery.

Shape is a step-by-step workflow with explicit approval boundaries.

When working in this repository:

- Follow the default Shape step order unless the user explicitly asks for another supported Shape operation.
- Treat each Shape operation as a separate boundary.
- Do not move to the next Shape operation without explicit user approval.
- Do not silently combine multiple Shape operations into one step.
- After a Shape operation updates workflow artifacts, stop and let the user review and commit the result, or explicitly ask you to commit it.
- `implement batch` is the special exception: it ends with code and any resulting Implementation Plan updates ready for review, not approved, not committed.
- Review, marking tasks done, and commit are handled by the later explicit Shape steps.

Default Shape step order:
1. initiate feature
2. create prd
3. create technical concept
4. initiate implementation
5. prepare slice
6. implement batch
7. review batch
8. commit batch
9. finish slice
10. finish implementation

Before acting:

- Read `.shape/config.json` to understand the configured Shape feature root and canonical artifact filenames.
- Treat `.shape/workspace.json` as transient local workspace state. Do not rely on it as committed project state.
- Use `.shape/workflow-templates/` as the canonical source for workflow artifact templates.
- Treat feature folders under the configured feature root as the primary Shape delivery units.
- Use installed Claude Code skills from `.claude/skills/` when a matching Shape workflow operation applies.

Shape feature artifacts typically include:
- `01-prd.md`
- `02-tech-concept.md`
- `03-implementation-plan.md`

Do not invent alternative artifact naming or layout if the configured Shape files already exist.

---

## Non-Goals for Agents

Do not:
- expand the feature set beyond the requested scope
- introduce unnecessary frameworks or infrastructure
- add persistence or external providers unless explicitly requested
- optimize prematurely
- create artificial complexity to make the project look more “enterprise”
- generate large amounts of boilerplate documentation

The best outcome is a small repo that looks clean, coherent, runnable, and professionally judged.
