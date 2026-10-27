import { CustomerServiceRecordsRoadmap } from '@/components/customer-service-records/roadmap/CustomerServiceRecordsRoadmap';
import { DashboardTableWorkspace, DashboardViewAccessBoundary } from '@/components/dashboard-shell';

export default function CustomerServiceRecordsPage() {
  return (
    <DashboardViewAccessBoundary module="CUSTOMER_SERVICE_RECORDS" requiredOperation="READ">
      <DashboardTableWorkspace>
        <CustomerServiceRecordsRoadmap />
      </DashboardTableWorkspace>
    </DashboardViewAccessBoundary>
  );
}
