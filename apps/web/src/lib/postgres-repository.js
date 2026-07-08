/* global process */

import pg from 'pg';

const { Pool } = pg;
let pool;

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
    });
  }

  return pool;
}

function mapListing(row) {
  return {
    id: row.id,
    type: row.listing_type,
    segment: row.segment,
    name: row.name,
    description: row.description,
    location: row.location,
    area: row.area,
    university: row.university,
    price: row.annual_price,
    image: row.image_urls?.[0] || '',
    images: row.image_urls || [],
    amenities: row.amenities || [],
    roomType: row.room_type,
    status: row.status,
    landlordId: row.owner_id,
    agentId: row.agent_id,
    inspectorId: row.inspector_id,
    availableFrom: row.available_from,
    verificationNotes: row.verification_notes,
  };
}

export async function getPostgresListings({ segment, status, type } = {}) {
  const clauses = [];
  const values = [];

  if (segment) {
    values.push(segment);
    clauses.push(`segment = $${values.length}`);
  }

  if (status) {
    values.push(status);
    clauses.push(`status = $${values.length}`);
  }

  if (type) {
    values.push(type === 'hostel' ? 'hostel' : 'property');
    clauses.push(`listing_type = $${values.length}`);
  }

  const where = clauses.length ? `where ${clauses.join(' and ')}` : '';
  const result = await getPool().query(`select * from listings ${where} order by created_at desc`, values);
  return result.rows.map(mapListing);
}

export async function getPostgresListingById(id, type = 'property') {
  const result = await getPool().query(
    'select * from listings where id = $1 and listing_type = $2 limit 1',
    [String(id), type === 'hostel' ? 'hostel' : 'property'],
  );

  return result.rows[0] ? mapListing(result.rows[0]) : null;
}

export async function getPostgresSnapshot() {
  const [users, listings, workflowEvents] = await Promise.all([
    getPool().query('select * from users order by created_at desc'),
    getPool().query('select * from listings order by created_at desc'),
    getPool().query('select * from workflow_events order by created_at desc limit 100'),
  ]);

  const mappedListings = listings.rows.map(mapListing);

  return {
    users: users.rows,
    properties: mappedListings.filter((listing) => listing.type === 'property'),
    hostels: mappedListings.filter((listing) => listing.type === 'hostel'),
    inspections: [],
    reservations: [],
    maintenanceRequests: [],
    messages: [],
    propertyDrafts: [],
    payouts: [],
    verifications: [],
    workflows: workflowEvents.rows,
  };
}

export async function createPostgresWorkflowRecord(kind, record) {
  await getPool().query(
    `insert into workflow_events (id, kind, target_id, status, payload)
     values ($1, $2, $3, $4, $5::jsonb)`,
    [
      record.id,
      kind,
      record.listingId || record.threadId || record.property || null,
      record.status || 'pending',
      JSON.stringify(record),
    ],
  );

  return record;
}

export async function upsertClerkUser(data) {
  const email = data.email_addresses?.find((entry) => entry.id === data.primary_email_address_id)?.email_address
    || data.email_addresses?.[0]?.email_address
    || '';
  const phone = data.phone_numbers?.find((entry) => entry.id === data.primary_phone_number_id)?.phone_number
    || data.phone_numbers?.[0]?.phone_number
    || null;
  const role = data.public_metadata?.role || data.unsafe_metadata?.role || 'tenant';
  const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || data.username || email || data.id;
  const onboardingComplete = Boolean(data.public_metadata?.onboardingComplete || data.unsafe_metadata?.onboardingComplete);

  await getPool().query(
    `insert into users (id, clerk_id, role, name, email, phone, onboarding_complete, verification_status, metadata)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)
     on conflict (clerk_id) do update set
       role = excluded.role,
       name = excluded.name,
       email = excluded.email,
       phone = excluded.phone,
       onboarding_complete = excluded.onboarding_complete,
       metadata = excluded.metadata,
       updated_at = now()`,
    [
      `clerk_${data.id}`,
      data.id,
      role,
      name,
      email,
      phone,
      onboardingComplete,
      onboardingComplete ? 'verified' : 'pending-review',
      JSON.stringify({
        imageUrl: data.image_url,
        publicMetadata: data.public_metadata || {},
        unsafeMetadata: data.unsafe_metadata || {},
      }),
    ],
  );

  return {
    clerkId: data.id,
    role,
    email,
    onboardingComplete,
  };
}
