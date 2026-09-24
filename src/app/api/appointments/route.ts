import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const appointments = db.getAppointments();
    return NextResponse.json({ appointments });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

const createAppointmentSchema = z.object({
  lead_id: z.string().optional(),
  patient_name: z.string().min(1, 'Patient name required'),
  phone: z.string().min(5, 'Phone required'),
  service: z.string().min(1, 'Service required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  time_slot: z.string().min(1, 'Time slot required'),
  doctor_or_staff: z.string().default('Dr. Arjun Sharma'),
  status: z.enum(['CONFIRMED', 'REMINDER_SENT', 'COMPLETED', 'CANCELLED']).default('CONFIRMED'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createAppointmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    let leadId = parsed.data.lead_id;
    if (!leadId) {
      const lead = db.createOrGetLead(parsed.data.phone, parsed.data.patient_name);
      leadId = lead.id;
    }

    const appointment = db.createAppointment({
      lead_id: leadId,
      patient_name: parsed.data.patient_name,
      phone: parsed.data.phone,
      service: parsed.data.service,
      date: parsed.data.date,
      time_slot: parsed.data.time_slot,
      doctor_or_staff: parsed.data.doctor_or_staff,
      status: parsed.data.status,
      reminder_sent: false,
    });

    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

const updateAptSchema = z.object({
  id: z.string(),
  status: z.enum(['CONFIRMED', 'REMINDER_SENT', 'COMPLETED', 'CANCELLED']).optional(),
  reminder_sent: z.boolean().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateAptSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const updated = db.updateAppointment(parsed.data.id, {
      status: parsed.data.status,
      reminder_sent: parsed.data.reminder_sent,
    });

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}
