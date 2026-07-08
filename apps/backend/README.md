# RentGrid Django Backend

A Django-based REST API backend for the RentGrid rental marketplace platform.

## Tech Stack

- **Python 3.10+** with Django 4.2
- **PostgreSQL** (via `psycopg2-binary` + `dj-database-url`) — falls back to SQLite if `DATABASE_URL` is not set
- **django-cors-headers** — CORS management for the Next.js frontend
- **Svix** — Clerk webhook signature verification
- **Requests** — Paystack + Resend + Termii integrations
- **Sentry SDK** — Error monitoring
- **Gunicorn** — Production WSGI server

---

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Service health + env readiness check |
| GET | `/api/marketplace` | Full marketplace snapshot (all entities) |
| GET | `/api/listings` | List listings (filter by `?segment=`, `?status=`, `?type=`) |
| GET | `/api/listings/<id>` | Listing detail (pass `?type=hostel` for hostels) |
| POST | `/api/workflows` | Submit a workflow event (inspection, reservation, etc.) |
| POST | `/api/onboarding` | Validate and save onboarding profile |
| POST | `/api/payments` | Initialize payment intent (Paystack or sandbox) |
| POST | `/api/notifications` | Send notification (Resend/Termii or sandbox) |
| POST | `/api/analytics` | Track page analytics event |
| GET | `/api/dashboard/<role>` | Role-specific dashboard snapshot |
| POST | `/api/webhooks/clerk` | Clerk webhook (syncs users into DB) |
| POST | `/api/payments/webhook` | Paystack/Flutterwave payment webhook |

---

## Setup

### Prerequisites
- Python 3.10+
- PostgreSQL (optional — falls back to SQLite)

### Local Development

```bash
# Navigate to backend directory
cd apps/backend

# Create a virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# (Mac/Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy env template
cp .env.example .env
# Fill in your credentials in .env

# Run migrations
python manage.py migrate

# Seed database with mock data
python manage.py seed_data

# Start development server on port 8000
python manage.py runserver 0.0.0.0:8000
```

### Connecting to the Frontend

The Next.js frontend at `apps/web` is configured to proxy all `/api/*` requests to the Django backend.

In development, it defaults to `http://127.0.0.1:8000`. Set `NEXT_PUBLIC_API_URL` in `apps/web/.env` to override this for staging or production.

---

## Production Deployment

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `DJANGO_SECRET_KEY` | Strong random secret key |
| `DJANGO_DEBUG` | Set to `False` |
| `ALLOWED_HOSTS` | Comma-separated list of production hosts |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth public key |
| `CLERK_SECRET_KEY` | Clerk auth secret key |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret |
| `PAYSTACK_SECRET_KEY` | Paystack secret key |
| `RESEND_API_KEY` | Resend email API key |
| `SENTRY_DSN` | Sentry DSN for error tracking |

### Hosting with Gunicorn (Render / Railway / Heroku)

```bash
gunicorn config.wsgi --log-file -
```

The `Procfile` in this directory is pre-configured for Heroku/Render.

### Database

Apply migrations on first deploy:

```bash
python manage.py migrate
python manage.py seed_data   # optional: load mock data
```

### Collect Static Files

```bash
python manage.py collectstatic --no-input
```

### Verify

```
GET /api/health
```

Should return `200` with `"ok": true` once all required environment variables are set.

---

## Django Admin

Create a superuser to access `/admin`:

```bash
python manage.py createsuperuser
```

All models (Users, Listings, Inspections, Reservations, Messages, Workflows) are registered in the admin panel.
