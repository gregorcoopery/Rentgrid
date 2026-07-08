import { NextResponse } from 'next/server';
import { getMarketplaceSnapshot } from '@/lib/marketplace-repository';

export async function GET() {
  return NextResponse.json(await getMarketplaceSnapshot());
}
