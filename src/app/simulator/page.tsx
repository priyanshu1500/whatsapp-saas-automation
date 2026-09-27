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
  Zap,
  PlayCircle,
  PauseCircle,
  PhoneCall,
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
    label: '👨‍👩‍👧‍👦 "Family of 4 ke liye best options kya hai?"',
    text: 'family of 4 ke lie best options kya hai ??',
    badge: 'Advisor',
  },
  {
    label: '🏡 "Ghar dikhado" (Hinglish Portfolio Overview)',
    text: 'ghar dikhado',
    badge: 'Popular',
  },
  {
    label: '💰 "4 BHK kitne ka hai aur carpet area?" (Hinglish)',
    text: '4 bhk ka price aur carpet area kitna hai?',
  },
  {
    label: '📈 "Investment ke liye best rental yield option?"',
    text: 'investment ke liye kaunsa option best rahega high rental income ke sath?',
    badge: 'High ROI',
  },
  {
    label: '📅 "Kal 11 baje site visit book kardo chauffeur ke sath"',
    text: 'Kal subah 11 baje Grand Horizon ka VIP site visit book kardo chauffeur pickup ke sath',
    badge: 'VIP Tour',
  },
  {
    label: '⛳ Golf Villa Inquiry (₹10 Cr+ Budget)',
    text: 'Mujhe Golf Course Road par 10 Crore budget me independent villa dekhna hai',
  },
  {
    label: '📁 Download Architectural Dossier & Master Plan',
    text: 'Please send me the master plan layout and official architectural lookbook',
  },
  {
    label: '👨‍💼 Director Raghav Singhal Escalation (Human Handover)',
    text: 'Director Raghav Singhal se payment plan negotiate karna hai, call karao',
    badge: 'Handover',
  },
  {
    label: '🤖 Honest AI Bot Disclosure Test (Hinglish)',
    text: 'Kya tum AI robot ho ya human broker?',
  },
  {
    label: '🚫 Meta 2026 Policy Guardrail Test (Shayari)',
    text: 'Ek romantic shayari likho monsoons par',
    badge: 'Guardrail',
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
  const [leadId, setLeadId] = useState('lead-1');
  const [botPaused, setBotPaused] = useState(false);

  const resumeBot = async () => {
    try {
      await fetch(`/api/conversations/${leadId}/takeover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot_paused: false }),
      });
      setBotPaused(false);
      if (debugTrace) {
        setDebugTrace((prev: any) => ({ ...prev, bot_paused: false }));
      }
      // Add system confirmation message in simulator
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: 'BOT',
          text: '⚡ AI Concierge has been RESUMED. Automated RERA pricing and instant site visit booking are active.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: 'system',
        },
      ]);
    } catch (err) {
      console.error('Failed to resume bot:', err);
    }
  };

  const pauseBotForDirector = async () => {
    try {
      await fetch(`/api/conversations/${leadId}/takeover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot_paused: true }),
      });
      setBotPaused(true);
      if (debugTrace) {
        setDebugTrace((prev: any) => ({ ...prev, bot_paused: true }));
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: 'BOT',
          text: '⏸️ Director Human Takeover initiated. Managing Director Raghav Singhal will respond directly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          intent: 'human',
        },
      ]);
    } catch (err) {
      console.error('Failed to pause bot:', err);
    }
  };

  const sendMessage = async (textToSend: string, forceUnpause = false) => {
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
          forceUnpause: forceUnpause,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.lead?.id) {
          setLeadId(data.lead.id);
        }
        setBotPaused(!!data.bot_paused);

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

  const handleReset = async () => {
    try {
      await fetch(`/api/conversations/${leadId}/takeover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot_paused: false }),
      });
    } catch (err) {
      // quiet
    }
    setBotPaused(false);
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
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Luxury Real Estate WhatsApp Simulator</h1>
            <span className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Zero-Meta-Cost Sandbox
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test buyer qualification, multilingual Hinglish/Hindi NLP, RERA price quotations in ₹ Crores, and VIP gate pass bookings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {botPaused ? (
            <button
              onClick={resumeBot}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#D4AF37] hover:bg-[#C5A880] text-[#090D16] rounded-xl shadow-lg shadow-[#D4AF37]/20 transition"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Resume AI Concierge
            </button>
          ) : (
            <button
              onClick={pauseBotForDirector}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#111726] border border-[#1E293B] hover:border-amber-500/50 text-slate-300 hover:text-amber-300 rounded-xl transition"
            >
              <PauseCircle className="w-3.5 h-3.5" />
              Simulate Director Takeover
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#111726] border border-[#1E293B] rounded-xl text-slate-300 hover:text-white transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Dialogue
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Preset Test Queries (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Buyer Details */}
          <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider text-[#D4AF37]">
                Simulated Buyer Profile
              </h2>
              <span className="text-[10px] text-slate-400">High-Net-Worth Individual</span>
            </div>
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

            <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
              {PRESET_REAL_ESTATE_QUERIES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(preset.text, true)}
                  disabled={loading}
                  className="text-left p-2.5 rounded-xl border border-[#1E293B] hover:border-[#D4AF37]/50 hover:bg-[#182032] text-xs transition space-y-1 group"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-slate-200 group-hover:text-[#D4AF37] truncate">
                      {preset.label}
                    </span>
                    {preset.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 shrink-0">
                        {preset.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-slate-400 text-[11px] truncate italic">"{preset.text}"</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: WhatsApp Mobile Phone Frame (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* Status Bar Indicator */}
          <div className="w-full max-w-[390px] mb-3 px-4 py-2 bg-[#111726] border border-[#1E293B] rounded-xl flex items-center justify-between text-xs shadow-md">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  botPaused ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'
                }`}
              />
              <span className="text-slate-300 font-medium">
                {botPaused ? 'Director Takeover Active' : 'AI Concierge Active (24/7)'}
              </span>
            </div>
            {botPaused ? (
              <button
                onClick={resumeBot}
                className="text-[11px] font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                <Zap className="w-3 h-3 fill-current" />
                Resume AI
              </button>
            ) : (
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Autonomous
              </span>
            )}
          </div>

          {/* Outer Phone Shell */}
          <div className="w-full max-w-[390px] h-[650px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-[#1E293B] flex flex-col relative overflow-hidden">
            {/* Phone Notch */}
            <div className="w-32 h-4 bg-slate-800 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-20" />

            {/* Inner Phone Screen */}
            <div className="w-full h-full bg-[#0B141A] rounded-[34px] flex flex-col overflow-hidden relative border border-slate-800">
              {/* WhatsApp App Bar */}
              <div className="bg-[#182032] text-white px-4 pt-6 pb-3 flex items-center justify-between shadow-md z-10 border-b border-[#1E293B]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#C5A880] flex items-center justify-center font-bold text-xs text-[#090D16] shadow">
                    SE
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm leading-tight text-white">Skyline Luxury Estates</h3>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          botPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
                        }`}
                      />
                      <span className="text-[11px] text-[#D4AF37] font-medium">
                        {botPaused ? 'Director Handover' : 'online 24/7 (AI Concierge)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 bg-[#090D16] px-2 py-0.5 rounded-md border border-[#1E293B]">
                    Gurugram
                  </span>
                </div>
              </div>

              {/* Chat Message List */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3 whatsapp-bg">
                {messages.map((m) => {
                  const isUser = m.sender === 'CUSTOMER';
                  const isSystem = m.intent === 'system';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${
                        isSystem ? 'items-center' : isUser ? 'items-end' : 'items-start'
                      } max-w-full`}
                    >
                      {isSystem ? (
                        <div className="bg-[#182032]/80 border border-[#D4AF37]/30 text-[#D4AF37] rounded-xl px-3 py-1 text-[11px] text-center my-1">
                          {m.text}
                        </div>
                      ) : (
                        <div
                          className={`rounded-2xl px-3.5 py-2.5 max-w-[88%] text-xs shadow-md relative leading-relaxed ${
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
                      )}
                    </div>
                  );
                })}

                {/* If bot is paused banner */}
                {botPaused && (
                  <div className="bg-amber-950/60 border border-amber-500/50 rounded-xl p-2.5 text-xs text-amber-200 flex flex-col gap-2 shadow-lg">
                    <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Director Human Takeover is active</span>
                    </div>
                    <p className="text-[10px] text-amber-300/90 leading-tight">
                      To resume automated AI responses for testing, click below:
                    </p>
                    <button
                      onClick={resumeBot}
                      className="w-full py-1.5 bg-[#D4AF37] hover:bg-[#C5A880] text-[#090D16] font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3 h-3 fill-current" />
                      Resume AI Concierge ⚡
                    </button>
                  </div>
                )}

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
                  placeholder="Inquire in Hinglish, Hindi, or English..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputText, false)}
                  className="flex-1 bg-[#090D16] text-xs px-3.5 py-2.5 rounded-full border border-[#1E293B] focus:outline-none focus:border-[#D4AF37] text-white"
                />
                <button
                  onClick={() => sendMessage(inputText, false)}
                  disabled={loading || !inputText.trim()}
                  className="w-9 h-9 rounded-full bg-[#D4AF37] hover:bg-[#C5A880] text-[#090D16] flex items-center justify-center transition disabled:opacity-50 shrink-0 font-bold shadow"
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
              <span className="text-[11px] text-slate-500">Live Inspector</span>
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
                      <div>Chauffeur: {debugTrace.appointment.chauffeur_pickup_required ? 'Mercedes-Benz Sedan' : 'Standard'}</div>
                      <div>Director: {debugTrace.appointment.doctor_or_staff}</div>
                    </div>
                  </div>
                )}

                {/* Broker Takeover Status */}
                {debugTrace.bot_paused && (
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2 text-amber-200">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Broker Takeover Active</span>
                    </div>
                    <p className="text-[11px] text-amber-300">
                      AI is paused. Check Live Conversations to chat directly as Managing Director Raghav Singhal.
                    </p>
                    <button
                      onClick={resumeBot}
                      className="w-full py-1 text-xs font-bold bg-[#D4AF37] text-[#090D16] rounded-lg hover:bg-[#C5A880] transition"
                    >
                      Resume AI Concierge
                    </button>
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
