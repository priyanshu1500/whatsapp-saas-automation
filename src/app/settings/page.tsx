'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  Building2,
  Phone,
  Clock,
  MapPin,
  Stethoscope,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
  Key,
  Award,
  Lock,
  Globe,
  Sliders,
} from 'lucide-react';
import { BusinessConfig } from '@/types';

const LUXURY_REAL_ESTATE_PRESETS = [
  {
    id: 'gurugram_luxury',
    name: 'Skyline Luxury Estates Gurugram',
    doctor: 'Vikram Malhotra (Senior Luxury Property Director)',
    address: 'DLF Golf Course Road, Sector 54, Gurugram, Haryana - 122002',
    timings: 'Monday to Sunday: 9:00 AM – 8:00 PM (Private Viewings by Appointment)',
    phone: '+919876543210',
    display_phone: '+91 98765 43210',
  },
  {
    id: 'mumbai_hni',
    name: 'South Mumbai Signature Residences',
    doctor: 'Ananya Singhania (Head of Private Client Group)',
    address: 'Worli Sea Face, Worli, Mumbai, Maharashtra - 400018',
    timings: 'All Days: 10:00 AM – 7:30 PM (Concierge Access)',
    phone: '+919822334455',
    display_phone: '+91 98223 34455',
  },
  {
    id: 'bangalore_golf',
    name: 'Prestige & Embassy Private Reserve',
    doctor: 'Rajeev Chandrasekhar (Managing Partner)',
    address: 'Windsor Square, Sankey Road, Bengaluru, Karnataka - 560052',
    timings: 'Monday to Saturday: 9:30 AM – 7:00 PM',
    phone: '+919844556677',
    display_phone: '+91 98445 56677',
  },
];

export default function SettingsPage() {
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setConfig(data.config);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    if (!config) return;
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage('Developer Configuration & RERA Grounding saved successfully!');
      }
    } catch (e) {
      setStatusMessage('Error saving configuration.');
    } finally {
      setSaving(false);
    }
  };

  const applyPreset = (preset: typeof LUXURY_REAL_ESTATE_PRESETS[0]) => {
    if (!config) return;
    setConfig({
      ...config,
      name: preset.name,
      doctor_name: preset.doctor,
      address: preset.address,
      timings: preset.timings,
      phone_number: preset.phone,
      display_phone: preset.display_phone,
    });
    setStatusMessage(`Applied preset: ${preset.name}`);
  };

  if (loading || !config) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400 text-xs flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Enterprise Real Estate Config...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Enterprise Control Center
            </span>
            <span className="text-xs text-slate-400">RERA & Meta Cloud API</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            PropTech Configuration & AI Knowledge Base
          </h1>
          <p className="text-sm text-slate-400">
            Ground the WhatsApp AI Advisor with verified development catalogs, RERA registration numbers, and concierge rules.
          </p>
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-sm active:scale-[0.98] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Deploy Grounding Changes'}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Preset Switcher */}
      <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Developer & Location Profiles</span>
            </h3>
            <p className="text-xs text-slate-400">
              Switch corporate identities to demonstrate to luxury clients in Delhi NCR, Mumbai, or Bengaluru.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LUXURY_REAL_ESTATE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`p-4 rounded-xl text-left border transition ${
                config.name === preset.name
                  ? 'border-amber-500/50 bg-amber-500/10 text-white'
                  : 'border-slate-800 hover:border-slate-700 bg-[#0a0e17] text-slate-300'
              }`}
            >
              <div className="font-bold text-xs text-amber-300">{preset.name}</div>
              <div className="text-[11px] text-slate-400 mt-1">{preset.doctor}</div>
              <div className="text-[10px] text-slate-500 truncate mt-1">{preset.address}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Developer Profile (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6 space-y-5">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Developer Identity & Private Office</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Developer / Brokerage Brand Name</label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Senior Property Advisor / Director</label>
                <input
                  type="text"
                  value={config.doctor_name}
                  onChange={(e) => setConfig({ ...config, doctor_name: e.target.value })}
                  className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">WhatsApp Business Number</label>
                  <input
                    type="text"
                    value={config.display_phone}
                    onChange={(e) => setConfig({ ...config, display_phone: e.target.value })}
                    className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Currency Standard</label>
                  <input
                    type="text"
                    value={config.currency}
                    onChange={(e) => setConfig({ ...config, currency: e.target.value })}
                    className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Experience Center Address</label>
                <input
                  type="text"
                  value={config.address}
                  onChange={(e) => setConfig({ ...config, address: e.target.value })}
                  className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Private Tour Operating Hours</label>
                <input
                  type="text"
                  value={config.timings}
                  onChange={(e) => setConfig({ ...config, timings: e.target.value })}
                  className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>
            </div>
          </div>

          {/* AI Grounding System Prompt Instructions */}
          <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Custom AI Grounding & Knowledge Base Directives</span>
            </h3>

            <div>
              <label className="block text-xs text-slate-400 mb-2">
                Inject custom knowledge (e.g. exclusive pre-launch discounts, preferred bank approvals, club memberships):
              </label>
              <textarea
                rows={4}
                value={config.system_prompt_custom || ''}
                onChange={(e) => setConfig({ ...config, system_prompt_custom: e.target.value })}
                placeholder="e.g. For The Grand Horizon Sky Villas, HDFC and ICICI Bank offer instant 75% loan pre-approvals for Tier-1 corporate executives..."
                className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Meta API & Guardrails (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Guardrails */}
          <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6 space-y-5">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Real Estate Guardrails & Compliance</span>
            </h3>

            <div className="space-y-4 text-xs">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.guardrail_refuse_offtopic}
                  onChange={(e) => setConfig({ ...config, guardrail_refuse_offtopic: e.target.checked })}
                  className="accent-amber-500 w-4 h-4 rounded mt-0.5"
                />
                <div>
                  <div className="font-semibold text-slate-200">Refuse Off-Topic Queries</div>
                  <div className="text-[11px] text-slate-400">
                    Confine the AI exclusively to property inquiries, floor plans, RERA details, and site visits.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.guardrail_honest_bot}
                  onChange={(e) => setConfig({ ...config, guardrail_honest_bot: e.target.checked })}
                  className="accent-amber-500 w-4 h-4 rounded mt-0.5"
                />
                <div>
                  <div className="font-semibold text-slate-200">Enforce RERA & Honest Bot Transparency</div>
                  <div className="text-[11px] text-slate-400">
                    Always append official RERA registration numbers to price quotes and disclose AI assistance when asked.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.guardrail_refuse_medical}
                  onChange={(e) => setConfig({ ...config, guardrail_refuse_medical: e.target.checked })}
                  className="accent-amber-500 w-4 h-4 rounded mt-0.5"
                />
                <div>
                  <div className="font-semibold text-slate-200">VIP Human Takeover Alert Trigger</div>
                  <div className="text-[11px] text-slate-400">
                    Instantly notify the Managing Director when buyers inquire about 20:80 subvention or price discounts.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Meta Cloud API Integration Credentials */}
          <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Meta Cloud API Production Keys</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">WhatsApp Phone Number ID</label>
                <input
                  type="text"
                  value={config.whatsapp_phone_number_id}
                  onChange={(e) => setConfig({ ...config, whatsapp_phone_number_id: e.target.value })}
                  className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">WhatsApp Business Account ID (WABA)</label>
                <input
                  type="text"
                  value={config.whatsapp_waba_id}
                  onChange={(e) => setConfig({ ...config, whatsapp_waba_id: e.target.value })}
                  className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Webhook Verify Token</label>
                <input
                  type="text"
                  value={config.whatsapp_verify_token}
                  onChange={(e) => setConfig({ ...config, whatsapp_verify_token: e.target.value })}
                  className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl p-2.5 text-white font-mono text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
