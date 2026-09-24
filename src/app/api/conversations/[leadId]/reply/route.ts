import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { z } from 'zod';

const replySchema = z.object({
  body: z.string().min(1, 'Message cannot be empty'),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { leadId: string } }
) {
  try {
    const { leadId } = params;
    const body = await req.json();
    const parsed = replySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const lead = db.getLeadById(leadId);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Save human staff message
    const msg = db.addMessage({
      lead_id: lead.id,
      phone: lead.phone,
      direction: 'OUTBOUND',
      sender: 'STAFF',
      body: parsed.data.body,
      cost_category: 'service_reply',
      cost_inr: 0,
    });

    // Reset unread count
    db.updateLead(lead.id, { unread_count: 0 });

    // Optional: send to real Meta WhatsApp API if configured
    const permanentToken = process.env.META_ACCESS_TOKEN;
    const config = db.getConfig();
    const phoneId = process.env.META_PHONE_NUMBER_ID || config.whatsapp_phone_number_id;

    if (permanentToken && phoneId && !lead.phone.includes('test')) {
      try {
        await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${permanentToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: lead.phone.replace('+', ''),
            type: 'text',
            text: { body: parsed.data.body },
          }),
        });
      } catch (err) {
        console.error('[Staff Reply] Outbound dispatch error:', err);
      }
    }

    return NextResponse.json({ success: true, message: msg });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
