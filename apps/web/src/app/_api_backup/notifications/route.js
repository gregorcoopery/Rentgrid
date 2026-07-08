import { NextResponse } from 'next/server';
import { createNotification } from '@/lib/integrations';

export async function POST(request) {
  const payload = await request.json();

  if (!payload.channel || !payload.recipient || !payload.body) {
    return NextResponse.json({ error: 'channel, recipient, and body are required' }, { status: 422 });
  }

  return NextResponse.json({
    notification: await createNotification(payload),
  }, { status: 201 });
}
