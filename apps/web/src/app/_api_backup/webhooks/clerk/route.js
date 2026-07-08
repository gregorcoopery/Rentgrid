/* global process */

import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { hasDatabaseUrl, upsertClerkUser } from '@/lib/postgres-repository';

export async function POST(request) {
  if (!process.env.CLERK_WEBHOOK_SECRET) {
    return NextResponse.json({
      received: false,
      reason: 'missing-clerk-webhook-secret',
    }, { status: 500 });
  }

  const rawBody = await request.text();
  const headers = {
    'svix-id': request.headers.get('svix-id'),
    'svix-timestamp': request.headers.get('svix-timestamp'),
    'svix-signature': request.headers.get('svix-signature'),
  };
  let event;

  try {
    event = new Webhook(process.env.CLERK_WEBHOOK_SECRET).verify(rawBody, headers);
  } catch {
    return NextResponse.json({
      received: false,
      reason: 'invalid-clerk-signature',
    }, { status: 401 });
  }

  let syncedUser = null;

  if (hasDatabaseUrl() && ['user.created', 'user.updated'].includes(event.type)) {
    syncedUser = await upsertClerkUser(event.data);
  }

  return NextResponse.json({
    received: true,
    event: event.type,
    user: syncedUser,
    databaseSync: hasDatabaseUrl() ? 'attempted' : 'skipped-no-database-url',
  });
}
