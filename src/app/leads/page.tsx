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
  Building2,
  Gem,
  Compass,
  Car,
  TrendingUp,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import { Lead, LeadStatus, LeadTier } from '@/types';

const STAGES: { id: LeadStatus; label: string; color: string; badgeBg: string }[] = [
  { id: 'NEW', label: 'New Inquiries', color: 'border-blue-500/40 bg-blue-950/20', badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { id: 'QUALIFIED', label: 'Budget Qualified', color: 'border-emerald-500/40 bg-emerald-950/20', badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { id: 'SITE_VISIT_BOOKED', label: 'Site Tour Booked', color: 'border-amber-500/40 bg-amber-950/20', badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  { id: 'BOOKED', label: 'Private Tour Confirmed', color: 'border-amber-500/40 bg-amber-950/20', badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  { id: 'NEGOTIATION', label: 'In Negotiation', color: 'border-purple-500/40 bg-purple-950/20', badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
  { id: 'CLOSED', label: 'Sale Closed / Token', color: 'border-slate-500/40 bg-slate-950/20', badgeBg: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
];

export default function LeadsPipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'ALL' | LeadTier>('ALL');
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
      (l.budget_bracket && l.budget_bracket.toLowerCase().includes(search.toLowerCase()));

    const matchesTier = tierFilter === 'ALL' || l.lead_tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const ultraHniCount = leads.filter((l) => l.lead_tier === 'ULTRA_HNI').length;
  const highIntentCount = leads.filter((l) => l.lead_tier === 'HIGH_INTENT').length;
  const totalSiteVisits = leads.filter((l) => l.status === 'SITE_VISIT_BOOKED' || l.status === 'BOOKED').length;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
              High-Ticket PropTech CRM
            </span>
            <span className="text-xs text-slate-400">RERA Verified Inventory</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Luxury Buyer Pipeline & CRM
          </h1>
          <p className="text-sm text-slate-400">
            Autonomous WhatsApp qualification, floor plan delivery, and VIP site visit conversion for luxury developers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search buyer name, property, budget..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#111625] border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 w-64"
            />
          </div>

          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value as any)}
            className="bg-[#111625] border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          >
            <option value="ALL">All Buyer Tiers</option>
            <option value="ULTRA_HNI">Ultra-HNI (₹10 Cr+)</option>
            <option value="HIGH_INTENT">High Intent (₹5-10 Cr)</option>
            <option value="INVESTOR">NRI / Investor</option>
          </select>

          {/* View Switcher */}
          <div className="flex items-center bg-[#111625] border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                viewMode === 'kanban'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                viewMode === 'table'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {/* High-Ticket KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111625] border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Gem className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Ultra-HNI Prospects</div>
            <div className="text-lg font-bold text-white">{ultraHniCount} Buyers</div>
          </div>
        </div>

        <div className="bg-[#111625] border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Pipeline Value</div>
            <div className="text-lg font-bold text-white">₹48.5 Cr</div>
          </div>
        </div>

        <div className="bg-[#111625] border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Scheduled Tours</div>
            <div className="text-lg font-bold text-white">{totalSiteVisits} Site Visits</div>
          </div>
        </div>

        <div className="bg-[#111625] border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Projected Commission</div>
            <div className="text-lg font-bold text-amber-300">₹97.0 Lakhs</div>
          </div>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        /* Kanban Pipeline View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.id);
            return (
              <div
                key={stage.id}
                className="bg-[#0e1320] rounded-2xl p-3.5 border border-slate-800/90 min-w-[240px] flex flex-col space-y-3"
              >
                <div className="flex items-center justify-between px-1">
                  <span className="font-semibold text-xs text-slate-200">{stage.label}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stage.badgeBg}`}>
                    {stageLeads.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 min-h-[360px]">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-[#131929] hover:bg-[#161d30] rounded-xl p-3.5 border border-slate-800 hover:border-amber-500/40 shadow-sm space-y-2.5 text-xs transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {lead.name}
                        </h4>
                        {lead.bot_paused ? (
                          <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded shrink-0">
                            VIP Takeover
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded shrink-0">
                            AI Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{lead.phone}</span>
                        {lead.buyer_type && (
                          <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
                            {lead.buyer_type}
                          </span>
                        )}
                      </div>

                      {lead.service_interest && (
                        <div className="text-[11px] font-medium text-amber-200/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{lead.service_interest}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Target Budget:</span>
                        <span className="font-bold text-emerald-400">{lead.budget_bracket || '₹3.5 Cr+'}</span>
                      </div>

                      {lead.notes && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 italic bg-[#0a0e17] p-2 rounded-lg border border-slate-800/60">
                          &ldquo;{lead.notes}&rdquo;
                        </p>
                      )}

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                          className="bg-[#0b0f19] border border-slate-700 text-slate-300 rounded px-1.5 py-0.5 text-[10px] focus:outline-none"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <Link
                          href="/conversations"
                          className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                        >
                          Dossier
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="h-32 border border-dashed border-slate-800/60 rounded-xl flex items-center justify-center text-slate-600 text-[11px]">
                      No active buyers
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Table View */
        <div className="bg-[#111625] rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0c101c] text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Luxury Buyer / Investor</th>
                <th className="p-4">WhatsApp Contact</th>
                <th className="p-4">Target Property & Budget</th>
                <th className="p-4">Buyer Classification</th>
                <th className="p-4">Pipeline Status</th>
                <th className="p-4">AI Autonomous State</th>
                <th className="p-4">Last Activity</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#141b2c] transition">
                  <td className="p-4">
                    <div className="font-bold text-white">{lead.name}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Verified HNI
                    </div>
                  </td>
                  <td className="p-4 text-slate-400 font-mono">{lead.phone}</td>
                  <td className="p-4">
                    <div className="text-amber-200 font-medium">{lead.service_interest || 'Skyline Penthouses'}</div>
                    <div className="text-[11px] text-emerald-400 font-bold">{lead.budget_bracket || '₹4.5 Cr - ₹8.0 Cr'}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {lead.lead_tier || 'ULTRA_HNI'} ({lead.buyer_type || 'Investor'})
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md font-bold text-[10px] bg-slate-800 text-slate-200 border border-slate-700">
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {lead.bot_paused ? (
                      <span className="text-amber-400 font-semibold text-[11px] flex items-center gap-1">
                        <PauseCircle className="w-3.5 h-3.5" /> Managing Director Takeover
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                        <PlayCircle className="w-3.5 h-3.5" /> Autonomous AI Property Advisor
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-slate-400 text-[11px]">
                    {new Date(lead.last_message_at).toLocaleDateString()} {new Date(lead.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href="/conversations"
                      className="text-xs bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 font-semibold px-3 py-1.5 rounded-lg transition"
                    >
                      Open Dossier
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
