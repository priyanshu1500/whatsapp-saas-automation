# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root: Defines core domain language and invariants.
- **`docs/adr/`**: Read ADRs that touch the area you are about to work in.

## File structure

Single-context repo:

```
/
├── CONTEXT.md
├── docs/adr/
│   └── 0001-whatsapp-ai-saas-architecture.md
├── specs/
│   └── whatsapp_ai_saas_design.md
└── src/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

