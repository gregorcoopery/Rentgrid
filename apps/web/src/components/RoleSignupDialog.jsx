'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BriefcaseBusiness, ClipboardCheck, Home, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePermissions } from '@/components/PermissionProvider.jsx';
import { ROLE_DEFINITIONS, ROLE_IDS, SIGN_UP_ROLE_ORDER } from '@/lib/permissions';

const ROLE_ICONS = {
  [ROLE_IDS.TENANT]: UserRound,
  [ROLE_IDS.LANDLORD]: Home,
  [ROLE_IDS.AGENT]: BriefcaseBusiness,
  [ROLE_IDS.INSPECTOR]: ClipboardCheck,
};

export default function RoleSignupDialog({ children }) {
  const router = useRouter();
  const { setRole } = usePermissions();
  const [open, setOpen] = React.useState(false);

  const handleRoleSelect = (roleId) => {
    setRole(roleId);
    setOpen(false);
    router.push(`/sign-up?role=${roleId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose your RentGrid role</DialogTitle>
          <DialogDescription>
            Your role determines which workspace Clerk sends you to after authentication.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SIGN_UP_ROLE_ORDER.map((roleId) => {
            const definition = ROLE_DEFINITIONS[roleId];
            const Icon = ROLE_ICONS[roleId];

            return (
              <button
                key={roleId}
                type="button"
                onClick={() => handleRoleSelect(roleId)}
                className="group rounded-xl border border-border bg-background p-4 text-left shadow-sm transition-colors hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="block text-base font-semibold text-foreground">{definition.label}</span>
                <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                  {definition.onboardingDescription}
                </span>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                  Continue <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
