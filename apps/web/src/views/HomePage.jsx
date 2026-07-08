import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Search, Shield, CheckCircle, Building2, GraduationCap, ArrowRight, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import RoleSignupDialog from '@/components/RoleSignupDialog.jsx';

const HomePage = () => {
  const features = [
    {
      icon: Shield,
      title: 'Verified Properties',
      description: 'Every listing is physically inspected by our team to ensure safety and accuracy.',
    },
    {
      icon: CheckCircle,
      title: 'Transparent Pricing',
      description: 'No hidden fees or surprise agent commissions. What you see is what you pay.',
    },
    {
      icon: Star,
      title: 'Trusted Landlords',
      description: 'We vet all property owners to guarantee a secure and professional rental experience.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>RentGrid - Verified Rentals & Student Accommodation</title>
        <meta name="description" content="Find verified apartments, flats, and student hostels on RentGrid. A trusted rental marketplace with transparent pricing and secure payments." />
      </Helmet>

      <div className="min-h-screen flex flex-col soft-bg">
        <Header />

        {/* Hero Section */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-4 py-1.5 text-sm font-medium mb-4 rounded-full">
                Trusted Rental Marketplace
              </Badge>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-foreground tracking-tight">
                Find Your Perfect Space on <span className="text-gradient">RentGrid</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                Whether you're a professional looking for a modern apartment or a student seeking campus accommodation, we have verified spaces for you.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <RoleSignupDialog>
                  <Button size="lg" className="w-full sm:w-auto rounded-full px-8 h-14 text-base shadow-lg shadow-primary/20">
                    Sign Up <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </RoleSignupDialog>
                <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-8 h-14 text-base shadow-lg shadow-primary/20">
                  <Link to="/browse-rentals?segment=general">
                    <Building2 className="mr-2 h-5 w-5" />
                    Browse General Rentals
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 text-base bg-background hover:bg-secondary">
                  <Link to="/for-students">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Explore Student Rentals
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Dual Segment Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
              {/* General Rentals Card */}
              <Card className="overflow-hidden border-border/50 shadow-md hover:shadow-xl transition-all duration-300 group rounded-2xl">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1592494804071-faea15d93a8a" 
                    alt="Modern apartment interior" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <Badge className="bg-primary text-primary-foreground mb-3 border-none">Professionals & Families</Badge>
                    <h3 className="text-3xl font-bold">General Rentals</h3>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                    Discover verified apartments, flats, and homes in prime neighborhoods. Enjoy transparent pricing, direct landlord communication, and secure digital payments.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-foreground font-medium"><CheckCircle className="w-5 h-5 text-primary mr-3" /> Verified property listings</li>
                    <li className="flex items-center text-foreground font-medium"><CheckCircle className="w-5 h-5 text-primary mr-3" /> Schedule physical inspections</li>
                    <li className="flex items-center text-foreground font-medium"><CheckCircle className="w-5 h-5 text-primary mr-3" /> Secure lease agreements</li>
                  </ul>
                  <Button asChild className="w-full group-hover:bg-primary/90 rounded-xl h-12">
                    <Link to="/browse-rentals?segment=general">
                      View Apartments <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Student Rentals Card */}
              <Card className="overflow-hidden border-border/50 shadow-md hover:shadow-xl transition-all duration-300 group rounded-2xl">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1629079447838-3d78840ee8cf" 
                    alt="Students studying together" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <Badge className="bg-accent text-accent-foreground mb-3 border-none">University Students</Badge>
                    <h3 className="text-3xl font-bold">Student Rentals</h3>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                    Find safe, verified off-campus hostels near your university. Benefit from student-friendly features and proximity to major campuses.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-foreground font-medium"><CheckCircle className="w-5 h-5 text-accent mr-3" /> Proximity to major campuses</li>
                    <li className="flex items-center text-foreground font-medium"><CheckCircle className="w-5 h-5 text-accent mr-3" /> Verified student communities</li>
                    <li className="flex items-center text-foreground font-medium"><CheckCircle className="w-5 h-5 text-accent mr-3" /> Safe and secure environments</li>
                  </ul>
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl h-12">
                    <Link to="/for-students">
                      Explore Hostels <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 soft-bg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Why Choose RentGrid?</h2>
              <p className="text-lg text-muted-foreground">We're building a rental ecosystem based on trust, transparency, and convenience.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-sm bg-background/60 backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300">
                  <CardContent className="pt-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
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

export default HomePage;
