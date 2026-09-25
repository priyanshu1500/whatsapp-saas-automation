import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  try {
    const events = db.getConsentEvents();
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch consent events' }, { status: 500 });
  }
}

const eraseSchema = z.object({
  phone: z.string().min(5, 'Valid phone number required for erasure request'),
});

// DPDP Right-to-be-forgotten / Data Deletion endpoint
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = eraseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const success = db.eraseLeadData(parsed.data.phone);
    if (!success) {
      return NextResponse.json({ error: 'Lead not found for phone number' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'All personal data, chat history, and appointments erased in compliance with India DPDP Act.',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process DPDP erasure request' }, { status: 500 });
  }
}

