import { NextResponse } from 'next/server';
import { createWorkflowRecord } from '@/lib/marketplace-repository';

const VALID_WORKFLOWS = new Set([
  'inspection',
  'reservation',
  'maintenance',
  'message',
  'property',
  'payout',
  'verification',
]);

export async function POST(request) {
  const payload = await request.json();
  const kind = payload.kind;

  if (!VALID_WORKFLOWS.has(kind)) {
    return NextResponse.json({ error: 'Unsupported workflow kind' }, { status: 400 });
  }

  return NextResponse.json({
    record: await createWorkflowRecord(kind, payload.data),
  }, { status: 201 });
}
