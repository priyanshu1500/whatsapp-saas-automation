'use client';

import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  CheckCheck,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Info,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface ChatBubble {
  id: string;
  sender: 'CUSTOMER' | 'BOT';
  text: string;
  time: string;
  intent?: string;
}

const PRESET_QUERIES = [
  { label: '💰 Price Inquiry (Hinglish)', text: 'Hi, teeth cleaning ka kitna charge hai?' },
  { label: '📅 Appointment Booking', text: 'Can I book an appointment for tomorrow at 4 PM?' },
  { label: '🏥 Root Canal Cost', text: 'Mujhe RCT karwana hai, price list bataiye' },
  { label: '👨‍⚕️ Human Escalation', text: 'Mujhe bohot tez dard ho raha hai, doctor se baat karni hai' },
  { label: '🤖 Bot Disclosure Test', text: 'Are you a bot or real human?' },
  { label: '🚫 Meta 2026 Guardrail (Poem)', text: 'Write me a poem about the monsoon season' },
  { label: '💊 Medical Advice Test', text: 'Daant me dard ke liye koun si antibiotic dawai lu?' },
];

export default function SimulatorPage() {
  const [messages, setMessages] = useState<ChatBubble[]>([
    {
      id: 'init-1',
      sender: 'BOT',
      text: 'Namaste! Welcome to Smile Clinic Delhi. How can I assist you with your dental care today? Feel free to ask about our service prices or book an appointment.',
      time: '10:00 AM',
      intent: 'greeting',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugTrace, setDebugTrace] = useState<any>(null);
  const [customerName, setCustomerName] = useState('Priya Sharma');
  const [customerPhone, setCustomerPhone] = useState('+919876543299');

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
        text: 'Namaste! Welcome to Smile Clinic Delhi. How can I assist you with your dental care today? Feel free to ask about our service prices or book an appointment.',
        time: '10:00 AM',
        intent: 'greeting',
      },
    ]);
    setDebugTrace(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">WhatsApp Agent Sandbox Simulator</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
              Zero-Meta-Cost Sandbox
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Test the AI agent, Meta 2026 task policies, appointment bookings, and Hinglish dialogue without a live Meta SIM.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Conversation
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Preset Test Queries & Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Contact Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Simulated Prospect</h2>
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-slate-500 font-medium">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-slate-500 font-medium">Phone Number (E.164)</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Quick Click Prompts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Quick Test Prompts</h2>
              <span className="text-[11px] text-slate-400">Click to Send</span>
            </div>

            <div className="flex flex-col gap-2">
              {PRESET_QUERIES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(preset.text)}
                  disabled={loading}
                  className="text-left p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-xs transition space-y-0.5 group"
                >
                  <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                    {preset.label}
                  </div>
                  <div className="text-slate-500 text-[11px] truncate italic">"{preset.text}"</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: WhatsApp Mobile Phone Frame (5 cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[390px] h-[640px] bg-slate-900 rounded-[42px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col relative overflow-hidden">
            {/* Phone Notch */}
            <div className="w-32 h-4 bg-slate-800 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-20" />

            {/* Inner Phone Screen */}
            <div className="w-full h-full bg-[#EFEAE2] dark:bg-[#0B141A] rounded-[32px] flex flex-col overflow-hidden relative border border-slate-700/30">
              {/* WhatsApp App Bar */}
              <div className="bg-[#075E54] dark:bg-[#202C33] text-white px-4 pt-6 pb-3 flex items-center justify-between shadow-md z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white shadow">
                    SC
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm leading-tight">Smile Clinic Delhi</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] text-emerald-200 font-medium">online 24/7 (AI Agent)</span>
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
                        className={`rounded-2xl px-3.5 py-2 max-w-[85%] text-xs shadow-sm relative leading-relaxed ${
                          isUser
                            ? 'bg-[#DCF8C6] dark:bg-[#005C4B] text-slate-900 dark:text-white rounded-tr-none'
                            : 'bg-white dark:bg-[#202C33] text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                          <span>{m.time}</span>
                          {isUser && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {loading && (
                  <div className="flex items-center gap-2 bg-white dark:bg-[#202C33] rounded-2xl px-3.5 py-2 text-xs text-slate-500 w-fit shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] italic ml-1">AI agent typing...</span>
                  </div>
                )}
              </div>

              {/* Input Field */}
              <div className="p-2 bg-[#F0F2F5] dark:bg-[#202C33] flex items-center gap-2 border-t border-slate-200 dark:border-slate-800">
                <input
                  type="text"
                  placeholder="Type a message like a patient..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputText)}
                  className="flex-1 bg-white dark:bg-[#2A3942] text-xs px-3.5 py-2.5 rounded-full border-none focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
                <button
                  onClick={() => sendMessage(inputText)}
                  disabled={loading || !inputText.trim()}
                  className="w-9 h-9 rounded-full bg-[#00A884] hover:bg-[#008f70] text-white flex items-center justify-center transition disabled:opacity-50 shrink-0"
                >
                  <Send className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Live Trace & Side-Effects (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">AI Real-time Trace</h2>
              <span className="text-xs text-slate-400">Inspector</span>
            </div>

            {debugTrace ? (
              <div className="space-y-3 text-xs">
                {/* Intent Tag */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Detected Intent</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      debugTrace.intent === 'book' ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300' :
                      debugTrace.intent === 'human' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      debugTrace.intent === 'refusal' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                      'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                    }`}>
                      {debugTrace.intent.toUpperCase()}
                    </span>
                    <span className="text-slate-500">{debugTrace.debug?.latencyMs}ms latency</span>
                  </div>
                </div>

                {/* Service Matched */}
                {debugTrace.service && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Matched Catalog Item</span>
                    <p className="font-semibold text-slate-900 dark:text-white">{debugTrace.service}</p>
                  </div>
                )}

                {/* Appointment Created Side-Effect */}
                {debugTrace.appointment && (
                  <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-1.5 text-teal-900 dark:text-teal-300">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>Slot Auto-Booked in DB!</span>
                    </div>
                    <div className="text-[11px] space-y-0.5 text-teal-800 dark:text-teal-200">
                      <div>Date: {debugTrace.appointment.date}</div>
                      <div>Time: {debugTrace.appointment.time_slot}</div>
                      <div>Doctor: {debugTrace.appointment.doctor_or_staff}</div>
                    </div>
                  </div>
                )}

                {/* Bot Paused Status */}
                {debugTrace.bot_paused && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1 text-amber-900 dark:text-amber-300">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Bot Takeover Active</span>
                    </div>
                    <p className="text-[11px] text-amber-800 dark:text-amber-200">
                      Bot auto-replies are paused. Check Live Conversations page to take over as human.
                    </p>
                  </div>
                )}

                {/* Rationale */}
                {debugTrace.debug?.reasoning && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">AI Logic Rationale</span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                      {debugTrace.debug.reasoning}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                Send a message in the simulator to see live parsed JSON, latency, and DB side-effects.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
