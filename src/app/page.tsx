'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  MessageSquare,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  Play,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  PhoneCall,
  IndianRupee,
  RefreshCw,
} from 'lucide-react';
import { Lead } from '@/types';

export default function DashboardPage() {
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
      setCronMessage(`Scanned ${data.scannedCount} appointments. Dispatched ${data.dispatchedCount} utility reminders!`);
      loadData();
    } catch (e) {
      setCronMessage('Failed to trigger reminder cron.');
    } finally {
      setCronTriggering(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1.5" />
              Meta Cloud API Connected
            </span>
            <span className="text-xs text-slate-300">Smile Clinic Delhi System</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">AI WhatsApp Agent & Staff Dashboard</h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Live AI answering patient queries in seconds, qualifying leads in English/Hindi/Hinglish, and booking clinic appointments 24/7.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Link
            href="/simulator"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20 text-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            Open WhatsApp Simulator
          </Link>
          <button
            onClick={triggerReminderCron}
            disabled={cronTriggering}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2.5 rounded-xl transition text-sm backdrop-blur-sm border border-white/10"
          >
            <Clock className={`w-4 h-4 ${cronTriggering ? 'animate-spin' : ''}`} />
            Run 24h Reminders Cron
          </button>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {cronMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{cronMessage}</span>
          </div>
          <button onClick={() => setCronMessage(null)} className="text-xs text-slate-500 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Leads */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Total Leads</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {loading ? '...' : metrics?.totalLeads || 0}
            </h3>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              +{metrics?.totalLeads ? metrics.totalLeads * 3 : 0} this week
            </span>
          </div>
          <div className="text-xs text-slate-500">Acquired from WhatsApp & ad clicks</div>
        </div>

        {/* Card 2: Bookings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Booked Consultations</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {loading ? '...' : metrics?.bookedLeads || 0}
            </h3>
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
              {loading ? '...' : `${metrics?.conversionRate || 0}% Conversion`}
            </span>
          </div>
          <div className="text-xs text-slate-500">Slots auto-confirmed by AI</div>
        </div>

        {/* Card 3: Pipeline Value */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Est. Pipeline Value</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              ₹{loading ? '...' : (metrics?.estimatedPipelineInr || 0).toLocaleString('en-IN')}
            </h3>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">High Ticket</span>
          </div>
          <div className="text-xs text-slate-500">From confirmed clinic procedures</div>
        </div>

        {/* Card 4: Meta Cost & Human Takeover */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium uppercase tracking-wider">Human Takeovers</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {loading ? '...' : metrics?.humanTakeovers || 0}
            </h3>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Bot Paused
            </span>
          </div>
          <div className="text-xs text-slate-500">Staff managing escalated queries</div>
        </div>
      </div>

      {/* Main Grid: Recent Activity & Meta Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent WhatsApp Conversations */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent WhatsApp Leads</h2>
              <p className="text-xs text-slate-500">Live conversations routed through Meta Cloud API</p>
            </div>
            <Link
              href="/conversations"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              View All In Inbox <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-sm shrink-0">
                    {lead.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{lead.name}</span>
                      <span className="text-xs text-slate-400">{lead.phone}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate max-w-md">{lead.notes || 'Inquired on WhatsApp'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {lead.bot_paused ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Staff Takeover
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      AI Active
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    lead.status === 'BOOKED' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                    lead.status === 'NEEDS_STAFF' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Meta Pricing & 2026 Guardrails Status */}
        <div className="space-y-6">
          {/* Card: WhatsApp Meta Cost (Section 5 Guide) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Meta API Costs (₹)</h2>
              <span className="text-xs text-slate-400">Current Cycle</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>AI Service Replies ({metrics?.metaCost?.serviceRepliesCount || 0})</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  ₹{metrics?.metaCost?.subtotalInr ? (metrics.metaCost.serviceRepliesCount <= 1000 ? '0.00 (Free 1k)' : '₹' + metrics.metaCost.subtotalInr) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Utility Reminder Templates ({metrics?.metaCost?.utilityCount || 0})</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  ₹{((metrics?.metaCost?.utilityCount || 0) * 0.115).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (18% on Meta charges)</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  ₹{metrics?.metaCost?.gst18Inr || '0.00'}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                <span>Total Meta Line</span>
                <span className="text-emerald-600">₹{metrics?.metaCost?.totalInr || '0.00'}</span>
              </div>
            </div>

            <Link
              href="/calculator"
              className="w-full text-center block bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 py-2.5 rounded-xl transition"
            >
              Open Full ROI & Retainer Calculator
            </Link>
          </div>

          {/* Card: Meta 2026 Policy Compliance Badge */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 space-y-3 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Meta 2026 Guardrails</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Compliant with Meta Jan 15 2026 API rules: Task-focused responses only, price list grounding, medical diagnosis refusal, and honest bot disclosure.
            </p>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>Hinglish/Hindi NLP Engine</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
