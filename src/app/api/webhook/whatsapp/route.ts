import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/server/db';
import { aiAgent } from '@/server/ai-agent';

// GET: Meta Webhook Verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const config = db.getConfig();
  const verifyToken = process.env.META_VERIFY_TOKEN || config.whatsapp_verify_token;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[Meta Webhook] Successfully verified webhook subscription');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification token mismatch' }, { status: 403 });
}

// POST: Meta WhatsApp Cloud API Inbound Webhook
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const config = db.getConfig();
    const appSecret = process.env.META_APP_SECRET;

    // Security Check: HMAC SHA-256 signature verification (Fullstack Guardian standard)
    if (appSecret) {
      const signature = req.headers.get('x-hub-signature-256');
      if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
      }
      const expectedSignature = `sha256=${crypto
        .createHmac('sha256', appSecret)
        .update(rawBody)
        .digest('hex')}`;

      if (signature !== expectedSignature) {
        console.warn('[Meta Webhook] Invalid HMAC signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);

    // Filter for WhatsApp message events
    const entry = payload.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const messageObj = change?.messages?.[0];

    if (!messageObj) {
      // Could be status updates (sent, delivered, read)
      return NextResponse.json({ status: 'ignored_non_message_event' });
    }

    const fromPhone = `+${messageObj.from}`;
    const customerName = change?.contacts?.[0]?.profile?.name || 'WhatsApp Customer';
    const messageText = messageObj.text?.body || messageObj.button?.text || '';

    if (!messageText) {
      return NextResponse.json({ status: 'ignored_unsupported_media' });
    }

    // 1. Get or create Lead
    const lead = db.createOrGetLead(fromPhone, customerName);

    // 2. Save incoming message
    db.addMessage({
      lead_id: lead.id,
      phone: fromPhone,
      direction: 'INBOUND',
      sender: 'CUSTOMER',
      body: messageText,
      cost_category: 'service_reply',
      cost_inr: 0,
      meta_message_id: messageObj.id,
    });

    // 3. Human Takeover Check: if bot is paused, do NOT auto-reply
    if (lead.bot_paused) {
      console.log(`[Meta Webhook] Bot paused for lead ${lead.id}. Skipping automated AI reply.`);
      return NextResponse.json({ status: 'bot_paused_human_takeover' });
    }

    // 4. Fetch history and run AI agent
    const history = db.getMessagesByLeadId(lead.id);
    const aiResult = await aiAgent.processMessage(messageText, history, config);

    // 5. Store AI reply
    db.addMessage({
      lead_id: lead.id,
      phone: fromPhone,
      direction: 'OUTBOUND',
      sender: 'BOT',
      body: aiResult.reply,
      intent: aiResult.intent,
      cost_category: 'service_reply',
      cost_inr: 0,
    });

    // 6. Handle Intent actions
    if (aiResult.intent === 'book') {
      db.createAppointment({
        lead_id: lead.id,
        patient_name: customerName,
        phone: fromPhone,
        service: aiResult.service || 'Dental Consultation & X-Ray',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time_slot: aiResult.preferred_date || '11:00 AM',
        doctor_or_staff: config.doctor_name,
        status: 'CONFIRMED',
        reminder_sent: false,
      });
      db.updateLead(lead.id, { status: 'BOOKED', service_interest: aiResult.service });
    } else if (aiResult.intent === 'human') {
      db.updateLead(lead.id, {
        status: 'NEEDS_STAFF',
        bot_paused: true,
        notes: 'Customer requested human handover.',
      });
    }

    // 7. Dispatch reply via Meta Graph API v20.0 if credentials configured
    const permanentToken = process.env.META_ACCESS_TOKEN;
    const phoneId = process.env.META_PHONE_NUMBER_ID || config.whatsapp_phone_number_id;

    if (permanentToken && phoneId) {
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
            to: messageObj.from,
            type: 'text',
            text: { body: aiResult.reply },
          }),
        });
      } catch (sendErr) {
        console.error('[Meta Webhook] Outbound API dispatch failed:', sendErr);
      }
    }

    return NextResponse.json({ success: true, reply: aiResult.reply, intent: aiResult.intent });
  } catch (error) {
    console.error('[Meta Webhook] Error processing event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
