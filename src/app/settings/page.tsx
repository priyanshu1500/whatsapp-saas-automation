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
} from 'lucide-react';
import { BusinessConfig, ServiceItem } from '@/types';

const NICHE_PRESETS = [
  {
    id: 'dental',
    name: 'Smile Clinic Delhi',
    doctor: 'Dr. Arjun Sharma (BDS, MDS)',
    address: 'Shop 14, Main Market, Green Park, New Delhi - 110016',
    timings: 'Mon-Sat: 10:00 AM – 8:00 PM | Sun: 11:00 AM – 4:00 PM',
  },
  {
    id: 'dermatology',
    name: 'Apex Skin & Laser Clinic',
    doctor: 'Dr. Meera Nambiar (MD Dermatologist)',
    address: '3rd Floor, Defence Colony, New Delhi - 110024',
    timings: 'Mon-Sat: 11:00 AM – 7:30 PM',
  },
  {
    id: 'real_estate',
    name: 'Skyline Luxury Homes Gurugram',
    doctor: 'Vikram Malhotra (Lead Property Advisor)',
    address: 'Golf Course Road, Sector 54, Gurugram, Haryana',
    timings: 'All Days: 9:30 AM – 7:00 PM',
  },
  {
    id: 'coaching',
    name: 'Prestige Academy IIT-JEE & NEET',
    doctor: 'Prof. R.K. Gupta (Academic Director)',
    address: 'Kalu Sarai, Near Hauz Khas Metro, New Delhi',
    timings: 'Mon-Sat: 9:00 AM – 8:00 PM',
  },
];

export default function SettingsPage() {
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState<number>(1500);
  const [newServiceDesc, setNewServiceDesc] = useState('');

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
        setStatusMessage('Configuration and AI Grounding saved successfully!');
      }
    } catch (e) {
      setStatusMessage('Error saving configuration.');
    } finally {
      setSaving(false);
    }
  };

  const applyNichePreset = (preset: typeof NICHE_PRESETS[0]) => {
    if (!config) return;
    setConfig({
      ...config,
      name: preset.name,
      doctor_name: preset.doctor,
      address: preset.address,
      timings: preset.timings,
    });
  };

  const addService = () => {
    if (!config || !newServiceName.trim()) return;
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: newServiceName,
      category: 'General',
      price_inr: Number(newServicePrice),
      duration_minutes: 30,
      description: newServiceDesc || 'Service consultation and treatment',
    };
    setConfig({
      ...config,
      services: [...config.services, newService],
    });
    setNewServiceName('');
    setNewServicePrice(1500);
    setNewServiceDesc('');
  };

  const removeService = (id: string) => {
    if (!config) return;
    setConfig({
      ...config,
      services: config.services.filter((s) => s.id !== id),
    });
  };

  if (loading || !config) {
    return <div className="p-8 text-center text-slate-400">Loading settings...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Knowledge Base & AI Configuration</h1>
          <p className="text-sm text-slate-500">
            Customize clinic prices, Meta 2026 AI guardrails, and Meta WhatsApp Cloud API credentials.
          </p>
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl transition text-xs shadow-md shadow-emerald-600/20"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Preset Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-600" />
          Quick Niche Presets (Indian Business Verticals)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {NICHE_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyNichePreset(p)}
              className="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition space-y-1"
            >
              <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{p.doctor}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Business Info & Guardrails */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Profile */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Clinic & Business Profile
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Business Display Name</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Head Doctor / Specialist</label>
              <input
                type="text"
                value={config.doctor_name}
                onChange={(e) => setConfig({ ...config, doctor_name: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Clinic Address</label>
              <input
                type="text"
                value={config.address}
                onChange={(e) => setConfig({ ...config, address: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Operating Timings</label>
              <input
                type="text"
                value={config.timings}
                onChange={(e) => setConfig({ ...config, timings: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Meta 2026 AI Policy Guardrails */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Meta 2026 Policy Guardrails
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-white">Task-Focused Containment</span>
                <p className="text-[11px] text-slate-500">
                  Refuse general chit-chat, poems, recipes, politics, and coding.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.guardrail_refuse_offtopic}
                onChange={(e) => setConfig({ ...config, guardrail_refuse_offtopic: e.target.checked })}
                className="mt-1 w-4 h-4 accent-emerald-600"
              />
            </div>

            <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-white">Strict Medical Advice Refusal</span>
                <p className="text-[11px] text-slate-500">
                  Never prescribe medicines or diagnose. Always route to in-clinic consultation.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.guardrail_refuse_medical}
                onChange={(e) => setConfig({ ...config, guardrail_refuse_medical: e.target.checked })}
                className="mt-1 w-4 h-4 accent-emerald-600"
              />
            </div>

            <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-white">Honest AI Bot Transparency</span>
                <p className="text-[11px] text-slate-500">
                  Honestly confirm bot status if the patient asks "Am I talking to a bot?".
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.guardrail_honest_bot}
                onChange={(e) => setConfig({ ...config, guardrail_honest_bot: e.target.checked })}
                className="mt-1 w-4 h-4 accent-emerald-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services & Price Sheet Table (Grounding) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Grounded Services & Price Sheet Table
            </h2>
            <p className="text-xs text-slate-500">
              The AI Agent references this exact price sheet. It will never invent prices or discount without permission.
            </p>
          </div>
        </div>

        {/* Existing services table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Treatment / Service Name</th>
                <th className="p-3">Price (₹ INR)</th>
                <th className="p-3">Duration (mins)</th>
                <th className="p-3">Clinical Description</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {config.services.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">{srv.name}</td>
                  <td className="p-3 font-bold text-emerald-600">₹{srv.price_inr.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-slate-500">{srv.duration_minutes}m</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{srv.description}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => removeService(srv.id)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add new service form */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Add New Service to Catalog</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <input
              type="text"
              placeholder="e.g. Tooth Extraction"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
            <input
              type="number"
              placeholder="Price (₹)"
              value={newServicePrice}
              onChange={(e) => setNewServicePrice(Number(e.target.value))}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
            <input
              type="text"
              placeholder="Brief description"
              value={newServiceDesc}
              onChange={(e) => setNewServiceDesc(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
            <button
              onClick={addService}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add to Catalog
            </button>
          </div>
        </div>
      </div>

      {/* Meta WhatsApp Cloud API Credentials */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-600" />
          Meta WhatsApp Cloud API Credentials (Optional for Live Mode)
        </h2>
        <p className="text-xs text-slate-500">
          Enter credentials from developers.facebook.com to connect a live verified business phone number. The simulator works even without these!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">WhatsApp Phone Number ID</label>
            <input
              type="text"
              placeholder="e.g. 109827364512345"
              value={config.whatsapp_phone_number_id || ''}
              onChange={(e) => setConfig({ ...config, whatsapp_phone_number_id: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">WhatsApp Business Account (WABA) ID</label>
            <input
              type="text"
              placeholder="e.g. 209871625344556"
              value={config.whatsapp_waba_id || ''}
              onChange={(e) => setConfig({ ...config, whatsapp_waba_id: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
            />
          </div>
          <div className="md:col-span-2">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Webhook Verify Token</label>
            <input
              type="text"
              value={config.whatsapp_verify_token || ''}
              onChange={(e) => setConfig({ ...config, whatsapp_verify_token: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
            />
            <span className="text-[10px] text-slate-400">Webhook URL: https://your-domain.com/api/webhook/whatsapp</span>
          </div>
        </div>
      </div>
    </div>
  );
}
