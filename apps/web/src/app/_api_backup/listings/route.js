import { NextResponse } from 'next/server';
import { getListings } from '@/lib/marketplace-repository';

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  return NextResponse.json({
    listings: await getListings({
      segment: searchParams.get('segment') || undefined,
      status: searchParams.get('status') || undefined,
      type: searchParams.get('type') || undefined,
    }),
  });
}
