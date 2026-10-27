import { CustomerServiceRecordsRoadmap } from '@/components/customer-service-records/roadmap/CustomerServiceRecordsRoadmap';
import { DashboardViewAccessBoundary } from '@/components/dashboard-shell';

export default function CustomerServiceRecordsPage() {
  return (
    <DashboardViewAccessBoundary module="CUSTOMER_SERVICE_RECORDS" requiredOperation="READ">
      <CustomerServiceRecordsRoadmap />
    </DashboardViewAccessBoundary>
  );
}
