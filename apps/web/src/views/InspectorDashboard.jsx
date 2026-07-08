import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { LayoutDashboard, ClipboardCheck, MapPin, Settings, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useClerkDashboardUser } from '@/hooks/use-clerk-dashboard-user';
import { DashboardHeaderActions, DashboardSidebar, runDashboardWorkflow } from '@/components/DashboardChrome.jsx';
import { getDashboardData } from '@/lib/marketplace-client';

const InspectorDashboard = () => {
  const { displayName, initials } = useClerkDashboardUser();
  const [activeSection, setActiveSection] = useState('Overview');
  const [dashData, setDashData] = useState(null);

  useEffect(() => {
    getDashboardData('inspector').then(setDashData).catch(() => {});
  }, []);

  const metrics = dashData?.metrics || {};
  const properties = dashData?.properties || [];
  const pendingProperties = properties.filter(p => p.status !== 'verified');
  const navItems = [
    { icon: LayoutDashboard, label: 'Overview' },
    { icon: ClipboardCheck, label: 'Verification Tasks' },
    { icon: MapPin, label: 'Territory Map' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      <Helmet>
        <title>Inspector Dashboard - RentGrid</title>
      </Helmet>

      <div className="min-h-screen flex bg-background">
        <DashboardSidebar
          portalLabel="Inspector Portal"
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
                <Input placeholder="Search properties..." className="pl-10 bg-secondary/50 border-none rounded-full h-10" />
              </div>
            </div>
            <DashboardHeaderActions initials={initials} />
          </header>

          {/* Dashboard Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto soft-bg">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground">Welcome back, {displayName}</h1>
              <p className="text-muted-foreground">Review and verify new property listings.</p>
            </div>

            {activeSection === 'Overview' && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <Card className="border-border/50 shadow-sm rounded-2xl">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Pending Verifications</p>
                      <p className="text-3xl font-bold text-foreground">{pendingProperties.length ?? '—'}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 shadow-sm rounded-2xl">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Verified Properties</p>
                      <p className="text-3xl font-bold text-foreground">{metrics.verifiedProperties ?? '—'}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 shadow-sm rounded-2xl bg-destructive/5 border-destructive/20">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-destructive mb-2">Pending Inspections</p>
                      <p className="text-3xl font-bold text-destructive">{metrics.pendingInspections ?? '—'}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Pending Tasks */}
                <Card className="border-border/50 shadow-sm rounded-2xl">
                  <CardHeader className="border-b border-border/50 pb-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Properties Awaiting Verification</CardTitle>
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => setActiveSection('Verification Tasks')}>View All</Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    {pendingProperties.length === 0 ? (
                      <div className="p-8 text-center">
                        <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-foreground font-medium">All caught up!</p>
                        <p className="text-sm text-muted-foreground mt-1">No properties awaiting verification.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/50">
                        {pendingProperties.slice(0, 5).map((prop) => (
                          <div key={prop.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/30 transition-colors">
                            <div className="flex items-start space-x-4">
                              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground">
                                <MapPin className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-foreground">{prop.name}</p>
                                  <Badge variant="outline" className="text-[10px] h-5">{prop.type || prop.segment}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{prop.location} • {prop.status}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 sm:ml-auto">
                              <Button variant="outline" size="sm" className="rounded-full text-destructive hover:bg-destructive/10 border-destructive/30" onClick={() => runDashboardWorkflow('verification', 'Property flagged', { property: prop.name, status: 'flagged' }, `${prop.name} has been flagged for review.`)}>
                                <AlertTriangle className="w-4 h-4 mr-1" /> Flag
                              </Button>
                              <Button size="sm" className="rounded-full bg-primary text-primary-foreground" onClick={() => runDashboardWorkflow('verification', 'Review started', { property: prop.name, listingId: prop.id, status: 'in-review' }, `Opening verification checklist for ${prop.name}.`)}>
                                Start Review
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

            {activeSection === 'Verification Tasks' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">All Verification Tasks</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="divide-y divide-border/50">
                    {[
                      { name: 'New 3-Bed Flat', location: 'Surulere, Lagos', status: 'Pending' },
                      { name: 'Campus View Lodge', location: 'Akoka, Lagos', status: 'Pending' },
                      { name: 'Luxury 2-Bed Apartment', location: 'Lekki Phase 1, Lagos', status: 'Verified' },
                    ].map((task, i) => (
                      <div key={i} className="py-4 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-foreground">{task.name}</p>
                          <p className="text-xs text-muted-foreground">{task.location}</p>
                        </div>
                        <Badge className={task.status === 'Verified' ? 'bg-green-100 text-green-800 border-none' : 'bg-yellow-100 text-yellow-800 border-none'}>
                          {task.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'Territory Map' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Territory Map</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="p-8 text-center text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto text-primary/40 mb-3" />
                    <p className="font-semibold text-foreground">Interactive inspection territory map will render once Leaflet/Google Maps script is connected.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'Settings' && (
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Inspector Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-secondary/30 rounded-xl space-y-2">
                    <p className="text-sm font-bold text-foreground">Chika Inspector</p>
                    <p className="text-xs text-muted-foreground">Role: Inspector</p>
                  </div>
                  <Button onClick={() => runDashboardWorkflow('settings', 'Settings updated', {}, 'Inspector settings updated successfully.')}>Save Settings</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default InspectorDashboard;
