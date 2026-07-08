import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { MapPin, Filter, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { getListings } from '@/lib/marketplace-client';

const BrowseHostelsPage = () => {
  const [priceRange, setPriceRange] = useState([30000, 300000]);
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [selectedRoomType, setSelectedRoomType] = useState('all');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [roomSize, setRoomSize] = useState('');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);

  const [allHostels, setAllHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getListings('hostel');
        setAllHostels(data);
      } catch (err) {
        console.error('Failed to load hostels', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const universities = [
    { value: 'all', label: 'All Universities' },
    { value: 'unilag', label: 'University of Lagos' },
    { value: 'ui', label: 'University of Ibadan' },
    { value: 'oau', label: 'Obafemi Awolowo University' },
    { value: 'unn', label: 'University of Nigeria' },
    { value: 'abu', label: 'Ahmadu Bello University' },
  ];

  const roomTypes = [
    { value: 'all', label: 'All Room Types' },
    { value: 'single', label: 'Single Room' },
    { value: 'shared', label: 'Shared Room' },
    { value: 'self-contain', label: 'Self-Contain' },
    { value: 'apartment', label: 'Apartment' },
  ];

  const amenities = [
    { id: 'wifi', label: 'Wi-Fi' },
    { id: 'power', label: '24/7 Power' },
    { id: 'security', label: 'Security' },
    { id: 'water', label: 'Running Water' },
    { id: 'parking', label: 'Parking' },
    { id: 'kitchen', label: 'Kitchen' },
  ];

  const neighborhoodOptions = [
    { id: 'landmark', label: 'Close to Landmark' },
    { id: 'train', label: 'Close to Train Station' },
    { id: 'bus_stop', label: 'Close to Bus Stop' },
    { id: 'bus_park', label: 'Close to Bus Park' },
    { id: 'shops', label: 'Shops (Pharmacy, Supermarket)' },
    { id: 'library', label: 'Library' },
    { id: 'gym', label: 'Gym' },
    { id: 'laundry', label: 'Laundry' },
    { id: 'clinic', label: 'Clinic/Hospital' },
    { id: 'restaurant', label: 'Restaurant' },
    { id: 'club', label: 'Club/Lounge' },
    { id: 'police', label: 'Police Station' },
    { id: 'schools', label: 'Nearby Schools' },
  ];

  const toggleAmenity = (amenityId) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const toggleNeighborhood = (optionId) => {
    setSelectedNeighborhoods((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const filteredHostels = allHostels.filter((hostel) => {
    const matchesUniversity = selectedUniversity === 'all' || hostel.university === selectedUniversity;
    const matchesPrice = hostel.price >= priceRange[0] && hostel.price <= priceRange[1];
    const matchesRoomType = selectedRoomType === 'all' || hostel.roomType === selectedRoomType;
    const matchesAmenities = selectedAmenities.length === 0 || selectedAmenities.every((amenity) => hostel.amenities.includes(amenity));
    // Note: Room size and neighborhood filters are UI-only for this mockup, 
    // but in a real app they would filter the data here.

    return matchesUniversity && matchesPrice && matchesRoomType && matchesAmenities;
  });

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-white">University</label>
        <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
          <SelectTrigger className="bg-background/50 border-border/50 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {universities.map((uni) => (
              <SelectItem key={uni.value} value={uni.value}>
                {uni.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-white">Price Range (₦/year)</label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={300000}
          min={30000}
          step={10000}
          className="w-full py-4"
        />
        <p className="text-sm text-primary font-medium">
          ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-white">Room Type</label>
        <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
          <SelectTrigger className="bg-background/50 border-border/50 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roomTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-white">Room Size</label>
        <Input 
          placeholder="e.g. 12 sqm or 3 by 4 sqm" 
          value={roomSize}
          onChange={(e) => setRoomSize(e.target.value)}
          className="bg-background/50 border-border/50 text-white placeholder:text-gray-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-white">Amenities</label>
        <div className="space-y-3">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox
                id={amenity.id}
                checked={selectedAmenities.includes(amenity.id)}
                onCheckedChange={() => toggleAmenity(amenity.id)}
                className="border-primary/50 data-[state=checked]:bg-primary"
              />
              <label
                htmlFor={amenity.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-300"
              >
                {amenity.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-white">Hostel Neighborhood</label>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {neighborhoodOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={selectedNeighborhoods.includes(option.id)}
                onCheckedChange={() => toggleNeighborhood(option.id)}
                className="border-accent/50 data-[state=checked]:bg-accent"
              />
              <label
                htmlFor={option.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-300"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Browse Hostels - RentGrid</title>
        <meta name="description" content="Browse and filter verified off-campus hostels near Nigerian universities. Find your perfect accommodation with our advanced search filters." />
      </Helmet>

      <div className="min-h-screen flex flex-col gradient-bg">
        <Header />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">Browse Hostels</h1>
            <p className="text-gray-300">
              Found {filteredHostels.length} verified {filteredHostels.length === 1 ? 'hostel' : 'hostels'}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <Card className="sticky top-24 card-shadow border-primary/20 bg-card/60 backdrop-blur-md">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="flex items-center text-white">
                    <Filter className="mr-2 h-5 w-5 text-primary" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <FilterContent />
                </CardContent>
              </Card>
            </aside>

            {/* Mobile Filters */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full border-primary/50 text-white bg-card/50">
                    <Filter className="mr-2 h-4 w-4 text-primary" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background border-r-border/50">
                  <SheetHeader>
                    <SheetTitle className="text-white">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 overflow-y-auto h-[calc(100vh-100px)] pb-10">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Hostel Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-card/40 border border-border/50 rounded-2xl">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-4 text-sm text-gray-300 font-medium">Loading verified hostels...</p>
                </div>
              ) : filteredHostels.length === 0 ? (
                <Card className="p-12 text-center card-shadow border-border/50 bg-card/40">
                  <p className="text-gray-300 mb-6 text-lg">No hostels match your filters</p>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={() => {
                      setSelectedUniversity('all');
                      setSelectedRoomType('all');
                      setSelectedAmenities([]);
                      setSelectedNeighborhoods([]);
                      setRoomSize('');
                      setPriceRange([30000, 300000]);
                    }}
                  >
                    Reset Filters
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredHostels.map((hostel) => (
                    <Card
                      key={hostel.id}
                      className="overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 card-shadow border-border/50 bg-card/80"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={hostel.image}
                          alt={`${hostel.name} - Student accommodation`}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground font-bold shadow-lg">
                          {hostel.distance}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl text-white">{hostel.name}</CardTitle>
                        <CardDescription className="flex items-center text-gray-400">
                          <MapPin className="h-3 w-3 mr-1 text-primary" />
                          {hostel.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hostel.amenities.map((amenityId) => {
                            const amenity = amenities.find((a) => a.id === amenityId);
                            return (
                              <Badge key={amenityId} variant="secondary" className="text-xs bg-secondary/50 text-secondary-foreground">
                                {amenity?.label}
                              </Badge>
                            );
                          })}
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          ₦{hostel.price.toLocaleString()}
                          <span className="text-sm text-gray-400 font-normal">/year</span>
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 transition-colors">
                          <Link to={`/hostel/${hostel.id}`}>
                            View Details
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default BrowseHostelsPage;
