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
  Calendar,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  CheckCheck,
  Sparkles,
  FileText,
  UserCheck,
} from 'lucide-react';
import { Lead, Message, MetaTemplate } from '@/types';

export default function ConversationsPage() {
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

  // 24-Hour Customer Care Window calculation
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
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Column 1: Conversations List (w-80) */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Conversations</h2>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-semibold text-slate-600 dark:text-slate-400">
              {leads.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500">Real-time WhatsApp customer threads</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {leads.map((lead) => {
            const isSelected = selectedLead?.id === lead.id;
            return (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`p-3.5 cursor-pointer transition flex items-start gap-3 ${
                  isSelected
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-l-4 border-emerald-600'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 shrink-0">
                  {lead.name.slice(0, 2).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-xs text-slate-900 dark:text-white truncate">{lead.name}</h3>
                    <span className="text-[10px] text-slate-400">
                      {new Date(lead.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{lead.phone}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {lead.bot_paused ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        HUMAN TAKEOVER
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        AI BOT ACTIVE
                      </span>
                    )}
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {lead.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Column 2: Active Chat & Staff Reply Box */}
      <div className="flex-1 flex flex-col h-full bg-slate-100 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">
        {selectedLead ? (
          <>
            {/* Chat Header with Takeover Toggle & Care Window */}
            <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
                  {selectedLead.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-sm text-slate-900 dark:text-white">{selectedLead.name}</h2>
                    <span className="text-xs text-slate-500">{selectedLead.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className={careWindow.active ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
                      {careWindow.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bot Pause / Takeover Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTakeover}
                  disabled={actionLoading}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                    selectedLead.bot_paused
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  {selectedLead.bot_paused ? (
                    <>
                      <PlayCircle className="w-4 h-4" /> Resume AI Bot
                    </>
                  ) : (
                    <>
                      <PauseCircle className="w-4 h-4" /> Take Over (Pause AI)
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Takeover Notice Banner */}
            {selectedLead.bot_paused && (
              <div className="bg-amber-50 dark:bg-amber-950/60 border-b border-amber-200 dark:border-amber-800 px-4 py-2 text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Human Takeover Active:</strong> AI automated replies are paused for this lead. You are chatting as clinic receptionist/staff.
                  </span>
                </div>
                <button
                  onClick={toggleTakeover}
                  className="font-bold underline hover:text-amber-950 text-xs ml-2"
                >
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
                      className={`rounded-2xl px-4 py-2.5 max-w-[75%] text-xs shadow-sm space-y-1 ${
                        isCustomer
                          ? 'bg-white dark:bg-[#202C33] text-slate-900 dark:text-white rounded-tl-none border border-slate-200 dark:border-slate-700'
                          : isStaff
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-[#DCF8C6] dark:bg-[#005C4B] text-slate-900 dark:text-white rounded-tr-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 font-semibold">
                        <span>{isCustomer ? 'Patient' : isStaff ? 'Human Staff' : 'AI Assistant'}</span>
                        {m.intent && (
                          <span className="uppercase text-[9px] px-1 rounded bg-black/10">
                            {m.intent}
                          </span>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{m.body}</p>
                      <div className="flex items-center justify-end gap-1 text-[10px] opacity-70">
                        <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {!isCustomer && <CheckCheck className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Controls */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2">
              {/* Template Quick Send Dropdown */}
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-semibold text-slate-500">Send Pre-Approved Template:</span>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200"
                >
                  <option value="">Select template...</option>
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name} ({tpl.category} - ₹{tpl.cost_inr})
                    </option>
                  ))}
                </select>
                {selectedTemplateId && (
                  <button
                    onClick={sendTemplate}
                    disabled={actionLoading}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg"
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
                      ? 'Type reply as clinic staff (Bot is paused)...'
                      : 'Type manual reply (Will automatically pause bot if needed)...'
                  }
                  value={staffReplyText}
                  onChange={(e) => setStaffReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendStaffReply()}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white"
                />
                <button
                  onClick={sendStaffReply}
                  disabled={loading || !staffReplyText.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Select a conversation to view chat and manage takeover.
          </div>
        )}
      </div>

      {/* Column 3: Lead Details & DPDP Info (w-72) */}
      {selectedLead && (
        <div className="w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-5 space-y-5 overflow-y-auto shrink-0 text-xs">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Patient Profile</h3>
            <p className="text-slate-400 text-[11px]">Synced with CRM & Supabase</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Phone Number</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedLead.phone}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Interested Service</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedLead.service_interest || 'General Dentistry'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Preferred Slot</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedLead.preferred_date || 'Flexible'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedLead.status}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Notes & Handoff</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                {selectedLead.notes || 'No staff notes.'}
              </p>
            </div>

            {/* DPDP Privacy Badge */}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1 text-emerald-900 dark:text-emerald-300">
              <div className="flex items-center gap-1.5 font-bold">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>DPDP Consent Granted</span>
              </div>
              <p className="text-[10px] text-emerald-800 dark:text-emerald-200">
                Consent recorded via WhatsApp message initiation.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
