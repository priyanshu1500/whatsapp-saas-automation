import fs from 'fs';
import path from 'path';
import {
  Lead,
  Message,
  Appointment,
  BusinessConfig,
  MetaTemplate,
  ConsentEvent,
  PropertyListing,
  ServiceItem,
} from '@/types';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

export interface DatabaseSchema {
  config: BusinessConfig;
  properties: PropertyListing[];
  leads: Lead[];
  messages: Message[];
  appointments: Appointment[];
  templates: MetaTemplate[];
  consentEvents: ConsentEvent[];
}

const DEFAULT_PROPERTIES: PropertyListing[] = [
  {
    id: 'prop-1',
    title: 'The Grand Horizon Penthouse & Sky Villas',
    slug: 'grand-horizon-penthouses',
    location: 'Golf Course Extension Road, Sector 65, Gurugram',
    configuration: '4 & 5 BHK Duplex Sky Villas',
    carpet_area_sqft: 4250,
    price_cr: 8.5,
    price_display: '₹8.50 Cr – ₹14.0 Cr',
    possession_date: 'Ready to Move',
    rera_number: 'RC/REP/HARERA/GGM/2023/88',
    status: 'Ready to Move',
    amenities: [
      'Private High-Speed Elevator',
      'Panoramic Golf View Balcony',
      'Infinity Rooftop Pool',
      'Double-Height Living Lounge',
      '24/7 White-Glove Concierge',
    ],
    description:
      'Ultra-luxury architectural penthouses featuring private plunge pools, floor-to-ceiling double-glazed soundproof glass, and bespoke Italian marble interiors.',
    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    brochure_filename: 'Skyline_Grand_Horizon_Brochure.pdf',
  },
  {
    id: 'prop-2',
    title: 'Skyline Lumina 3 & 4 BHK Luxury Residences',
    slug: 'skyline-lumina-residences',
    location: 'Sector 54, Golf Course Road, Gurugram',
    configuration: '3 & 4 BHK Residences',
    carpet_area_sqft: 2250,
    price_cr: 3.4,
    price_display: '₹3.40 Cr – ₹5.80 Cr',
    possession_date: 'Dec 2026',
    rera_number: 'RC/REP/HARERA/GGM/2024/112',
    status: 'Under Construction',
    amenities: [
      'Clubhouse & Spa by Six Senses',
      'Olympic-Length Heated Pool',
      'EV Charging Bays (3 per apartment)',
      'Sub-Zero & Wolf Kitchen Appliance Suite',
      'VRV Air Conditioning',
    ],
    description:
      'Contemporary luxury apartments offering optimal cross-ventilation, expansive wraparound balconies, and 82% open landscaped greens.',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    brochure_filename: 'Skyline_Lumina_Masterplan.pdf',
  },
  {
    id: 'prop-3',
    title: 'The Crestview Signature Golf Villas',
    slug: 'crestview-golf-villas',
    location: 'Aravalli Hills Foothills, Sector 63, Gurugram',
    configuration: '5 BHK Independent Villas',
    carpet_area_sqft: 5800,
    price_cr: 11.5,
    price_display: '₹11.50 Cr – ₹18.0 Cr',
    possession_date: 'Under Construction (Q3 2027)',
    rera_number: 'RC/REP/HARERA/GGM/2024/405',
    status: 'Under Construction',
    amenities: [
      'Private 400 sq.yd Landscaped Lawn',
      'Basement Home Cinema & Wine Cellar',
      'Heated Indoor Lap Pool',
      'Direct Buggy Access to Golf Course',
      'Biometric Multi-tier Security',
    ],
    description:
      'Gated community of 42 limited-edition architectural villas crafted with natural stone, structural timber, and private subterranean entertainment lounges.',
    image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    brochure_filename: 'Crestview_Villas_Lookbook.pdf',
  },
  {
    id: 'prop-4',
    title: 'Skyline One Commercial Corporate Suites',
    slug: 'skyline-one-commercial',
    location: 'Cyber City Phase 2, DLF CyberHub Belt, Gurugram',
    configuration: 'Grade-A Office Suites & Retail',
    carpet_area_sqft: 1450,
    price_cr: 2.1,
    price_display: '₹2.10 Cr – ₹6.50 Cr',
    possession_date: 'Ready to Move',
    rera_number: 'RC/REP/HARERA/GGM/2022/94',
    status: 'Ready to Move',
    amenities: [
      'LEED Platinum Certified Green Building',
      'High-Speed Smart Elevators (3.5 m/s)',
      'Triple-Height Grand Reception',
      'Helipad Access',
      'Guaranteed 8.2% Rental Yield',
    ],
    description:
      'Prime Grade-A commercial assets with verified Fortune 500 corporate leases offering instant high rental yields and capital appreciation.',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    brochure_filename: 'Skyline_Commercial_Investment_Report.pdf',
  },
];

const DEFAULT_CONFIG: BusinessConfig = {
  id: 'biz-skyline-estates',
  name: 'Skyline Luxury Estates',
  niche: 'real_estate',
  phone_number: '+919810012345',
  display_phone: '+91 98100 12345',
  address: 'Level 18, Two Horizon Centre, Golf Course Road, DLF Phase 5, Gurugram - 122002',
  timings: 'Monday to Sunday: 9:00 AM – 8:00 PM (Private Site Tours by Appointment)',
  doctor_name: 'Raghav Singhal (Managing Director, Luxury Sales)',
  rera_registration: 'HARERA-GGM-2024-9182',
  currency: 'INR (₹ Crores)',
  whatsapp_phone_number_id: '109827364512345',
  whatsapp_waba_id: '209871625344556',
  whatsapp_verify_token: 'skyline_proptech_webhook_2026',
  system_prompt_custom: '',
  guardrail_refuse_medical: true,
  guardrail_refuse_offtopic: true,
  guardrail_honest_bot: true,
  services: [
    {
      id: 'srv-1',
      name: 'The Grand Horizon Penthouse Tour',
      category: 'Residential Penthouse',
      price_inr: 85000000,
      duration_minutes: 60,
      description: 'Private chauffeur walkthrough of 4 & 5 BHK Duplex Sky Villas (₹8.5 Cr+)',
    },
    {
      id: 'srv-2',
      name: 'Skyline Lumina 3 & 4 BHK Consultation',
      category: 'Luxury Condominium',
      price_inr: 34000000,
      duration_minutes: 45,
      description: 'Experience center visit & sample flat preview on Golf Course Road (₹3.4 Cr+)',
    },
    {
      id: 'srv-3',
      name: 'Crestview Signature Villa Private Showing',
      category: 'Ultra Luxury Villa',
      price_inr: 115000000,
      duration_minutes: 90,
      description: 'Exclusive buggy tour of 5 BHK independent golf estate villas (₹11.5 Cr+)',
    },
    {
      id: 'srv-4',
      name: 'Grade-A Commercial Investment Advisory',
      category: 'Commercial Assets',
      price_inr: 21000000,
      duration_minutes: 45,
      description: 'Rental yield assessment and corporate lease inspection (₹2.1 Cr+)',
    },
  ],
  properties: DEFAULT_PROPERTIES,
};

const DEFAULT_TEMPLATES: MetaTemplate[] = [
  {
    id: 'tpl-sitevisit-confirm',
    name: 'site_visit_confirmed_utility',
    category: 'UTILITY',
    language: 'en',
    status: 'APPROVED',
    cost_inr: 0.115,
    body: 'Namaste {{1}}! Your VIP Private Site Visit for {{2}} is confirmed for {{3}} at {{4}}. Gate Pass Code: {{5}}. Your dedicated luxury sales director {{6}} will receive you at Two Horizon Centre. Chauffeur pickup is confirmed.',
    variables: ['buyer_name', 'project_name', 'date', 'time', 'gate_pass', 'sales_director'],
  },
  {
    id: 'tpl-sitevisit-reminder',
    name: 'site_visit_reminder_24h_utility',
    category: 'UTILITY',
    language: 'en',
    status: 'APPROVED',
    cost_inr: 0.115,
    body: 'Dear {{1}}, reminder for your private site showing at {{2}} tomorrow at {{3}}. Address: Golf Course Road, Gurugram. Please reply 1 to CONFIRM or 2 to RESCHEDULE. We look forward to hosting you.',
    variables: ['buyer_name', 'project_name', 'time'],
  },
  {
    id: 'tpl-brochure-dispatch',
    name: 'digital_brochure_delivery',
    category: 'UTILITY',
    language: 'en',
    status: 'APPROVED',
    cost_inr: 0.115,
    body: 'Hello {{1}}, as requested, here is the official architectural lookbook and floor plan catalogue for {{2}} (RERA: {{3}}). Tap the link below to download your high-resolution PDF dossier: {{4}}',
    variables: ['buyer_name', 'project_name', 'rera_number', 'brochure_link'],
  },
  {
    id: 'tpl-tower-launch-mkt',
    name: 'exclusive_prelaunch_marketing',
    category: 'MARKETING',
    language: 'en',
    status: 'APPROVED',
    cost_inr: 0.8631,
    body: 'Exclusive for {{1}}: Skyline Luxury Estates announces the private pre-release of Tower Platinum at Skyline Lumina. Limited 18 sky residences at inaugural invitation pricing. Reply "VIP" for the confidential dossier.',
    variables: ['buyer_name'],
  },
];

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    phone: '+919811223344',
    name: 'Vikramaditya Singhania',
    status: 'SITE_VISIT_BOOKED',
    bot_paused: false,
    service_interest: 'The Grand Horizon Penthouse & Sky Villas',
    budget_bracket: '₹8.5 Cr – ₹14.0 Cr',
    preferred_date: 'This Sunday at 11:00 AM',
    buyer_type: 'End-User',
    lead_tier: 'ULTRA_HNI',
    notes: 'Inquired on WhatsApp for 4 BHK Duplex Penthouse. Requested private elevator access & golf view. Chauffeur pickup confirmed for Sunday 11 AM.',
    unread_count: 0,
    last_message_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: 'lead-2',
    phone: '+919877665544',
    name: 'Ananya Oberoi',
    status: 'NEEDS_STAFF',
    bot_paused: true,
    service_interest: 'Skyline Lumina 3 & 4 BHK Luxury Residences',
    budget_bracket: '₹3.5 Cr – ₹5.0 Cr',
    preferred_date: 'Saturday Afternoon',
    buyer_type: 'End-User',
    lead_tier: 'HIGH_INTENT',
    notes: 'Buyer requested custom payment plan (20:80 subvention scheme) and bank pre-approval. Bot paused for Managing Director intervention.',
    unread_count: 1,
    last_message_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    id: 'lead-3',
    phone: '+919988771122',
    name: 'Karan Mehra (NRI, Dubai)',
    status: 'QUALIFIED',
    bot_paused: false,
    service_interest: 'The Crestview Signature Golf Villas',
    budget_bracket: '₹10 Cr+',
    preferred_date: 'Next week on Delhi trip',
    buyer_type: 'NRI',
    lead_tier: 'ULTRA_HNI',
    notes: 'NRI investor looking for freehold golf villa asset in Gurugram. Downloaded digital brochure via WhatsApp.',
    unread_count: 0,
    last_message_at: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    lead_id: 'lead-1',
    phone: '+919811223344',
    direction: 'INBOUND',
    sender: 'CUSTOMER',
    body: 'Hi, what is the starting price for 4 BHK Sky Villa in Grand Horizon?',
    intent: 'question',
    cost_category: 'service_reply',
    cost_inr: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'msg-2',
    lead_id: 'lead-1',
    phone: '+919811223344',
    direction: 'OUTBOUND',
    sender: 'BOT',
    body: 'Namaste Vikramaditya ji. The Grand Horizon Sky Villas (Sector 65, Golf Course Ext Road) start at ₹8.50 Cr for 4,250 sq.ft duplex configurations, featuring private high-speed elevators, double-height living ceilings, and panoramic golf course vistas (RERA Approved: RC/REP/HARERA/GGM/2023/88). Would you like to schedule a private site tour this weekend?',
    intent: 'question',
    cost_category: 'service_reply',
    cost_inr: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
  },
  {
    id: 'msg-3',
    lead_id: 'lead-1',
    phone: '+919811223344',
    direction: 'INBOUND',
    sender: 'CUSTOMER',
    body: 'Yes, can I book a site visit for this Sunday at 11 AM with chauffeur pickup?',
    intent: 'book',
    cost_category: 'service_reply',
    cost_inr: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
  },
  {
    id: 'msg-4',
    lead_id: 'lead-1',
    phone: '+919811223344',
    direction: 'OUTBOUND',
    sender: 'BOT',
    body: 'Your VIP Private Site Tour has been reserved for Sunday at 11:00 AM. Raghav Singhal (Managing Director) will personally host you at the Horizon Experience Lounge. Gate Pass Code: #VIP-7701. Chauffeur pickup is scheduled 45 minutes prior. We look forward to welcoming you.',
    intent: 'book',
    cost_category: 'service_reply',
    cost_inr: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 21).toISOString(),
  },
  {
    id: 'msg-5',
    lead_id: 'lead-2',
    phone: '+919877665544',
    direction: 'INBOUND',
    sender: 'CUSTOMER',
    body: 'I want to discuss customized 20:80 construction-linked payment plans with your sales director directly.',
    intent: 'human',
    cost_category: 'service_reply',
    cost_inr: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'msg-6',
    lead_id: 'lead-2',
    phone: '+919877665544',
    direction: 'OUTBOUND',
    sender: 'BOT',
    body: 'Understood, Ms. Oberoi. I have flagged your request with priority to our Managing Director, Mr. Raghav Singhal. He will contact you directly on this number within 15 minutes to review bespoke payment structures.',
    intent: 'human',
    cost_category: 'service_reply',
    cost_inr: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
  },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    lead_id: 'lead-1',
    patient_name: 'Vikramaditya Singhania',
    phone: '+919811223344',
    service: 'The Grand Horizon Penthouse Tour',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time_slot: '11:00 AM',
    doctor_or_staff: 'Raghav Singhal (Managing Director)',
    status: 'CONFIRMED',
    reminder_sent: false,
    chauffeur_pickup_required: true,
    gate_pass_code: 'SKY-VIP-7701',
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
];

const INITIAL_CONSENT: ConsentEvent[] = [
  {
    id: 'cst-1',
    lead_id: 'lead-1',
    phone: '+919811223344',
    consent_type: 'WHATSAPP_OPT_IN',
    status: 'GRANTED',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    source: 'Luxury Developer Website Lead Portal',
  },
  {
    id: 'cst-2',
    lead_id: 'lead-2',
    phone: '+919877665544',
    consent_type: 'WHATSAPP_OPT_IN',
    status: 'GRANTED',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    source: 'Meta Click-to-WhatsApp Luxury Ad Campaign',
  },
];

class StorageEngine {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure real estate properties catalog exists
        if (!parsed.properties || parsed.properties.length === 0) {
          parsed.properties = DEFAULT_PROPERTIES;
          parsed.config = DEFAULT_CONFIG;
          parsed.leads = INITIAL_LEADS;
          parsed.messages = INITIAL_MESSAGES;
          parsed.appointments = INITIAL_APPOINTMENTS;
          parsed.templates = DEFAULT_TEMPLATES;
          this.persist(parsed);
        }
        return parsed;
      }
    } catch (e) {
      console.error('[DB] Failed reading disk store, falling back to defaults:', e);
    }

    const initial: DatabaseSchema = {
      config: DEFAULT_CONFIG,
      properties: DEFAULT_PROPERTIES,
      leads: INITIAL_LEADS,
      messages: INITIAL_MESSAGES,
      appointments: INITIAL_APPOINTMENTS,
      templates: DEFAULT_TEMPLATES,
      consentEvents: INITIAL_CONSENT,
    };
    this.persist(initial);
    return initial;
  }

  private persist(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('[DB] Failed writing to disk store:', e);
    }
  }

  private save(): void {
    this.persist(this.data);
  }

  // --- Config ---
  getConfig(): BusinessConfig {
    return this.data.config;
  }

  updateConfig(updates: Partial<BusinessConfig>): BusinessConfig {
    this.data.config = { ...this.data.config, ...updates };
    this.save();
    return this.data.config;
  }

  // --- Properties Portfolio ---
  getProperties(): PropertyListing[] {
    return this.data.properties || DEFAULT_PROPERTIES;
  }

  getPropertyById(id: string): PropertyListing | undefined {
    return this.getProperties().find((p) => p.id === id);
  }

  // --- Leads ---
  getLeads(): Lead[] {
    return [...this.data.leads].sort(
      (a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
    );
  }

  getLeadById(id: string): Lead | undefined {
    return this.data.leads.find((l) => l.id === id);
  }

  getLeadByPhone(phone: string): Lead | undefined {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return this.data.leads.find(
      (l) => l.phone.replace(/[\s\-\(\)]/g, '') === cleanPhone
    );
  }

  createOrGetLead(phone: string, name?: string): Lead {
    const existing = this.getLeadByPhone(phone);
    if (existing) {
      if (name && existing.name === 'Unknown Contact') {
        existing.name = name;
        this.save();
      }
      return existing;
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      phone,
      name: name || 'VIP Property Buyer',
      status: 'NEW',
      bot_paused: false,
      lead_tier: 'HIGH_INTENT',
      notes: 'Acquired via Meta Click-to-WhatsApp Luxury Ad',
      unread_count: 1,
      last_message_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.leads.unshift(newLead);

    // Automatic DPDP consent logging
    this.addConsentEvent({
      id: `cst-${Date.now()}`,
      lead_id: newLead.id,
      phone: newLead.phone,
      consent_type: 'WHATSAPP_OPT_IN',
      status: 'GRANTED',
      timestamp: new Date().toISOString(),
      source: 'Direct WhatsApp Inbound Real Estate Inquiry',
    });

    this.save();
    return newLead;
  }

  updateLead(id: string, updates: Partial<Lead>): Lead | undefined {
    const idx = this.data.leads.findIndex((l) => l.id === id);
    if (idx === -1) return undefined;
    this.data.leads[idx] = {
      ...this.data.leads[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.save();
    return this.data.leads[idx];
  }

  // --- Messages ---
  getMessagesByLeadId(leadId: string): Message[] {
    return this.data.messages
      .filter((m) => m.lead_id === leadId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  addMessage(msg: Omit<Message, 'id' | 'timestamp'>): Message {
    const fullMsg: Message = {
      ...msg,
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    this.data.messages.push(fullMsg);

    // Update lead timestamp
    const lead = this.getLeadById(msg.lead_id);
    if (lead) {
      lead.last_message_at = fullMsg.timestamp;
      if (msg.direction === 'INBOUND') {
        lead.unread_count += 1;
      }
      this.updateLead(lead.id, lead);
    }

    this.save();
    return fullMsg;
  }

  // --- Site Visits / Appointments ---
  getAppointments(): Appointment[] {
    return [...this.data.appointments].sort(
      (a, b) => new Date(a.date + ' ' + a.time_slot).getTime() - new Date(b.date + ' ' + b.time_slot).getTime()
    );
  }

  createAppointment(apt: Omit<Appointment, 'id' | 'created_at'>): Appointment {
    const fullApt: Appointment = {
      ...apt,
      id: `apt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      gate_pass_code: apt.gate_pass_code || `VIP-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString(),
    };
    this.data.appointments.push(fullApt);

    // Update lead status to SITE_VISIT_BOOKED
    if (apt.lead_id) {
      this.updateLead(apt.lead_id, {
        status: 'SITE_VISIT_BOOKED',
        service_interest: apt.service,
        preferred_date: `${apt.date} at ${apt.time_slot}`,
      });
    }

    this.save();
    return fullApt;
  }

  updateAppointment(id: string, updates: Partial<Appointment>): Appointment | undefined {
    const idx = this.data.appointments.findIndex((a) => a.id === id);
    if (idx === -1) return undefined;
    this.data.appointments[idx] = { ...this.data.appointments[idx], ...updates };
    this.save();
    return this.data.appointments[idx];
  }

  // --- Templates ---
  getTemplates(): MetaTemplate[] {
    return this.data.templates;
  }

  getTemplateById(id: string): MetaTemplate | undefined {
    return this.data.templates.find((t) => t.id === id);
  }

  // --- Consent & DPDP ---
  getConsentEvents(): ConsentEvent[] {
    return this.data.consentEvents;
  }

  addConsentEvent(event: ConsentEvent): void {
    this.data.consentEvents.unshift(event);
    this.save();
  }

  eraseLeadData(phone: string): boolean {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const lead = this.getLeadByPhone(cleanPhone);
    if (!lead) return false;

    this.data.messages = this.data.messages.filter((m) => m.lead_id !== lead.id);
    this.data.appointments = this.data.appointments.filter((a) => a.lead_id !== lead.id);
    this.data.leads = this.data.leads.filter((l) => l.id !== lead.id);

    this.addConsentEvent({
      id: `cst-erase-${Date.now()}`,
      lead_id: lead.id,
      phone: lead.phone,
      consent_type: 'DATA_ERASURE_REQUEST',
      status: 'REVOKED',
      timestamp: new Date().toISOString(),
      source: 'DPDP Privacy Erasure Request',
    });

    this.save();
    return true;
  }

  // --- High-Ticket Real Estate Metrics ($1000/mo Value Driver) ---
  getMetrics() {
    const totalLeads = this.data.leads.length;
    const bookedSiteVisits = this.data.leads.filter(
      (l) => l.status === 'SITE_VISIT_BOOKED' || l.status === 'BOOKED'
    ).length;
    const humanTakeovers = this.data.leads.filter((l) => l.bot_paused).length;
    const totalMessages = this.data.messages.length;
    const botReplies = this.data.messages.filter((m) => m.sender === 'BOT').length;
    const customerMessages = this.data.messages.filter((m) => m.sender === 'CUSTOMER').length;

    // Real Estate Pipeline Value (in ₹ Crores)
    // Average deal size is ~₹4.8 Cr
    const estimatedPipelineCr = Number(
      (
        this.data.leads.reduce((sum, l) => {
          if (l.status === 'SITE_VISIT_BOOKED' || l.status === 'NEGOTIATION') return sum + 6.5;
          if (l.status === 'QUALIFIED') return sum + 4.2;
          return sum + 3.4;
        }, 0)
      ).toFixed(1)
    );

    // Projected Brokerage Commission @ 2%
    // e.g. on ₹48.5 Cr pipeline = ₹97 Lakhs (~$116k)
    const projectedCommissionLakhs = Number(((estimatedPipelineCr * 100) * 0.02).toFixed(1));

    // Meta API Cost breakdown
    const serviceRepliesCount = botReplies;
    const paidServiceReplies = Math.max(0, serviceRepliesCount - 1000);
    const serviceCostInr = paidServiceReplies * 0.115;
    const utilityCount = this.data.appointments.filter((a) => a.reminder_sent).length;
    const utilityCostInr = utilityCount * 0.115;
    const marketingCount = 0;
    const marketingCostInr = marketingCount * 0.8631;

    const metaSubtotal = serviceCostInr + utilityCostInr + marketingCostInr;
    const gst18Inr = metaSubtotal * 0.18;
    const totalMetaCostInr = metaSubtotal + gst18Inr;

    return {
      totalLeads,
      bookedSiteVisits,
      conversionRate: totalLeads > 0 ? Math.round((bookedSiteVisits / totalLeads) * 100) : 0,
      humanTakeovers,
      totalMessages,
      botReplies,
      customerMessages,
      estimatedPipelineCr,
      projectedCommissionLakhs,
      metaCost: {
        serviceRepliesCount,
        utilityCount,
        marketingCount,
        subtotalInr: Number(metaSubtotal.toFixed(2)),
        gst18Inr: Number(gst18Inr.toFixed(2)),
        totalInr: Number(totalMetaCostInr.toFixed(2)),
      },
    };
  }
}

const globalForDb = globalThis as unknown as { dbInstance?: StorageEngine };
export const db = globalForDb.dbInstance ?? new StorageEngine();
if (process.env.NODE_ENV !== 'production') globalForDb.dbInstance = db;
