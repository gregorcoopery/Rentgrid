import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Home, MessageSquare, Users, Wallet, Settings, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useClerkDashboardUser } from '@/hooks/use-clerk-dashboard-user';
import { DashboardHeaderActions, DashboardSidebar, notifyDashboardAction, runDashboardWorkflow } from '@/components/DashboardChrome.jsx';
import { getDashboardData } from '@/lib/marketplace-client';

const LandlordDashboard = () => {
  const { displayName, initials } = useClerkDashboardUser();
  const [activeSection, setActiveSection] = useState('Overview');
  const [dashData, setDashData] = useState(null);

  useEffect(() => {
    getDashboardData('landlord').then(setDashData).catch(() => {});
  }, []);

  const metrics = dashData?.metrics || {};
  const messages = dashData?.messages || [];
  const properties = dashData?.properties || [];
  const reservations = dashData?.reservations || [];
  const navItems = [
    { icon: LayoutDashboard, label: 'Overview' },
    { icon: Home, label: 'My Properties' },
    { icon: MessageSquare, label: 'Enquiries' },
    { icon: Users, label: 'Manage Rentals' },
    { icon: Wallet, label: 'Earnings' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      <Helmet>
        <title>Landlord Dashboard - RentGrid</title>
      </Helmet>

      <div className="min-h-screen flex bg-background">
        <DashboardSidebar
          portalLabel="Landlord Portal"
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
                <Input placeholder="Search properties, tenants..." className="pl-10 bg-secondary/50 border-none rounded-full h-10" />
              </div>
            </div>
            <DashboardHeaderActions initials={initials} />
          </header>

          {/* Dashboard Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto soft-bg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Welcome back, {displayName}</h1>
                <p className="text-muted-foreground">Here's what's happening with your properties today.</p>
              </div>
              {activeSection === 'Overview' && (
                <Button asChild className="rounded-full shadow-sm">
                  <Link to="/landlord-dashboard/properties/new">
                    <Plus className="w-4 h-4 mr-2" /> Add Property
                  </Link>
                </Button>
              )}
            </div>

            {activeSection === 'Overview' && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="border-border/50 shadow-sm rounded-2xl">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Total Properties</p>
                      <p className="text-3xl font-bold text-foreground">{metrics.properties ?? '—'}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 shadow-sm rounded-2xl">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Active Rentals</p>
                      <p className="text-3xl font-bold text-foreground">{metrics.pendingReservations != null ? (reservations.filter(r => r.status === 'confirmed').length) : '—'}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 shadow-sm rounded-2xl">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Pending Enquiries</p>
                      <p className="text-3xl font-bold text-foreground">{metrics.unreadMessages ?? '—'}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 shadow-sm rounded-2xl bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-primary mb-2">Verified Properties</p>
                      <p className="text-3xl font-bold text-primary">{metrics.verifiedProperties ?? '—'}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Enquiries */}
                  <Card className="lg:col-span-2 border-border/50 shadow-sm rounded-2xl">
                    <CardHeader className="border-b border-border/50 pb-4">
                      <CardTitle className="text-lg">Recent Enquiries ({metrics.unreadMessages ?? 0})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {messages.length === 0 ? (
                        <div className="p-8 text-center">
                          <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                          <p className="text-foreground font-medium">No enquiries yet</p>
                          <p className="text-sm text-muted-foreground mt-1">Tenant messages will appear here.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-border/50">
                          {messages.slice(0, 5).map((msg, i) => (
                            <div key={msg.id} className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-medium">
                                  {(msg.fromUserId || 'T').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{msg.subject || 'Enquiry'}</p>
                                  <p className="text-sm text-muted-foreground">{msg.body?.slice(0, 50) || 'New message received'}</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="rounded-full" onClick={() => setActiveSection('Enquiries')}>View</Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="border-border/50 shadow-sm rounded-2xl">
                    <CardHeader className="border-b border-border/50 pb-4">
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <Button variant="outline" className="w-full justify-start h-12 rounded-xl border-border/50" onClick={() => setActiveSection('Enquiries')}>
                        <MessageSquare className="w-4 h-4 mr-3 text-muted-foreground" /> View Messages
                      </Button>
                      <Button variant="outline" className="w-full justify-start h-12 rounded-xl border-border/50" onClick={() => setActiveSection('Earnings')}>
                        <Wallet className="w-4 h-4 mr-3 text-muted-foreground" /> Withdraw Funds
                      </Button>
                      <Button variant="outline" className="w-full justify-start h-12 rounded-xl border-border/50" onClick={() => setActiveSection('Settings')}>
                        <Settings className="w-4 h-4 mr-3 text-muted-foreground" /> Account Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {activeSection === 'My Properties' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader className="flex flex-row justify-between items-center border-b pb-4">
                  <CardTitle className="text-lg">My Listed Properties</CardTitle>
                  <Button asChild className="rounded-full">
                    <Link to="/landlord-dashboard/properties/new">
                      <Plus className="w-4 h-4 mr-2" /> Add Property
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="p-4">
                  {properties.length === 0 ? (
                    <div className="p-8 text-center">
                      <Home className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="font-medium text-foreground">No properties listed yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Add your first property to get started.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {properties.map((prop) => (
                        <div key={prop.id} className="py-4 flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-foreground">{prop.name}</p>
                            <p className="text-xs text-muted-foreground">{prop.location} • ₦{prop.price?.toLocaleString()}/yr</p>
                          </div>
                          <Badge className={prop.verified ? 'bg-green-100 text-green-800 border-none' : 'bg-yellow-100 text-yellow-800 border-none'}>
                            {prop.verified ? 'Verified' : 'In Review'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeSection === 'Enquiries' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Inbox / Enquiries</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="p-4 border rounded-xl bg-secondary/10">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground">Prospective Tenant {i}</h4>
                          <span className="text-xs text-muted-foreground">Today</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">Hi, is this property still available for inspection next Tuesday?</p>
                        <Button size="sm" onClick={() => runDashboardWorkflow('message', 'Reply sent', { tenantId: i }, 'Your reply has been queued.')}>Reply</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'Manage Rentals' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Active Leases</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="p-4 bg-secondary/10 rounded-xl">
                    <p className="font-semibold text-foreground">Ada Tenant</p>
                    <p className="text-xs text-muted-foreground">Tenant at: Luxury 2-Bed Apartment</p>
                    <p className="text-xs text-muted-foreground mt-2">Next Payment: Oct 2025</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'Earnings' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Earnings & Payouts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
                    <span className="text-xs text-muted-foreground uppercase font-bold">Total Balance Available</span>
                    <p className="text-3xl font-bold text-primary mt-1">₦2,400,000</p>
                  </div>
                  <Button onClick={() => runDashboardWorkflow('payout', 'Payout request queued', { ownerRole: 'landlord', amount: 2400000 }, 'Payout request sent to GTBank.')}>Request Payout</Button>
                </CardContent>
              </Card>
            )}

            {activeSection === 'Settings' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Landlord Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-secondary/30 rounded-xl space-y-2">
                    <p className="text-sm font-bold text-foreground">{displayName}</p>
                    <p className="text-xs text-muted-foreground">Role: Landlord</p>
                  </div>
                  <Button onClick={() => notifyDashboardAction('Settings updated', 'Settings saved successfully.')}>Save Settings</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default LandlordDashboard;
