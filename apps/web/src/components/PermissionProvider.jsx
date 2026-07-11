'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { ROLE_IDS, getRoleFromMetadata, normalizeRole } from '@/lib/permissions';

const STORAGE_KEY = 'rentgrid-pending-role';

const PermissionContext = React.createContext({
  role: ROLE_IDS.PUBLIC,
  pendingRole: null,
  setRole: () => {},
});

export function PermissionProvider({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [role, setRoleState] = React.useState(ROLE_IDS.PUBLIC);
  const [pendingRole, setPendingRole] = React.useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryRole = params.get('role');
    const storedRole = window.localStorage.getItem(STORAGE_KEY);
    const nextPendingRole = queryRole || storedRole;

    if (nextPendingRole) {
      const normalizedRole = normalizeRole(nextPendingRole);
      if (normalizedRole !== ROLE_IDS.PUBLIC) {
        setPendingRole(normalizedRole);
        window.localStorage.setItem(STORAGE_KEY, normalizedRole);
      }
    }
  }, []);

  React.useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn || !user) {
      setRoleState(ROLE_IDS.PUBLIC);
      return;
    }

    const metadataRole = getRoleFromMetadata(user);
    const nextRole = metadataRole !== ROLE_IDS.PUBLIC ? metadataRole : pendingRole || ROLE_IDS.TENANT;

    setRoleState(nextRole);

    if (metadataRole !== ROLE_IDS.PUBLIC) {
      if (pendingRole || window.localStorage.getItem(STORAGE_KEY)) {
        window.localStorage.removeItem(STORAGE_KEY);
        setPendingRole(null);
      }
    } else if (nextRole !== ROLE_IDS.PUBLIC) {
      user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          role: nextRole,
        },
      }).then(() => {
        // The pending role will be cleaned up on the subsequent render
        // once the user metadata updates and propagates.
      }).catch(() => {
        setPendingRole(nextRole);
      });
    }
  }, [isLoaded, isSignedIn, pendingRole, user]);

  const setRole = React.useCallback((nextRole) => {
    const normalizedRole = normalizeRole(nextRole);
    if (normalizedRole === ROLE_IDS.PUBLIC) {
      setPendingRole(null);
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    setPendingRole(normalizedRole);
    window.localStorage.setItem(STORAGE_KEY, normalizedRole);
  }, []);

  const value = React.useMemo(() => ({ role, pendingRole, setRole }), [role, pendingRole, setRole]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  return React.useContext(PermissionContext);
}
