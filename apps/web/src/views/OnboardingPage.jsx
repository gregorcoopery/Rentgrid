'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Helmet } from 'react-helmet';
import { ArrowRight, BadgeCheck, Building2, ClipboardCheck, MapPin, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { usePermissions } from '@/components/PermissionProvider.jsx';
import { getDashboardRoute, getRoleDefinition, ROLE_IDS } from '@/lib/permissions';
import { submitOnboardingProfile } from '@/lib/marketplace-client';
import { toast } from '@/hooks/use-toast';

const ROLE_FIELDS = {
  [ROLE_IDS.TENANT]: [
    { name: 'preferredLocation', label: 'Preferred location', placeholder: 'Lekki, Yaba, Akoka...' },
    { name: 'budget', label: 'Annual budget', placeholder: 'e.g. 1200000' },
  ],
  [ROLE_IDS.LANDLORD]: [
    { name: 'businessName', label: 'Business or owner name', placeholder: 'Kemi Properties Ltd' },
    { name: 'propertyOwnershipProof', label: 'Ownership proof reference', placeholder: 'Deed, tax receipt, upload reference...' },
    { name: 'bankName', label: 'Payout bank', placeholder: 'GTBank' },
  ],
  [ROLE_IDS.AGENT]: [
    { name: 'serviceAreas', label: 'Service areas', placeholder: 'Lekki, Yaba, Akoka' },
    { name: 'identityDocument', label: 'Identity document reference', placeholder: 'NIN, passport, upload reference...' },
  ],
  [ROLE_IDS.INSPECTOR]: [
    { name: 'serviceAreas', label: 'Inspection areas', placeholder: 'Lagos Mainland, Lagos Island' },
    { name: 'identityDocument', label: 'Identity document reference', placeholder: 'NIN, passport, upload reference...' },
    { name: 'inspectionExperience', label: 'Inspection experience', placeholder: '2 years property inspections...' },
  ],
};

const ROLE_ICONS = {
  [ROLE_IDS.TENANT]: UserRound,
  [ROLE_IDS.LANDLORD]: Building2,
  [ROLE_IDS.AGENT]: MapPin,
  [ROLE_IDS.INSPECTOR]: ClipboardCheck,
  [ROLE_IDS.SUPER_ADMIN]: BadgeCheck,
};

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const { role } = usePermissions();
  const definition = getRoleDefinition(role);
  const Icon = ROLE_ICONS[role] || UserRound;
  const roleFields = ROLE_FIELDS[role] || [];
  const [saving, setSaving] = React.useState(false);
  const [profile, setProfile] = React.useState({
    name: user?.fullName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    phone: user?.primaryPhoneNumber?.phoneNumber || '',
  });

  React.useEffect(() => {
    setProfile((current) => ({
      ...current,
      name: current.name || user?.fullName || '',
      email: current.email || user?.primaryEmailAddress?.emailAddress || '',
      phone: current.phone || user?.primaryPhoneNumber?.phoneNumber || '',
    }));
  }, [user]);

  const updateField = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const completedProfile = await submitOnboardingProfile(role, {
        ...profile,
        clerkId: user?.id,
      });
      await user?.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          onboardingComplete: true,
          onboardingProfile: completedProfile,
        },
      });

      toast({
        title: 'Profile completed',
        description: 'Your RentGrid workspace is ready.',
      });
      router.push(getDashboardRoute(role) || '/browse-rentals');
    } catch (error) {
      toast({
        title: 'Complete the required fields',
        description: error.missing?.length ? `Missing: ${error.missing.join(', ')}` : error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Complete Profile - RentGrid</title>
      </Helmet>
      <div className="min-h-screen flex flex-col soft-bg">
        <Header />
        <main className="flex-1 py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="mx-auto max-w-3xl border-border/50 shadow-sm glass-card">
              <CardHeader className="border-b border-border/50">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">Complete your {definition.label} profile</CardTitle>
                <p className="text-muted-foreground">
                  RentGrid uses this information for verification, bookings, payouts, and support.
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input id="name" value={profile.name} onChange={(event) => updateField('name', event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profile.email} onChange={(event) => updateField('email', event.target.value)} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input id="phone" value={profile.phone} onChange={(event) => updateField('phone', event.target.value)} />
                    </div>
                    {roleFields.map((field) => (
                      <div key={field.name} className="space-y-2 sm:col-span-2">
                        <Label htmlFor={field.name}>{field.label}</Label>
                        {field.name.includes('Experience') || field.name.includes('Proof') ? (
                          <Textarea
                            id={field.name}
                            placeholder={field.placeholder}
                            value={profile[field.name] || ''}
                            onChange={(event) => updateField(field.name, event.target.value)}
                          />
                        ) : (
                          <Input
                            id={field.name}
                            placeholder={field.placeholder}
                            value={profile[field.name] || ''}
                            onChange={(event) => updateField(field.name, event.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving} className="rounded-full">
                      {saving ? 'Saving...' : 'Finish setup'}
                      <ArrowRight className="ml-2 h-4 w-4" />
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
