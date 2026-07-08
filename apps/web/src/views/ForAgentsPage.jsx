import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle, DollarSign, MapPin, Shield, Users, ChevronRight, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ForAgentsPage = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Earn Consistent Fees',
      description: 'Get compensated for property viewings and client coordination as part of a structured network.',
    },
    {
      icon: Users,
      title: 'Expand Your Network',
      description: 'Connect with landlords and property managers seeking reliable agents for ongoing property management.',
    },
    {
      icon: Shield,
      title: 'Trusted Platform',
      description: 'Operate within a trusted marketplace. We provide the digital tools, you provide the local expertise.',
    },
    {
      icon: Briefcase,
      title: 'Flexible Workflow',
      description: 'Manage viewing schedules and coordination tasks flexibly around your core business.',
    },
  ];

  const responsibilities = [
    {
      icon: MapPin,
      title: 'Conduct Physical Inspections',
      description: 'Meet prospective renters at the property, show them the rooms, amenities, and address their inquiries.',
    },
    {
      icon: Camera,
      title: 'Maintain Listing Accuracy',
      description: 'Ensure properties align with digital listings. Act as an on-the-ground verifier for quality standards.',
    },
    {
      icon: CheckCircle,
      title: 'Assist with Logistics',
      description: 'Help facilitate a smooth handover process and handle physical coordination for active rentals.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>For Agents - Partner with RentGrid</title>
        <meta name="description" content="Join RentGrid as a verified agent. Earn money conducting viewings and connect with landlords globally." />
      </Helmet>

      <div className="min-h-screen flex flex-col soft-bg">
        <Header />

        {/* Hero Section */}
        <section className="py-20 lg:py-32 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge className="bg-primary/10 text-primary border-none mb-2 px-4 py-1.5 rounded-full text-sm font-medium">
                Agent Partnership Program
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
                Turn Local Expertise into <span className="text-gradient">Opportunity</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                Register as a verified agent on our trusted marketplace. Conduct property viewings and build strong partnerships with top landlords.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button asChild size="lg" className="rounded-full px-8 h-14 text-base shadow-md">
                  <Link to="/agent-dashboard">
                    Go to Agent Dashboard <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-background border-y border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Why Partner With Us?</h2>
              <p className="text-muted-foreground text-lg">We empower independent agents with technology and continuous client streams.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-secondary/20">
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

        {/* Responsibilities Section */}
        <section className="py-20 soft-bg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Your Role as an Agent</h2>
                <p className="text-muted-foreground text-lg">Your core responsibilities on the ground</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {responsibilities.map((item, index) => (
                  <Card key={index} className="border-none shadow-sm bg-background rounded-2xl">
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                          <item.icon className="h-5 w-5 text-foreground" />
                        </div>
                        <CardTitle className="text-lg text-foreground">{item.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ForAgentsPage;