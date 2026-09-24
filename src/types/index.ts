export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'BOOKED' | 'NEEDS_STAFF' | 'CLOSED';

export type MessageSender = 'CUSTOMER' | 'BOT' | 'STAFF';
export type MessageDirection = 'INBOUND' | 'OUTBOUND';
export type MessageCostCategory = 'service_reply' | 'utility_template' | 'marketing_template';
export type AIIntent = 'book' | 'question' | 'human' | 'refusal';

export interface Lead {
  id: string;
  phone: string; // e.g. "+919876543210"
  name: string;
  status: LeadStatus;
  bot_paused: boolean;
  service_interest?: string;
  preferred_date?: string;
  notes: string;
  unread_count: number;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  lead_id: string;
  phone: string;
  direction: MessageDirection;
  sender: MessageSender;
  body: string;
  intent?: AIIntent;
  cost_category: MessageCostCategory;
  cost_inr: number;
  meta_message_id?: string;
  timestamp: string;
}

export type AppointmentStatus = 'CONFIRMED' | 'REMINDER_SENT' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: string;
  lead_id: string;
  patient_name: string;
  phone: string;
  service: string;
  date: string; // YYYY-MM-DD
  time_slot: string; // e.g. "10:30 AM"
  doctor_or_staff: string;
  status: AppointmentStatus;
  reminder_sent: boolean;
  reminder_sent_at?: string;
  created_at: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price_inr: number;
  duration_minutes: number;
  description: string;
}

export interface BusinessConfig {
  id: string;
  name: string;
  niche: 'dental' | 'dermatology' | 'real_estate' | 'coaching' | 'gym' | 'd2c';
  phone_number: string;
  display_phone: string;
  address: string;
  timings: string;
  doctor_name: string;
  currency: string;
  whatsapp_phone_number_id?: string;
  whatsapp_waba_id?: string;
  whatsapp_verify_token: string;
  system_prompt_custom?: string;
  guardrail_refuse_medical: boolean;
  guardrail_refuse_offtopic: boolean;
  guardrail_honest_bot: boolean;
  services: ServiceItem[];
}

export interface MetaTemplate {
  id: string;
  name: string;
  category: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION';
  language: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  cost_inr: number;
  body: string;
  variables: string[];
}

export interface ConsentEvent {
  id: string;
  lead_id: string;
  phone: string;
  consent_type: 'WHATSAPP_OPT_IN' | 'MARKETING_OPT_IN' | 'DATA_ERASURE_REQUEST';
  status: 'GRANTED' | 'REVOKED';
  timestamp: string;
  source: string;
}

export interface AIResponsePayload {
  reply: string;
  intent: AIIntent;
  name?: string;
  preferred_date?: string;
  service?: string;
  reasoning?: string;
  refused_reason?: string;
}

export interface SimulatorChatRequest {
  phone: string;
  name: string;
  message: string;
}
