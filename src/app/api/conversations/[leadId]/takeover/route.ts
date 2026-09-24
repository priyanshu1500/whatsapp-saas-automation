import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { z } from 'zod';

const takeoverSchema = z.object({
  bot_paused: z.boolean(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { leadId: string } }
) {
  try {
    const { leadId } = params;
    const body = await req.json();
    const parsed = takeoverSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const lead = db.getLeadById(leadId);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const updated = db.updateLead(leadId, {
      bot_paused: parsed.data.bot_paused,
      status: parsed.data.bot_paused ? 'NEEDS_STAFF' : (lead.status === 'NEEDS_STAFF' ? 'CONTACTED' : lead.status),
      notes: parsed.data.bot_paused
        ? `${lead.notes} | [Human Takeover initiated at ${new Date().toLocaleTimeString()}]`
        : `${lead.notes} | [AI Bot resumed at ${new Date().toLocaleTimeString()}]`,
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
