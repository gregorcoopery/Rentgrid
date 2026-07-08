'use client';

import InspectorDashboard from '@/views/InspectorDashboard.jsx';
import ProtectedDashboard from '@/components/ProtectedDashboard.jsx';

export default function Page() {
  return (
    <ProtectedDashboard route="/inspectors">
      <InspectorDashboard />
    </ProtectedDashboard>
  );
}
