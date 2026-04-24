<!-- Shape / Claude integration: start -->

## Shape workflow

This repository uses the Shape workflow for AI-assisted software delivery.

Shape is a step-by-step workflow with explicit approval boundaries.

When working in this repository:

- Follow the default Shape step order unless the user explicitly asks for another supported Shape operation.
- Treat each Shape operation as a separate boundary.
- Do not move to the next Shape operation without explicit user approval.
- Do not silently combine multiple Shape operations into one step.
- After a Shape operation updates workflow artifacts, stop and let the user review and commit the result, or explicitly ask you to commit it.
- `implement batch` is the special exception: it may continue through review handoff, revision, approval handling, task completion updates, and optional commit, but only with explicit user approval and explicit commit instruction.
- Do not mark tasks done before explicit approval, and do not commit without explicit user instruction.
- Never deviate from the workflow, e.g. by skipping a step, combining two steps or implementing two slices in one go.

Default Shape step order:
1. initiate feature
2. create prd
3. create technical concept
4. plan implementation
5. plan slice
6. implement batch
7. finish slice
8. finish feature

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

<!-- Shape / Claude integration: end -->
