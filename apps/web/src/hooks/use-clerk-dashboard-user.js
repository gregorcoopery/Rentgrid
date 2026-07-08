'use client';

import { useUser } from '@clerk/nextjs';

function getEmailName(user) {
  const email = user?.primaryEmailAddress?.emailAddress;
  return email ? email.split('@')[0] : '';
}

export function getClerkDisplayName(user) {
  return user?.fullName || user?.firstName || user?.username || getEmailName(user) || 'there';
}

export function getClerkInitials(user) {
  const parts = [user?.firstName, user?.lastName].filter(Boolean);
  const source = parts.length > 0 ? parts.join(' ') : getClerkDisplayName(user);

  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'RG';
}

export function useClerkDashboardUser() {
  const { user } = useUser();

  return {
    displayName: getClerkDisplayName(user),
    initials: getClerkInitials(user),
  };
}
