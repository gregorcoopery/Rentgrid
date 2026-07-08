import { NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/marketplace-repository';
import { normalizeRole } from '@/lib/permissions';

export async function GET(_request, { params }) {
  const role = normalizeRole(params.role);

  return NextResponse.json(await getDashboardData(role));
}
