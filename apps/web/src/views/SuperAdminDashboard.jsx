import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { LayoutDashboard, Users, Building2, ShieldCheck, BarChart3, Settings, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useClerkDashboardUser } from '@/hooks/use-clerk-dashboard-user';
import { DashboardHeaderActions, DashboardSidebar, runDashboardWorkflow } from '@/components/DashboardChrome.jsx';
import { getDashboardData } from '@/lib/marketplace-client';

const SuperAdminDashboard = () => {
  const { displayName, initials } = useClerkDashboardUser();
  const [activeSection, setActiveSection] = useState('Platform Overview');
  const [dashData, setDashData] = useState(null);

  useEffect(() => {
    getDashboardData('super-admin').then(setDashData).catch(() => {});
  }, []);

  const metrics = dashData?.metrics || {};
  const users = dashData?.users || [];
  const properties = dashData?.properties || [];
  const hostels = dashData?.hostels || [];
  const reservations = dashData?.reservations || [];
  const navItems = [
    { icon: LayoutDashboard, label: 'Platform Overview' },
    { icon: Users, label: 'User Management' },
    { icon: Building2, label: 'All Properties' },
    { icon: ShieldCheck, label: 'Verifications' },
    { icon: BarChart3, label: 'Financials' },
    { icon: Settings, label: 'System Settings' },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - RentGrid</title>
      </Helmet>

      <div className="min-h-screen flex bg-background">
        <DashboardSidebar
          portalLabel="Super Admin"
          navItems={navItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-16 border-b border-border/50 bg-background flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center flex-1">
              <div className="relative w-full max-w-md hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Global search..." className="pl-10 bg-secondary/50 border-none rounded-full h-10" />
              </div>
            </div>
            <DashboardHeaderActions initials={initials} />
          </header>

          {/* Dashboard Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto soft-bg">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground">Welcome back, {displayName}</h1>
              <p className="text-muted-foreground">System metrics and high-level statistics.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Total Users</p>
                  <p className="text-3xl font-bold text-foreground">{users.length || '—'}</p>
                  <p className="text-xs text-muted-foreground mt-2">Registered on platform</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Total Listings</p>
                  <p className="text-3xl font-bold text-foreground">{(properties.length + hostels.length) || '—'}</p>
                  <p className="text-xs text-muted-foreground mt-2">{metrics.verifiedProperties ?? 0} verified</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Open Maintenance</p>
                  <p className="text-3xl font-bold text-foreground">{metrics.openMaintenance ?? '—'}</p>
                  <p className="text-xs text-muted-foreground mt-2">Pending requests</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-sm rounded-2xl bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-primary mb-2">Pending Inspections</p>
                  <p className="text-3xl font-bold text-primary">{metrics.pendingInspections ?? '—'}</p>
                  <p className="text-xs text-primary/80 mt-2">Awaiting completion</p>
                </CardContent>
              </Card>
            </div>

            {/* System Alerts */}
            <Card className="border-border/50 shadow-sm rounded-2xl">
              <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="text-lg">System Alerts & Approvals</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  <div className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                    <div>
                      <p className="font-medium text-foreground">5 New Landlord Registrations</p>
                      <p className="text-sm text-muted-foreground">Awaiting KYC verification</p>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => runDashboardWorkflow('verification', 'Registrations review', { queue: 'landlord-kyc' }, 'Opening landlord KYC queue.')}>Review</Button>
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                    <div>
                      <p className="font-medium text-foreground">2 Reported Properties</p>
                      <p className="text-sm text-muted-foreground">Flagged by users for inaccurate info</p>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => runDashboardWorkflow('verification', 'Investigation opened', { queue: 'reported-properties' }, 'Opening reported property cases.')}>Investigate</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
