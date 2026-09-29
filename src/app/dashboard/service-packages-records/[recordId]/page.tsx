import { DashboardViewAccessBoundary } from '@/components/dashboard-shell';
import { ServicePackageRecordDetailPage } from '@/components/servicePackagesRecords/ServicePackageRecordDetailPage';

export default function ServicePackageRecordDetailRoutePage() {
  return (
    <DashboardViewAccessBoundary module="SERVICE_PACKAGES" requiredOperation="READ">
      <ServicePackageRecordDetailPage />
    </DashboardViewAccessBoundary>
  );
}
