# RentGrid Deployment Readiness

## Current Implementation

- Clerk authentication and role routing are active.
- Role onboarding validates required role profile fields.
- Marketplace API routes expose listings, dashboard data, workflow creation, payment intent stubs, notifications, and health checks.
- Dashboard actions submit workflow records through `/api/workflows`.
- Property and hostel reservations create workflow records and payment intents.
- Landlords can create property drafts from `/landlord-dashboard/properties/new`.
- PostgreSQL repository support is active when `DATABASE_URL` is configured.
- Clerk webhooks verify Svix signatures and sync users into PostgreSQL when `DATABASE_URL` is configured.
- Paystack transaction initialization is wired when `PAYSTACK_SECRET_KEY` is configured.
- Resend email and Termii SMS notifications are wired when provider keys are configured.
- Sentry and first-party analytics are wired through environment variables.
- `/api/health` reports missing required production env vars and returns `503` until configured.

## Required Production Connections

1. Provision PostgreSQL and apply `database/schema.sql`. External action required.
2. Set `DATABASE_URL` in production. Code path is implemented.
3. Configure Clerk webhook URL at `/api/webhooks/clerk`. Code path is implemented.
4. Configure Paystack webhook URL at `/api/payments/webhook`. Code path is implemented.
5. Configure payment, email, SMS, Sentry, and analytics keys from `.env.example`.
6. Verify `/api/health` returns `200` in production.

## Recommended Release Gate

- `npm.cmd run lint --prefix apps/web`
- `npm.cmd run build --prefix apps/web`
- Verify `/api/health` reports configured integrations.
- Exercise tenant reservation and inspection flows.
- Exercise landlord property draft creation.
- Exercise admin verification workflow.
- Configure Clerk webhook URL at `/api/webhooks/clerk`.
- Configure payment provider webhook URL at `/api/payments/webhook`.

## Known External Blockers

- A real PostgreSQL instance is needed before seeded/runtime data becomes durable.
- Real provider credentials are needed before payments, email, SMS, Sentry, and analytics can be verified end-to-end.
- npm currently reports 2 vulnerabilities, but the audit endpoint failed in this environment; run `npm audit --workspace apps/web --omit=dev` from a networked machine.
