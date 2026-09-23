import { CustomerServiceRecordsContainer } from '@/components/customer-service-records/CustomerServiceRecordsContainer';
import { DashboardTableWorkspace, DashboardViewAccessBoundary } from '@/components/dashboard-shell';

export default function CustomerServiceRecordsPage() {
  return (
    <DashboardViewAccessBoundary module="CUSTOMER_SERVICE_RECORDS" requiredOperation="READ">
      <DashboardTableWorkspace contentClassName="mx-auto max-w-[1600px]">
        <CustomerServiceRecordsContainer />
      </DashboardTableWorkspace>
    </DashboardViewAccessBoundary>
  );
}
