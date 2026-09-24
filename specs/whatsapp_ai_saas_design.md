# Technical Design: WhatsApp AI SaaS & Agent OS

**Feature Scope**: End-to-end commercial SaaS application for deploying, managing, testing, and selling WhatsApp AI Agents for businesses (Clinics, Real Estate, Coaching, D2C).

---

## 1. Frontend Perspective

### Components & Pages
1. **App Shell & Layout**:
   - Collapsible sidebar with active navigation, tenant/business switcher (e.g. "Smile Clinic - Delhi", "Apex Skin Clinic", "Prestige Academy"), status badge (Meta API connected / Simulator active), dark/light theme switcher.
2. **Dashboard Overview (`/`)**:
   - Metrics cards: Total Leads Captured, AI Messages Processed, Human Takeovers, Bookings Confirmed, Est. Pipeline Value (₹), Meta API Cost in INR (with 18% GST calculation).
   - Recent Lead Activity feed.
   - Quick Actions: "Open WhatsApp Simulator", "Send Bulk Reminder", "New Booking".
3. **Live Inbox & Conversations (`/conversations`)**:
   - Left pane: Filterable conversation list (All, Unread, Needs Staff Attention, Booked).
   - Center pane: WhatsApp-style message history, real-time message stream, sender bubbles with timestamps and intent indicators.
   - Header: Customer name, phone, 24-Hour Window Countdown Badge, "Take Over" toggle button (pauses/resumes AI bot).
   - Bottom input: Manual reply input for human staff with template quick-select.
   - Right pane: Lead Profile, intent history, booked appointments, DPDP consent status, notes.
4. **Interactive WhatsApp Simulator (`/simulator`)**:
   - Realistic mobile phone device frame showing a real WhatsApp chat interface.
   - Interactive chat typing, predefined test pills ("Teeth cleaning cost?", "Book appointment for tomorrow", "Speak to human", "Hinglish test: Daant me dard hai kitna charge hoga?").
   - Live Inspection drawer showing the AI's internal reasoning, parsed JSON `{ reply, intent, name, preferred_date, service }`, database updates, and latency.
5. **Lead Pipeline / CRM (`/leads`)**:
   - Kanban board and tabular view with search and filters.
   - Stages: New -> Contacted -> Qualified -> Booked -> Needs Staff -> Closed.
   - Lead detail modal with edit capabilities.
6. **Appointments Calendar (`/appointments`)**:
   - Grid and list views of consultations.
   - Add/edit appointment modal.
   - "Send 24-hr Reminder Template" button.
7. **Meta Templates & Follow-ups (`/templates`)**:
   - Catalog of pre-approved templates: Utility (Appointment Reminder, Confirmation), Marketing (Re-engagement / "We Missed You"), Authentication (OTP).
   - Variables preview (`{{1}} = Patient Name`, `{{2}} = Date/Time`).
8. **Knowledge Base & Prompt Settings (`/settings`)**:
   - Business Profile & Niche preset switchers.
   - Services & Price Sheet Table (CRUD for service names, price in ₹, duration).
   - Meta 2026 Guardrail toggles: Medical diagnosis refusal, Off-topic refusal, Bot transparency declaration.
   - Meta API credentials setup (Phone Number ID, WABA ID, Access Token, Verify Token).

---

## 2. Backend Perspective

### Endpoints & Modules
1. **Meta Webhook Handler**:
   - `GET /api/webhook/whatsapp`: Meta webhook verification (`hub.mode === 'subscribe'`, token comparison, returns `hub.challenge`).
   - `POST /api/webhook/whatsapp`: Payload parser extracting message text, customer phone, sender name, message ID, checking 24-hr window, saving to DB, invoking AI engine, dispatching reply via Meta Graph API v20.0.
2. **Simulator Chat API**:
   - `POST /api/simulator/chat`: Takes `{ phone, name, message }`, runs the exact same pipeline as live Meta webhook, returns `{ botReply, intent, lead, appointment, debugTrace }`.
3. **Leads API**:
   - `GET /api/leads`: Query leads with filtering and pagination.
   - `PATCH /api/leads/:id`: Update status, toggle `bot_paused`, add notes.
4. **Conversations & Messages API**:
   - `GET /api/conversations`: Fetch threads with unread counts and latest messages.
   - `GET /api/conversations/:leadId/messages`: Fetch full message history.
   - `POST /api/conversations/:leadId/reply`: Staff manual reply (dispatches outbound WhatsApp message or simulator message, resets 24-hr window).
5. **Appointments API**:
   - `GET /api/appointments`: Fetch appointments list.
   - `POST /api/appointments`: Create appointment.
   - `POST /api/appointments/:id/send-reminder`: Send utility template reminder.
6. **Templates API**:
   - `GET /api/templates`: List active templates and approval status.
   - `POST /api/templates/send`: Trigger template dispatch.
7. **Scheduled Reminder Cron API**:
   - `POST /api/cron/reminders`: Scans appointments within the next 24 hours, dispatches utility reminder templates if not yet sent.
8. **AI Engine Service**:
   - Core prompt builder with grounding on the business catalog, strict refusal rules, multilingual handling.
   - JSON parsing with resilient fallback if model returns non-JSON.
   - Supports Gemini API, OpenAI API, Anthropic Claude API, and a built-in Intelligent Local Rule/Heuristic Engine so it works 100% out of the box even without any external API keys configured!

---

## 3. Security Perspective (Fullstack Guardian)

1. **Webhook Authentication**:
   - `X-Hub-Signature-256` HMAC validation against the Meta App Secret. Reject invalid signatures with 401 Unauthorized.
2. **Input Validation**:
   - Strict Zod schemas on all API inputs (phone numbers validated against E.164, message lengths bounded, XSS characters sanitized).
3. **Parameterized Storage & SQL Safety**:
   - All queries use parameterized statements / typed queries to prevent injection attacks.
4. **Data Privacy & DPDP Compliance**:
   - Dedicated `consent_events` table recording customer opt-in timestamps and channel.
   - Data erasure endpoint (`POST /api/dpdp/erase`) to comply with India DPDP right-to-be-forgotten requests.
5. **Credential Isolation**:
   - Meta system user tokens, API keys, and app secrets kept in server environment variables, never exposed in client bundles or public API responses.

