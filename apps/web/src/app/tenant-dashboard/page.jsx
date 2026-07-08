'use client';

import TenantDashboard from '@/views/TenantDashboard.jsx';
import ProtectedDashboard from '@/components/ProtectedDashboard.jsx';

export default function Page() {
  return (
    <ProtectedDashboard route="/tenant-dashboard">
      <TenantDashboard />
    </ProtectedDashboard>
  );
}
