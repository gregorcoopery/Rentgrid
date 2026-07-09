import '../index.css';
import React, { Suspense } from 'react';
import AnalyticsProvider from '@/components/AnalyticsProvider.jsx';
import ClientToaster from '@/components/ClientToaster.jsx';
import ClerkClientProvider from '@/components/ClerkClientProvider.jsx';
import { PermissionProvider } from '@/components/PermissionProvider.jsx';
import GlobalBackground from '@/components/GlobalBackground.jsx';

export const metadata = {
  title: 'RentGrid',
  description: "Nigeria's trusted marketplace for verified general and student rentals.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkClientProvider>
          <PermissionProvider>
            <GlobalBackground />
            {children}
            <Suspense fallback={null}>
              <AnalyticsProvider />
            </Suspense>
            <ClientToaster />
          </PermissionProvider>
        </ClerkClientProvider>
      </body>
    </html>
  );
}
