import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { leadId: string } }
) {
  try {
    const { leadId } = params;
    const lead = db.getLeadById(leadId);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const messages = db.getMessagesByLeadId(leadId);

    // Reset unread count on view
    if (lead.unread_count > 0) {
      db.updateLead(leadId, { unread_count: 0 });
    }

    return NextResponse.json({ lead, messages });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
