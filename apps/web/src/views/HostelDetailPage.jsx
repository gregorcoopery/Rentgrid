import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Wifi, Zap, Lock, Droplet, Car, ChefHat, ArrowLeft, Calendar, CreditCard, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@clerk/nextjs';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { usePermissions } from '@/components/PermissionProvider.jsx';
import { canInitiateRentalAction, getRoleDefinition } from '@/lib/permissions';
import { createPaymentIntent, submitWorkflow, getListing } from '@/lib/marketplace-client';

const HostelDetailPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { role } = usePermissions();
  const { user } = useUser();
  const [selectedPricing, setSelectedPricing] = useState('yearly');
  const canStartRentalAction = canInitiateRentalAction(role);
  const currentRole = getRoleDefinition(role);

  const [hostelData, setHostelData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getListing(id);
        const amenityIcons = { wifi: Wifi, power: Zap, security: Lock, water: Droplet, parking: Car, kitchen: ChefHat };
        const amenityLabels = {
          wifi: 'High-Speed Wi-Fi',
          power: '24/7 Power Supply',
          security: 'Security',
          water: 'Running Water',
          parking: 'Parking Space',
          kitchen: 'Shared Kitchen',
        };
        const formatted = {
          ...data,
          university: (data.university || '').toUpperCase(),
          distance: data.distance || 'Near campus',
          images: data.images && data.images.length ? data.images : [
            data.image,
            'https://images.unsplash.com/photo-1680210851458-b7dc5685e06e',
            'https://images.unsplash.com/photo-1657639754502-3c138cb24b4c',
          ],
          pricing: {
            monthly: Math.round(data.price / 10),
            yearly: data.price,
          },
          amenities: (data.amenities || []).map((amenityId) => ({
            icon: amenityIcons[amenityId] || CheckCircle,
            label: amenityLabels[amenityId] || amenityId,
            description: 'Verified during hostel review',
          })),
          houseRules: data.houseRules || [
            'No smoking inside the building',
            'Visitors allowed between 8 AM - 8 PM',
            'Quiet hours: 10 PM - 7 AM',
            'Keep common areas clean',
            'No pets allowed',
            'Respect other residents',
          ],
          description: data.description || `${data.name} offers verified student accommodation in ${data.location}. RentGrid reviews location, amenities, room availability, and safety checks before publication.`,
          roomTypes: data.roomTypes || [
            { type: 'Single Room', price: 120000, available: 3 },
            { type: 'Shared Room (2 persons)', price: 85000, available: 5 },
            { type: 'Self-Contain', price: 150000, available: 2 },
          ],
        };
        setHostelData(formatted);
      } catch (err) {
        console.error('Failed to load hostel', err);
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
        listingId: hostelData.id,
        listingType: 'hostel',
        requestedPricing: selectedPricing,
      });
      toast({
        title: "Inspection request sent",
        description: "Our team will contact you within 24 hours to schedule your physical inspection.",
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
      const amount = hostelData.pricing[selectedPricing];
      await submitWorkflow('reservation', {
        listingId: hostelData.id,
        listingType: 'hostel',
        amount,
      });
      const intent = await createPaymentIntent({
        amount,
        email: user?.primaryEmailAddress?.emailAddress || 'tenant@example.com',
        metadata: { listingId: hostelData.id, listingType: 'hostel' },
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
          <p className="text-sm font-medium text-muted-foreground">Loading hostel details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!hostelData) {
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
        <title>{`${hostelData.name} - RentGrid`}</title>
        <meta name="description" content={`${hostelData.name} in ${hostelData.location}. ${hostelData.description.substring(0, 150)}...`} />
      </Helmet>

      <div className="min-h-screen flex flex-col gradient-bg">
        <Header />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6 text-gray-300 hover:text-white hover:bg-white/10">
            <Link to="/browse-hostels">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Browse
            </Link>
          </Button>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2">
              <img
                src={hostelData.images[0]}
                alt={`${hostelData.name} - Main view of student accommodation`}
                className="w-full h-[400px] object-cover rounded-xl card-shadow border border-border/30"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {hostelData.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${hostelData.name} - Additional view ${index + 1}`}
                  className="w-full h-[192px] object-cover rounded-xl card-shadow border border-border/30"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">{hostelData.name}</h1>
                    <p className="text-gray-300 flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-primary" />
                      {hostelData.location}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-sm border-primary/50 text-primary bg-primary/10">
                    {hostelData.university}
                  </Badge>
                </div>
                <p className="text-accent font-bold">{hostelData.distance}</p>
              </div>

              {/* Description */}
              <Card className="card-shadow border-border/50 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">About This Hostel</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{hostelData.description}</p>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card className="card-shadow border-border/50 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {hostelData.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <amenity.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{amenity.label}</p>
                          <p className="text-sm text-gray-400">{amenity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Room Types */}
              <Card className="card-shadow border-border/50 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Available Room Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hostelData.roomTypes.map((room, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:border-primary/50 bg-background/30 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-white">{room.type}</p>
                          <p className="text-sm text-gray-400">
                            {room.available} {room.available === 1 ? 'room' : 'rooms'} available
                          </p>
                        </div>
                        <p className="text-xl font-bold text-primary">
                          ₦{room.price.toLocaleString()}/year
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* House Rules */}
              <Card className="card-shadow border-border/50 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">House Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {hostelData.houseRules.map((rule, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Pricing & Actions */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 card-shadow border-primary/30 bg-card/80 backdrop-blur-md">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-white">Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <Tabs value={selectedPricing} onValueChange={setSelectedPricing}>
                    <TabsList className="grid w-full grid-cols-2 bg-background/50">
                      <TabsTrigger value="monthly" className="data-[state=active]:bg-primary data-[state=active]:text-white">Monthly</TabsTrigger>
                      <TabsTrigger value="yearly" className="data-[state=active]:bg-primary data-[state=active]:text-white">Yearly</TabsTrigger>
                    </TabsList>
                    <TabsContent value="monthly" className="mt-4">
                      <div className="text-center py-4">
                        <p className="text-4xl font-extrabold text-primary">
                          ₦{hostelData.pricing.monthly.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">per month</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="yearly" className="mt-4">
                      <div className="text-center py-4">
                        <p className="text-4xl font-extrabold text-primary">
                          ₦{hostelData.pricing.yearly.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">per year</p>
                        <Badge variant="secondary" className="mt-2 bg-accent/20 text-accent border-accent/30">
                          Save ₦{(hostelData.pricing.monthly * 12 - hostelData.pricing.yearly).toLocaleString()}
                        </Badge>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="space-y-3">
                    <Button onClick={handleInspectionRequest} variant="outline" className="w-full border-primary/50 text-white hover:bg-primary/20" size="lg">
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      {canStartRentalAction ? 'Request Inspection' : 'Sign in as tenant to inspect'}
                    </Button>
                    <Button onClick={handleReservation} className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25" size="lg">
                      <CreditCard className="mr-2 h-4 w-4" />
                      {canStartRentalAction ? 'Reserve Now' : 'Sign in as tenant to reserve'}
                    </Button>
                  </div>

                  {/* Inspection Fee Notice */}
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 flex items-start space-x-2">
                    <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-300 leading-relaxed">
                      <strong className="text-white">Non-refundable inspection fee: ₦500–₦1,000</strong> to incentivize the inspector's time and transport (to be split 70% Landlord / 30% RentGrid in the final system).
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/50 space-y-2">
                    <div className="flex items-center text-sm text-gray-300">
                      <CheckCircle className="h-4 w-4 text-accent mr-2" />
                      <span>Verified property</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <CheckCircle className="h-4 w-4 text-accent mr-2" />
                      <span>No hidden agent fees</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <CheckCircle className="h-4 w-4 text-accent mr-2" />
                      <span>Secure payment</span>
                    </div>
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

export default HostelDetailPage;
