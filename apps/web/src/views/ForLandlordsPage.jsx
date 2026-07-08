import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, DollarSign, Smartphone, ArrowRight, LayoutDashboard, MessageSquare, Wallet, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ForLandlordsPage = () => {
  const benefits = [
    {
      icon: Users,
      title: 'Reach Quality Tenants',
      description: 'Connect with verified professionals, families, and students actively searching for accommodation globally.',
    },
    {
      icon: TrendingUp,
      title: 'Fill Rooms Faster',
      description: 'Our platform helps you fill vacancies 3x faster than traditional methods with targeted visibility.',
    },
    {
      icon: DollarSign,
      title: 'Secure Transactions',
      description: 'Streamline tracking and logging of payments, and manage renewals easily through the dashboard.',
    },
    {
      icon: Smartphone,
      title: 'Powerful Dashboard',
      description: 'Manage your listings, track inquiries, and communicate with potential tenants from one centralized place.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>For Landlords - RentGrid</title>
        <meta name="description" content="List your property on RentGrid. Join trusted Landlords and Property Managers for verified rentals." />
      </Helmet>

      <div className="min-h-screen flex flex-col soft-bg">
        <Header />

        {/* Hero Section */}
        <section className="py-20 lg:py-32 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge className="bg-primary/10 text-primary border-none mb-2 px-4 py-1.5 rounded-full text-sm font-medium">
                Landlord & Property Manager Portal
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
                Manage Properties with <span className="text-gradient">Confidence</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                Join our trusted marketplace to list verified rentals, manage tenants efficiently, and streamline your property business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button asChild size="lg" className="rounded-full px-8 h-14 text-base shadow-md">
                  <Link to="/landlord-dashboard">
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Everything You Need in One Place</h2>
              <p className="text-muted-foreground text-lg">A sneak peek at your powerful management tools</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
              {/* Sidebar Preview */}
              <div className="lg:col-span-3 space-y-2">
                <Card className="border-border/50 shadow-sm rounded-2xl bg-secondary/20">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center p-3 bg-primary text-primary-foreground rounded-xl font-medium">
                      <LayoutDashboard className="w-5 h-5 mr-3" /> Overview
                    </div>
                    <div className="flex items-center p-3 text-muted-foreground hover:bg-secondary rounded-xl font-medium cursor-pointer transition-colors">
                      <Home className="w-5 h-5 mr-3" /> Manage Listings
                    </div>
                    <div className="flex items-center p-3 text-muted-foreground hover:bg-secondary rounded-xl font-medium cursor-pointer transition-colors">
                      <MessageSquare className="w-5 h-5 mr-3" /> Enquiries
                    </div>
                    <div className="flex items-center p-3 text-muted-foreground hover:bg-secondary rounded-xl font-medium cursor-pointer transition-colors">
                      <Users className="w-5 h-5 mr-3" /> Manage Rentals
                    </div>
                    <div className="flex items-center p-3 text-muted-foreground hover:bg-secondary rounded-xl font-medium cursor-pointer transition-colors">
                      <Wallet className="w-5 h-5 mr-3" /> Earnings Overview
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Dashboard Area Preview */}
              <div className="lg:col-span-9 space-y-6">
                {/* Top Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="border-border/50 shadow-sm rounded-2xl">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Active Rentals</p>
                      <p className="text-3xl font-bold text-foreground">12</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 shadow-sm rounded-2xl">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Pending Enquiries</p>
                      <p className="text-3xl font-bold text-foreground">5</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50 shadow-sm rounded-2xl bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                      <p className="text-sm font-medium text-primary mb-1">Portfolio Value</p>
                      <p className="text-3xl font-bold text-primary">Stable</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity Widget */}
                <Card className="border-border/50 shadow-sm rounded-2xl">
                  <CardHeader className="border-b border-border/50 pb-4">
                    <CardTitle className="text-lg">Recent Enquiries & Inspections</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border/50">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-medium">
                              JD
                            </div>
                            <div>
                              <p className="font-medium text-foreground">John Doe</p>
                              <p className="text-sm text-muted-foreground">Requested inspection for Unit {i}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-background">Pending</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 soft-bg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Why Landlords Choose RentGrid</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-none shadow-sm bg-background rounded-2xl hover:-translate-y-1 transition-transform duration-300">
                  <CardContent className="pt-8">
                    <div className="w-14 h-14 mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ForLandlordsPage;