import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Hammer, Sparkles, Shield, Banknote, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ForServiceProvidersPage = () => {
  const roles = [
    {
      id: 'inspectors',
      icon: ClipboardCheck,
      title: 'Property Inspectors',
      description: 'Conduct physical verification of properties. Ensure listings match reality, check safety standards, and facilitate tenant viewings.',
      benefits: ['Earn per inspection', 'Flexible scheduling', 'Verified property leads'],
      image: 'https://images.unsplash.com/photo-1556910103-1c02745a872f'
    },
    {
      id: 'contractors',
      icon: Hammer,
      title: 'General Contractors',
      description: 'Provide renovation, plumbing, electrical, and general repair services to landlords looking to upgrade or maintain their properties.',
      benefits: ['Direct access to landlords', 'Secure digital payments', 'Build long-term contracts'],
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356f58'
    },
    {
      id: 'facility',
      icon: Sparkles,
      title: 'Facility Support',
      description: 'Offer cleaning, waste management, security, and ongoing facility management services for multi-unit buildings and hostels.',
      benefits: ['Steady recurring income', 'Manage multiple sites', 'Integrated scheduling tools'],
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952'
    }
  ];

  return (
    <>
      <Helmet>
        <title>For Service Providers - RentGrid</title>
        <meta name="description" content="Join RentGrid as a service provider. Offer inspection, contracting, or facility support services to property owners and renters." />
      </Helmet>

      <div className="min-h-screen flex flex-col soft-bg">
        <Header />

        {/* Hero Section */}
        <section className="py-20 lg:py-32 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge className="bg-primary/10 text-primary border-none mb-2 px-4 py-1.5 rounded-full text-sm font-medium">
                Service Provider Network
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
                Grow Your Business with <span className="text-gradient">RentGrid</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                Connect with thousands of landlords and property managers who need reliable inspection, maintenance, and facility support services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button asChild size="lg" className="rounded-full px-8 h-14 text-base shadow-md">
                  <Link to="/sign-up?role=inspector">
                    Apply to Join Network <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-20 bg-background border-y border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Who We Partner With</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                RentGrid operates a trusted network of professionals dedicated to keeping properties safe, clean, and well-maintained.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {roles.map((role) => (
                <Card key={role.id} className="border-border/50 shadow-sm overflow-hidden flex flex-col rounded-2xl group hover:shadow-lg transition-all">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={role.image} 
                      alt={role.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <role.icon className="absolute bottom-4 left-4 h-8 w-8 text-white" />
                  </div>
                  <CardHeader className="pb-2 pt-6">
                    <CardTitle className="text-xl text-foreground">{role.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {role.description}
                    </p>
                    <div className="mt-auto space-y-2 pb-6 border-b border-border/50 mb-6">
                      {role.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center text-sm font-medium text-foreground">
                          <Shield className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                    <Button asChild variant="outline" className="w-full rounded-xl border-border/50 hover:bg-primary/5 hover:text-primary">
                      <Link to={role.id === 'inspectors' ? '/inspectors' : '/faq'}>
                        Learn More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Backend Info Section */}
        <section className="py-20 soft-bg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-secondary/40 border-border/50 shadow-sm rounded-3xl overflow-hidden max-w-4xl mx-auto">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-border/50">
                  <Banknote className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Powerful Tools for Professionals</h2>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  Approved service providers gain access to our dedicated backend management portal. Track your scheduled tasks, submit inspection reports, manage invoices, and communicate with landlords—all from one secure dashboard.
                </p>
                <div className="inline-flex items-center justify-center p-3 px-6 bg-background border border-border/50 rounded-full text-sm font-medium text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2 text-primary" /> Access your portal at <strong className="mx-1 text-foreground">/inspectors</strong> upon approval
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ForServiceProvidersPage;
