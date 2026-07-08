'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { usePermissions } from '@/components/PermissionProvider.jsx';
import {
  ROLE_DEFINITIONS,
  canAccessDashboard,
  getDashboardRoute,
  getRoleDefinition,
  ROLE_IDS,
} from '@/lib/permissions';

export default function ProtectedDashboard({ route, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();
  const { role } = usePermissions();
  const currentRole = getRoleDefinition(role);
  const allowed = canAccessDashboard(role, route);
  const ownDashboardRoute = getDashboardRoute(role);
  const onboardingComplete = Boolean(user?.unsafeMetadata?.onboardingComplete || user?.publicMetadata?.onboardingComplete);
  const routeOwner = Object.values(ROLE_DEFINITIONS).find((definition) =>
    definition.dashboardRoutes?.includes(route),
  );
  const targetRoleId = routeOwner
    ? Object.entries(ROLE_DEFINITIONS).find(([, definition]) => definition === routeOwner)?.[0]
    : null;
  const signInRoute = targetRoleId ? `/sign-in?role=${targetRoleId}` : '/sign-in';

  React.useEffect(() => {
    if (!isLoaded || !isSignedIn || !allowed || pathname === '/onboarding') {
      return;
    }

    if (role !== ROLE_IDS.SUPER_ADMIN && !onboardingComplete) {
      router.push('/onboarding');
    }
  }, [allowed, isLoaded, isSignedIn, onboardingComplete, pathname, role, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm font-medium text-muted-foreground">Checking access...</p>
      </div>
    );
  }

  if (!isSignedIn || !allowed) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 soft-bg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
                {!isSignedIn ? 'Sign in required' : 'Dashboard access restricted'}
              </p>
              <h1 className="text-3xl font-bold text-foreground">
                {!isSignedIn
                  ? `Sign in as ${routeOwner?.label || 'an authorized user'} to continue.`
                  : `${routeOwner?.label || 'This dashboard'} is not available to ${currentRole.label}.`}
              </h1>
              <p className="mt-4 text-muted-foreground">
                RentGrid dashboards follow the role order in the permissions reference. Each authenticated role opens its assigned workspace, while Super Administrators can review every dashboard for operations.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {!isSignedIn ? (
                  <Button asChild>
                    <Link to={signInRoute}>Sign in</Link>
                  </Button>
                ) : ownDashboardRoute ? (
                  <Button asChild>
                    <Link to={ownDashboardRoute}>Open my dashboard</Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to="/browse-rentals">Browse rentals</Link>
                  </Button>
                )}
                <Button variant="outline" asChild>
                  <Link to="/">Return home</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (role !== ROLE_IDS.SUPER_ADMIN && !onboardingComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm font-medium text-muted-foreground">Preparing your profile setup...</p>
      </div>
    );
  }

  return children;
}
