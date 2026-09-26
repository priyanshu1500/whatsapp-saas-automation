export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'SITE_VISIT_BOOKED'
  | 'BOOKED'
  | 'NEGOTIATION'
  | 'NEEDS_STAFF'
  | 'CLOSED';

export type MessageSender = 'CUSTOMER' | 'BOT' | 'STAFF';
export type MessageDirection = 'INBOUND' | 'OUTBOUND';
export type MessageCostCategory = 'service_reply' | 'utility_template' | 'marketing_template';
export type AIIntent = 'book' | 'question' | 'human' | 'refusal' | 'brochure';

export type LeadTier = 'ULTRA_HNI' | 'HIGH_INTENT' | 'INVESTOR' | 'EXPLORING';
export type BuyerType = 'End-User' | 'Investor' | 'NRI';

export interface Lead {
  id: string;
  phone: string; // e.g. "+919876543210"
  name: string;
  status: LeadStatus;
  bot_paused: boolean;
  service_interest?: string; // Property or configuration interest
  property_interest?: string;
  budget_bracket?: string; // e.g. "₹3.5 Cr - ₹5.0 Cr"
  budget_range?: string;
  deal_value_estimate?: number;
  financing_status?: string;
  preferred_date?: string; // e.g. "This Sunday at 11:00 AM"
  buyer_type?: BuyerType;
  lead_tier?: LeadTier;
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
  patient_name: string; // Used as visitor/buyer name
  phone: string;
  service: string; // Property name / configuration
  date: string; // YYYY-MM-DD
  time_slot: string; // e.g. "11:00 AM"
  doctor_or_staff: string; // Assigned Senior Property Consultant
  status: AppointmentStatus;
  reminder_sent: boolean;
  reminder_sent_at?: string;
  chauffeur_pickup_required?: boolean;
  gate_pass_code?: string;
  created_at: string;
}

export interface PropertyListing {
  id: string;
  title: string;
  slug: string;
  location: string;
  configuration: string; // e.g. "3 & 4 BHK Luxury Residences"
  carpet_area_sqft: number;
  price_cr: number; // In ₹ Crores
  price_display: string; // e.g. "₹3.40 Cr"
  possession_date: string; // e.g. "Dec 2026"
  rera_number: string;
  status: 'Ready to Move' | 'Under Construction' | 'Pre-Launch';
  amenities: string[];
  description: string;
  image_url: string;
  brochure_filename: string;
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
  niche: 'real_estate' | 'dental' | 'dermatology' | 'coaching' | 'gym' | 'd2c';
  phone_number: string;
  display_phone: string;
  address: string;
  timings: string;
  doctor_name: string; // Lead Broker / Managing Director
  rera_registration?: string;
  currency: string;
  whatsapp_phone_number_id?: string;
  whatsapp_waba_id?: string;
  whatsapp_verify_token: string;
  system_prompt_custom?: string;
  guardrail_refuse_medical: boolean;
  guardrail_refuse_offtopic: boolean;
  guardrail_honest_bot: boolean;
  services: ServiceItem[];
  properties?: PropertyListing[];
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
  service?: string; // Property or configuration
  budget?: string;
  reasoning?: string;
  refused_reason?: string;
}

export interface SimulatorChatRequest {
  phone: string;
  name: string;
  message: string;
}
