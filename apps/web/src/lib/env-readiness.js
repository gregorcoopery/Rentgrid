/* global process */

const REQUIRED_PRODUCTION_ENV = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'CLERK_WEBHOOK_SECRET',
  'DATABASE_URL',
  'PAYSTACK_SECRET_KEY',
  'RESEND_API_KEY',
  'SENTRY_DSN',
  'NEXT_PUBLIC_SENTRY_DSN',
  'NEXT_PUBLIC_ANALYTICS_KEY',
];

const OPTIONAL_ENV = [
  'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY',
  'FLUTTERWAVE_SECRET_KEY',
  'NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY',
  'FLUTTERWAVE_WEBHOOK_HASH',
  'TERMII_API_KEY',
  'TERMII_SENDER_ID',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'SENTRY_ORG',
  'SENTRY_PROJECT',
  'SENTRY_AUTH_TOKEN',
];

export function getEnvReadiness(env = process.env) {
  const missingRequired = REQUIRED_PRODUCTION_ENV.filter((key) => !env[key]);
  const configuredOptional = OPTIONAL_ENV.filter((key) => Boolean(env[key]));

  return {
    ready: missingRequired.length === 0,
    missingRequired,
    configuredOptional,
    required: REQUIRED_PRODUCTION_ENV,
  };
}

