'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Bot,
  User,
  ShieldAlert,
  Send,
  Clock,
  Phone,
  Building2,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  CheckCheck,
  Sparkles,
  FileText,
  UserCheck,
  Compass,
} from 'lucide-react';
import { Lead, Message, MetaTemplate } from '@/types';

export default function RealEstateConversationsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [templates, setTemplates] = useState<MetaTemplate[]>([]);
  const [staffReplyText, setStaffReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data.leads || []);
      if (!selectedLead && data.leads?.length > 0) {
        setSelectedLead(data.leads[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMessages = async (leadId: string) => {
    try {
      const res = await fetch(`/api/conversations/${leadId}/messages`);
      const data = await res.json();
      setMessages(data.messages || []);
      if (data.lead) setSelectedLead(data.lead);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates');
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchTemplates();
    const interval = setInterval(fetchLeads, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedLead) {
      fetchMessages(selectedLead.id);
      const msgInterval = setInterval(() => fetchMessages(selectedLead.id), 4000);
      return () => clearInterval(msgInterval);
    }
  }, [selectedLead?.id]);

  const toggleTakeover = async () => {
    if (!selectedLead) return;
    setActionLoading(true);
    const newPaused = !selectedLead.bot_paused;
    try {
      const res = await fetch(`/api/conversations/${selectedLead.id}/takeover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot_paused: newPaused }),
      });
      const data = await res.json();
      if (data.success && data.lead) {
        setSelectedLead(data.lead);
        fetchLeads();
        fetchMessages(data.lead.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const sendStaffReply = async () => {
    if (!selectedLead || !staffReplyText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/conversations/${selectedLead.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: staffReplyText }),
      });
      const data = await res.json();
      if (data.success) {
        setStaffReplyText('');
        fetchMessages(selectedLead.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sendTemplate = async () => {
    if (!selectedLead || !selectedTemplateId) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: selectedTemplateId,
          lead_id: selectedLead.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedTemplateId('');
        fetchMessages(selectedLead.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const getCareWindowInfo = () => {
    if (!selectedLead?.last_message_at) return { active: true, label: 'Care window active' };
    const diffHours = (Date.now() - new Date(selectedLead.last_message_at).getTime()) / (1000 * 60 * 60);
    if (diffHours <= 24) {
      const remainingHours = Math.floor(24 - diffHours);
      return { active: true, label: `24h Care Window Active (${remainingHours}h remaining)` };
    }
    return { active: false, label: 'Care Window Expired (>24h silence). Use Meta Template' };
  };

  const careWindow = getCareWindowInfo();

  return (
    <div className="flex h-screen overflow-hidden bg-[#090D16]">
      {/* Column 1: Conversations List */}
      <div className="w-80 border-r border-[#1E293B] bg-[#111726] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#1E293B] space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-white">VIP Inquiries</h2>
            <span className="text-[10px] bg-[#182032] border border-[#1E293B] px-2 py-0.5 rounded-full font-bold text-[#D4AF37]">
              {leads.length} Active Buyers
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Live WhatsApp client threads</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#1E293B]">
          {leads.map((lead) => {
            const isSelected = selectedLead?.id === lead.id;
            return (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`p-3.5 cursor-pointer transition flex items-start gap-3 ${
                  isSelected
                    ? 'bg-[#182032] border-l-4 border-[#D4AF37]'
                    : 'hover:bg-[#182032]/50'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#090D16] border border-[#1E293B] flex items-center justify-center font-bold text-xs text-[#D4AF37] shrink-0">
                  {lead.name.slice(0, 2).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-xs text-white truncate">{lead.name}</h3>
                    <span className="text-[9px] text-slate-500">
                      {new Date(lead.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#D4AF37] font-semibold truncate mt-0.5">
                    {lead.budget_bracket || '₹3.5 Cr – ₹8.0 Cr'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {lead.bot_paused ? (
                      <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        BROKER ACTIVE
                      </span>
                    ) : (
                      <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        AI BOT ACTIVE
                      </span>
                    )}
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#090D16] text-slate-400 border border-[#1E293B]">
                      {lead.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Column 2: Active Chat & Broker Takeover */}
      <div className="flex-1 flex flex-col h-full bg-[#0B0F19] border-r border-[#1E293B]">
        {selectedLead ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-[#111726] border-b border-[#1E293B] flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#C5A880] flex items-center justify-center font-bold text-[#090D16] text-sm">
                  {selectedLead.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-sm text-white">{selectedLead.name}</h2>
                    <span className="text-xs text-slate-400">{selectedLead.phone}</span>
                    {selectedLead.lead_tier && (
                      <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40">
                        {selectedLead.lead_tier}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className={careWindow.active ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                      {careWindow.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Broker Takeover Switch */}
              <button
                onClick={toggleTakeover}
                disabled={actionLoading}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md ${
                  selectedLead.bot_paused
                    ? 'bg-[#D4AF37] hover:bg-[#C5A880] text-[#090D16]'
                    : 'bg-[#182032] hover:bg-[#1E293B] text-amber-300 border border-amber-500/40'
                }`}
              >
                {selectedLead.bot_paused ? (
                  <>
                    <PlayCircle className="w-4 h-4" /> Resume AI Concierge
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-4 h-4" /> Take Over (Pause AI)
                  </>
                )}
              </button>
            </div>

            {/* Takeover Notice Banner */}
            {selectedLead.bot_paused && (
              <div className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Broker Takeover Active:</strong> AI automated replies are paused for this buyer. You are replying directly as Director Raghav Singhal.
                  </span>
                </div>
                <button onClick={toggleTakeover} className="font-bold underline text-xs ml-2 hover:text-white">
                  Resume AI
                </button>
              </div>
            )}

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 whatsapp-bg">
              {messages.map((m) => {
                const isCustomer = m.sender === 'CUSTOMER';
                const isStaff = m.sender === 'STAFF';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'} max-w-full`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2.5 max-w-[75%] text-xs shadow-md space-y-1 ${
                        isCustomer
                          ? 'bg-[#182032] text-white rounded-tl-none border border-[#1E293B]'
                          : isStaff
                          ? 'bg-[#D4AF37] text-[#090D16] font-medium rounded-tr-none'
                          : 'bg-[#005C4B] text-white rounded-tr-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[9px] opacity-75 font-bold uppercase tracking-wider">
                        <span>{isCustomer ? 'Prospective Buyer' : isStaff ? 'Managing Director' : 'AI Luxury Consultant'}</span>
                        {m.intent && (
                          <span className="px-1 rounded bg-black/20 text-[8px]">
                            {m.intent}
                          </span>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{m.body}</p>
                      <div className="flex items-center justify-end gap-1 text-[10px] opacity-70">
                        <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {!isCustomer && <CheckCheck className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Controls */}
            <div className="p-3 bg-[#111726] border-t border-[#1E293B] space-y-2">
              {/* Template Quick Send */}
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[11px] font-semibold text-slate-400">Pre-Approved Real Estate Template:</span>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="text-xs bg-[#090D16] border border-[#1E293B] rounded-lg px-2 py-1 text-slate-200 focus:outline-none"
                >
                  <option value="">Select template...</option>
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name} ({tpl.category})
                    </option>
                  ))}
                </select>
                {selectedTemplateId && (
                  <button
                    onClick={sendTemplate}
                    disabled={actionLoading}
                    className="text-xs bg-[#D4AF37] hover:bg-[#C5A880] text-[#090D16] font-bold px-3 py-1 rounded-lg transition"
                  >
                    Dispatch Template
                  </button>
                )}
              </div>

              {/* Text Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={
                    selectedLead.bot_paused
                      ? 'Type confidential reply as Managing Director...'
                      : 'Type manual response (Will automatically pause AI)...'
                  }
                  value={staffReplyText}
                  onChange={(e) => setStaffReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendStaffReply()}
                  className="flex-1 bg-[#090D16] text-xs px-4 py-2.5 rounded-xl border border-[#1E293B] focus:outline-none focus:border-[#D4AF37] text-white"
                />
                <button
                  onClick={sendStaffReply}
                  disabled={loading || !staffReplyText.trim()}
                  className="bg-[#D4AF37] hover:bg-[#C5A880] text-[#090D16] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
            Select a high-ticket buyer inquiry to inspect dialogue and negotiate.
          </div>
        )}
      </div>

      {/* Column 3: Real Estate Buyer Dossier */}
      {selectedLead && (
        <div className="w-72 bg-[#111726] border-l border-[#1E293B] p-5 space-y-4 overflow-y-auto shrink-0 text-xs">
          <div>
            <h3 className="font-bold text-sm text-white">Buyer Dossier</h3>
            <p className="text-slate-400 text-[11px]">Synced with PropTech CRM</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#090D16] border border-[#1E293B] space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Target Budget Bracket</span>
              <p className="font-bold text-[#D4AF37] text-sm">
                {selectedLead.budget_bracket || '₹8.5 Cr – ₹14.0 Cr'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#090D16] border border-[#1E293B] space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Interested Development</span>
              <p className="font-semibold text-white">
                {selectedLead.service_interest || 'The Grand Horizon Penthouse'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#090D16] border border-[#1E293B] space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Site Visit Slot</span>
              <p className="font-semibold text-white">
                {selectedLead.preferred_date || 'Sunday 11:00 AM'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#090D16] border border-[#1E293B] space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Buyer Classification</span>
              <p className="font-semibold text-white">
                {selectedLead.buyer_type || 'End-User (Luxury)'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#090D16] border border-[#1E293B] space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Consultant Notes</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {selectedLead.notes || 'Inquired on WhatsApp for luxury floor plan.'}
              </p>
            </div>

            {/* DPDP Consent */}
            <div className="p-3 rounded-xl bg-[#182032] border border-[#1E293B] space-y-1 text-slate-300">
              <div className="flex items-center gap-1.5 font-bold text-[#D4AF37]">
                <UserCheck className="w-3.5 h-3.5" />
                <span>RERA & DPDP Consent</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Buyer opt-in confirmed for WhatsApp floor plan and pricing updates.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
