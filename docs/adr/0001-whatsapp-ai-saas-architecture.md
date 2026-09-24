# ADR 0001: WhatsApp AI SaaS Architecture & Technology Stack

## Status
Accepted

## Context
We need to build a complete, commercial-grade, end-to-end SaaS platform for WhatsApp AI Agents in India and global high-ticket service verticals (Dental/Skin clinics, Real estate, Coaching academies, IVF, Diagnostics, D2C).
The application must:
1. Provide a staff/agency dashboard that looks and behaves like an enterprise SaaS product.
2. Ingest Meta WhatsApp Cloud API webhooks with HMAC SHA-256 signature verification and payload processing.
3. Feature a built-in WhatsApp Web/Mobile Interactive Simulator so prospective clients, agency owners, and staff can experience and test the AI agent without needing an active Meta WABA phone number on day 1.
4. Implement an AI Agent reasoning loop returning structured JSON: `{ reply, intent, name, preferred_date, service }` with Meta 2026 AI Policy guardrails, multilingual English/Hindi/Hinglish fluency, and full price-list grounding.
5. Provide live Conversation Takeover (`bot_paused`), lead pipeline CRM, visual appointment calendar, Meta template manager, 24-hr care window tracking, DPDP consent tracking, and Meta message billing calculator in ₹ INR.

## Decisions

### 1. Unified Stack: Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **Frontend**: Next.js App Router with React 18/19, Tailwind CSS, Lucide Icons, and Radix UI primitives. Gives a sleek, responsive, dark/light theme SaaS design.
- **Backend API**: Next.js Route Handlers (`/api/webhook/whatsapp`, `/api/simulator/chat`, `/api/leads`, `/api/appointments`, `/api/templates`, `/api/cron/reminders`, `/api/settings`).
- **Data Persistence**: Pluggable storage layer (Typed in-memory with disk persistence & JSON/SQLite adapter, with straightforward drop-in migration to Supabase/PostgreSQL).

### 2. Dual-Mode Messaging Engine
- **Mode A (Production Meta Cloud API)**: Real webhook endpoint `/api/webhook/whatsapp` handling Meta verification tokens and incoming message webhooks, calling Meta Graph API v20.0 to send outbound replies and templates.
- **Mode B (Live WhatsApp Simulator)**: Built-in sandbox simulator running the exact same AI reasoning engine, database updates, lead creation, and appointment booking logic as the live WhatsApp webhook, enabling instant live demos for sales pitches.

### 3. Security (Fullstack Guardian Standards)
- Server-side input validation with Zod schemas.
- Meta webhook signature verification (`X-Hub-Signature-256`) using crypto HMAC.
- Sanitized outputs and strict DTO schemas preventing API token or internal credential leakage.
- Indian DPDP Act compliance (explicit consent logs, phone number privacy, data deletion request endpoint).

## Consequences
- Single cohesive codebase easy to deploy on Vercel, Docker, or Node.js.
- Rapid client onboarding and demo capability: an agency can spin up a client demo in under 2 minutes.

