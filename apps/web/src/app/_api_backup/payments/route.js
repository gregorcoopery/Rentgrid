import { NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/integrations';

export async function POST(request) {
  const payload = await request.json();

  if (!payload.amount || !payload.email) {
    return NextResponse.json({ error: 'amount and email are required' }, { status: 422 });
  }

  return NextResponse.json({
    intent: await createPaymentIntent(payload),
  }, { status: 201 });
}
