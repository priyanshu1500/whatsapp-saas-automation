import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { aiAgent } from '@/server/ai-agent';

const chatSchema = z.object({
  phone: z.string().min(5, 'Invalid phone number'),
  name: z.string().default('Simulator Patient'),
  message: z.string().min(1, 'Message cannot be empty'),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = chatSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { phone, name, message } = parsed.data;
    const config = db.getConfig();

    // 1. Get or create Lead
    const lead = db.createOrGetLead(phone, name);

    // 2. Save incoming user message
    const userMsg = db.addMessage({
      lead_id: lead.id,
      phone,
      direction: 'INBOUND',
      sender: 'CUSTOMER',
      body: message,
      cost_category: 'service_reply',
      cost_inr: 0,
    });

    // 3. Human Takeover Check
    if (lead.bot_paused) {
      return NextResponse.json({
        success: true,
        bot_paused: true,
        reply: '(AI Bot is currently PAUSED by clinic staff. Human receptionist will respond in live inbox)',
        intent: 'human',
        lead: db.getLeadById(lead.id),
      });
    }

    // 4. Run AI Agent
    const history = db.getMessagesByLeadId(lead.id);
    const startTime = Date.now();
    const aiResult = await aiAgent.processMessage(message, history, config);
    const latencyMs = Date.now() - startTime;

    // 5. Store Bot reply
    const botMsg = db.addMessage({
      lead_id: lead.id,
      phone,
      direction: 'OUTBOUND',
      sender: 'BOT',
      body: aiResult.reply,
      intent: aiResult.intent,
      cost_category: 'service_reply',
      cost_inr: 0,
    });

    let newAppointment = null;
    // 6. Handle Intent side effects
    if (aiResult.intent === 'book') {
      newAppointment = db.createAppointment({
        lead_id: lead.id,
        patient_name: name,
        phone,
        service: aiResult.service || 'Dental Consultation & X-Ray',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time_slot: aiResult.preferred_date || '04:00 PM',
        doctor_or_staff: config.doctor_name,
        status: 'CONFIRMED',
        reminder_sent: false,
      });
      db.updateLead(lead.id, { status: 'BOOKED', service_interest: aiResult.service });
    } else if (aiResult.intent === 'human') {
      db.updateLead(lead.id, {
        status: 'NEEDS_STAFF',
        bot_paused: true,
        notes: 'Customer requested human handover in WhatsApp Simulator.',
      });
    }

    return NextResponse.json({
      success: true,
      bot_paused: false,
      reply: aiResult.reply,
      intent: aiResult.intent,
      service: aiResult.service,
      lead: db.getLeadById(lead.id),
      appointment: newAppointment,
      debugTrace: {
        latencyMs,
        intent: aiResult.intent,
        reasoning: aiResult.reasoning,
        userMessageId: userMsg.id,
        botMessageId: botMsg.id,
      },
    });
  } catch (error) {
    console.error('[Simulator API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
