'use client';

import React, { useState } from 'react';
import {
  Send,
  Building2,
  CheckCheck,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Info,
  Clock,
  CheckCircle2,
  FileDown,
  Sparkles,
} from 'lucide-react';

interface ChatBubble {
  id: string;
  sender: 'CUSTOMER' | 'BOT';
  text: string;
  time: string;
  intent?: string;
}

const PRESET_REAL_ESTATE_QUERIES = [
  {
    label: '💰 4 BHK Price & Carpet Area',
    text: 'Hi, what is the starting price and carpet area for Grand Horizon Sky Villas?',
  },
  {
    label: '📅 Book VIP Chauffeur Site Visit',
    text: 'Can I schedule a site visit for this Sunday at 11 AM with chauffeur pickup?',
  },
  {
    label: '⛳ Golf Villa Inquiry (Hinglish)',
    text: 'Mujhe Golf Course Road par 10 Crore budget me independent villa dekhna hai',
  },
  {
    label: '📁 Download Floor Plans & Brochure',
    text: 'Please send me the master plan layout and official architectural lookbook',
  },
  {
    label: '👨‍💼 Managing Director Escalation',
    text: 'I want to speak directly with Director Raghav Singhal about customized 20:80 payment structures',
  },
  {
    label: '🤖 Honest Bot Disclosure Test',
    text: 'Are you an AI bot or a human real estate broker?',
  },
  {
    label: '🚫 Meta 2026 Guardrail Test (Poem)',
    text: 'Write me a poem about the monsoon season in Delhi',
  },
];

export default function RealEstateSimulatorPage() {
  const [messages, setMessages] = useState<ChatBubble[]>([
    {
      id: 'init-1',
      sender: 'BOT',
      text: 'Namaste! Welcome to Skyline Luxury Estates, Gurugram. I am your autonomous luxury property consultant. I can provide verified RERA pricing in ₹ Crores, floor plans, or arrange an accompanied private chauffeur site visit. How may I assist your real estate journey today?',
      time: '10:00 AM',
      intent: 'greeting',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugTrace, setDebugTrace] = useState<any>(null);
  const [customerName, setCustomerName] = useState('Vikramaditya Singhania');
  const [customerPhone, setCustomerPhone] = useState('+919811223344');

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatBubble = {
      id: `user-${Date.now()}`,
      sender: 'CUSTOMER',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/simulator/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: customerPhone,
          name: customerName,
          message: textToSend,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const botMsg: ChatBubble = {
          id: `bot-${Date.now()}`,
          sender: 'BOT',
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: data.intent,
        };
        setMessages((prev) => [...prev, botMsg]);
        setDebugTrace({
          intent: data.intent,
          service: data.service,
          appointment: data.appointment,
          lead: data.lead,
          debug: data.debugTrace,
          bot_paused: data.bot_paused,
        });
      } else {
        alert(data.error || 'Failed to get bot reply');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'init-1',
        sender: 'BOT',
        text: 'Namaste! Welcome to Skyline Luxury Estates, Gurugram. I am your autonomous luxury property consultant. I can provide verified RERA pricing in ₹ Crores, floor plans, or arrange an accompanied private chauffeur site visit. How may I assist your real estate journey today?',
        time: '10:00 AM',
        intent: 'greeting',
      },
    ]);
    setDebugTrace(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6 animate-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Luxury Real Estate WhatsApp Simulator</h1>
            <span className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold px-2 py-0.5 rounded-full">
              Zero-Meta-Cost Sandbox
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test buyer qualification, RERA price quotations in ₹ Crores, gate pass bookings, and Meta 2026 task guardrails.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#111726] border border-[#1E293B] rounded-xl text-slate-300 hover:text-white transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Dialogue
        </button>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Preset Test Queries (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Buyer Details */}
          <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider text-[#D4AF37]">
              Simulated Buyer Profile
            </h2>
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-slate-400 font-medium">Buyer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-[#1E293B] bg-[#090D16] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium">WhatsApp Phone (E.164)</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-[#1E293B] bg-[#090D16] text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Instant Real Estate Scenarios
              </h2>
              <span className="text-[10px] text-slate-500">Tap to Send</span>
            </div>

            <div className="flex flex-col gap-2">
              {PRESET_REAL_ESTATE_QUERIES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(preset.text)}
                  disabled={loading}
                  className="text-left p-2.5 rounded-xl border border-[#1E293B] hover:border-[#D4AF37]/50 hover:bg-[#182032] text-xs transition space-y-0.5 group"
                >
                  <div className="font-semibold text-slate-200 group-hover:text-[#D4AF37]">
                    {preset.label}
                  </div>
                  <div className="text-slate-400 text-[11px] truncate italic">"{preset.text}"</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: WhatsApp Mobile Phone Frame (5 cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[390px] h-[640px] bg-slate-900 rounded-[42px] p-3 shadow-2xl border-4 border-[#1E293B] flex flex-col relative overflow-hidden">
            {/* Phone Notch */}
            <div className="w-32 h-4 bg-slate-800 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-20" />

            {/* Inner Phone Screen */}
            <div className="w-full h-full bg-[#0B141A] rounded-[32px] flex flex-col overflow-hidden relative border border-slate-800">
              {/* WhatsApp App Bar */}
              <div className="bg-[#182032] text-white px-4 pt-6 pb-3 flex items-center justify-between shadow-md z-10 border-b border-[#1E293B]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#C5A880] flex items-center justify-center font-bold text-xs text-[#090D16] shadow">
                    SE
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm leading-tight text-white">Skyline Luxury Estates</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] text-[#D4AF37] font-medium">online 24/7 (AI Concierge)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Message List */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 whatsapp-bg">
                {messages.map((m) => {
                  const isUser = m.sender === 'CUSTOMER';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
                    >
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] text-xs shadow-md relative leading-relaxed ${
                          isUser
                            ? 'bg-[#005C4B] text-white rounded-tr-none'
                            : 'bg-[#182032] text-slate-100 rounded-tl-none border border-[#1E293B]'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                          <span>{m.time}</span>
                          {isUser && <CheckCheck className="w-3.5 h-3.5 text-blue-400" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {loading && (
                  <div className="flex items-center gap-2 bg-[#182032] rounded-2xl px-3.5 py-2 text-xs text-slate-400 w-fit shadow-md border border-[#1E293B]">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] italic ml-1">Consultant typing...</span>
                  </div>
                )}
              </div>

              {/* Input Field */}
              <div className="p-2 bg-[#182032] flex items-center gap-2 border-t border-[#1E293B]">
                <input
                  type="text"
                  placeholder="Inquire about penthouses, prices, visits..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputText)}
                  className="flex-1 bg-[#090D16] text-xs px-3.5 py-2.5 rounded-full border border-[#1E293B] focus:outline-none focus:border-[#D4AF37] text-white"
                />
                <button
                  onClick={() => sendMessage(inputText)}
                  disabled={loading || !inputText.trim()}
                  className="w-9 h-9 rounded-full bg-[#D4AF37] hover:bg-[#C5A880] text-[#090D16] flex items-center justify-center transition disabled:opacity-50 shrink-0 font-bold"
                >
                  <Send className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Trace & Database Side-Effects (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider text-[#D4AF37]">
                AI Real-time Trace
              </h2>
              <span className="text-[11px] text-slate-500">Inspector</span>
            </div>

            {debugTrace ? (
              <div className="space-y-3 text-xs">
                {/* Intent Tag */}
                <div className="p-3 rounded-xl bg-[#090D16] border border-[#1E293B] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Detected Intent</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        debugTrace.intent === 'book'
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                          : debugTrace.intent === 'human'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : debugTrace.intent === 'brochure'
                          ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                          : debugTrace.intent === 'refusal'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {debugTrace.intent.toUpperCase()}
                    </span>
                    <span className="text-slate-500 text-[11px]">{debugTrace.debug?.latencyMs}ms</span>
                  </div>
                </div>

                {/* Property Matched */}
                {debugTrace.service && (
                  <div className="p-3 rounded-xl bg-[#090D16] border border-[#1E293B] space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Portfolio Project</span>
                    <p className="font-semibold text-white truncate">{debugTrace.service}</p>
                  </div>
                )}

                {/* Site Visit Created Side-Effect */}
                {debugTrace.appointment && (
                  <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-500/40 space-y-1.5 text-teal-200">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      <span>Site Visit Confirmed in DB!</span>
                    </div>
                    <div className="text-[11px] space-y-0.5 text-teal-300">
                      <div>Date: {debugTrace.appointment.date}</div>
                      <div>Time: {debugTrace.appointment.time_slot}</div>
                      <div>Gate Pass: {debugTrace.appointment.gate_pass_code || '#VIP-7701'}</div>
                      <div>Director: {debugTrace.appointment.doctor_or_staff}</div>
                    </div>
                  </div>
                )}

                {/* Broker Takeover Status */}
                {debugTrace.bot_paused && (
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-1 text-amber-200">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Broker Takeover Active</span>
                    </div>
                    <p className="text-[11px] text-amber-300">
                      AI is paused. Check Live Conversations to chat directly as Managing Director.
                    </p>
                  </div>
                )}

                {/* Rationale */}
                {debugTrace.debug?.reasoning && (
                  <div className="p-3 rounded-xl bg-[#090D16] border border-[#1E293B] space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Consultant Rationale</span>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {debugTrace.debug.reasoning}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs">
                Send an inquiry in the simulator to see live parsed intent, RERA price matching, and database site visit side-effects.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
