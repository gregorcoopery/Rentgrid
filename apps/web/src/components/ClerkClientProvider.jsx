'use client';

/* global process */

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';

const fallbackPublishableKey = 'pk_test_Y2xlcmsuZXhhbXBsZS5jb20k';
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || fallbackPublishableKey;

export default function ClerkClientProvider({ children }) {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
