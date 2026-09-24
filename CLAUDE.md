# WhatsApp AI SaaS & Agent OS

An enterprise-grade WhatsApp AI Automation & Staff Operating System designed for high-ticket service businesses (clinics, real estate, academies, salons, D2C) in India and global markets.

## Agent skills

### Issue tracker

Local markdown issues tracked under `.scratch/whatsapp-saas/issues/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical triage label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout with root `CONTEXT.md` and `docs/adr/`. See `docs/agents/domain.md`.

## Engineering Workflow & Skills

- **`/setup-matt-pocock-skills`**: Configures tracker, labels, and domain doc layout.
- **`/ask-matt`**: Routes and guides main engineering flow (Idea -> Domain Modeling -> Specs -> Tracer Tickets -> TDD/Implement -> Security Audit).
- **`/fullstack-guardian`**: Enforces strict three-perspective development (Frontend, Backend, Security) on every feature.
- **Rules**: Validate client & server, use parameterized/typed DB queries, sanitize outputs, maintain explicit DTO responses, verify Meta HMAC signatures, and comply with DPDP Act.

