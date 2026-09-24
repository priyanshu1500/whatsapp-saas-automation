'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  PauseCircle,
  PlayCircle,
  ArrowRight,
  MoreVertical,
} from 'lucide-react';
import { Lead, LeadStatus } from '@/types';

const STAGES: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'NEW', label: 'New Lead', color: 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/20' },
  { id: 'CONTACTED', label: 'In Conversation', color: 'border-purple-400 bg-purple-50/50 dark:bg-purple-950/20' },
  { id: 'QUALIFIED', label: 'Qualified', color: 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20' },
  { id: 'BOOKED', label: 'Appointment Booked', color: 'border-teal-400 bg-teal-50/50 dark:bg-teal-950/20' },
  { id: 'NEEDS_STAFF', label: 'Needs Staff Attention', color: 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20' },
  { id: 'CLOSED', label: 'Completed / Closed', color: 'border-slate-400 bg-slate-50/50 dark:bg-slate-950/20' },
];

export default function LeadsPipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateLeadStatus = async (id: string, newStatus: LeadStatus) => {
    try {
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      fetchLeads();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      (l.service_interest && l.service_interest.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lead Pipeline & CRM</h1>
          <p className="text-sm text-slate-500">Track patients acquired through WhatsApp ads and organic direct chats</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                viewMode === 'kanban' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                viewMode === 'table' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.id);
            return (
              <div
                key={stage.id}
                className="bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800 min-w-[220px] flex flex-col space-y-3"
              >
                <div className="flex items-center justify-between px-1">
                  <span className="font-bold text-xs text-slate-700 dark:text-slate-300">{stage.label}</span>
                  <span className="text-[11px] font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 min-h-[300px]">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white dark:bg-slate-800/90 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 text-xs hover:border-emerald-500 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{lead.name}</h4>
                        {lead.bot_paused && (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.5 rounded shrink-0">
                            Takeover
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500">{lead.phone}</div>

                      {lead.service_interest && (
                        <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-md">
                          {lead.service_interest}
                        </div>
                      )}

                      <p className="text-[11px] text-slate-500 line-clamp-2">{lead.notes || 'Inquired via WhatsApp'}</p>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                          className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 text-[10px]"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <Link
                          href="/conversations"
                          className="text-emerald-600 hover:text-emerald-500 font-semibold"
                        >
                          Chat
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">WhatsApp Phone</th>
                <th className="p-4">Service Interest</th>
                <th className="p-4">Status</th>
                <th className="p-4">AI Bot State</th>
                <th className="p-4">Last Active</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-4 font-semibold text-slate-900 dark:text-white">{lead.name}</td>
                  <td className="p-4 text-slate-500">{lead.phone}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">
                    {lead.service_interest || 'General Dentistry'}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {lead.bot_paused ? (
                      <span className="text-amber-600 font-semibold text-[11px]">Human Takeover</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold text-[11px]">AI Bot Responding</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-400">
                    {new Date(lead.last_message_at).toLocaleDateString()} {new Date(lead.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href="/conversations"
                      className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition"
                    >
                      Open Chat
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
