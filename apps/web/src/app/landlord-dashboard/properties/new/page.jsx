'use client';

import ProtectedDashboard from '@/components/ProtectedDashboard.jsx';
import PropertyCreatePage from '@/views/PropertyCreatePage.jsx';

export default function Page() {
  return (
    <ProtectedDashboard route="/landlord-dashboard">
      <PropertyCreatePage />
    </ProtectedDashboard>
  );
}
