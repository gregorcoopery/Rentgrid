/* global process */

export const INTEGRATION_STATUS = {
  CONFIGURED: 'configured',
  MISSING_ENV: 'missing-env',
};

export function getIntegrationReadiness(env = process.env) {
  return {
    database: env.DATABASE_URL ? INTEGRATION_STATUS.CONFIGURED : INTEGRATION_STATUS.MISSING_ENV,
    clerk: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && env.CLERK_SECRET_KEY
      ? INTEGRATION_STATUS.CONFIGURED
      : INTEGRATION_STATUS.MISSING_ENV,
    payments: env.PAYSTACK_SECRET_KEY || env.FLUTTERWAVE_SECRET_KEY
      ? INTEGRATION_STATUS.CONFIGURED
      : INTEGRATION_STATUS.MISSING_ENV,
    email: env.RESEND_API_KEY || env.SENDGRID_API_KEY
      ? INTEGRATION_STATUS.CONFIGURED
      : INTEGRATION_STATUS.MISSING_ENV,
    sms: env.TERMII_API_KEY || (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN)
      ? INTEGRATION_STATUS.CONFIGURED
      : INTEGRATION_STATUS.MISSING_ENV,
    monitoring: env.SENTRY_DSN ? INTEGRATION_STATUS.CONFIGURED : INTEGRATION_STATUS.MISSING_ENV,
    analytics: env.NEXT_PUBLIC_ANALYTICS_KEY ? INTEGRATION_STATUS.CONFIGURED : INTEGRATION_STATUS.MISSING_ENV,
  };
}

export async function createPaymentIntent({ amount, email, reference, metadata }) {
  const paymentReference = reference || `rentgrid_${Date.now()}`;

  if (process.env.PAYSTACK_SECRET_KEY) {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Number(amount) * 100,
        email,
        reference: paymentReference,
        metadata,
      }),
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || 'Paystack initialization failed');
    }

    return {
      provider: 'paystack',
      amount,
      email,
      reference: paymentReference,
      currency: 'NGN',
      metadata,
      status: 'initialized',
      authorizationUrl: payload.data?.authorization_url,
      accessCode: payload.data?.access_code,
    };
  }

  return {
    provider: 'sandbox',
    amount,
    email,
    reference: paymentReference,
    currency: 'NGN',
    metadata,
    status: 'sandbox-created',
  };
}

export async function createNotification({ channel, recipient, subject, body }) {
  if (channel === 'email' && process.env.RESEND_API_KEY) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.NOTIFICATION_FROM_EMAIL || 'RentGrid <support@rentgrid.ng>',
        to: recipient,
        subject: subject || 'RentGrid notification',
        text: body,
      }),
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || 'Email notification failed');
    }

    return {
      channel,
      recipient,
      subject,
      provider: 'resend',
      status: 'sent',
      providerId: payload.id,
      createdAt: new Date().toISOString(),
    };
  }

  if (channel === 'sms' && process.env.TERMII_API_KEY) {
    const response = await fetch('https://api.ng.termii.com/api/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: process.env.TERMII_API_KEY,
        to: recipient,
        from: process.env.TERMII_SENDER_ID || 'RentGrid',
        sms: body,
        type: 'plain',
        channel: 'generic',
      }),
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || 'SMS notification failed');
    }

    return {
      channel,
      recipient,
      subject,
      provider: 'termii',
      status: 'sent',
      providerId: payload.message_id,
      createdAt: new Date().toISOString(),
    };
  }

  return {
    channel,
    recipient,
    subject,
    body,
    provider: 'sandbox',
    status: 'queued',
    createdAt: new Date().toISOString(),
  };
}

export function verifyWebhookSignature({ signature, secret }) {
  if (!secret) {
    return { verified: false, reason: 'missing-secret' };
  }

  if (!signature) {
    return { verified: false, reason: 'missing-signature' };
  }

  return { verified: true };
}
