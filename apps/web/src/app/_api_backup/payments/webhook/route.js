/* global process */

import crypto from 'node:crypto';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const rawBody = await request.text();
  const paystackSignature = request.headers.get('x-paystack-signature');
  const flutterwaveHash = request.headers.get('verif-hash');
  const expectedPaystackSignature = process.env.PAYSTACK_SECRET_KEY
    ? crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(rawBody).digest('hex')
    : null;
  const paystackVerified = Boolean(paystackSignature && expectedPaystackSignature && paystackSignature === expectedPaystackSignature);
  const flutterwaveVerified = Boolean(
    flutterwaveHash
      && process.env.FLUTTERWAVE_WEBHOOK_HASH
      && flutterwaveHash === process.env.FLUTTERWAVE_WEBHOOK_HASH,
  );

  if (!paystackVerified && !flutterwaveVerified) {
    return NextResponse.json({
      received: false,
      reason: 'invalid-signature',
    }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);

  return NextResponse.json({
    received: true,
    event: payload.event || payload['event.type'] || 'payment.event',
    reference: payload.data?.reference || payload.tx_ref || null,
  });
}
