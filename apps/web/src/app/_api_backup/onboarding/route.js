import { NextResponse } from 'next/server';
import { normalizeRole } from '@/lib/permissions';
import { validateOnboardingProfile } from '@/lib/marketplace-repository';

export async function POST(request) {
  const payload = await request.json();
  const role = normalizeRole(payload.role);
  const validation = validateOnboardingProfile(role, payload.profile);

  if (!validation.complete) {
    return NextResponse.json(
      {
        error: 'Profile is incomplete',
        missing: validation.missing,
      },
      { status: 422 },
    );
  }

  return NextResponse.json({
    profile: {
      role,
      ...payload.profile,
      onboardingComplete: true,
      verificationStatus: ['tenant', 'super-admin'].includes(role) ? 'verified' : 'pending-review',
      updatedAt: new Date().toISOString(),
    },
  });
}

