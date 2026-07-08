import {
  hostels,
  inspections,
  maintenanceRequests,
  messages,
  properties,
  reservations,
  users,
  WORKFLOW_STATUS,
} from '@/lib/marketplace-data';
import { appendWorkflow, getStore, getStoredWorkflows } from '@/lib/marketplace-store';
import {
  createPostgresWorkflowRecord,
  getPostgresListingById,
  getPostgresListings,
  getPostgresSnapshot,
  hasDatabaseUrl,
} from '@/lib/postgres-repository';

const clone = (value) => JSON.parse(JSON.stringify(value));

export async function getMarketplaceSnapshot() {
  if (hasDatabaseUrl()) {
    return getPostgresSnapshot();
  }

  const store = getStore();

  return clone({
    users,
    properties,
    hostels,
    inspections: store.inspections,
    reservations: store.reservations,
    maintenanceRequests: store.maintenanceRequests,
    messages: store.messages,
    propertyDrafts: store.properties,
    payouts: store.payouts,
    verifications: store.verifications,
    workflows: getStoredWorkflows(),
  });
}

export async function getListings({ segment, status, type } = {}) {
  if (hasDatabaseUrl()) {
    return getPostgresListings({ segment, status, type });
  }

  const listingPool = type === 'hostel' ? hostels : properties;

  return clone(
    listingPool.filter((listing) => {
      const matchesSegment = !segment || listing.segment === segment;
      const matchesStatus = !status || listing.status === status;
      return matchesSegment && matchesStatus;
    }),
  );
}

export async function getListingById(id, type = 'property') {
  if (hasDatabaseUrl()) {
    return getPostgresListingById(id, type);
  }

  const listingPool = type === 'hostel' ? hostels : properties;
  return clone(listingPool.find((listing) => listing.id === String(id)) || null);
}

export async function getDashboardData(role) {
  const snapshot = await getMarketplaceSnapshot();

  return {
    role,
    metrics: {
      properties: snapshot.properties.length,
      verifiedProperties: snapshot.properties.filter((property) => property.status === 'verified').length,
      pendingInspections: snapshot.inspections.filter((inspection) => inspection.status !== WORKFLOW_STATUS.COMPLETED).length,
      unreadMessages: snapshot.messages.filter((message) => !message.read).length,
      pendingReservations: snapshot.reservations.filter((reservation) => reservation.status === WORKFLOW_STATUS.PENDING).length,
      openMaintenance: snapshot.maintenanceRequests.filter((request) => request.status !== WORKFLOW_STATUS.COMPLETED).length,
    },
    ...snapshot,
  };
}

export async function createWorkflowRecord(kind, payload = {}) {
  const now = new Date().toISOString();
  const id = `${kind}_${Date.now()}`;

  const record = {
    id,
    status: WORKFLOW_STATUS.PENDING,
    createdAt: now,
    ...payload,
  };

  if (hasDatabaseUrl()) {
    return createPostgresWorkflowRecord(kind, record);
  }

  return appendWorkflow(kind, record);
}

export function validateOnboardingProfile(role, profile = {}) {
  const baseRequired = ['name', 'email', 'phone'];
  const roleRequired = {
    tenant: ['preferredLocation', 'budget'],
    landlord: ['businessName', 'propertyOwnershipProof', 'bankName'],
    agent: ['serviceAreas', 'identityDocument'],
    inspector: ['serviceAreas', 'identityDocument', 'inspectionExperience'],
    'super-admin': [],
  };

  const required = [...baseRequired, ...(roleRequired[role] || [])];
  const missing = required.filter((field) => {
    const value = profile[field];
    return Array.isArray(value) ? value.length === 0 : !value;
  });

  return {
    complete: missing.length === 0,
    missing,
  };
}
