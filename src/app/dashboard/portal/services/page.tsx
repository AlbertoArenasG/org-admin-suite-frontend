'use client';

import { DashboardTableWorkspace } from '@/components/dashboard-shell';
import { ClientAccessServicesContainer } from '@/components/customer-service-records-client-access';

export default function ClientAccessServicesPage() {
  return (
    <DashboardTableWorkspace contentClassName="mx-auto max-w-[1600px]">
      <ClientAccessServicesContainer />
    </DashboardTableWorkspace>
  );
}
