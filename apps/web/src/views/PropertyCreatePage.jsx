'use client';

import React from 'react';
import { Helmet } from 'react-helmet';
import { useRouter } from 'next/navigation';
import { Building2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { submitWorkflow } from '@/lib/marketplace-client';
import { toast } from '@/hooks/use-toast';

export default function PropertyCreatePage() {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    name: '',
    segment: 'general',
    location: '',
    price: '',
    roomType: 'self-contain',
    amenities: '',
    description: '',
  });

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await submitWorkflow('property', {
        ...form,
        price: Number(form.price),
        status: 'draft',
      });
      toast({
        title: 'Property draft created',
        description: 'Your listing is queued for completion and verification.',
      });
      router.push('/landlord-dashboard');
    } catch (error) {
      toast({
        title: 'Property could not be saved',
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Property - RentGrid</title>
      </Helmet>
      <div className="min-h-screen flex flex-col soft-bg">
        <Header />
        <main className="flex-1 py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="mx-auto max-w-4xl border-border/50 shadow-sm">
              <CardHeader className="border-b border-border/50">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">Add a property</CardTitle>
                <p className="text-muted-foreground">
                  Create a draft listing. RentGrid will verify ownership, photos, location, and amenities before publishing.
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <form className="grid grid-cols-1 gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="name">Property name</Label>
                    <Input id="name" required value={form.name} onChange={(event) => updateField('name', event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Segment</Label>
                    <Select value={form.segment} onValueChange={(value) => updateField('segment', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General rental</SelectItem>
                        <SelectItem value="student">Student rental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Room type</Label>
                    <Select value={form.roomType} onValueChange={(value) => updateField('roomType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single room</SelectItem>
                        <SelectItem value="self-contain">Self-contain</SelectItem>
                        <SelectItem value="1bed">1 bedroom flat</SelectItem>
                        <SelectItem value="2bed">2 bedroom flat</SelectItem>
                        <SelectItem value="3bed">3 bedroom flat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" required value={form.location} onChange={(event) => updateField('location', event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Annual price</Label>
                    <Input id="price" required type="number" min="1" value={form.price} onChange={(event) => updateField('price', event.target.value)} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="amenities">Amenities</Label>
                    <Input id="amenities" placeholder="Power, water, security, parking" value={form.amenities} onChange={(event) => updateField('amenities', event.target.value)} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={form.description} onChange={(event) => updateField('description', event.target.value)} />
                  </div>
                  <div className="flex justify-end sm:col-span-2">
                    <Button type="submit" disabled={saving} className="rounded-full">
                      <Save className="mr-2 h-4 w-4" />
                      {saving ? 'Saving...' : 'Save draft'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

