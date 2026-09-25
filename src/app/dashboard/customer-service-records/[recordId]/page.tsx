import { DashboardViewAccessBoundary } from '@/components/dashboard-shell';
import { CustomerServiceRecordDetailPage } from '@/components/customer-service-records/CustomerServiceRecordDetailPage';

export default function CustomerServiceRecordDetailRoute() {
  return (
    <DashboardViewAccessBoundary module="CUSTOMER_SERVICE_RECORDS" requiredOperation="READ">
      <CustomerServiceRecordDetailPage />
    </DashboardViewAccessBoundary>
  );
}
