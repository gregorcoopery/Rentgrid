-- RentGrid production schema baseline.
-- Target: PostgreSQL-compatible databases such as Supabase, Neon, Railway, or RDS.

create table if not exists users (
  id text primary key,
  clerk_id text unique not null,
  role text not null check (role in ('tenant', 'landlord', 'agent', 'inspector', 'super-admin')),
  name text not null,
  email text not null,
  phone text,
  onboarding_complete boolean not null default false,
  verification_status text not null default 'pending-review',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists listings (
  id text primary key,
  listing_type text not null check (listing_type in ('property', 'hostel')),
  segment text not null check (segment in ('general', 'student')),
  owner_id text not null references users(id),
  agent_id text references users(id),
  inspector_id text references users(id),
  name text not null,
  description text,
  location text not null,
  area text,
  university text,
  annual_price integer not null check (annual_price > 0),
  room_type text not null,
  amenities text[] not null default '{}',
  image_urls text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'pending-review', 'verified', 'rejected')),
  available_from date,
  verification_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists inspections (
  id text primary key,
  listing_id text not null references listings(id),
  tenant_id text not null references users(id),
  agent_id text references users(id),
  inspector_id text references users(id),
  scheduled_for timestamptz,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'flagged')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reservations (
  id text primary key,
  listing_id text not null references listings(id),
  tenant_id text not null references users(id),
  amount integer not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'flagged')),
  payment_status text not null default 'awaiting-payment',
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists maintenance_requests (
  id text primary key,
  listing_id text not null references listings(id),
  tenant_id text not null references users(id),
  title text not null,
  description text,
  priority text not null default 'medium',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'flagged')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id text primary key,
  thread_id text not null,
  from_user_id text not null references users(id),
  to_user_id text not null references users(id),
  subject text,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists workflow_events (
  id text primary key,
  kind text not null,
  actor_id text references users(id),
  target_id text,
  status text not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists listings_status_idx on listings(status);
create index if not exists listings_segment_idx on listings(segment);
create index if not exists inspections_listing_idx on inspections(listing_id);
create index if not exists reservations_listing_idx on reservations(listing_id);
create index if not exists messages_thread_idx on messages(thread_id);

