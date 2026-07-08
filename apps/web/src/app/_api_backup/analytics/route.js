import { NextResponse } from 'next/server';

export async function POST(request) {
  const payload = await request.json();

  if (!payload.event || !payload.path) {
    return NextResponse.json({ error: 'event and path are required' }, { status: 422 });
  }

  return NextResponse.json({
    accepted: true,
    event: payload.event,
    path: payload.path,
  }, { status: 202 });
}
