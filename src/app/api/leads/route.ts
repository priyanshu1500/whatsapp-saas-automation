import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const leads = db.getLeads();
    const metrics = db.getMetrics();
    return NextResponse.json({ leads, metrics });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

const updateLeadSchema = z.object({
  id: z.string(),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'BOOKED', 'NEEDS_STAFF', 'CLOSED']).optional(),
  bot_paused: z.boolean().optional(),
  notes: z.string().optional(),
  service_interest: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { id, ...updates } = parsed.data;
    const updated = db.updateLead(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

