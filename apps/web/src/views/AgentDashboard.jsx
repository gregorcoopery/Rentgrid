import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { LayoutDashboard, Calendar, MapPin, Wallet, Settings, Search, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useClerkDashboardUser } from '@/hooks/use-clerk-dashboard-user';
import { DashboardHeaderActions, DashboardSidebar, notifyDashboardAction, runDashboardWorkflow } from '@/components/DashboardChrome.jsx';
import { getDashboardData } from '@/lib/marketplace-client';

const AgentDashboard = () => {
  const { displayName, initials } = useClerkDashboardUser();
  const [activeSection, setActiveSection] = useState('Overview');
  const [dashData, setDashData] = useState(null);

  useEffect(() => {
    getDashboardData('agent').then(setDashData).catch(() => {});
  }, []);

  const metrics = dashData?.metrics || {};
  const inspections = dashData?.inspections || [];
  const navItems = [
    { icon: LayoutDashboard, label: 'Overview' },
    { icon: Calendar, label: 'My Schedule' },
    { icon: MapPin, label: 'Assigned Properties' },
    { icon: Wallet, label: 'Earnings' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      <Helmet>
        <title>Agent Dashboard - RentGrid</title>
      </Helmet>

      <div className="min-h-screen flex bg-background">
        <DashboardSidebar
          portalLabel="Agent Portal"
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
                <Input placeholder="Search tasks..." className="pl-10 bg-secondary/50 border-none rounded-full h-10" />
              </div>
            </div>
            <DashboardHeaderActions initials={initials} />
          </header>

          {/* Dashboard Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto soft-bg">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground">Welcome back, {displayName}</h1>
              <p className="text-muted-foreground">Manage your inspections and earnings.</p>
            </div>

            {activeSection === 'Overview' && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <Card className="border-border/50 shadow-sm rounded-2xl">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Pending Inspections</p>
                      <p className="text-3xl font-bold text-foreground">{metrics.pendingInspections ?? '—'}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 shadow-sm rounded-2xl">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Total Inspections</p>
                      <p className="text-3xl font-bold text-foreground">{inspections.length || '—'}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 shadow-sm rounded-2xl bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-primary mb-2">Assigned Properties</p>
                      <p className="text-3xl font-bold text-primary">{metrics.properties ?? '—'}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Schedule */}
                <Card className="border-border/50 shadow-sm rounded-2xl">
                  <CardHeader className="border-b border-border/50 pb-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Today's Schedule</CardTitle>
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => setActiveSection('My Schedule')}>View Calendar</Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    {inspections.length === 0 ? (
                      <div className="p-8 text-center">
                        <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-foreground font-medium">No inspections scheduled</p>
                        <p className="text-sm text-muted-foreground mt-1">New assigned inspections will appear here.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/50">
                        {inspections.slice(0, 5).map((insp) => (
                          <div key={insp.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/30 transition-colors">
                            <div className="flex items-start space-x-4">
                              <div className="w-16 text-center flex-shrink-0">
                                <p className="font-bold text-foreground text-sm">{insp.scheduledFor ? new Date(insp.scheduledFor).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBD'}</p>
                                <p className="text-xs text-muted-foreground">{insp.scheduledFor ? new Date(insp.scheduledFor).toLocaleDateString() : ''}</p>
                              </div>
                              <div className="w-px h-10 bg-border/50 hidden sm:block"></div>
                              <div>
                                <p className="font-medium text-foreground">Inspection #{insp.id?.slice(-6)}</p>
                                <p className="text-sm text-muted-foreground">Status: {insp.status}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 sm:ml-auto">
                              <Button size="sm" className="rounded-full bg-primary text-primary-foreground" onClick={() => runDashboardWorkflow('inspection', 'Inspection completed', { inspectionId: insp.id, status: 'completed' }, `Inspection #${insp.id?.slice(-6)} has been marked complete.`)}>
                                <CheckCircle className="w-4 h-4 mr-1" /> Complete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {activeSection === 'My Schedule' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">My Schedule & Calendar</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="p-8 text-center text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto text-primary/40 mb-3" />
                    <p className="font-semibold text-foreground">Interactive calendar will sync once Google Calendar integration is connected.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'Assigned Properties' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">My Assigned Listings</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="divide-y divide-border/50">
                    <div className="py-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-foreground">Luxury 2-Bed Apartment</p>
                        <p className="text-xs text-muted-foreground">Lekki Phase 1, Lagos</p>
                      </div>
                      <Badge className="bg-primary/20 text-primary border-none">Assigned</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'Earnings' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Agent Earnings Balance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
                    <span className="text-xs text-muted-foreground uppercase font-bold">Commission Balance</span>
                    <p className="text-3xl font-bold text-primary mt-1">₦45,000</p>
                  </div>
                  <Button onClick={() => runDashboardWorkflow('payout', 'Payout requested', { amount: 45000 }, 'Agent payout request sent to bank.')}>Withdraw Earnings</Button>
                </CardContent>
              </Card>
            )}

            {activeSection === 'Settings' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Agent Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-secondary/30 rounded-xl space-y-2">
                    <p className="text-sm font-bold text-foreground">Michael Agent</p>
                    <p className="text-xs text-muted-foreground">Role: Agent</p>
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

export default AgentDashboard;
