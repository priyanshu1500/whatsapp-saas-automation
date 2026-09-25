'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  Play,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  IndianRupee,
  Compass,
  CheckCircle2,
  Car,
} from 'lucide-react';
import { Lead } from '@/types';

export default function RealEstateDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [cronTriggering, setCronTriggering] = useState(false);
  const [cronMessage, setCronMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setMetrics(data.metrics);
      setRecentLeads(data.leads?.slice(0, 5) || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 8000);
    return () => clearInterval(timer);
  }, []);

  const triggerReminderCron = async () => {
    setCronTriggering(true);
    setCronMessage(null);
    try {
      const res = await fetch('/api/cron/reminders', { method: 'POST' });
      const data = await res.json();
      setCronMessage(
        `Scanned ${data.scannedCount} site visits. Dispatched ${data.dispatchedCount} VIP reminder templates!`
      );
      loadData();
    } catch (e) {
      setCronMessage('Failed to trigger reminder cron.');
    } finally {
      setCronTriggering(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-enter">
      {/* Top Banner / Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-[#0B0F19] via-[#111726] to-[#182032] border border-[#1E293B] text-white p-6 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40 tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping mr-1.5" />
              Meta Cloud API v20.0 Active
            </span>
            <span className="text-xs text-slate-400">RERA: HARERA-GGM-2024-9182</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Skyline Luxury Estates • Sales Engine & OS
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Autonomous 24/7 WhatsApp concierge qualifying Ultra-HNI buyers, quoting RERA pricing in ₹ Crores, and scheduling private chauffeur site visits.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Link
            href="/simulator"
            className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C5A880] text-[#090D16] font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-[#D4AF37]/20 text-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Launch Real Estate Simulator
          </Link>
          <button
            onClick={triggerReminderCron}
            disabled={cronTriggering}
            className="flex items-center gap-2 bg-[#182032] hover:bg-[#1E293B] text-slate-200 font-semibold px-4 py-2.5 rounded-xl transition text-xs border border-[#1E293B]"
          >
            <Clock className={`w-3.5 h-3.5 text-[#D4AF37] ${cronTriggering ? 'animate-spin' : ''}`} />
            Run 24h Site Tour Reminders
          </button>
        </div>

        {/* Ambient gold glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {cronMessage && (
        <div className="bg-[#111726] border border-[#D4AF37]/40 text-[#D4AF37] px-4 py-3 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>{cronMessage}</span>
          </div>
          <button onClick={() => setCronMessage(null)} className="text-xs text-slate-400 hover:underline">Dismiss</button>
        </div>
      )}

      {/* High-Ticket Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pipeline Value in Crores */}
        <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 shadow-lg space-y-3 hover:border-[#D4AF37]/50 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Deal Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/20">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-white">
              ₹{loading ? '...' : metrics?.estimatedPipelineCr || '48.5'} Cr
            </h3>
            <span className="text-xs font-semibold text-[#D4AF37]">+3 Deals</span>
          </div>
          <div className="text-[11px] text-slate-400">In active WhatsApp negotiations</div>
        </div>

        {/* Card 2: Confirmed Site Visits */}
        <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 shadow-lg space-y-3 hover:border-[#D4AF37]/50 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">VIP Site Visits</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-white">
              {loading ? '...' : metrics?.bookedSiteVisits || 3}
            </h3>
            <span className="text-xs font-semibold text-teal-400">
              {loading ? '...' : `${metrics?.conversionRate || 33}% Tour Rate`}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">Chauffeur escorted tours booked</div>
        </div>

        {/* Card 3: Projected Broker Commission */}
        <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 shadow-lg space-y-3 hover:border-[#D4AF37]/50 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Projected Commission</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-white">
              ₹{loading ? '...' : metrics?.projectedCommissionLakhs || '97.0'} L
            </h3>
            <span className="text-xs font-semibold text-indigo-400">@ 2% Dev Fee</span>
          </div>
          <div className="text-[11px] text-slate-400">From high-intent pipeline closings</div>
        </div>

        {/* Card 4: Broker Takeovers */}
        <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-5 shadow-lg space-y-3 hover:border-[#D4AF37]/50 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Broker Escalations</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-white">
              {loading ? '...' : metrics?.humanTakeovers || 1}
            </h3>
            <span className="text-xs font-semibold text-amber-400">Bot Paused</span>
          </div>
          <div className="text-[11px] text-slate-400">Director managing payment plans</div>
        </div>
      </div>

      {/* Main Grid: Live WhatsApp Buyer Feed & Meta Rate Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent WhatsApp Leads */}
        <div className="lg:col-span-2 bg-[#111726] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">High-Ticket Buyer Inquiries</h2>
              <p className="text-xs text-slate-400">Qualified leads engaging through WhatsApp ads & referrals</p>
            </div>
            <Link
              href="/conversations"
              className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              Open Live Inbox <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#1E293B]">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#182032] border border-[#1E293B] flex items-center justify-center text-[#D4AF37] font-bold text-xs shrink-0">
                    {lead.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{lead.name}</span>
                      <span className="text-xs text-slate-500">{lead.phone}</span>
                      {lead.lead_tier && (
                        <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                          {lead.lead_tier}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-md">{lead.notes || 'Inquired on WhatsApp'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {lead.bot_paused ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      Broker Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      AI Active
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#182032] text-slate-300 border border-[#1E293B]">
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Meta API Rate Card & RERA Guardrails */}
        <div className="space-y-6">
          {/* Card: Real Estate WhatsApp Meta Cost */}
          <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Meta Cloud API Line</h2>
              <span className="text-xs text-slate-400">Current Cycle</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>AI Service Replies ({metrics?.metaCost?.serviceRepliesCount || 0})</span>
                <span className="font-semibold text-white">
                  ₹{metrics?.metaCost?.subtotalInr ? (metrics.metaCost.serviceRepliesCount <= 1000 ? '0.00 (1k Free)' : '₹' + metrics.metaCost.subtotalInr) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Site Visit Reminders ({metrics?.metaCost?.utilityCount || 0})</span>
                <span className="font-semibold text-white">
                  ₹{((metrics?.metaCost?.utilityCount || 0) * 0.115).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (18% on Meta charges)</span>
                <span className="font-semibold text-white">
                  ₹{metrics?.metaCost?.gst18Inr || '0.00'}
                </span>
              </div>
              <div className="pt-2 border-t border-[#1E293B] flex justify-between font-bold text-xs text-white">
                <span>Total Monthly Cost</span>
                <span className="text-[#D4AF37]">₹{metrics?.metaCost?.totalInr || '0.00'}</span>
              </div>
            </div>

            <Link
              href="/calculator"
              className="w-full text-center block bg-[#182032] hover:bg-[#1E293B] text-xs font-semibold text-[#D4AF37] py-2.5 rounded-xl border border-[#1E293B] transition"
            >
              Open Brokerage $1,000/mo ROI Model
            </Link>
          </div>

          {/* Card: RERA & Meta 2026 Guardrails Status */}
          <div className="bg-[#090D16] text-slate-200 rounded-2xl p-5 space-y-3 border border-[#1E293B]">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">RERA & Meta 2026 Active</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complies with HARERA disclosure standards and Meta Jan 15 2026 guidelines. Only answers verified project facts, floor plans, and schedules site tours.
            </p>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>Hinglish/English PropTech NLP</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
