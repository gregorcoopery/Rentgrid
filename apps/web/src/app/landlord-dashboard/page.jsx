'use client';

import LandlordDashboard from '@/views/LandlordDashboard.jsx';
import ProtectedDashboard from '@/components/ProtectedDashboard.jsx';

export default function Page() {
  return (
    <ProtectedDashboard route="/landlord-dashboard">
      <LandlordDashboard />
    </ProtectedDashboard>
  );
}
