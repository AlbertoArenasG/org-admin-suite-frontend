'use client';

import { DashboardViewAccessBoundary } from '@/components/dashboard-shell';
import { ClientAccessServicesRoadmap } from '@/components/customer-service-records-client-access/roadmap/ClientAccessServicesRoadmap';

export default function ClientAccessServicesPage() {
  return (
    <DashboardViewAccessBoundary
      module="CUSTOMER_SERVICE_RECORDS_CLIENT_ACCESS"
      requiredOperation="READ"
    >
      <ClientAccessServicesRoadmap />
    </DashboardViewAccessBoundary>
  );
}
