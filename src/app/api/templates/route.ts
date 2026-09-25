import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const templates = db.getTemplates();
    return NextResponse.json({ templates });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

const sendTemplateSchema = z.object({
  template_id: z.string(),
  lead_id: z.string(),
  variables: z.record(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = sendTemplateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const template = db.getTemplateById(parsed.data.template_id);
    const lead = db.getLeadById(parsed.data.lead_id);
    if (!template || !lead) {
      return NextResponse.json({ error: 'Template or Lead not found' }, { status: 404 });
    }

    let renderedBody = template.body;
    renderedBody = renderedBody.replace(/\{\{1\}\}/g, lead.name);

    const costCategory =
      template.category === 'MARKETING' ? 'marketing_template' : 'utility_template';

    const msg = db.addMessage({
      lead_id: lead.id,
      phone: lead.phone,
      direction: 'OUTBOUND',
      sender: 'BOT',
      body: `[META TEMPLATE: ${template.name}]\n${renderedBody}`,
      cost_category: costCategory,
      cost_inr: template.cost_inr,
    });

    return NextResponse.json({ success: true, message: msg });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to dispatch template' }, { status: 500 });
  }
}

