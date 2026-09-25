# CONTEXT.md - Luxury Real Estate PropTech Domain Model & Glossary

## Product Overview
**PropFlow OS / Skyline AI** is an enterprise-grade Autonomous WhatsApp Real Estate Sales Engine & Site Visit Operating System designed for luxury property developers, high-end builders, and premier real estate brokerage firms. It connects high-ticket prospective property buyers directly on WhatsApp to an intelligent AI luxury property consultant, seamlessly synced with a director dashboard for site visit tours, inventory presentation, broker takeover, and automated WhatsApp reminder templates.

## Core Domain Entities & Terms

### 1. Real Estate Lead & Buyer Dossier
A high-ticket prospective buyer acquiring luxury residential or commercial property.
- Attributes: `id`, `phone`, `name`, `status` (`NEW`, `QUALIFIED`, `SITE_VISIT_BOOKED`, `NEGOTIATION`, `NEEDS_BROKER`, `CLOSED_DEAL`), `bot_paused` (boolean), `budget_bracket` (e.g. `₹3 Cr - ₹5 Cr`, `₹5 Cr - ₹10 Cr`, `₹10 Cr+`), `preferred_configuration` (e.g. `3 BHK`, `4 BHK`, `Penthouse`, `Sky Villa`), `purchase_timeline` (`Immediate (0-30 days)`, `1-3 months`, `Investment`), `buyer_type` (`End-User`, `Investor`, `NRI`), `lead_tier` (`ULTRA_HNI`, `HIGH_INTENT`, `INVESTOR`, `EXPLORING`).

### 2. Property Listing & Inventory
A luxury real estate project or development unit in the agency portfolio.
- Attributes: `id`, `project_name`, `configuration` (`3 BHK`, `4 BHK`, `Penthouse`, `Commercial Suite`), `carpet_area_sqft`, `price_cr` (price in ₹ Crores, e.g. `₹3.4 Cr` or `$410k`), `possession_timeline`, `rera_registration_number`, `location`, `amenities` (Private Elevator, Golf View, Olympic Pool, Concierge, 3-tier Security), `brochure_url`, `floor_plan_url`.

### 3. Site Visit (VIP Private Tour)
A scheduled physical or virtual walkthrough of the property development.
- Attributes: `id`, `lead_id`, `visitor_name`, `phone`, `property_id`, `property_name`, `date`, `time_slot`, `assigned_sales_director`, `visitor_count`, `chauffeur_pickup_required` (boolean), `gate_pass_code`, `status` (`CONFIRMED`, `REMINDER_SENT`, `COMPLETED`, `CANCELLED`).

### 4. Broker Takeover (`bot_paused`)
Critical human-in-the-loop capability for high-ticket transactions. When an Ultra-HNI buyer asks nuanced negotiation questions, makes a specific counter-offer, or requests a human senior broker, or when the sales director clicks "Take Over", the bot's auto-reply is instantly paused (`bot_paused = true`). The director or broker chats directly inside the live thread.

### 5. Meta WhatsApp Real Estate Templates
Pre-approved message structures complying with Meta Business Platform:
- `UTILITY`: Site Visit Confirmation with Gate Pass & Directions (₹0.115 in India).
- `UTILITY`: 24-Hour Prior Site Visit Chauffeur & Tour Reminder (₹0.115).
- `MARKETING`: New Luxury Tower Launch / VIP Pre-Release Brochure (₹0.8631).
- `AUTHENTICATION`: Secure Buyer Portal OTP (₹0.115).

### 6. Brokerage Commission & ROI Model ($1,000/mo Proposition)
High-ticket real estate transactions have average ticket sizes of ₹3.5 Cr to ₹10 Cr ($400k - $1.2M). At standard developer commission rates of 2%–3%:
- A single closed ₹3.5 Cr unit produces **₹7,00,000 ($8,400)** in commission.
- A single closed ₹7.0 Cr penthouse produces **₹14,00,000 ($16,800)** in commission.
- Converting just 1 to 2 additional leads per year through 8-second WhatsApp engagement pays for an entire year's $1,000/mo software subscription multiple times over.

### 7. Meta 2026 AI Guardrails for Real Estate
- Strictly limited to property details, floor plans, starting prices, RERA compliance, amenities, and site visits.
- Refuses general-purpose chat, jokes, or non-real-estate advice.
- Discloses AI identity honestly when asked.
- Multilingual fluency across English, Hindi, and Hinglish.
