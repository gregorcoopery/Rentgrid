import {
  inspections,
  maintenanceRequests,
  messages,
  reservations,
} from '@/lib/marketplace-data';

const STORE_KEY = '__rentgrid_marketplace_store__';

function createInitialStore() {
  return {
    workflows: [],
    inspections: [...inspections],
    reservations: [...reservations],
    maintenanceRequests: [...maintenanceRequests],
    messages: [...messages],
    properties: [],
    payouts: [],
    verifications: [],
  };
}

export function getStore() {
  if (!globalThis[STORE_KEY]) {
    globalThis[STORE_KEY] = createInitialStore();
  }

  return globalThis[STORE_KEY];
}

export function appendWorkflow(kind, record) {
  const store = getStore();
  store.workflows.unshift({ kind, ...record });

  if (kind === 'inspection') {
    store.inspections.unshift(record);
  }

  if (kind === 'reservation') {
    store.reservations.unshift(record);
  }

  if (kind === 'maintenance') {
    store.maintenanceRequests.unshift(record);
  }

  if (kind === 'message') {
    store.messages.unshift(record);
  }

  if (kind === 'property') {
    store.properties.unshift(record);
  }

  if (kind === 'payout') {
    store.payouts.unshift(record);
  }

  if (kind === 'verification') {
    store.verifications.unshift(record);
  }

  return record;
}

export function getStoredWorkflows() {
  return getStore().workflows;
}

