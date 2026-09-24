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
} from 'lucide-react';
import { Appointment } from '@/types';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    phone: '',
    service: 'Teeth Cleaning & Polishing',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time_slot: '04:00 PM',
    doctor_or_staff: 'Dr. Arjun Sharma',
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
          service: 'Teeth Cleaning & Polishing',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          time_slot: '04:00 PM',
          doctor_or_staff: 'Dr. Arjun Sharma',
        });
        fetchAppointments();
        setActionMessage('Appointment successfully booked and synced with clinic schedule!');
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
        `Dispatched ${data.dispatchedCount} utility reminders for appointments in the next 24 hours!`
      );
      fetchAppointments();
    } catch (e) {
      setActionMessage('Failed to trigger reminder cron');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Appointments & Consultations</h1>
          <p className="text-sm text-slate-500">
            Automated calendar managed by the WhatsApp AI Agent with hourly 24h reminder triggers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerHourlyReminderCron}
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900 font-semibold px-4 py-2.5 rounded-xl transition text-xs border border-emerald-200 dark:border-emerald-800"
          >
            <Clock className="w-4 h-4 text-emerald-600" />
            Send 24h Reminder Templates
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl transition text-xs shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            Add Patient Booking
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-xs text-slate-500 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Appointments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-emerald-500 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{apt.patient_name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <Phone className="w-3 h-3" />
                  <span>{apt.phone}</span>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  apt.status === 'CONFIRMED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : apt.status === 'REMINDER_SENT'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {apt.status}
              </span>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{apt.service}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{apt.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Time Slot:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{apt.time_slot}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Doctor / Staff:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{apt.doctor_or_staff}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                {apt.reminder_sent ? (
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 24h Reminder Sent
                  </span>
                ) : (
                  <span className="text-slate-400">Reminder pending</span>
                )}
              </div>
              <span className="text-[10px] text-slate-400">
                {new Date(apt.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Manual Patient Booking</h2>
            <form onSubmit={createAppointment} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Patient Name</label>
                <input
                  type="text"
                  required
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">WhatsApp Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+919876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Service Required</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="Teeth Cleaning & Polishing">Teeth Cleaning & Polishing (₹1,500)</option>
                  <option value="Dental Consultation & X-Ray">Dental Consultation & X-Ray (₹500)</option>
                  <option value="Root Canal Treatment (RCT)">Root Canal Treatment (₹4,500)</option>
                  <option value="Teeth Whitening (Laser)">Teeth Whitening (₹8,000)</option>
                  <option value="Dental Implant Consultation">Dental Implant Consultation (₹25,000)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={formData.time_slot}
                    onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
