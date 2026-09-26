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
  Building,
  Key,
  ShieldCheck,
  TrendingUp,
  Award,
  Crown,
  Car,
  ChevronRight,
  ExternalLink,
  UserCheck,
} from 'lucide-react';
import { Lead, LeadStatus } from '@/types';

const STAGES: { id: LeadStatus; label: string; sublabel: string; color: string; badge: string }[] = [
  {
    id: 'NEW',
    label: 'New HNI Inquiry',
    sublabel: 'WhatsApp Ad / Direct Inbound',
    color: 'border-blue-500/30 bg-blue-500/5',
    badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  },
  {
    id: 'CONTACTED',
    label: 'Discovery & Profiling',
    sublabel: 'AI Inquiring Specs & Budget',
    color: 'border-purple-500/30 bg-purple-500/5',
    badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  },
  {
    id: 'QUALIFIED',
    label: 'High-Intent Qualified',
    sublabel: 'Budget & Timeline Verified',
    color: 'border-amber-500/40 bg-amber-500/5',
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  },
  {
    id: 'BOOKED',
    label: 'Site Visit Scheduled',
    sublabel: 'Private Tour & Gate Pass Issued',
    color: 'border-emerald-500/30 bg-emerald-500/5',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'NEEDS_STAFF',
    label: 'Sales Director Takeover',
    sublabel: 'VIP Consultation Escalation',
    color: 'border-rose-500/30 bg-rose-500/5',
    badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  },
  {
    id: 'CLOSED',
    label: 'Booking Token Received',
    sublabel: 'Deal Secured / Escrow Initiated',
    color: 'border-slate-500/30 bg-slate-500/5',
    badge: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
  },
];

export default function LeadsPipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'ALL' | 'ULTRA_HNI' | 'HIGH_INTENT' | 'INVESTOR'>('ALL');
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

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      (l.service_interest && l.service_interest.toLowerCase().includes(search.toLowerCase())) ||
      (l.property_interest && l.property_interest.toLowerCase().includes(search.toLowerCase()));

    const matchesTier = tierFilter === 'ALL' || l.lead_tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const totalPipelineValue = leads.reduce((acc, lead) => {
    const val = lead.deal_value_estimate || 0;
    return acc + val;
  }, 0);

  const ultraHniCount = leads.filter((l) => l.lead_tier === 'ULTRA_HNI').length;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
              High-Ticket PropTech CRM
            </span>
            <span className="text-xs text-slate-400">RERA Verified Client Base</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Ultra-HNI Buyer Pipeline & Concierge
          </h1>
          <p className="text-sm text-slate-400">
            Automated WhatsApp qualification and VIP sales director routing for luxury real estate transactions.
          </p>
        </div>

        {/* Pipeline Value pill */}
        <div className="flex items-center gap-4 bg-[#111625] border border-slate-800 rounded-2xl p-3 px-5 shadow-sm">
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Active Pipeline
            </div>
            <div className="text-xl font-bold text-amber-300 font-mono">
              ₹{(totalPipelineValue / 10000000).toFixed(2)} Cr
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Ultra-HNI Leads
            </div>
            <div className="text-xl font-bold text-white font-mono flex items-center gap-1">
              <Crown className="w-4 h-4 text-amber-400 inline" />
              {ultraHniCount}
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111625] p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by buyer name, phone, or luxury development..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#090D16] border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </div>

          {/* Tier Filter tabs */}
          <div className="hidden sm:flex items-center gap-1 bg-[#090D16] p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setTierFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                tierFilter === 'ALL'
                  ? 'bg-amber-500/20 text-amber-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Tiers
            </button>
            <button
              onClick={() => setTierFilter('ULTRA_HNI')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
                tierFilter === 'ULTRA_HNI'
                  ? 'bg-amber-500/20 text-amber-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-3 h-3 text-amber-400" />
              Ultra-HNI
            </button>
            <button
              onClick={() => setTierFilter('HIGH_INTENT')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                tierFilter === 'HIGH_INTENT'
                  ? 'bg-amber-500/20 text-amber-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              High Intent
            </button>
            <button
              onClick={() => setTierFilter('INVESTOR')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                tierFilter === 'INVESTOR'
                  ? 'bg-amber-500/20 text-amber-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Investors
            </button>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#090D16] border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                viewMode === 'kanban'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                viewMode === 'table'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Portfolio Table
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex items-center justify-center">
          <div className="text-slate-400 text-xs flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span>Syncing RERA WhatsApp Buyer Pipeline...</span>
          </div>
        </div>
      ) : viewMode === 'kanban' ? (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-6">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.id);
            const stageValue = stageLeads.reduce((acc, l) => acc + (l.deal_value_estimate || 0), 0);

            return (
              <div
                key={stage.id}
                className={`bg-[#0d121d] rounded-2xl p-3 border ${stage.color} min-w-[240px] flex flex-col space-y-3`}
              >
                {/* Stage Header */}
                <div className="px-1 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white truncate">{stage.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stage.badge}`}>
                      {stageLeads.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span className="truncate">{stage.sublabel}</span>
                    <span className="text-amber-400 font-mono font-semibold">
                      ₹{(stageValue / 10000000).toFixed(1)} Cr
                    </span>
                  </div>
                </div>

                {/* Lead Cards */}
                <div className="space-y-3 flex-1 min-h-[350px]">
                  {stageLeads.length === 0 ? (
                    <div className="h-28 border border-dashed border-slate-800/80 rounded-xl flex items-center justify-center text-[11px] text-slate-500">
                      No buyers in this stage
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-[#111625] rounded-xl p-3.5 border border-slate-800 shadow-sm space-y-2.5 text-xs hover:border-amber-500/50 transition group"
                      >
                        {/* Header: Name + VIP tag */}
                        <div className="flex items-start justify-between gap-1.5">
                          <div>
                            <h4 className="font-bold text-white group-hover:text-amber-300 transition truncate">
                              {lead.name}
                            </h4>
                            <div className="text-[10px] text-slate-400 font-mono">{lead.phone}</div>
                          </div>
                          {lead.lead_tier === 'ULTRA_HNI' && (
                            <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                              <Crown className="w-2.5 h-2.5" />
                              Ultra HNI
                            </span>
                          )}
                          {lead.lead_tier === 'INVESTOR' && (
                            <span className="text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 px-1.5 py-0.5 rounded shrink-0">
                              Investor
                            </span>
                          )}
                        </div>

                        {/* Property & Budget Pill */}
                        <div className="p-2 rounded-lg bg-[#090D16] border border-slate-800/80 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400 truncate">
                              {lead.property_interest || lead.service_interest || 'Luxury Suite'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between font-mono text-[10px]">
                            <span className="text-slate-500">Budget Bracket:</span>
                            <span className="text-amber-400 font-bold">
                              {lead.budget_range || (lead.deal_value_estimate ? `₹${(lead.deal_value_estimate / 10000000).toFixed(1)} Cr` : '₹4.5 - ₹7 Cr')}
                            </span>
                          </div>
                        </div>

                        {/* Notes snippet */}
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {lead.notes || 'Inquired through WhatsApp Real Estate Campaign'}
                        </p>

                        {/* AI / Takeover Indicator */}
                        <div className="flex items-center justify-between text-[10px] pt-1">
                          {lead.bot_paused ? (
                            <span className="text-rose-400 font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                              Director Active
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              AI Concierge
                            </span>
                          )}
                          <span className="text-slate-500">
                            {new Date(lead.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Stage Selector & Action */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                            className="bg-[#090D16] border border-slate-800 rounded px-1.5 py-1 text-[10px] text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50 max-w-[130px]"
                          >
                            {STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                          <Link
                            href="/conversations"
                            className="text-amber-400 hover:text-amber-300 font-bold text-[11px] flex items-center gap-0.5"
                          >
                            <span>Dossier</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#111625] rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090D16] text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Buyer & HNI Classification</th>
                <th className="p-4">WhatsApp Contact</th>
                <th className="p-4">Target Development</th>
                <th className="p-4">Budget Range</th>
                <th className="p-4">Current Pipeline Stage</th>
                <th className="p-4">Concierge State</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-4">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{lead.name}</span>
                      {lead.lead_tier === 'ULTRA_HNI' && (
                        <Crown className="w-3.5 h-3.5 text-amber-400 inline" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {lead.lead_tier === 'ULTRA_HNI'
                        ? 'Ultra-HNI Private Client'
                        : lead.lead_tier === 'INVESTOR'
                        ? 'Institutional / Portfolio Investor'
                        : 'Pre-Qualified Homebuyer'}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-300">{lead.phone}</td>
                  <td className="p-4 text-slate-200 font-medium">
                    {lead.property_interest || lead.service_interest || 'Golf Course Luxury Residence'}
                  </td>
                  <td className="p-4 font-mono text-amber-400 font-semibold">
                    {lead.budget_range || (lead.deal_value_estimate ? `₹${(lead.deal_value_estimate / 10000000).toFixed(2)} Cr` : '₹4.50 Cr')}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {STAGES.find((s) => s.id === lead.status)?.label || lead.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {lead.bot_paused ? (
                      <span className="text-rose-400 font-semibold text-[11px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                        Sales Director Takeover
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Autonomous AI Active
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href="/conversations"
                      className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1 shadow-sm active:scale-[0.98]"
                    >
                      <span>Open Dossier</span>
                      <ExternalLink className="w-3 h-3" />
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
