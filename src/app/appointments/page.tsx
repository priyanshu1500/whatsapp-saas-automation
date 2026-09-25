'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Clock,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  Sparkles,
  Calendar as CalendarIcon,
  RefreshCw,
  Building2,
  Car,
  Key,
  ShieldCheck,
  MapPin,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Appointment } from '@/types';

export default function SiteVisitsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    phone: '',
    service: 'The Grand Horizon Penthouse & Sky Villas',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time_slot: '11:00 AM',
    doctor_or_staff: 'Raghav Singhal (Managing Director)',
    chauffeur_pickup_required: true,
  });
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const createAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({
          patient_name: '',
          phone: '',
          service: 'The Grand Horizon Penthouse & Sky Villas',
          date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          time_slot: '11:00 AM',
          doctor_or_staff: 'Raghav Singhal (Managing Director)',
          chauffeur_pickup_required: true,
        });
        fetchAppointments();
        setActionMessage('VIP Site Tour successfully scheduled and WhatsApp Gate Pass generated!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const triggerHourlyReminderCron = async () => {
    try {
      const res = await fetch('/api/cron/reminders', { method: 'POST' });
      const data = await res.json();
      setActionMessage(
        `Dispatched ${data.dispatchedCount} utility reminders via Meta Cloud API for upcoming site tours!`
      );
      fetchAppointments();
    } catch (e) {
      setActionMessage('Failed to trigger reminder cron');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Concierge Management
            </span>
            <span className="text-xs text-slate-400">Experience Center Tours</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Site Visits & Private Tours Calendar
          </h1>
          <p className="text-sm text-slate-400">
            Automated calendar managed by the WhatsApp AI Advisor with chauffeur dispatch, gate pass verification, and 24h Meta reminders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerHourlyReminderCron}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#111625] text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Trigger 24h Reminder Cron</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule VIP Tour</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111625] border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Confirmed VIP Site Visits</div>
            <div className="text-xl font-bold text-white">{appointments.length} Scheduled</div>
          </div>
        </div>

        <div className="bg-[#111625] border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Chauffeur Pickups Requested</div>
            <div className="text-xl font-bold text-purple-300">
              {appointments.filter((a) => a.chauffeur_pickup_required).length} Transits
            </div>
          </div>
        </div>

        <div className="bg-[#111625] border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Meta Utility Reminders Dispatched</div>
            <div className="text-xl font-bold text-emerald-400">
              {appointments.filter((a) => a.reminder_sent).length} Sent
            </div>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-[#111625] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-sm text-white">Upcoming Private Property Showings</h2>
          <span className="text-xs text-slate-400 font-mono">Meta Cloud Utility Category (₹0.115/reminder)</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {appointments.map((item) => (
            <div
              key={item.id}
              className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#141b2c] transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0a0e17] border border-slate-800 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-sm text-white">{item.patient_name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                      {item.gate_pass_code || 'SKY-VIP-8812'}
                    </span>
                    {item.chauffeur_pickup_required && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
                        <Car className="w-3 h-3" /> Chauffeur Requested
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-300 flex items-center gap-1.5">
                    <span className="text-amber-200 font-medium">{item.service}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">Accompanied by: {item.doctor_or_staff}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1 font-mono text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {item.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                      {item.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {item.time_slot}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end lg:self-center">
                {item.reminder_sent ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>24h Reminder Dispatched</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Scheduled for Reminder</span>
                  </span>
                )}

                <a
                  href="/simulator"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition flex items-center gap-1"
                >
                  Simulator
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}

          {appointments.length === 0 && (
            <div className="p-12 text-center text-slate-500 text-xs">
              No site visits booked yet. Inquiries arriving in WhatsApp Simulator will automatically appear here!
            </div>
          )}
        </div>
      </div>

      {/* Schedule Tour Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111625] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Schedule Private Site Tour</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={createAppointment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Buyer / Investor Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  placeholder="e.g. Vikramaditya Oberoi"
                  className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">WhatsApp Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+919811223344"
                  className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Property Development</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                >
                  <option value="The Grand Horizon Penthouse & Sky Villas">The Grand Horizon Penthouse & Sky Villas (₹8.5 Cr+)</option>
                  <option value="Skyline Lumina 3 & 4 BHK Luxury Residences">Skyline Lumina 3 & 4 BHK Residences (₹3.4 Cr+)</option>
                  <option value="The Crestview Signature Golf Villas">The Crestview Signature Golf Villas (₹11.5 Cr+)</option>
                  <option value="Skyline One Commercial Corporate Suites">Skyline One Commercial Suites (₹2.1 Cr+)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={formData.time_slot}
                    onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                    placeholder="11:00 AM"
                    className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Sales Director</label>
                <input
                  type="text"
                  required
                  value={formData.doctor_or_staff}
                  onChange={(e) => setFormData({ ...formData, doctor_or_staff: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-[#0a0e17] rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="chauffeur"
                  checked={formData.chauffeur_pickup_required}
                  onChange={(e) => setFormData({ ...formData, chauffeur_pickup_required: e.target.checked })}
                  className="accent-amber-500 w-4 h-4 rounded"
                />
                <label htmlFor="chauffeur" className="text-slate-300 cursor-pointer text-xs">
                  Dispatch luxury Mercedes Maybach / BMW chauffeur for guest pickup
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition"
                >
                  Generate VIP Gate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
