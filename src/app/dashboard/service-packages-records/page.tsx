import { ServicePackagesRecordsContainer } from '@/components/servicePackagesRecords/ServicePackagesRecordsContainer';
import { DashboardTableWorkspace, DashboardViewAccessBoundary } from '@/components/dashboard-shell';

export default function ServicePackagesRecordsPage() {
  return (
    <DashboardViewAccessBoundary module="SERVICE_PACKAGES" requiredOperation="READ">
      <DashboardTableWorkspace contentClassName="mx-auto max-w-[1600px]">
        <ServicePackagesRecordsContainer />
      </DashboardTableWorkspace>
    </DashboardViewAccessBoundary>
  );
}
