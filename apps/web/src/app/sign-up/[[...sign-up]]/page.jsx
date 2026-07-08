'use client';

import React, { Suspense } from 'react';
import { SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { ROLE_IDS, getPostAuthRedirect, getRoleDefinition, normalizeRole } from '@/lib/permissions';

function SignUpContent() {
  const searchParams = useSearchParams();
  const role = normalizeRole(searchParams.get('role'));
  const signupRole = role === ROLE_IDS.PUBLIC ? ROLE_IDS.TENANT : role;
  const redirectUrl = getPostAuthRedirect(signupRole);
  const roleLabel = getRoleDefinition(signupRole).label;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 soft-bg">
        <div className="container mx-auto flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              {roleLabel}
            </p>
            <h1 className="text-3xl font-bold text-foreground">Create your RentGrid account</h1>
            <p className="mt-3 text-muted-foreground">
              Clerk will attach this role to your account and open the correct workspace after signup.
            </p>
          </div>
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl={`/sign-in?role=${signupRole}`}
            unsafeMetadata={{ role: signupRole }}
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
        <p className="text-sm font-medium text-muted-foreground">Loading sign up...</p>
      </div>
    }>
      <SignUpContent />
    </Suspense>
  );
}
