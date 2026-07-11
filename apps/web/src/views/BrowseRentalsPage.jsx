import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Filter, ChevronRight, Building2, GraduationCap, LayoutGrid, List as ListIcon, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { getListings } from '@/lib/marketplace-client';

const BrowseRentalsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSegment = queryParams.get('segment') === 'student' ? 'student' : 'general';

  const [segment, setSegment] = useState(initialSegment);
  const DEFAULT_PRICE_RANGE = [50000, 5000000];
  const [priceRange, setPriceRange] = useState(DEFAULT_PRICE_RANGE);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedRoomType, setSelectedRoomType] = useState('all');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  
  // View mode & Pagination State
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getListings('property');
        setAllProperties(data);
      } catch (err) {
        console.error('Failed to load properties', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Update segment if URL changes
  useEffect(() => {
    const currentSegment = queryParams.get('segment');
    if (currentSegment === 'student' || currentSegment === 'general') {
      setSegment(currentSegment);
      setSelectedLocation('all'); // Reset location filter on segment change
      setCurrentPage(1);
    }
  }, [location.search]);

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'lagos_island', label: 'Lagos Island' },
    { value: 'lagos_mainland', label: 'Lagos Mainland' },
    { value: 'abuja', label: 'Abuja' },
    { value: 'port_harcourt', label: 'Port Harcourt' },
    { value: 'ibadan', label: 'Ibadan' },
  ];

  const universities = [
    { value: 'all', label: 'All Universities' },
    { value: 'unilag', label: 'UNILAG' },
    { value: 'ui', label: 'UI' },
    { value: 'oau', label: 'OAU' },
  ];

  const roomTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'single', label: 'Single Room' },
    { value: 'self-contain', label: 'Self-Contain' },
    { value: '1bed', label: '1 Bedroom Flat' },
    { value: '2bed', label: '2 Bedroom Flat' },
    { value: '3bed', label: '3 Bedroom Flat' },
  ];

  const amenities = [
    { id: 'wifi', label: 'Wi-Fi' },
    { id: 'power', label: '24/7 Power' },
    { id: 'security', label: 'Security' },
    { id: 'water', label: 'Running Water' },
    { id: 'parking', label: 'Parking' },
  ];

  const toggleAmenity = (amenityId) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
    setCurrentPage(1);
  };

  const filteredProperties = allProperties.filter((property) => {
    const matchesSegment = property.segment === segment;
    const matchesLocation = selectedLocation === 'all' || property.area === selectedLocation || property.university === selectedLocation;
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    const matchesRoomType = selectedRoomType === 'all' || property.roomType === selectedRoomType;
    const matchesAmenities = selectedAmenities.length === 0 || selectedAmenities.every((amenity) => property.amenities.includes(amenity));

    return matchesSegment && matchesLocation && matchesPrice && matchesRoomType && matchesAmenities;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // FilterContent receives a prefix to ensure unique IDs when rendered in multiple places
  const FilterContent = ({ idPrefix = 'desktop' }) => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">
          {segment === 'student' ? 'University Area' : 'Location'}
        </label>
        <Select value={selectedLocation} onValueChange={(val) => { setSelectedLocation(val); setCurrentPage(1); }}>
          <SelectTrigger className="bg-background border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(segment === 'student' ? universities : locations).map((loc) => (
              <SelectItem key={loc.value} value={loc.value}>
                {loc.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Price Range (₦/year)</label>
        <Slider
          value={priceRange}
          onValueChange={(val) => { setPriceRange(val); setCurrentPage(1); }}
          max={segment === 'student' ? 500000 : 5000000}
          min={30000}
          step={10000}
          className="w-full py-4"
        />
        <p className="text-sm text-primary font-medium">
          ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Property Type</label>
        <Select value={selectedRoomType} onValueChange={(val) => { setSelectedRoomType(val); setCurrentPage(1); }}>
          <SelectTrigger className="bg-background border-border">
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
        <label className="text-sm font-semibold text-foreground">Amenities</label>
        <div className="space-y-3">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${idPrefix}-${amenity.id}`}
                checked={selectedAmenities.includes(amenity.id)}
                onCheckedChange={() => toggleAmenity(amenity.id)}
              />
              <label
                htmlFor={`${idPrefix}-${amenity.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-muted-foreground"
              >
                {amenity.label}
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
        <title>Browse Rentals - RentGrid</title>
        <meta name="description" content="Browse verified general apartments and student rentals on RentGrid." />
      </Helmet>

      <div className="min-h-screen flex flex-col soft-bg">
        <Header />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          
          {/* Segment Toggle & View Mode */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-border/50 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">Browse Properties</h1>
              <p className="text-muted-foreground">
                Found {filteredProperties.length} verified {filteredProperties.length === 1 ? 'property' : 'properties'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <Tabs value={segment} onValueChange={(val) => { setSegment(val); setSelectedLocation('all'); setCurrentPage(1); }} className="w-full sm:w-auto">
                <TabsList className="grid w-full sm:w-[300px] grid-cols-2 h-12 rounded-full bg-secondary/50 p-1">
                  <TabsTrigger value="general" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Building2 className="w-4 h-4 mr-2" /> General
                  </TabsTrigger>
                  <TabsTrigger value="student" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <GraduationCap className="w-4 h-4 mr-2" /> Student
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* View Toggle */}
              <div className="hidden sm:flex bg-secondary/50 p-1 rounded-xl border border-border/30">
                <button 
                  className="view-toggle-btn"
                  data-state={viewMode === 'grid' ? 'active' : 'inactive'}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid View"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button 
                  className="view-toggle-btn"
                  data-state={viewMode === 'list' ? 'active' : 'inactive'}
                  onClick={() => setViewMode('list')}
                  aria-label="List View"
                >
                  <ListIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <Card className="sticky top-24 border-border/50 shadow-sm bg-background/80 backdrop-blur-md rounded-2xl">
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="flex items-center text-foreground">
                    <Filter className="mr-2 h-5 w-5 text-primary" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                <FilterContent idPrefix="desktop" />
                </CardContent>
              </Card>
            </aside>

            {/* Mobile Filters */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full border-border bg-background rounded-xl h-12 mb-4">
                    <Filter className="mr-2 h-4 w-4 text-primary" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 overflow-y-auto h-[calc(100vh-100px)] pb-10">
                    <FilterContent idPrefix="mobile" />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
              
              {/* Banner Ad Space */}
              <div className="banner-ad mb-8">
                <span className="text-muted-foreground/60 text-sm font-medium tracking-widest uppercase">Advertisement Space</span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-card border border-border/50 rounded-2xl">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-4 text-sm text-muted-foreground font-medium">Loading verified properties...</p>
                </div>
              ) : paginatedProperties.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2 border-border bg-transparent shadow-none">
                  <p className="text-muted-foreground mb-6 text-lg">No properties match your filters</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedLocation('all');
                      setSelectedRoomType('all');
                      setSelectedAmenities([]);
                      setPriceRange(DEFAULT_PRICE_RANGE);
                    }}
                  >
                    Reset Filters
                  </Button>
                </Card>
              ) : (
                <div className={`grid gap-6 mb-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {paginatedProperties.map((property) => (
                    <Card
                      key={property.id}
                      className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 bg-card rounded-2xl group flex ${viewMode === 'list' ? 'flex-col sm:flex-row' : 'flex-col h-full'}`}
                    >
                      <div className={`relative overflow-hidden ${viewMode === 'list' ? 'sm:w-64 sm:h-auto h-56 flex-shrink-0' : 'h-56'}`}>
                        <img
                          src={property.image}
                          alt={property.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <Badge className={`absolute top-4 right-4 font-medium shadow-sm ${segment === 'student' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>
                          {property.tag}
                        </Badge>
                      </div>
                      <div className="flex flex-col flex-1 p-5">
                        <div className="pb-2">
                          <CardTitle className="text-xl text-foreground line-clamp-1">{property.name}</CardTitle>
                          <CardDescription className="flex items-center text-muted-foreground mt-2">
                            <MapPin className="h-4 w-4 mr-1.5 text-primary flex-shrink-0" />
                            <span className="line-clamp-1">{property.location}</span>
                          </CardDescription>
                        </div>
                        <div className="pb-4 flex-1 mt-2">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {property.amenities.slice(0, 3).map((amenityId) => {
                              const amenity = amenities.find((a) => a.id === amenityId);
                              return (
                                <Badge key={amenityId} variant="secondary" className="text-xs font-normal bg-secondary text-secondary-foreground">
                                  {amenity?.label}
                                </Badge>
                              );
                            })}
                            {property.amenities.length > 3 && (
                              <Badge variant="secondary" className="text-xs font-normal bg-secondary text-secondary-foreground">
                                +{property.amenities.length - 3} more
                              </Badge>
                            )}
                          </div>
                          <div className="mt-auto">
                            <p className="text-2xl font-bold text-foreground">
                              ₦{property.price.toLocaleString()}
                              <span className="text-sm text-muted-foreground font-normal">/year</span>
                            </p>
                          </div>
                        </div>
                        <div className="pt-0 mt-auto">
                          <Button asChild className="w-full rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                            <Link to={`/property/${property.id}`}>
                              View Details
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {filteredProperties.length > 0 && (
                <div className="mt-auto pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>Show:</span>
                    <Select value={itemsPerPage.toString()} onValueChange={(val) => { setItemsPerPage(Number(val)); setCurrentPage(1); }}>
                      <SelectTrigger className="h-8 w-[70px] bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>per page</span>
                  </div>

                  <div className="pagination-control">
                    <button 
                      className="pagination-btn" 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {(() => {
                      const pages = [];
                      const delta = 2;
                      const left = currentPage - delta;
                      const right = currentPage + delta;
                      let lastPage = null;
                      for (let i = 1; i <= totalPages; i++) {
                        if (i === 1 || i === totalPages || (i >= left && i <= right)) {
                          if (lastPage && i - lastPage > 1) {
                            pages.push(
                              <span key={`ellipsis-${i}`} className="h-10 w-10 flex items-center justify-center text-muted-foreground text-sm">
                                …
                              </span>
                            );
                          }
                          pages.push(
                            <button
                              key={i}
                              className="pagination-btn font-medium text-sm"
                              onClick={() => setCurrentPage(i)}
                              aria-current={currentPage === i ? 'page' : undefined}
                            >
                              {i}
                            </button>
                          );
                          lastPage = i;
                        }
                      }
                      return pages;
                    })()}

                    <button 
                      className="pagination-btn" 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
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

export default BrowseRentalsPage;
