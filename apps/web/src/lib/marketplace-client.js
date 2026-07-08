'use client';

export async function submitWorkflow(kind, data = {}) {
  const response = await fetch('/api/workflows', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ kind, data }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'Workflow request failed');
  }

  return payload.record;
}

export async function submitOnboardingProfile(role, profile) {
  const response = await fetch('/api/onboarding', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role, profile }),
  });

  const payload = await response.json();

  if (!response.ok) {
    const error = new Error(payload.error || 'Onboarding failed');
    error.missing = payload.missing || [];
    throw error;
  }

  return payload.profile;
}

export async function createPaymentIntent(data = {}) {
  const response = await fetch('/api/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'Payment intent failed');
  }

  return payload.intent;
}

export async function getListings(type = null, segment = null) {
  let url = '/api/listings';
  const params = [];
  if (type) params.push(`type=${type}`);
  if (segment) params.push(`segment=${segment}`);
  if (params.length) {
    url += '?' + params.join('&');
  }
  const response = await fetch(url);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || 'Failed to fetch listings');
  }
  return payload.listings;
}

export async function getListing(id) {
  const response = await fetch(`/api/listings/${id}`);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || 'Failed to fetch listing');
  }
  return payload.listing;
}

export async function getDashboardData(role) {
  const response = await fetch(`/api/dashboard/${role}`);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || 'Failed to fetch dashboard data');
  }
  return payload;
}
