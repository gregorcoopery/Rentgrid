export const ROLE_IDS = {
  PUBLIC: 'public-visitor',
  TENANT: 'tenant',
  LANDLORD: 'landlord',
  AGENT: 'agent',
  INSPECTOR: 'inspector',
  SUPER_ADMIN: 'super-admin',
};

export const ROLE_ORDER = [
  ROLE_IDS.PUBLIC,
  ROLE_IDS.TENANT,
  ROLE_IDS.LANDLORD,
  ROLE_IDS.AGENT,
  ROLE_IDS.INSPECTOR,
  ROLE_IDS.SUPER_ADMIN,
];

export const SIGN_UP_ROLE_ORDER = [
  ROLE_IDS.TENANT,
  ROLE_IDS.LANDLORD,
  ROLE_IDS.AGENT,
  ROLE_IDS.INSPECTOR,
];

export const ROLE_DEFINITIONS = {
  [ROLE_IDS.PUBLIC]: {
    label: 'Public Visitor',
    access: 'Read-only, public pages only',
    dashboardRoute: null,
    dashboardRoutes: [],
    permissions: [
      'View public pages',
      'Browse rental listings',
      'View property detail pages',
      'Access student rentals',
      'View FAQ, Privacy Policy, and Terms of Service',
    ],
    restrictions: [
      'Cannot access dashboards',
      'Cannot submit inquiries or initiate bookings',
      'Cannot save listings',
      'Cannot manage content',
    ],
  },
  [ROLE_IDS.TENANT]: {
    label: 'Tenant / Renter',
    access: 'Authenticated personal workspace',
    dashboardRoute: '/tenant-dashboard',
    dashboardRoutes: ['/tenant-dashboard'],
    onboardingDescription: 'Find rentals, save listings, request inspections, and manage applications.',
  },
  [ROLE_IDS.LANDLORD]: {
    label: 'Landlord',
    access: 'Authenticated listing owner workspace',
    dashboardRoute: '/landlord-dashboard',
    dashboardRoutes: ['/landlord-dashboard'],
    onboardingDescription: 'Create and manage owned listings, pricing, availability, and renter inquiries.',
  },
  [ROLE_IDS.AGENT]: {
    label: 'Agent',
    access: 'Authenticated portfolio management workspace',
    dashboardRoute: '/agent-dashboard',
    dashboardRoutes: ['/agent-dashboard'],
    onboardingDescription: 'Manage a portfolio of listings, tenant leads, and follow-up tasks.',
  },
  [ROLE_IDS.INSPECTOR]: {
    label: 'Inspector',
    access: 'Authenticated verification workspace',
    dashboardRoute: '/inspector-dashboard',
    dashboardRoutes: ['/inspector-dashboard', '/inspectors'],
    onboardingDescription: 'Review assigned properties, update verification status, and record notes.',
  },
  [ROLE_IDS.SUPER_ADMIN]: {
    label: 'Super Administrator',
    access: 'Authenticated platform-wide administrative access',
    dashboardRoute: '/admin-dashboard',
    dashboardRoutes: ['/admin-dashboard'],
  },
};

export const DASHBOARD_ROUTES = ROLE_ORDER.flatMap((roleId) =>
  ROLE_DEFINITIONS[roleId].dashboardRoutes.map((route) => ({ route, roleId })),
);

export function normalizeRole(roleId) {
  return ROLE_ORDER.includes(roleId) ? roleId : ROLE_IDS.PUBLIC;
}

export function getRoleDefinition(roleId) {
  return ROLE_DEFINITIONS[normalizeRole(roleId)];
}

export function getDashboardRoute(roleId) {
  return getRoleDefinition(roleId).dashboardRoute;
}

export function getPostAuthRedirect(roleId) {
  return getDashboardRoute(roleId) || '/browse-rentals';
}

export function canAccessDashboard(roleId, dashboardRoute) {
  const normalizedRole = normalizeRole(roleId);

  if (normalizedRole === ROLE_IDS.SUPER_ADMIN) {
    return DASHBOARD_ROUTES.some(({ route }) => route === dashboardRoute);
  }

  return getRoleDefinition(normalizedRole).dashboardRoutes.includes(dashboardRoute);
}

export function canInitiateRentalAction(roleId) {
  return normalizeRole(roleId) === ROLE_IDS.TENANT || normalizeRole(roleId) === ROLE_IDS.SUPER_ADMIN;
}

export function getRoleFromMetadata(user) {
  return normalizeRole(user?.publicMetadata?.role || user?.unsafeMetadata?.role || ROLE_IDS.PUBLIC);
}
