import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Wifi, Zap, Lock, Droplet, Car, ArrowLeft, Calendar, CreditCard, CheckCircle, Info, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@clerk/nextjs';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { usePermissions } from '@/components/PermissionProvider.jsx';
import { canInitiateRentalAction, getRoleDefinition } from '@/lib/permissions';
import { createPaymentIntent, submitWorkflow, getListing } from '@/lib/marketplace-client';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { role } = usePermissions();
  const { user } = useUser();
  const [selectedPricing, setSelectedPricing] = useState('yearly');
  const canStartRentalAction = canInitiateRentalAction(role);
  const currentRole = getRoleDefinition(role);

  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getListing(id);
        const amenityIcons = { wifi: Wifi, power: Zap, security: Lock, water: Droplet, parking: Car };
        const amenityLabels = {
          wifi: 'Fibre Internet',
          power: '24/7 Power Supply',
          security: 'Security',
          water: 'Treated Water',
          parking: 'Parking Space',
        };
        const formatted = {
          ...data,
          propertyId: `RG-${String(data.id).padStart(5, '0')}`,
          images: data.images && data.images.length ? data.images : [
            data.image,
            'https://images.unsplash.com/photo-1502672260266-1c1e5250a15f',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
          ],
          pricing: {
            monthly: Math.round(data.price / 10),
            yearly: data.price,
          },
          amenities: (data.amenities || []).map((amenityId) => ({
            icon: amenityIcons[amenityId] || CheckCircle,
            label: amenityLabels[amenityId] || amenityId,
            description: 'Verified during property review',
          })),
          houseRules: data.houseRules || [
            'No commercial activities',
            'Service charge applies monthly',
            'Pets allowed with prior approval',
            'Maintain noise levels after 10 PM',
          ],
          description: data.description || `${data.name} is a verified RentGrid listing in ${data.location}. The listing has been reviewed for ownership, location, amenities, pricing, and availability.`,
          verifiedOn: 'Jul 4, 2026',
          lastUpdated: 'Jul 4, 2026',
          tag: data.tag || (data.segment === 'student' ? '5 mins to campus' : 'Premium'),
        };
        setPropertyData(formatted);
      } catch (err) {
        console.error('Failed to load property', err);
        toast({
          title: 'Error loading listing',
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      load();
    }
  }, [id, toast]);

  const handleInspectionRequest = async () => {
    if (!canStartRentalAction) {
      toast({
        title: "Tenant account required",
        description: `${currentRole.label} can view listings, but inspection requests are limited to tenants.`,
      });
      return;
    }

    try {
      await submitWorkflow('inspection', {
        listingId: propertyData.id,
        listingType: 'property',
        requestedPricing: selectedPricing,
      });
      toast({
        title: "Inspection request sent",
        description: "Our team will contact you to schedule your physical inspection.",
      });
    } catch (error) {
      toast({
        title: "Inspection request failed",
        description: error.message,
      });
    }
  };

  const handleReservation = async () => {
    if (!canStartRentalAction) {
      toast({
        title: "Tenant account required",
        description: `${currentRole.label} can view listings, but reservations are limited to tenants.`,
      });
      return;
    }

    try {
      const amount = propertyData.pricing[selectedPricing];
      await submitWorkflow('reservation', {
        listingId: propertyData.id,
        listingType: 'property',
        amount,
      });
      const intent = await createPaymentIntent({
        amount,
        email: user?.primaryEmailAddress?.emailAddress || 'tenant@example.com',
        metadata: { listingId: propertyData.id, listingType: 'property' },
      });

      if (intent.authorizationUrl) {
        window.location.href = intent.authorizationUrl;
        return;
      }

      toast({
        title: "Reservation initiated",
        description: "Payment intent created. Connect Paystack or Flutterwave to collect funds.",
      });
    } catch (error) {
      toast({
        title: "Reservation failed",
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center soft-bg">
          <p className="text-sm font-medium text-muted-foreground">Loading property details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!propertyData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center soft-bg">
          <p className="text-sm font-medium text-muted-foreground">Listing not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${propertyData.name} - RentGrid`}</title>
        <meta name="description" content={`${propertyData.name} in ${propertyData.location}. ${propertyData.description.substring(0, 150)}...`} />
      </Helmet>

      <div className="min-h-screen flex flex-col soft-bg">
        <Header />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6 text-muted-foreground hover:text-foreground">
            <Link to="/browse-rentals">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Browse
            </Link>
          </Button>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2">
              <img
                src={propertyData.images[0]}
                alt={`${propertyData.name} - Main view`}
                className="w-full h-[400px] object-cover rounded-2xl shadow-sm border border-border/50"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {propertyData.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${propertyData.name} - Additional view ${index + 1}`}
                  className="w-full h-[192px] object-cover rounded-2xl shadow-sm border border-border/50"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Info */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-secondary text-secondary-foreground uppercase tracking-wider text-xs">
                        {propertyData.segment === 'student' ? 'Student Rental' : 'General Rental'}
                      </Badge>
                      <Badge className="bg-primary/10 text-primary border-none">{propertyData.tag}</Badge>
                      <Badge variant="outline" className="border-border text-muted-foreground font-mono">
                        ID: {propertyData.propertyId}
                      </Badge>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">{propertyData.name}</h1>
                    <p className="text-muted-foreground flex items-center text-lg">
                      <MapPin className="h-5 w-5 mr-1.5 text-primary" />
                      {propertyData.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl">About This Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-base">{propertyData.description}</p>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl">Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {propertyData.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <amenity.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{amenity.label}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{amenity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* House Rules */}
              <Card className="border-border/50 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl">House Rules & Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {propertyData.houseRules.map((rule, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Pricing & Actions */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="sticky top-24 border-border/50 shadow-md rounded-2xl overflow-hidden glass-card">
                <CardHeader className="bg-secondary/30 border-b border-border/50 pb-6">
                  <CardTitle className="text-xl">Pricing & Reservation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <Tabs value={selectedPricing} onValueChange={setSelectedPricing}>
                    <TabsList className="grid w-full grid-cols-2 bg-secondary/50 rounded-full p-1 h-12">
                      <TabsTrigger value="monthly" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">Monthly</TabsTrigger>
                      <TabsTrigger value="yearly" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">Yearly</TabsTrigger>
                    </TabsList>
                    <TabsContent value="monthly" className="mt-6">
                      <div className="text-center">
                        <p className="text-4xl font-extrabold text-foreground">
                          ₦{propertyData.pricing.monthly.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">per month</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="yearly" className="mt-6">
                      <div className="text-center">
                        <p className="text-4xl font-extrabold text-foreground">
                          ₦{propertyData.pricing.yearly.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">per year</p>
                        <Badge variant="secondary" className="mt-3 bg-green-100 text-green-800 border-none font-semibold">
                          Save ₦{(propertyData.pricing.monthly * 12 - propertyData.pricing.yearly).toLocaleString()}
                        </Badge>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="space-y-3 pt-4">
                    <Button onClick={handleInspectionRequest} variant="outline" className="w-full rounded-xl h-12 border-primary/30 text-primary hover:bg-primary/5" size="lg">
                      <Calendar className="mr-2 h-5 w-5" />
                      {canStartRentalAction ? 'Request Inspection' : 'Sign in as tenant to inspect'}
                    </Button>
                    <Button onClick={handleReservation} className="w-full rounded-xl h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm" size="lg">
                      <CreditCard className="mr-2 h-5 w-5" />
                      {canStartRentalAction ? 'Reserve Now' : 'Sign in as tenant to reserve'}
                    </Button>
                  </div>


                  {/* Inspection Fee Notice */}
                  <div className="bg-secondary/50 rounded-xl p-4 flex items-start space-x-3 mt-4">
                    <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">Why This Works</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        A small non-refundable inspection fee encourages serious bookings and respects the inspector's time and transport costs.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/50 space-y-3">
                    <div className="flex items-center text-sm font-medium text-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                      <span>Verified property</span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                      <span>No hidden agent fees</span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-3" />
                      <span>Secure digital payment</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audit Trail Details */}
              <Card className="border-border/50 shadow-sm rounded-2xl bg-secondary/10">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
                    <span>Verified on: <strong className="text-foreground">{propertyData.verifiedOn}</strong></span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <span>Last updated: <strong className="text-foreground">{propertyData.lastUpdated}</strong></span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default PropertyDetailPage;
