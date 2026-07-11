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
        <main className="flex-1 flex flex-col min-w-0 pt-14 lg:pt-0">
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

            {/* Stats Grid — always shown at top of Platform Overview */}
            {activeSection === 'Platform Overview' && (
              <>
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
                    <CardTitle className="text-lg">System Alerts &amp; Approvals</CardTitle>
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
              </>
            )}

            {activeSection === 'User Management' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-lg">All Registered Users ({users.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {users.length === 0 ? (
                    <div className="p-8 text-center">
                      <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="font-medium text-foreground">No users found</p>
                      <p className="text-sm text-muted-foreground mt-1">Registered users will appear here.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {users.slice(0, 20).map((user, i) => (
                        <div key={user.id || i} className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                              {(user.email || user.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm">{user.name || user.email || `User #${i + 1}`}</p>
                              <p className="text-xs text-muted-foreground">{user.role || 'tenant'} · {user.email || '—'}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="rounded-full text-xs" onClick={() => runDashboardWorkflow('admin', 'User reviewed', { userId: user.id }, 'User profile action queued.')}>
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeSection === 'All Properties' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <Card className="border-border/50 rounded-2xl">
                    <CardContent className="p-5">
                      <p className="text-sm text-muted-foreground mb-1">Properties</p>
                      <p className="text-2xl font-bold text-foreground">{properties.length || '—'}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 rounded-2xl">
                    <CardContent className="p-5">
                      <p className="text-sm text-muted-foreground mb-1">Hostels</p>
                      <p className="text-2xl font-bold text-foreground">{hostels.length || '—'}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 rounded-2xl bg-primary/5 border-primary/20">
                    <CardContent className="p-5">
                      <p className="text-sm text-primary mb-1">Verified</p>
                      <p className="text-2xl font-bold text-primary">{metrics.verifiedProperties ?? '—'}</p>
                    </CardContent>
                  </Card>
                </div>
                <Card className="border-border/50 shadow-sm rounded-2xl">
                  <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="text-lg">All Listings</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {properties.length === 0 && hostels.length === 0 ? (
                      <div className="p-8 text-center">
                        <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="font-medium text-foreground">No listings yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/50">
                        {[...properties, ...hostels].slice(0, 20).map((listing, i) => (
                          <div key={listing.id || i} className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                            <div>
                              <p className="font-medium text-foreground text-sm">{listing.name || `Listing #${i + 1}`}</p>
                              <p className="text-xs text-muted-foreground">{listing.location || '—'} · ₦{(listing.price || 0).toLocaleString()}/yr</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${listing.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {listing.verified ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'Verifications' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-lg">Verification Queue</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50">
                    <div className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                      <div>
                        <p className="font-medium text-foreground">Landlord KYC — 5 pending</p>
                        <p className="text-sm text-muted-foreground">Identity documents awaiting review</p>
                      </div>
                      <Button size="sm" className="rounded-full" onClick={() => runDashboardWorkflow('verification', 'KYC queue opened', { queue: 'landlord-kyc' }, 'Reviewing landlord identity submissions.')}>
                        Review
                      </Button>
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                      <div>
                        <p className="font-medium text-foreground">Property Verification — {metrics.pendingInspections ?? 0} pending</p>
                        <p className="text-sm text-muted-foreground">Inspection reports awaiting admin sign-off</p>
                      </div>
                      <Button size="sm" className="rounded-full" onClick={() => runDashboardWorkflow('verification', 'Property verifications reviewed', { queue: 'property-verify' }, 'Opening property sign-off queue.')}>
                        Review
                      </Button>
                    </div>
                    <div className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                      <div>
                        <p className="font-medium text-foreground">Agent Profiles — 2 pending</p>
                        <p className="text-sm text-muted-foreground">New agent applications</p>
                      </div>
                      <Button size="sm" className="rounded-full" onClick={() => runDashboardWorkflow('verification', 'Agent applications reviewed', { queue: 'agent-verify' }, 'Opening agent verification queue.')}>
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'Financials' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="border-border/50 rounded-2xl bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-primary mb-1">Total Reservations</p>
                      <p className="text-3xl font-bold text-primary">{reservations.length || '—'}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 rounded-2xl">
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground mb-1">Platform Revenue</p>
                      <p className="text-3xl font-bold text-foreground">₦—</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 rounded-2xl">
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground mb-1">Pending Payouts</p>
                      <p className="text-3xl font-bold text-foreground">₦—</p>
                    </CardContent>
                  </Card>
                </div>
                <Card className="border-border/50 shadow-sm rounded-2xl">
                  <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="text-lg">Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {reservations.length === 0 ? (
                      <div className="p-8 text-center">
                        <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="font-medium text-foreground">No transactions yet</p>
                        <p className="text-sm text-muted-foreground mt-1">Payment records will appear here once Paystack is connected.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/50">
                        {reservations.slice(0, 10).map((res, i) => (
                          <div key={res.id || i} className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                            <div>
                              <p className="font-medium text-foreground text-sm">Reservation #{res.id?.slice(-6) || i + 1}</p>
                              <p className="text-xs text-muted-foreground">Status: {res.status || 'pending'}</p>
                            </div>
                            <p className="text-sm font-bold text-foreground">₦{(res.amount || 0).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'System Settings' && (
              <div className="space-y-6">
                <Card className="border-border/50 shadow-sm rounded-2xl">
                  <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="text-lg">Platform Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="p-4 bg-secondary/30 rounded-xl">
                      <p className="text-sm font-semibold text-foreground mb-1">Platform Name</p>
                      <p className="text-sm text-muted-foreground">RentGrid</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-xl">
                      <p className="text-sm font-semibold text-foreground mb-1">Environment</p>
                      <p className="text-sm text-muted-foreground">Production · Nigeria</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-xl">
                      <p className="text-sm font-semibold text-foreground mb-1">Payment Gateway</p>
                      <p className="text-sm text-muted-foreground">Paystack (configure in environment variables)</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-xl">
                      <p className="text-sm font-semibold text-foreground mb-1">Database</p>
                      <p className="text-sm text-muted-foreground">Connected via DATABASE_URL</p>
                    </div>
                    <Button onClick={() => runDashboardWorkflow('admin', 'Settings saved', {}, 'Platform settings update queued.')}>
                      Save Configuration
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
