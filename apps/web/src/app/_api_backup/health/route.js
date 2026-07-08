import { NextResponse } from 'next/server';
import { getIntegrationReadiness } from '@/lib/integrations';
import { getEnvReadiness } from '@/lib/env-readiness';

export async function GET() {
  const env = getEnvReadiness();

  return NextResponse.json({
    ok: env.ready,
    service: 'rentgrid-web',
    checkedAt: new Date().toISOString(),
    environment: env,
    integrations: getIntegrationReadiness(),
  }, { status: env.ready ? 200 : 503 });
}
