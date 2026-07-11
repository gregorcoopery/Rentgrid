import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Home, Calendar, CreditCard, Settings, Search, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useClerkDashboardUser } from '@/hooks/use-clerk-dashboard-user';
import { DashboardHeaderActions, DashboardSidebar, notifyDashboardAction, runDashboardWorkflow } from '@/components/DashboardChrome.jsx';
import { getDashboardData } from '@/lib/marketplace-client';

const TenantDashboard = () => {
  const { displayName, initials } = useClerkDashboardUser();
  const [activeSection, setActiveSection] = useState('Overview');
  const [maintenanceDescription, setMaintenanceDescription] = useState('');
  const [dashData, setDashData] = useState(null);

  useEffect(() => {
    getDashboardData('tenant').then(setDashData).catch(() => {});
  }, []);

  const metrics = dashData?.metrics || {};
  const inspections = dashData?.inspections || [];
  const reservations = dashData?.reservations || [];
  const navItems = [
    { icon: LayoutDashboard, label: 'Overview' },
    { icon: Home, label: 'My Rental' },
    { icon: Calendar, label: 'Inspections' },
    { icon: CreditCard, label: 'Payments' },
    { icon: Wrench, label: 'Maintenance' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      <Helmet>
        <title>Tenant Dashboard - RentGrid</title>
      </Helmet>

      <div className="min-h-screen flex bg-background">
        <DashboardSidebar
          portalLabel="Tenant Portal"
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
                <Input placeholder="Search..." className="pl-10 bg-secondary/50 border-none rounded-full h-10" />
              </div>
            </div>
            <DashboardHeaderActions initials={initials} avatarClassName="bg-accent/20 text-accent border-accent/30" />
          </header>

          {/* Dashboard Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto soft-bg">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground">Welcome, {displayName}</h1>
              <p className="text-muted-foreground">Manage your rentals, inspections, and payments.</p>
            </div>

            {activeSection === 'Overview' && (
              <>
                {/* Active Rental Card */}
                {reservations.length > 0 ? (
                  <Card className="border-border/50 shadow-sm rounded-2xl mb-8 overflow-hidden">
                    <div className="bg-primary/5 p-6 border-b border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <Badge className="bg-primary text-primary-foreground mb-2">Active Lease</Badge>
                        <h2 className="text-xl font-bold text-foreground">{reservations[0].listingName || 'Your Rental'}</h2>
                        <p className="text-muted-foreground flex items-center mt-1">
                          {reservations[0].location || 'Location not set'}
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-sm text-muted-foreground">Reservation Amount</p>
                        <p className="text-2xl font-bold text-foreground">₦{reservations[0].amount?.toLocaleString() || '—'}</p>
                        <p className="text-sm text-muted-foreground font-medium capitalize">Status: {reservations[0].status || 'pending'}</p>
                      </div>
                    </div>
                    <CardContent className="p-6 bg-background">
                      <div className="flex flex-wrap gap-4">
                        <Button className="rounded-full shadow-sm" onClick={() => runDashboardWorkflow('reservation', 'Rent payment started', { listingId: reservations[0].id, amount: reservations[0].amount }, 'Payment intent recorded. Connect Paystack or Flutterwave to collect funds.')}>Pay Rent Now</Button>
                        <Button variant="outline" className="rounded-full" onClick={() => setActiveSection('Maintenance')}>Request Maintenance</Button>
                        <Button variant="outline" className="rounded-full" onClick={() => notifyDashboardAction('Lease agreement', 'Your lease document viewer will open here once document storage is connected.')}>View Lease Agreement</Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-border/50 shadow-sm rounded-2xl mb-8">
                    <CardContent className="p-8 text-center">
                      <Home className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="font-medium text-foreground">No active lease yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Once you complete a reservation, your lease details will appear here.</p>
                      <Button variant="link" className="mt-2 text-primary" asChild>
                        <Link to="/browse-rentals">Browse Properties</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Upcoming Inspections */}
                  <Card className="border-border/50 shadow-sm rounded-2xl">
                    <CardHeader className="border-b border-border/50 pb-4">
                      <CardTitle className="text-lg">Scheduled Inspections ({metrics.pendingInspections ?? '—'})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {inspections.length === 0 ? (
                        <div className="p-8 text-center">
                          <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                          <p className="text-foreground font-medium">No upcoming inspections</p>
                          <p className="text-sm text-muted-foreground mt-1">You have no pending property viewings.</p>
                          <Button variant="link" className="mt-2 text-primary" asChild>
                            <Link to="/browse-rentals">Browse Properties</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="divide-y divide-border/50">
                          {inspections.slice(0, 4).map((insp) => (
                            <div key={insp.id} className="p-4 flex items-center justify-between">
                              <div>
                                <p className="font-medium text-foreground">Inspection #{insp.id?.slice(-6)}</p>
                                <p className="text-sm text-muted-foreground">{insp.scheduledFor ? new Date(insp.scheduledFor).toLocaleDateString() : 'Date TBD'}</p>
                              </div>
                              <Badge variant="outline">{insp.status}</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Payments */}
                  <Card className="border-border/50 shadow-sm rounded-2xl">
                    <CardHeader className="border-b border-border/50 pb-4">
                      <CardTitle className="text-lg">Payment History</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {reservations.length === 0 ? (
                        <div className="p-8 text-center">
                          <CreditCard className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                          <p className="text-foreground font-medium">No payments yet</p>
                          <p className="text-sm text-muted-foreground mt-1">Your rent payments will appear here.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-border/50">
                          {reservations.slice(0, 4).map((res) => (
                            <div key={res.id} className="p-4 flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                  <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">Reservation Payment</p>
                                  <p className="text-sm text-muted-foreground">{res.createdAt ? new Date(res.createdAt).toLocaleDateString() : '—'}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-foreground">₦{res.amount?.toLocaleString()}</p>
                                <Badge variant="outline" className={res.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200 mt-1' : 'mt-1'}>{res.paymentStatus || res.status}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {activeSection === 'My Rental' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">My Active Lease</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reservations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-secondary/30 rounded-xl">
                        <span className="text-xs text-muted-foreground uppercase font-semibold">Property</span>
                        <p className="font-bold text-foreground mt-1">{reservations[0].listingName || 'Your Rental'}</p>
                      </div>
                      <div className="p-4 bg-secondary/30 rounded-xl">
                        <span className="text-xs text-muted-foreground uppercase font-semibold">Amount</span>
                        <p className="font-bold text-foreground mt-1">₦{reservations[0].amount?.toLocaleString() || '—'}/year</p>
                      </div>
                      <div className="p-4 bg-secondary/30 rounded-xl">
                        <span className="text-xs text-muted-foreground uppercase font-semibold">Status</span>
                        <p className="font-bold text-foreground mt-1 capitalize">{reservations[0].status || 'pending'}</p>
                      </div>
                      <div className="p-4 bg-secondary/30 rounded-xl">
                        <span className="text-xs text-muted-foreground uppercase font-semibold">Lease Term</span>
                        <p className="font-bold text-foreground mt-1">12 Months (Renewable)</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Home className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="font-medium text-foreground">No active lease</p>
                      <p className="text-sm text-muted-foreground mt-1">Your lease details will appear here once a reservation is confirmed.</p>
                      <Button variant="link" className="mt-2 text-primary" asChild>
                        <Link to="/browse-rentals">Browse Properties</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeSection === 'Inspections' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-lg">Inspections List</CardTitle>
                </CardHeader>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-foreground font-medium">No inspections scheduled</p>
                  <p className="text-sm text-muted-foreground mt-1">Request inspections on listings to see them here.</p>
                </CardContent>
              </Card>
            )}

            {activeSection === 'Payments' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-lg">Payment History & Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/20 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-foreground">GTBank Direct Debit</p>
                        <p className="text-xs text-muted-foreground">Connected for rent payment</p>
                      </div>
                      <Badge className="bg-primary/20 text-primary border-none">Active</Badge>
                    </div>
                    <div className="divide-y divide-border/50">
                      {[1, 2].map((i) => (
                        <div key={i} className="py-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <CreditCard className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-foreground">Monthly Lease Charge</p>
                              <p className="text-xs text-muted-foreground">Completed via GTBank</p>
                            </div>
                          </div>
                          <p className="font-bold text-foreground">₦350,000</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'Maintenance' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Maintenance Requests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 border rounded-xl space-y-4 bg-background">
                    <h3 className="font-semibold text-foreground">Submit a Request</h3>
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground font-semibold uppercase">Description</label>
                      <Input
                        placeholder="Describe the maintenance issue..."
                        value={maintenanceDescription}
                        onChange={(e) => setMaintenanceDescription(e.target.value)}
                      />
                    </div>
                    <Button
                      disabled={!maintenanceDescription.trim()}
                      onClick={() => {
                        runDashboardWorkflow(
                          'maintenance',
                          'Maintenance request created',
                          { listingId: reservations[0]?.id || '1', title: maintenanceDescription },
                          'Your maintenance request has been submitted to the landlord.'
                        );
                        setMaintenanceDescription('');
                      }}
                    >
                      Submit Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'Settings' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-secondary/30 rounded-xl space-y-2">
                    <p className="text-sm font-bold text-foreground">Profile Details</p>
                    <p className="text-xs text-muted-foreground">Name: {displayName}</p>
                    <p className="text-xs text-muted-foreground">Role: Tenant</p>
                  </div>
                  <Button onClick={() => notifyDashboardAction('Settings updated', 'Your settings have been saved successfully.')}>Save Settings</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default TenantDashboard;
