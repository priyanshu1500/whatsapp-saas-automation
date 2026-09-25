import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

/**
 * Phase C Step 16 in 'How to Build & Sell an AI WhatsApp Agent in India':
 * Runs periodically to find appointments scheduled in the next 24 hours
 * and automatically dispatches pre-approved Utility Reminder templates.
 */
export async function POST(req: NextRequest) {
  try {
    const appointments = db.getAppointments();
    const config = db.getConfig();
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    const dispatched: any[] = [];

    for (const apt of appointments) {
      if (apt.status === 'CONFIRMED' && !apt.reminder_sent) {
        const aptDateTime = new Date(`${apt.date}T12:00:00`).getTime();
        const diff = aptDateTime - now;

        // If appointment is within the next 24-48 hours
        if (diff > 0 && diff <= twentyFourHours * 2) {
          // 1. Mark reminder sent
          db.updateAppointment(apt.id, {
            reminder_sent: true,
            reminder_sent_at: new Date().toISOString(),
            status: 'REMINDER_SENT',
          });

          // 2. Dispatch Utility template message to conversation history
          const reminderBody = `[UTILITY TEMPLATE: appointment_reminder_utility] Namaste ${apt.patient_name}! Reminder for your appointment at ${config.name} on ${apt.date} at ${apt.time_slot} for ${apt.service}. Address: ${config.address}. Reply 1 to Confirm.`;

          db.addMessage({
            lead_id: apt.lead_id,
            phone: apt.phone,
            direction: 'OUTBOUND',
            sender: 'BOT',
            body: reminderBody,
            cost_category: 'utility_template',
            cost_inr: 0.115,
          });

          dispatched.push({
            appointmentId: apt.id,
            patient: apt.patient_name,
            phone: apt.phone,
            time: `${apt.date} ${apt.time_slot}`,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      scannedCount: appointments.length,
      dispatchedCount: dispatched.length,
      dispatched,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Reminder cron failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}

