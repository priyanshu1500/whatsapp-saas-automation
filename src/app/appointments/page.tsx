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
  Building,
  Key,
  ShieldCheck,
  Car,
  QrCode,
  MapPin,
  X,
} from 'lucide-react';
import { Appointment } from '@/types';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    phone: '',
    service: 'Skyline Golf Reserve — 4 BHK Sky Villa',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time_slot: '03:00 PM',
    doctor_or_staff: 'Vikram Malhotra (Managing Director)',
    chauffeur_requested: true,
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
          service: 'Skyline Golf Reserve — 4 BHK Sky Villa',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          time_slot: '03:00 PM',
          doctor_or_staff: 'Vikram Malhotra (Managing Director)',
          chauffeur_requested: true,
        });
        fetchAppointments();
        setActionMessage('Private VIP Site Visit booked & Security Gate Pass dispatched to buyer WhatsApp!');
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
        `Dispatched ${data.dispatchedCount} utility reminders with gate pass & GPS directions for upcoming tours!`
      );
      fetchAppointments();
    } catch (e) {
      setActionMessage('Failed to trigger reminder cron');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Concierge Operations
            </span>
            <span className="text-xs text-slate-400">Security Gate Access & Chauffeur Sync</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Private Site Visits & VIP Tours Calendar
          </h1>
          <p className="text-sm text-slate-400">
            Automated calendar managed autonomously by the WhatsApp AI Real Estate Advisor with hourly 24h reminder triggers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerHourlyReminderCron}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#111625] hover:bg-slate-800 text-slate-200 border border-slate-800 transition active:scale-[0.98]"
            title="Simulate background cron worker sending Meta utility reminders 24h prior to visit"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Dispatch 24h Reminders</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Private Tour</span>
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111625] border border-slate-800 rounded-2xl p-5 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Confirmed Private Visits
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {appointments.filter((a) => a.status === 'CONFIRMED').length}
          </div>
          <div className="text-xs text-amber-400 font-medium">WhatsApp RSVP synced</div>
        </div>

        <div className="bg-[#111625] border border-slate-800 rounded-2xl p-5 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Chauffeur Pickups Requested
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono flex items-center gap-2">
            <Car className="w-5 h-5 text-amber-400" />
            {appointments.length > 0 ? Math.max(1, Math.round(appointments.length * 0.6)) : 0}
          </div>
          <div className="text-xs text-slate-400">Mercedes S-Class Concierge Fleet</div>
        </div>

        <div className="bg-[#111625] border border-slate-800 rounded-2xl p-5 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Pre-Tour Show-Up Rate
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            94.2%
          </div>
          <div className="text-xs text-slate-400">Driven by automated Meta 24h reminders</div>
        </div>
      </div>

      {/* Visits List */}
      <div className="bg-[#111625] rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-sm text-white flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-amber-400" />
            <span>Scheduled Private Viewings & Gate Clearances</span>
          </h2>
          <span className="text-xs text-slate-400">
            {appointments.length} Total Viewings on Record
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Loading tour schedule...
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <CalendarIcon className="w-8 h-8 text-slate-600 mx-auto" />
            <div>No private tours scheduled yet.</div>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-amber-400 hover:underline font-semibold"
            >
              Schedule the first visit
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/20 transition"
              >
                {/* Left: Client & Property */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#090D16] border border-slate-800 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">
                      {new Date(appt.date).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-base font-bold text-white font-mono leading-none">
                      {new Date(appt.date).getDate()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{appt.patient_name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {appt.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono text-slate-300">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {appt.phone}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-200">
                        <Building className="w-3 h-3 text-amber-400" />
                        {appt.service}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[11px]">
                      <span className="font-mono bg-[#090D16] px-2 py-0.5 rounded border border-slate-800 text-amber-300 font-semibold flex items-center gap-1">
                        <QrCode className="w-3 h-3 text-amber-400" />
                        Gate Pass: GATE-{appt.id.slice(-4).toUpperCase()}
                      </span>
                      <span className="text-slate-400">
                        Director: <strong className="text-slate-200">{appt.doctor_or_staff}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Time, Reminder Status & Actions */}
                <div className="flex md:flex-col items-end justify-between md:justify-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white bg-[#090D16] px-3 py-1.5 rounded-xl border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{appt.time_slot}</span>
                  </div>

                  <div className="text-[11px] text-right">
                    {appt.reminder_sent ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Meta 24h Reminder Sent
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        Reminder Pending (Cron Auto)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111625] border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">Schedule Private VIP Tour</h3>
                <p className="text-xs text-slate-400">Grounds security gate clearance and sends WhatsApp pass</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={createAppointment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Buyer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Singhania"
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  className="w-full bg-[#090D16] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">WhatsApp Mobile Number</label>
                <input
                  type="text"
                  required
                  placeholder="+919876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#090D16] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Development / Residence</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-[#090D16] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                >
                  <option value="Skyline Golf Reserve — 4 BHK Sky Villa">Skyline Golf Reserve — 4 BHK Sky Villa (₹6.8 Cr)</option>
                  <option value="Worli Ocean Penthouse — 5 BHK Triplex">Worli Ocean Penthouse — 5 BHK Triplex (₹14.0 Cr)</option>
                  <option value="The Camellias Grand Residence — 3.5 BHK">The Camellias Grand Residence — 3.5 BHK (₹4.2 Cr)</option>
                  <option value="Bandra West Designer Duplex">Bandra West Designer Duplex (₹8.5 Cr)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Visit Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#090D16] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time Slot</label>
                  <select
                    value={formData.time_slot}
                    onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                    className="w-full bg-[#090D16] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  >
                    <option value="11:00 AM">11:00 AM (Morning Tour)</option>
                    <option value="02:00 PM">02:00 PM (Afternoon)</option>
                    <option value="04:30 PM">04:30 PM (Golden Hour View)</option>
                    <option value="06:30 PM">06:30 PM (Evening Sunset)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Sales Director</label>
                <input
                  type="text"
                  value={formData.doctor_or_staff}
                  onChange={(e) => setFormData({ ...formData, doctor_or_staff: e.target.value })}
                  className="w-full bg-[#090D16] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              <div className="p-3 bg-[#090D16] border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300 font-medium">Request Luxury Chauffeur Pickup</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.chauffeur_requested}
                  onChange={(e) => setFormData({ ...formData, chauffeur_requested: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-[0.98]"
                >
                  Confirm & Dispatch Gate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
