import fs from 'fs';
import path from 'path';
import {
  Lead,
  Message,
  Appointment,
  BusinessConfig,
  MetaTemplate,
  ConsentEvent,
  ServiceItem,
} from '@/types';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

export interface DatabaseSchema {
  config: BusinessConfig;
  leads: Lead[];
  messages: Message[];
  appointments: Appointment[];
  templates: MetaTemplate[];
  consentEvents: ConsentEvent[];
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Teeth Cleaning & Polishing',
    category: 'Preventive',
    price_inr: 1500,
    duration_minutes: 30,
    description: 'Ultrasonic scaling, stain removal, and polishing',
  },
  {
    id: 'srv-2',
    name: 'Dental Consultation & X-Ray',
    category: 'Consultation',
    price_inr: 500,
    duration_minutes: 20,
    description: 'Full oral exam with digital diagnostic X-ray',
  },
  {
    id: 'srv-3',
    name: 'Root Canal Treatment (RCT)',
    category: 'Endodontics',
    price_inr: 4500,
    duration_minutes: 60,
    description: 'Painless single/multi-sitting rotary root canal treatment',
  },
  {
    id: 'srv-4',
    name: 'Teeth Whitening (Laser)',
    category: 'Cosmetic',
    price_inr: 8000,
    duration_minutes: 45,
    description: 'Professional in-clinic laser teeth whitening for radiant smile',
  },
  {
    id: 'srv-5',
    name: 'Dental Implant Consultation',
    category: 'Implantology',
    price_inr: 25000,
    duration_minutes: 45,
    description: 'Permanent titanium implant with ceramic crown warranty',
  },
  {
    id: 'srv-6',
    name: 'Invisible Aligners Consultation',
    category: 'Orthodontics',
    price_inr: 45000,
    duration_minutes: 30,
    description: 'Clear aligners scanning & custom 3D treatment planning',
  },
];

const DEFAULT_CONFIG: BusinessConfig = {
  id: 'biz-smile-clinic',
  name: 'Smile Clinic Delhi',
  niche: 'dental',
  phone_number: '+919876543210',
  display_phone: '+91 98765 43210',
  address: 'Shop 14, Main Market, Green Park, New Delhi - 110016',
  timings: 'Monday to Saturday: 10:00 AM – 8:00 PM | Sunday: 11:00 AM – 4:00 PM',
  doctor_name: 'Dr. Arjun Sharma (BDS, MDS)',
  currency: 'INR (₹)',
  whatsapp_phone_number_id: '109827364512345',
  whatsapp_waba_id: '209871625344556',
  whatsapp_verify_token: 'smile_clinic_webhook_token_2026',
  system_prompt_custom: '',
  guardrail_refuse_medical: true,
  guardrail_refuse_offtopic: true,
  guardrail_honest_bot: true,
  services: DEFAULT_SERVICES,
};

const DEFAULT_TEMPLATES: MetaTemplate[] = [
  {
    id: 'tpl-reminder-24h',
    name: 'appointment_reminder_utility',
    category: 'UTILITY',
    language: 'en',
    status: 'APPROVED',
    cost_inr: 0.115,
    body: 'Namaste {{1}}! This is a reminder from Smile Clinic Delhi for your appointment on {{2}} at {{3}} with {{4}}. Please reply 1 to CONFIRM or 2 to RESCHEDULE. Address: Green Park, New Delhi.',
    variables: ['patient_name', 'date', 'time', 'doctor_name'],
  },
  {
    id: 'tpl-booking-confirmed',
    name: 'booking_confirmation_utility',
    category: 'UTILITY',
    language: 'en',
    status: 'APPROVED',
    cost_inr: 0.115,
    body: 'Dear {{1}}, your booking for {{2}} at Smile Clinic Delhi is confirmed for {{3}} at {{4}}. Dr. {{5}} looks forward to seeing you. Reply to this chat if you have any questions.',
    variables: ['patient_name', 'service_name', 'date', 'time', 'doctor_name'],
  },
  {
    id: 'tpl-missed-you-mkt',
    name: 'we_missed_you_followup',
    category: 'MARKETING',
    language: 'en',
    status: 'APPROVED',
    cost_inr: 0.8631,
    body: 'Hi {{1}}, we missed you at Smile Clinic! Dental health checkups are recommended every 6 months. Reply "OFFER" to claim a complimentary dental X-ray with your next cleaning.',
    variables: ['patient_name'],
  },
  {
    id: 'tpl-otp-auth',
    name: 'patient_portal_otp',
    category: 'AUTHENTICATION',
    language: 'en',
    status: 'APPROVED',
    cost_inr: 0.115,
    body: '{{1}} is your verification OTP for Smile Clinic patient services. Valid for 10 minutes. Do not share with anyone.',
    variables: ['otp_code'],
  },
];

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    phone: '+919811223344',
    name: 'Rohit Verma',
    status: 'BOOKED',
    bot_paused: false,
    service_interest: 'Teeth Cleaning & Polishing',
    preferred_date: 'Tomorrow, 4:00 PM',
    notes: 'Booked via WhatsApp AI Agent. Interested in laser teeth whitening package afterwards.',
    unread_count: 0,
    last_message_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'lead-2',
    phone: '+919877665544',
    name: 'Pooja Sharma',
    status: 'NEEDS_STAFF',
    bot_paused: true,
    service_interest: 'Root Canal Treatment (RCT)',
    preferred_date: 'Urgent today',
    notes: 'Customer reported severe pain and asked to speak to human doctor. Bot paused automatically.',
    unread_count: 1,
    last_message_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'lead-3',
    phone: '+919988771122',
    name: 'Amit Patel',
    status: 'QUALIFIED',
    bot_paused: false,
    service_interest: 'Dental Implant Consultation',
    preferred_date: 'Saturday morning',
    notes: 'Enquired about full titanium implant cost; bot answered ₹25,000 with crown warranty.',
    unread_count: 0,
    last_message_at: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    lead_id: 'lead-1',
    phone: '+919811223344',
    direction: 'INBOUND',
    sender: 'CUSTOMER',
    body: 'Hi, what is the cost of teeth cleaning?',
    intent: 'question',
    cost_category: 'service_reply',
    cost_inr: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'msg-2',
    lead_id: 'lead-1',
    phone: '+919811223344',
    direction: 'OUTBOUND',
    sender: 'BOT',
    body: 'Hello Rohit ji! Teeth Cleaning & Polishing at Smile Clinic Delhi is ₹1,500 (includes ultrasonic scaling and stain removal). What day and time suits you best for an appointment?',
    intent: 'question',
    cost_category: 'service_reply',
    cost_inr: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
  },
  {
    id: 'msg-3',
    lead_id: 'lead-1',
    phone: '+919811223344',
    direction: 'INBOUND',
    sender: 'CUSTOMER',
    body: 'Can I book for tomorrow at 4 PM?',
    intent: 'book',
    cost_category: 'service_reply',
    cost_inr: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: 'msg-4',
    lead_id: 'lead-1',
    phone: '+919811223344',
    direction: 'OUTBOUND',
    sender: 'BOT',
    body: 'Great! I have reserved your slot for Teeth Cleaning tomorrow at 4:00 PM with Dr. Arjun Sharma at our Green Park clinic. We will send you an automatic reminder before your visit.',
    intent: 'book',
    cost_category: 'service_reply',
    cost_inr: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 39).toISOString(),
  },
  {
    id: 'msg-5',
    lead_id: 'lead-2',
    phone: '+919877665544',
    direction: 'INBOUND',
    sender: 'CUSTOMER',
    body: 'Mujhe daant me bohot tez dard hai, can I talk to the doctor right now?',
    intent: 'human',
    cost_category: 'service_reply',
    cost_inr: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'msg-6',
    lead_id: 'lead-2',
    phone: '+919877665544',
    direction: 'OUTBOUND',
    sender: 'BOT',
    body: 'Hum samajh sakte hain aapko takleef ho rahi hai. Main turant hamare clinic doctor/staff ko notify kar raha hoon taaki wo aapse directly baat kar sakein. Kripya thoda wait kijiye.',
    intent: 'human',
    cost_category: 'service_reply',
    cost_inr: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
  },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    lead_id: 'lead-1',
    patient_name: 'Rohit Verma',
    phone: '+919811223344',
    service: 'Teeth Cleaning & Polishing',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time_slot: '04:00 PM',
    doctor_or_staff: 'Dr. Arjun Sharma',
    status: 'CONFIRMED',
    reminder_sent: false,
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
];

const INITIAL_CONSENT: ConsentEvent[] = [
  {
    id: 'cst-1',
    lead_id: 'lead-1',
    phone: '+919811223344',
    consent_type: 'WHATSAPP_OPT_IN',
    status: 'GRANTED',
    timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    source: 'Website Lead Form Checkbox',
  },
  {
    id: 'cst-2',
    lead_id: 'lead-2',
    phone: '+919877665544',
    consent_type: 'WHATSAPP_OPT_IN',
    status: 'GRANTED',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    source: 'Direct WhatsApp Inbound Message',
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
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('[DB] Failed reading disk store, falling back to defaults:', e);
    }

    const initial: DatabaseSchema = {
      config: DEFAULT_CONFIG,
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
      name: name || 'WhatsApp Prospect',
      status: 'NEW',
      bot_paused: false,
      notes: 'Acquired via WhatsApp inquiry',
      unread_count: 1,
      last_message_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.data.leads.unshift(newLead);

    // Automatic DPDP consent logging on inbound engagement
    this.addConsentEvent({
      id: `cst-${Date.now()}`,
      lead_id: newLead.id,
      phone: newLead.phone,
      consent_type: 'WHATSAPP_OPT_IN',
      status: 'GRANTED',
      timestamp: new Date().toISOString(),
      source: 'Direct WhatsApp Inbound Message',
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

  // --- Appointments ---
  getAppointments(): Appointment[] {
    return [...this.data.appointments].sort(
      (a, b) => new Date(a.date + ' ' + a.time_slot).getTime() - new Date(b.date + ' ' + b.time_slot).getTime()
    );
  }

  createAppointment(apt: Omit<Appointment, 'id' | 'created_at'>): Appointment {
    const fullApt: Appointment = {
      ...apt,
      id: `apt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
    };
    this.data.appointments.push(fullApt);

    // Update lead status to BOOKED
    if (apt.lead_id) {
      this.updateLead(apt.lead_id, {
        status: 'BOOKED',
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

    // DPDP Right to be Forgotten: erase messages and appointments
    this.data.messages = this.data.messages.filter((m) => m.lead_id !== lead.id);
    this.data.appointments = this.data.appointments.filter((a) => a.lead_id !== lead.id);
    this.data.leads = this.data.leads.filter((l) => l.id !== lead.id);

    // Log erasure event for compliance record
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

  // --- Analytics & Cost Metrics (Section 5 of Guide) ---
  getMetrics() {
    const totalLeads = this.data.leads.length;
    const bookedLeads = this.data.leads.filter((l) => l.status === 'BOOKED').length;
    const humanTakeovers = this.data.leads.filter((l) => l.bot_paused).length;
    const totalMessages = this.data.messages.length;
    const botReplies = this.data.messages.filter((m) => m.sender === 'BOT').length;
    const customerMessages = this.data.messages.filter((m) => m.sender === 'CUSTOMER').length;

    // Pricing calculation based on Section 5 of "How to Build & Sell an AI WhatsApp Agent in India":
    // Service replies: Free now / 1000 free per month, then ₹0.115
    // Utility templates: ₹0.115 per message
    // Marketing templates: ₹0.8631 per message
    // GST @ 18%
    const serviceRepliesCount = botReplies;
    const paidServiceReplies = Math.max(0, serviceRepliesCount - 1000);
    const serviceCostInr = paidServiceReplies * 0.115;
    const utilityCount = this.data.appointments.filter((a) => a.reminder_sent).length;
    const utilityCostInr = utilityCount * 0.115;
    const marketingCount = 0; // templates dispatched
    const marketingCostInr = marketingCount * 0.8631;

    const metaSubtotal = serviceCostInr + utilityCostInr + marketingCostInr;
    const gst18Inr = metaSubtotal * 0.18;
    const totalMetaCostInr = metaSubtotal + gst18Inr;

    // Estimated revenue from confirmed appointments
    const estimatedPipelineInr = this.data.appointments
      .filter((a) => a.status === 'CONFIRMED' || a.status === 'COMPLETED')
      .reduce((sum, a) => {
        const srv = this.data.config.services.find((s) => s.name === a.service);
        return sum + (srv ? srv.price_inr : 2000);
      }, 0);

    return {
      totalLeads,
      bookedLeads,
      conversionRate: totalLeads > 0 ? Math.round((bookedLeads / totalLeads) * 100) : 0,
      humanTakeovers,
      totalMessages,
      botReplies,
      customerMessages,
      estimatedPipelineInr,
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

// Global singleton instance
const globalForDb = globalThis as unknown as { dbInstance?: StorageEngine };
export const db = globalForDb.dbInstance ?? new StorageEngine();
if (process.env.NODE_ENV !== 'production') globalForDb.dbInstance = db;
