import { BillingCustomerServiceRecordsContainer } from '@/components/billing-customer-service-records/BillingCustomerServiceRecordsContainer';
import { DashboardTableWorkspace, DashboardViewAccessBoundary } from '@/components/dashboard-shell';

export default function BillingCustomerServiceRecordsPage() {
  return (
    <DashboardViewAccessBoundary module="BILLING_CUSTOMER_SERVICE_RECORDS" requiredOperation="READ">
      <DashboardTableWorkspace contentClassName="mx-auto max-w-[1600px]">
        <BillingCustomerServiceRecordsContainer />
      </DashboardTableWorkspace>
    </DashboardViewAccessBoundary>
  );
}
