'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  Sparkles,
  Info,
  ShieldCheck,
  Send,
  Building,
  Key,
  DollarSign,
  Copy,
  Check,
} from 'lucide-react';
import { MetaTemplate } from '@/types';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<MetaTemplate[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('/api/templates');
        const data = await res.json();
        setTemplates(data.templates || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTemplates();
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Meta WhatsApp Cloud API v20.0
            </span>
            <span className="text-xs text-slate-400">Section 5 India Compliance</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Pre-Approved Real Estate Message Templates
          </h1>
          <p className="text-sm text-slate-400">
            Compliant Meta templates for site visit gate clearances, brochure downloads, and 24-hr utility reminders outside the free session window.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#111625] text-amber-300 px-4 py-2 rounded-xl text-xs border border-slate-800 font-medium shadow-sm">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Meta WABA Tier-1 Status: High Quality</span>
        </div>
      </div>

      {/* Meta 24-hr rule banner */}
      <div className="bg-[#111625] border border-amber-500/30 rounded-2xl p-5 text-xs text-slate-300 space-y-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        <h4 className="font-bold flex items-center gap-2 text-sm text-amber-300">
          <Info className="w-4 h-4 text-amber-400" />
          The Meta 24-Hour Real Estate Messaging Window Rule
        </h4>
        <p className="leading-relaxed text-slate-300">
          When an Ultra-HNI prospect clicks a WhatsApp Property Ad or sends an inquiry, a <strong>24-hour customer care session opens</strong> where your AI Property Advisor sends unlimited, interactive property brochures, floor plans, and pricing quotes at zero template fee. Once 24 hours pass, Meta mandates using one of the pre-approved templates below (charged at <strong>₹0.115</strong> for utility reminders or <strong>₹0.8631</strong> for exclusive marketing launches).
        </p>
      </div>

      {/* Cost Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111625] border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Inbound Free Tier
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">1,000 Chats / mo</div>
          <div className="text-[11px] text-slate-400">Zero Meta charge for first 1,000 monthly service sessions</div>
        </div>

        <div className="bg-[#111625] border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Utility Rate (India)
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono">₹0.115 / message</div>
          <div className="text-[11px] text-slate-400">Site visit confirmations, gate passes & 24h reminders</div>
        </div>

        <div className="bg-[#111625] border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Marketing Rate (India)
          </div>
          <div className="text-xl font-bold text-purple-300 font-mono">₹0.8631 / message</div>
          <div className="text-[11px] text-slate-400">Exclusive VIP pre-launch penthouses & price revisions</div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-[#111625] rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4 hover:border-amber-500/40 transition group"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  {tpl.name}
                </span>
                <h3 className="font-bold text-sm text-white capitalize mt-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{tpl.category.toLowerCase()} Template</span>
                </h3>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {tpl.status}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-400">
                  ₹{tpl.cost_inr} / msg
                </span>
              </div>
            </div>

            {/* Template Body */}
            <div className="relative">
              <div className="p-4 rounded-xl bg-[#090D16] border border-slate-800 text-xs font-mono leading-relaxed whitespace-pre-wrap text-slate-200">
                {tpl.body}
              </div>
              <button
                onClick={() => handleCopy(tpl.id, tpl.body)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Copy template text"
              >
                {copiedId === tpl.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Variables */}
            <div className="space-y-1.5 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 text-[11px]">
                Supported Dynamic Meta Parameters:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tpl.variables.map((v, i) => (
                  <span
                    key={v}
                    className="font-mono text-[10px] bg-[#090D16] border border-slate-800 px-2 py-0.5 rounded text-amber-300"
                  >
                    &#123;&#123;{i + 1}&#125;&#125; : {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer action */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Languages: English (en_US), Hindi (hi)</span>
              <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                Webhook Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
