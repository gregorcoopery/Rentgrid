# RentGrid

RentGrid is a modern property rentals and student hostel bookings marketplace specifically tailored for the Nigerian market, featuring automated KYC, verified property listings, and local payment integration (Paystack/Flutterwave).

The codebase is structured as a split repository containing the frontend (Next.js) and backend (Django) in the `apps/` directory.

---

## Repository Structure

```
rentgrid/
├── apps/
│   ├── web/        # Next.js frontend (UI & pages)
│   └── backend/    # Django API backend (data model & logic)
├── package.json    # Workspace dependency manager
└── README.md       # General developer instructions
```

---

## 🛠️ Step-by-Step Local Setup

### 1. Backend Setup (Django API)

1. Navigate to the backend directory:
   ```bash
   cd apps/backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   venv\Scripts\Activate.ps1
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment template and set up your variables:
   ```bash
   cp .env.example .env
   ```
5. Apply database migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the local server:
   ```bash
   python manage.py runserver
   ```
   The backend API will run at `http://127.0.0.1:8000/`.

---

### 2. Frontend Setup (Next.js)

1. Navigate to the web directory:
   ```bash
   cd apps/web
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template and configure keys:
   ```bash
   cp .env.example .env
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to browse RentGrid locally. Next.js automatically rewrites `/api/*` requests to the Django backend.

---

## 🔑 Key Configurations & Third-Party Integrations

Ensure you copy the environment templates to `.env` in both folders and fill in these keys:

* **Authentication (Clerk):** Manage users, roles, and sessions. Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
* **Clerk Webhooks:** Subscribe to `user.created` and `user.updated` events. Direct the webhook endpoint to `https://<your-domain>/api/webhooks/clerk` to sync user data instantly to the Django database.
* **Payments (Paystack):** Complete live bookings. Set `PAYSTACK_SECRET_KEY` and `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`.
* **Cache/Rate Limiting:** Backend rate-limiting is set on sensitive endpoints (payments, workflow creation, and analytics). In production, configure `REDIS_URL` in `apps/backend/.env` for a shared state rate limit. Dev defaults gracefully to single-process in-memory caching.
