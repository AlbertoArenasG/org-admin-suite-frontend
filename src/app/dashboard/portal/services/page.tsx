'use client';

import { DashboardTableWorkspace, DashboardViewAccessBoundary } from '@/components/dashboard-shell';
import { ClientAccessServicesContainer } from '@/components/customer-service-records-client-access';

export default function ClientAccessServicesPage() {
  return (
    <DashboardViewAccessBoundary
      module="CUSTOMER_SERVICE_RECORDS_CLIENT_ACCESS"
      requiredOperation="READ"
    >
      <DashboardTableWorkspace contentClassName="mx-auto max-w-[1600px]">
        <ClientAccessServicesContainer />
      </DashboardTableWorkspace>
    </DashboardViewAccessBoundary>
  );
}
