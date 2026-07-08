'use client';

/* global process */

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (!process.env.NEXT_PUBLIC_ANALYTICS_KEY || !pathname) {
      return;
    }

    const query = searchParams?.toString();
    const payload = JSON.stringify({
      event: 'page_view',
      path: `${pathname}${query ? `?${query}` : ''}`,
      key: process.env.NEXT_PUBLIC_ANALYTICS_KEY,
      timestamp: new Date().toISOString(),
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', new Blob([payload], { type: 'application/json' }));
      return;
    }

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    });
  }, [pathname, searchParams]);

  return null;
}
