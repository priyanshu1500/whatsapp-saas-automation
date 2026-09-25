# ADR 0002: Packaging Platform as a $1,000/mo High-Ticket Real Estate SaaS

## Status
Accepted

## Context
The user requested packaging the entire product into a bespoke, enterprise-grade SaaS application for luxury real estate developers and top brokerage teams, looking and behaving like a $1,000/month ($12,000/year) high-ticket product.

Real estate leads cost anywhere from ₹500 to ₹2,500 ($6 - $30) each to acquire via Meta ads, and over 68% go cold when response time exceeds 15 minutes. In high-ticket real estate (units from ₹3.5 Cr to ₹15 Cr), a single closed transaction pays out ₹7,00,000 to ₹30,00,000 ($8,400 - $36,000) in broker commissions.

## Decisions

### 1. Aesthetic Direction: Cold Luxury & Architectural Minimalism
- **Palette**: Obsidian dark slate (`#090D16`), architectural crisp card borders (`#1E293B`), subtle champagne brass accents (`#D4AF37` / `#C5A880`), clean neutral typography.
- **Typography & Proportions**: Clean sans-serif hierarchy, optical alignment on crore/dollar values, concentric border radii, subtle layered shadows, and physical press feedback (`scale(0.96)`).
- **Motion**: Strictly adhering to Emil Kowalski's animation guidelines: hardware-accelerated transforms and opacity, custom cubic-bezier `cubic-bezier(0.23, 1, 0.32, 1)`, snappy 150-250ms durations, and complete reduced-motion compliance.

### 2. Deep Module Architecture (`/codebase-design`)
- Encapsulate property catalog, site visits, and buyer lead scoring behind deep modules with clean seams.
- Inbound inquiries trigger instant AI reasoning that classifies buyer tier (Ultra-HNI, High-Intent, Investor, Exploring), quotes exact carpet area and RERA registration, dispatches digital brochures, and books physical site visits.

### 3. $1,000/mo Value Justification
- Interactive Brokerage ROI & Commission Calculator demonstrating that converting just 2 additional deals per year delivers a 140%+ net ROI on the $12,000/year subscription.

## Consequences
- The product immediately resonates with luxury real estate developers, managing directors, and brokerages who demand high design quality, RERA transparency, and VIP client handling.
