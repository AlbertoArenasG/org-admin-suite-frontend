import { BillingCustomerServiceRecordDetailPage } from '@/components/billing-customer-service-records/BillingCustomerServiceRecordDetailPage';
import { DashboardViewAccessBoundary } from '@/components/dashboard-shell';

export default function BillingCustomerServiceRecordPage() {
  return (
    <DashboardViewAccessBoundary module="BILLING_CUSTOMER_SERVICE_RECORDS" requiredOperation="READ">
      <BillingCustomerServiceRecordDetailPage />
    </DashboardViewAccessBoundary>
  );
}
