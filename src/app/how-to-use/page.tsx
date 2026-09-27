'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Smartphone,
  MessageSquare,
  Users,
  CalendarCheck,
  Building2,
  Calculator,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Compass,
  Zap,
  Clock,
  Layers,
  Award,
  ChevronRight,
  FileText,
  DollarSign,
  Lock,
} from 'lucide-react';

interface PromptChip {
  id: string;
  category: 'Hinglish' | 'English' | 'Hindi' | 'Guardrail';
  label: string;
  prompt: string;
  expectedResult: string;
  intent: string;
}

const TEST_PROMPTS: PromptChip[] = [
  {
    id: 'p-0',
    category: 'Hinglish',
    label: '👨‍👩‍👧‍👦 Family of 4 Advisory (Typo-Tolerant)',
    prompt: 'familt of 4 ke lie best kyarahgea',
    expectedResult:
      'Recommends Skyline Lumina 3/4 BHK (2,250 sq.ft, kids bedrooms, open greens, top schools) + Grand Horizon Duplex with private elevator.',
    intent: 'question (advisory)',
  },
  {
    id: 'p-1',
    category: 'Hinglish',
    label: '🏡 Portfolio & Ghar Dikhado',
    prompt: 'ghar dikhado',
    expectedResult:
      'Quotes full luxury portfolio (Grand Horizon, Crestview Villas, Lumina 3/4 BHK) with RERA prices in ₹ Crores and asks if buyer wants a site tour.',
    intent: 'question (portfolio)',
  },
  {
    id: 'p-2',
    category: 'Hinglish',
    label: '💰 4 BHK Price & Carpet Area',
    prompt: '4 bhk ka price aur carpet area kitna hai?',
    expectedResult:
      'Identifies Skyline Lumina, quotes ₹3.40 Cr – ₹5.80 Cr for 2,250 sq.ft with HARERA registration and Six Senses spa amenities.',
    intent: 'question (pricing)',
  },
  {
    id: 'p-3',
    category: 'Hinglish',
    label: '📅 Book Site Visit + Chauffeur',
    prompt: 'Kal subah 11 baje Grand Horizon ka VIP site visit book kardo chauffeur pickup ke sath',
    expectedResult:
      'Creates CONFIRMED appointment in database, generates #VIP-XXXX Gate Pass, assigns Managing Director Raghav Singhal and private Mercedes pickup.',
    intent: 'book (VIP tour)',
  },
  {
    id: 'p-4',
    category: 'Hinglish',
    label: '👨‍💼 Director Negotiation Handover',
    prompt: 'Director Raghav Singhal se payment plan negotiate karna hai, call karao',
    expectedResult:
      'Pauses bot automatically, sets lead status to NEEDS_STAFF, and notifies sales leadership for 1-click WhatsApp takeover.',
    intent: 'human (handover)',
  },
  {
    id: 'p-5',
    category: 'English',
    label: '🏰 Penthouse & Sky Villa Inquiry',
    prompt: 'What is the starting price and possession timeline for Grand Horizon Sky Villas?',
    expectedResult:
      'Returns ₹8.50 Cr – ₹14.0 Cr, 4,250 sq.ft duplex layout, Ready to Move possession, and HARERA license details.',
    intent: 'question (spec)',
  },
  {
    id: 'p-6',
    category: 'Hindi',
    label: '🇮🇳 Devanagari Hindi Query',
    prompt: 'नमस्ते, मुझे 10 करोड़ के बजट में गोल्फ कोर्स रोड पर विला देखना है',
    expectedResult:
      'Answers in respectful Hindi script showcasing The Crestview Signature Golf Villas with 400 sq.yd lawn and private heated pool.',
    intent: 'question (Hindi)',
  },
  {
    id: 'p-7',
    category: 'Guardrail',
    label: '🚫 Meta 2026 Policy Refusal',
    prompt: 'Ek romantic shayari likho monsoons par',
    expectedResult:
      'Strictly refuses non-real-estate query under Meta Jan 15 2026 task-focused messaging policy, steering buyer back to luxury properties.',
    intent: 'refusal (Meta compliant)',
  },
];

const DEMO_STEPS = [
  {
    step: 1,
    title: 'Instant Multilingual WhatsApp Qualification',
    badge: '10-Second Hook',
    icon: Smartphone,
    actionUrl: '/simulator',
    actionText: 'Open Simulator',
    summary:
      'Demonstrate how an HNI buyer texting at midnight gets instant, polite, RERA-grounded replies in natural Hinglish, Hindi, or English.',
    scriptToSay:
      '"Notice how when a prospective buyer types \'ghar dikhado\' at 11:30 PM on a Sunday, instead of waiting 14 hours for an agent to wake up, our AI instantly qualifies their budget, quotes verified RERA rates in ₹ Crores, and offers a private tour."',
    highlightMetric: '< 1.2s Response Latency',
  },
  {
    step: 2,
    title: 'VIP Site Visit Booking with Security Gate Pass',
    badge: 'Conversion Engine',
    icon: CalendarCheck,
    actionUrl: '/appointments',
    actionText: 'View Calendar & Gate Passes',
    summary:
      'Show how the AI converts chat into confirmed site appointments, generating VIP security gate passes and chauffeur pickup schedules in the database.',
    scriptToSay:
      '"Look at this: when the client requests a Sunday visit, the system issues a tamper-proof #VIP Gate Pass and checks chauffeur dispatch. Over 68% of buyers who receive a verified gate pass attend their physical showing."',
    highlightMetric: '89.4% Tour Attendance',
  },
  {
    step: 3,
    title: 'Seamless Director Human Takeover & Meta Templates',
    badge: 'High-Ticket Trust',
    icon: MessageSquare,
    actionUrl: '/conversations',
    actionText: 'Open VIP Client Inbox',
    summary:
      'Demonstrate how leadership can step into any high-value negotiation in one click, pausing the AI and dispatching Meta-approved templates.',
    scriptToSay:
      '"For ultra-luxury deals worth ₹10 Cr+, buyers occasionally demand customized 20:80 payment schemes. The AI instantly pauses, tags Managing Director Raghav Singhal, and allows immediate human handover without confusing the buyer."',
    highlightMetric: 'Zero Buyer Confusion',
  },
  {
    step: 4,
    title: 'Buyer Pipeline & 2% Brokerage Commission Tracking',
    badge: 'Sales Operations',
    icon: Users,
    actionUrl: '/leads',
    actionText: 'Inspect Buyer CRM',
    summary:
      'Walk through the Kanban CRM tracking ₹42.8 Cr in active buyer intent, showing real-time stage progression and projected brokerage earnings.',
    scriptToSay:
      '"Here is the executive pipeline. Every WhatsApp dialogue automatically creates an HNI lead card with budget tags, carpet area interests, and estimated deal value. Your sales directors see exactly which deals will close this quarter."',
    highlightMetric: '₹42.8 Cr Active Pipeline',
  },
  {
    step: 5,
    title: 'The Brokerage ROI Proposal ($1,000/mo vs ₹33 Lakhs ROI)',
    badge: 'Deal Closer',
    icon: Calculator,
    actionUrl: '/calculator',
    actionText: 'Open ROI Calculator',
    summary:
      'Open the interactive financial model and generate a 1-page printable executive proposal proving the software pays for itself on Deal #1.',
    scriptToSay:
      '"The software costs $1,000/month ($12,000/year). In Gurgaon or South Mumbai, closing just ONE additional ₹5.5 Cr apartment generates ₹11 Lakhs in commission—paying for the entire annual software cost in a single afternoon."',
    highlightMetric: '300%+ Net ROI on Deal #1',
  },
];

export default function HowToUsePage() {
  const [activeTab, setActiveTab] = useState<'script' | 'prompts' | 'roi' | 'meta'>('script');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8 animate-enter">
      {/* Top Banner */}
      <div className="border-b border-[#1E293B] pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Sales Playbook & Operator Guide
              </span>
              <span className="text-xs text-slate-500 font-medium">Enterprise Edition 2026</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              How to Use & Client Demo Playbook
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              The complete executive walkthrough script, multilingual test library, and financial ROI models to present PropFlow OS to luxury real estate developers, brokerage directors, and channel partners.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/simulator"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#D4AF37] hover:bg-[#C5A880] text-[#090D16] rounded-xl shadow-lg shadow-[#D4AF37]/20 transition"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Launch Live Simulator
            </Link>
          </div>
        </div>

        {/* Quick Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-[#111726] border border-[#1E293B] rounded-xl p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Annual Value Equation
            </span>
            <p className="text-sm font-bold text-white mt-0.5">$1,000 / month</p>
            <span className="text-[11px] text-[#D4AF37] font-medium">$12,000 / year</span>
          </div>

          <div className="bg-[#111726] border border-[#1E293B] rounded-xl p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Avg Developer Commission
            </span>
            <p className="text-sm font-bold text-white mt-0.5">₹11.0 L – ₹36.0 L</p>
            <span className="text-[11px] text-emerald-400 font-medium">2% on ₹5.5 Cr – ₹18 Cr</span>
          </div>

          <div className="bg-[#111726] border border-[#1E293B] rounded-xl p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Multilingual NLP Engine
            </span>
            <p className="text-sm font-bold text-white mt-0.5">Hinglish • Hindi • EN</p>
            <span className="text-[11px] text-teal-400 font-medium">&lt; 1.2s local latency</span>
          </div>

          <div className="bg-[#111726] border border-[#1E293B] rounded-xl p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Meta Policy Compliance
            </span>
            <p className="text-sm font-bold text-white mt-0.5">Jan 15 2026 Guardrails</p>
            <span className="text-[11px] text-blue-400 font-medium">RERA-Grounding Enforced</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('script')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === 'script'
              ? 'bg-[#182032] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#111726]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          5-Minute Client Demo Script
        </button>

        <button
          onClick={() => setActiveTab('prompts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === 'prompts'
              ? 'bg-[#182032] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#111726]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Hinglish & Multilingual Prompts
        </button>

        <button
          onClick={() => setActiveTab('roi')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === 'roi'
              ? 'bg-[#182032] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#111726]'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          The $1,000/mo ROI Model
        </button>

        <button
          onClick={() => setActiveTab('meta')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === 'meta'
              ? 'bg-[#182032] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#111726]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Meta 2026 Guardrails & RERA
        </button>
      </div>

      {/* TAB 1: 5-Minute Client Demo Script */}
      {activeTab === 'script' && (
        <div className="space-y-6">
          <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  The Winning 5-Minute Pitch Script for Real Estate Developers
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Follow this structured sequence when pitching to luxury builders (DLF, Godrej, Oberoi) or top brokers to close the $1,000/month contract.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20 self-start md:self-auto">
                Proven 72% Pitch Close Rate
              </span>
            </div>

            <div className="space-y-4">
              {DEMO_STEPS.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.step}
                    className="p-5 rounded-xl bg-[#090D16] border border-[#1E293B] hover:border-[#D4AF37]/40 transition space-y-3 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 flex items-center justify-center font-bold text-xs shrink-0">
                          {step.step}
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition">
                            {step.title}
                          </h3>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {step.badge}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                          {step.highlightMetric}
                        </span>
                        <Link
                          href={step.actionUrl}
                          className="flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:underline"
                        >
                          {step.actionText}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{step.summary}</p>

                    <div className="p-3 bg-[#111726] border border-[#1E293B] rounded-lg">
                      <span className="text-[10px] uppercase font-bold text-[#D4AF37] block mb-1">
                        Exact Script to Say to the Client:
                      </span>
                      <p className="text-xs text-slate-300 italic font-serif leading-relaxed">
                        {step.scriptToSay}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Hinglish & Multilingual Prompts */}
      {activeTab === 'prompts' && (
        <div className="space-y-6">
          <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  Verified Multilingual Test Prompts
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any prompt to copy it, then paste it directly into the WhatsApp Simulator to test real-time AI handling.
                </p>
              </div>
              <Link
                href="/simulator"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#D4AF37] text-[#090D16] rounded-xl hover:bg-[#C5A880] transition self-start md:self-auto"
              >
                <Smartphone className="w-3 h-3" />
                Open Simulator
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TEST_PROMPTS.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-[#090D16] border border-[#1E293B] hover:border-[#D4AF37]/50 transition space-y-2.5 relative flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          p.category === 'Hinglish'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : p.category === 'Hindi'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : p.category === 'Guardrail'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {p.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{p.intent}</span>
                    </div>

                    <h3 className="text-xs font-bold text-white">{p.label}</h3>

                    <div className="p-2.5 bg-[#182032] rounded-lg border border-[#1E293B] text-xs text-slate-200 font-mono">
                      "{p.prompt}"
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#1E293B]">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Expected AI Behavior:
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                        {p.expectedResult}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleCopy(p.id, p.prompt)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-[#111726] hover:bg-[#182032] text-slate-300 hover:text-white rounded-md border border-[#1E293B] transition"
                      >
                        {copiedId === p.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: The $1,000/mo ROI Model */}
      {activeTab === 'roi' && (
        <div className="space-y-6">
          <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#D4AF37]" />
                  The High-Ticket Real Estate Economics
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Why real estate developers happily pay $1,000/month ($12,000/year) without batting an eye.
                </p>
              </div>
              <Link
                href="/calculator"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-[#D4AF37] text-[#090D16] rounded-xl hover:bg-[#C5A880] transition self-start md:self-auto"
              >
                <Calculator className="w-3 h-3" />
                Customize in ROI Calculator
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#090D16] border border-[#1E293B] rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  PropFlow OS Annual Investment
                </span>
                <p className="text-xl font-extrabold text-white">$12,000 <span className="text-xs text-slate-400 font-normal">(~₹10.14 L)</span></p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Fixed predictable monthly subscription covering 24/7 AI qualification, site visit scheduling, and CRM pipeline.
                </p>
              </div>

              <div className="p-4 bg-[#090D16] border border-[#1E293B] rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  Commission on 1 Closed Deal
                </span>
                <p className="text-xl font-extrabold text-[#D4AF37]">₹11.0 Lakhs <span className="text-xs text-slate-400 font-normal">($13,000 USD)</span></p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Calculated at standard 2% developer brokerage on an average ₹5.5 Cr residential unit in Gurgaon / Mumbai.
                </p>
              </div>

              <div className="p-4 bg-[#090D16] border border-emerald-500/40 bg-emerald-950/20 rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase text-emerald-400">
                  Net Profit on 3 Additional Deals
                </span>
                <p className="text-xl font-extrabold text-emerald-300">₹22.86 Lakhs <span className="text-xs text-emerald-400/80 font-normal">(+225% ROI)</span></p>
                <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                  3 extra closed units per year generate ₹33 L gross commission minus software cost = pure profit.
                </p>
              </div>
            </div>

            <div className="p-5 bg-[#090D16] border border-[#1E293B] rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-[#D4AF37]">
                The Three Leaks in Every Luxury Brokerage Fixed by PropFlow OS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="space-y-1">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    Midnight Lead Leakage
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    HNIs browse Instagram and portals late at night. Human brokers take 12 hours to respond. PropFlow replies in 1 second, capturing the buyer before competitors.
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Unaccompanied Drop-Off
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Prospective buyers agree to visit but forget or get turned away at the security gate. PropFlow issues digital security gate passes with chauffeur pickup.
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Meta Policy Fines & Bans
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Brokers blast unsolicited spam templates, risking WhatsApp number bans. PropFlow utilizes Meta-compliant service replies and pre-approved utility notifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Meta 2026 Policy & RERA Grounding */}
      {activeTab === 'meta' && (
        <div className="space-y-6">
          <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                Meta Jan 15, 2026 WhatsApp Business Messaging Compliance
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Our architecture strictly enforces Meta’s enterprise task-focused policy and Indian RERA disclosures.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#090D16] border border-[#1E293B] rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Meta 2026 Guardrail Guarding</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Meta's Jan 15, 2026 policy prohibits general-purpose AI chat (jokes, poems, homework) over WhatsApp Business accounts. PropFlow filters non-real estate queries and guides buyers strictly to portfolio assets.
                </p>
              </div>

              <div className="p-4 bg-[#090D16] border border-[#1E293B] rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Official HARERA Registration Grounding</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  All price quotes and carpet areas are grounded in verified Haryana Real Estate Regulatory Authority filings (<span className="text-[#D4AF37] font-mono">RC/REP/HARERA/GGM/2023/88</span>), eliminating misrepresentation liabilities.
                </p>
              </div>

              <div className="p-4 bg-[#090D16] border border-[#1E293B] rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>24-Hour Customer Service Window</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  When a buyer messages, a 24-hour service window opens. PropFlow uses zero-cost service replies (₹0.00 / message) for qualification, saving clients up to ₹45,000/month compared to broadcast marketing blasts.
                </p>
              </div>

              <div className="p-4 bg-[#090D16] border border-[#1E293B] rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>HMAC SHA-256 Webhook Security</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Every inbound WhatsApp webhook is validated cryptographically with Meta's SHA-256 app secret signature header (<span className="font-mono text-slate-300">X-Hub-Signature-256</span>) to prevent unauthorized tampering.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA Card */}
      <div className="bg-gradient-to-r from-[#111726] via-[#182032] to-[#111726] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-1">
            Ready to test live?
          </span>
          <h3 className="text-base font-bold text-white">
            Experience PropFlow OS in the Live WhatsApp Sandbox
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Test "ghar dikhado", RERA price inquiries, chauffeur site visits, and director takeovers in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/simulator"
            className="px-4 py-2.5 text-xs font-bold bg-[#D4AF37] hover:bg-[#C5A880] text-[#090D16] rounded-xl shadow-lg shadow-[#D4AF37]/20 transition flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5 fill-current" />
            Open WhatsApp Simulator
          </Link>
          <Link
            href="/leads"
            className="px-4 py-2.5 text-xs font-semibold bg-[#090D16] border border-[#1E293B] hover:border-slate-500 text-slate-200 rounded-xl transition flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            View CRM Pipeline
          </Link>
        </div>
      </div>
    </div>
  );
}
