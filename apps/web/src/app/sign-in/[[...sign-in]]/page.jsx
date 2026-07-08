'use client';

import React, { Suspense } from 'react';
import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { getPostAuthRedirect, getRoleDefinition, normalizeRole } from '@/lib/permissions';

function SignInContent() {
  const searchParams = useSearchParams();
  const role = normalizeRole(searchParams.get('role'));
  const redirectUrl = getPostAuthRedirect(role);
  const roleLabel = getRoleDefinition(role).label;
  const roleQuery = role === 'public-visitor' ? '' : `?role=${role}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 soft-bg">
        <div className="container mx-auto flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              {role === 'public-visitor' ? 'Welcome back' : roleLabel}
            </p>
            <h1 className="text-3xl font-bold text-foreground">Sign in to RentGrid</h1>
            <p className="mt-3 text-muted-foreground">
              Continue with Clerk to access your role-specific workspace.
            </p>
          </div>
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl={`/sign-up${roleQuery}`}
            fallbackRedirectUrl={redirectUrl}
            forceRedirectUrl={redirectUrl}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm font-medium text-muted-foreground">Loading sign in...</p>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
