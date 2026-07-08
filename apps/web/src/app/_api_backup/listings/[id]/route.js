import { NextResponse } from 'next/server';
import { getListingById } from '@/lib/marketplace-repository';

export async function GET(request, { params }) {
  const { searchParams } = new URL(request.url);
  const listing = await getListingById(params.id, searchParams.get('type') || 'property');

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  return NextResponse.json({ listing });
}
