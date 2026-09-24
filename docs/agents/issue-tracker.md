# Issue tracker: Local Markdown

Issues and specs for this repo live as markdown files in `.scratch/`.

## Conventions

- Feature directory: `.scratch/whatsapp-saas/`
- The spec is `.scratch/whatsapp-saas/spec.md` and `specs/whatsapp_ai_saas_design.md`
- Implementation issues are one file per ticket at `.scratch/whatsapp-saas/issues/<NN>-<slug>.md`, numbered from `01`
- Triage state is recorded as a `Status:` line near the top of each issue file (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`)
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## When a skill says "publish to the issue tracker"

Create a new file under `.scratch/whatsapp-saas/issues/`.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path.

