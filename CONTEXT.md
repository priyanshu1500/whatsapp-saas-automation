# CONTEXT.md - Domain Model & Glossary

## Product Overview
An end-to-end, multi-tenant WhatsApp AI Business Agent & Staff Operating System designed for high-ticket Indian and global SMBs (Dental/Skin clinics, Real estate brokers, Coaching academies, IVF centers, Diagnostics, D2C). Connects customer WhatsApp conversations to an intelligent task-oriented AI agent, synced with a live staff dashboard for bookings, lead qualification, bot pause/takeover, and automated 24-hr reminder templates.

## Core Domain Entities & Terms

### 1. Lead
A customer contact who has initiated a conversation or submitted an opt-in lead form.
- Attributes: `id`, `phone` (E.164 format, e.g. `+919876543210`), `name`, `status` (`NEW`, `QUALIFIED`, `BOOKED`, `NEEDS_STAFF`, `CLOSED`), `bot_paused` (boolean), `service_interest`, `notes`, `created_at`, `updated_at`.

### 2. Message
An individual communication exchanged between customer and business.
- Attributes: `id`, `lead_id`, `direction` (`INBOUND` | `OUTBOUND`), `sender` (`CUSTOMER` | `BOT` | `STAFF`), `body`, `intent` (`book` | `question` | `human` | `other`), `cost_category` (`service_reply` | `utility_template` | `marketing_template`), `timestamp`, `meta_message_id`.

### 3. Bot Takeover (`bot_paused`)
A critical human-in-the-loop feature. When a customer is angry, asks complex non-standard questions, or explicitly requests a human (`intent === 'human'`), or when staff clicks "Take Over", the bot's auto-reply is suppressed (`bot_paused = true`). Staff can resume the bot at any time.

### 4. 24-Hour Customer Care Window
Meta's messaging policy window:
- Within 24 hours of customer's last message: Freeform service replies (AI or Staff) are permitted.
- After 24 hours of silence: Freeform replies are blocked by Meta; only pre-approved Templates (Utility or Marketing) can be sent.
- The UI displays an active countdown timer badge for every conversation.

### 5. Meta Template
Pre-approved message structure registered with WhatsApp Business Platform:
- `UTILITY`: Appointment reminders (24h before), booking confirmations (₹0.115 in India).
- `MARKETING`: Re-engagement follow-ups, promotional offers (₹0.8631 in India).
- `AUTHENTICATION`: OTPs and verification.

### 6. Appointment
A booked consultation or service slot:
- Attributes: `id`, `lead_id`, `patient_name`, `phone`, `service`, `date`, `time_slot`, `status` (`CONFIRMED` | `REMINDER_SENT` | `COMPLETED` | `CANCELLED`), `notes`.

### 7. Consent Event (DPDP Compliance)
India Digital Personal Data Protection (DPDP) Act compliance record:
- Attributes: `id`, `lead_id`, `phone`, `consent_type` (`WHATSAPP_OPT_IN`, `MARKETING_OPT_IN`, `DATA_ERASURE_REQUEST`), `status` (`GRANTED` | `REVOKED`), `timestamp`, `ip_or_source`.

### 8. System Prompt & Guardrails (Meta 2026 AI Policy)
Meta strictly forbids open-ended general chatbots on WhatsApp Business API since January 2026. The agent must:
- Confine conversation solely to the business's explicit services and price list.
- Never invent medical diagnoses or clinical advice.
- Honestly state "I am an AI assistant for [Business Name]" if asked.
- Fluently handle English, Hindi, and natural Hinglish.

