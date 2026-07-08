'use client';

import AgentDashboard from '@/views/AgentDashboard.jsx';
import ProtectedDashboard from '@/components/ProtectedDashboard.jsx';

export default function Page() {
  return (
    <ProtectedDashboard route="/agent-dashboard">
      <AgentDashboard />
    </ProtectedDashboard>
  );
}
