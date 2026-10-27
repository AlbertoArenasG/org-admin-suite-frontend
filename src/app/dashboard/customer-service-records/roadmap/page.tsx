import { DashboardViewAccessBoundary, DashboardTableWorkspace } from '@/components/dashboard-shell';
import { CustomerServiceRecordsRoadmap } from '@/components/customer-service-records/roadmap/CustomerServiceRecordsRoadmap';

export default function CustomerServiceRecordsRoadmapPage() {
  return (
    <DashboardViewAccessBoundary module="CUSTOMER_SERVICE_RECORDS" requiredOperation="READ">
      <DashboardTableWorkspace>
        <CustomerServiceRecordsRoadmap />
      </DashboardTableWorkspace>
    </DashboardViewAccessBoundary>
  );
}
