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
} from 'lucide-react';
import { MetaTemplate } from '@/types';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<MetaTemplate[]>([]);

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

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Meta Message Templates</h1>
          <p className="text-sm text-slate-500">
            Pre-approved WhatsApp templates required for outbound messages sent outside the 24-hour customer window.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-3.5 py-2 rounded-xl text-xs border border-emerald-200 dark:border-emerald-800 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Meta Cloud API v20.0 Approved</span>
        </div>
      </div>

      {/* Meta 24-hr rule banner */}
      <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 text-xs text-blue-900 dark:text-blue-300 space-y-1">
        <h4 className="font-bold flex items-center gap-1.5 text-sm">
          <Info className="w-4 h-4 text-blue-600" />
          The 24-Hour Messaging Window Rule
        </h4>
        <p className="leading-relaxed text-blue-800 dark:text-blue-200">
          When a patient messages your WhatsApp number, a 24-hour customer care session opens where freeform AI replies and staff messages can be sent freely. Once 24 hours of patient silence passes, you <strong>must</strong> use one of these pre-approved Meta templates to reach out (e.g. appointment reminders or re-engagement offers).
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 hover:border-emerald-500 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {tpl.name}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white capitalize mt-1.5">
                  {tpl.category.toLowerCase()} Template
                </h3>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {tpl.status}
                </span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  ₹{tpl.cost_inr} / msg
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-mono leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
              {tpl.body}
            </div>

            <div className="space-y-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Supported Dynamic Variables:</span>
              <div className="flex flex-wrap gap-1.5">
                {tpl.variables.map((v, i) => (
                  <span
                    key={i}
                    className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium"
                  >
                    {`{{${i + 1}}}: ${v}`}
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
