'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  Sparkles,
  Info,
  DollarSign,
  Send,
  ShieldCheck,
  Building2,
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

  const copyTemplateBody = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Meta Cloud API v20.0
            </span>
            <span className="text-xs text-slate-400">RERA & TRAI Compliant</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Meta Pre-Approved Message Templates
          </h1>
          <p className="text-sm text-slate-400">
            Mandatory registered templates for outbound WhatsApp notifications sent outside the 24-hour customer window.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#111625] text-slate-300 px-4 py-2 rounded-xl text-xs border border-slate-800 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>India Rate Card Tier: 1,000 Free Service Replies/mo</span>
        </div>
      </div>

      {/* Meta 24-hr rule banner */}
      <div className="bg-[#111625] border border-amber-500/30 rounded-2xl p-6 text-xs text-slate-300 space-y-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <h4 className="font-bold flex items-center gap-2 text-sm text-amber-300">
          <Info className="w-4 h-4 text-amber-400" />
          The 24-Hour Messaging Window & RERA Compliance Rules
        </h4>
        <p className="leading-relaxed text-slate-400">
          When an ultra-high-net-worth investor initiates a conversation via Click-to-WhatsApp ads or website QR, a <strong className="text-white">24-hour customer service window</strong> opens where the AI Property Advisor can exchange unlimited natural language messages. Once 24 hours pass without client input, WhatsApp Business policy mandates utilizing these registered <strong className="text-white">Utility (₹0.115)</strong> or <strong className="text-white">Marketing (₹0.8631)</strong> templates containing project RERA identifiers.
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-[#111625] rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4 hover:border-amber-500/40 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  {tpl.name}
                </span>
                <h3 className="font-bold text-sm text-white capitalize mt-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  {tpl.category.toLowerCase()} Template
                </h3>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  tpl.category === 'UTILITY'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                }`}>
                  {tpl.status}
                </span>
                <span className="text-xs font-semibold text-slate-300 font-mono">
                  ₹{tpl.cost_inr} / msg
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0a0e17] border border-slate-800 text-xs font-mono leading-relaxed whitespace-pre-wrap text-slate-300 relative group">
              {tpl.body}
              <button
                onClick={() => copyTemplateBody(tpl.id, tpl.body)}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition opacity-80 hover:opacity-100"
                title="Copy template"
              >
                {copiedId === tpl.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="font-semibold text-slate-300">Supported Meta Variables:</span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {tpl.variables.map((v) => (
                  <span
                    key={v}
                    className="bg-[#0e1320] border border-slate-700 text-amber-300 px-2 py-0.5 rounded"
                  >
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
