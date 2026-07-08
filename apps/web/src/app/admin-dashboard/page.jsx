'use client';

import SuperAdminDashboard from '@/views/SuperAdminDashboard.jsx';
import ProtectedDashboard from '@/components/ProtectedDashboard.jsx';

export default function Page() {
  return (
    <ProtectedDashboard route="/admin-dashboard">
      <SuperAdminDashboard />
    </ProtectedDashboard>
  );
}
