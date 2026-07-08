import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Shield, Clock, CheckCircle, Search, Calendar, Home, Smile, FileBadge, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ForStudentsPage = () => {
  const benefits = [
    {
      icon: Shield,
      title: 'Verified & Safe',
      description: 'Every hostel is physically verified. We check safety features, amenities, and landlord credentials.',
    },
    {
      icon: Clock,
      title: 'No Hidden Fees',
      description: 'The price you see is the price you pay. No agent fees, no service charges, no surprises.',
    },
    {
      icon: MapPin,
      title: 'Close to Campus',
      description: 'Find accommodations specifically located in prime student areas, minimizing daily commute time.',
    },
    {
      icon: FileBadge,
      title: 'Student Verification',
      description: 'Secure community verified via matriculation number, university ID, or two-factor authentication.',
    },
  ];

  const steps = [
    {
      icon: Search,
      title: 'Search Near Campus',
      description: 'Use our filters to find hostels close to your specific university with the amenities you need.',
    },
    {
      icon: Calendar,
      title: 'Request Inspection',
      description: 'Schedule a physical inspection. Our team coordinates with landlords to arrange viewings.',
    },
    {
      icon: CheckCircle,
      title: 'Compare & Decide',
      description: 'Visit multiple hostels, compare features and prices, and make an informed decision.',
    },
    {
      icon: Home,
      title: 'Reserve & Move In',
      description: 'Complete your reservation with transparent pricing, then move into your verified accommodation.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Student Rentals - RentGrid</title>
        <meta name="description" content="Discover verified, safe, and affordable off-campus student accommodation near your university on RentGrid." />
      </Helmet>

      <div className="min-h-screen flex flex-col soft-bg">
        <Header />

        {/* Hero Section */}
        <section className="py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1629079447838-3d78840ee8cf"
              alt="Student desk setup"
              className="w-full h-full object-cover opacity-[0.05]"
            />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge className="bg-accent/10 text-accent border-none mb-2 px-4 py-1.5 rounded-full text-sm font-medium">
                Student Rentals Segment
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
                Your Campus Home, <span className="text-accent">Simplified.</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                Safe, verified, and affordable accommodation near your university. Experience a trusted marketplace with zero agent fees.
              </p>
              <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 h-14 shadow-md">
                <Link to="/browse-rentals?segment=student">
                  Browse Student Hostels
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Designed for Students</h2>
              <p className="text-muted-foreground text-lg">Everything you need for a stress-free accommodation search</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-secondary/20">
                  <CardContent className="pt-8">
                    <div className="w-14 h-14 mb-6 rounded-2xl bg-accent/10 flex items-center justify-center">
                      <benefit.icon className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Organized Workspace Img Section */}
        <section className="py-20 bg-accent/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">Focus on Your Studies</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  We handle the stress of finding verified, comfortable student spaces so you can focus on what truly matters. From stable power supply to quiet study environments, find a place that matches your academic goals.
                </p>
                <ul className="space-y-4">
                  {['Curated student communities', 'Fast-track inspection bookings', 'Direct communication with verified landlords'].map((item, idx) => (
                     <li key={idx} className="flex items-center text-foreground font-medium">
                       <CheckCircle className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                       {item}
                     </li>
                  ))}
                </ul>
              </div>
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-border/50">
                <img 
                  src="https://images.unsplash.com/photo-1455994972514-4624f7f224a7" 
                  alt="Organized study workspace" 
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 soft-bg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">How It Works</h2>
              <p className="text-muted-foreground text-lg">Your journey to the perfect hostel in 4 simple steps</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <Card key={index} className="border-none shadow-sm bg-background rounded-2xl hover:shadow-md transition-all duration-300">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                            <step.icon className="h-8 w-8 text-accent" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl font-black text-accent/30">{index + 1}</span>
                            <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                          </div>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background border-t border-border/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-accent/5 border-accent/20 shadow-none rounded-3xl overflow-hidden">
              <CardContent className="p-12 text-center">
                <Smile className="h-16 w-16 text-accent mx-auto mb-6" />
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Ready to Find Your Perfect Space?</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                  Join thousands of students who have found safe, verified, and affordable accommodation through our trusted marketplace.
                </p>
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 h-14 shadow-md">
                  <Link to="/browse-rentals?segment=student">
                    Start Browsing Hostels
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ForStudentsPage;