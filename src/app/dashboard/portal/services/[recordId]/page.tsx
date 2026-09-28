'use client';

import { ClientAccessCustomerServiceRecordDetailPage } from '@/components/customer-service-records-client-access';
import { DashboardViewAccessBoundary } from '@/components/dashboard-shell';

export default function ClientAccessCustomerServiceRecordDetailRoutePage() {
  return (
    <DashboardViewAccessBoundary
      module="CUSTOMER_SERVICE_RECORDS_CLIENT_ACCESS"
      requiredOperation="READ"
    >
      <ClientAccessCustomerServiceRecordDetailPage />
    </DashboardViewAccessBoundary>
  );
}
