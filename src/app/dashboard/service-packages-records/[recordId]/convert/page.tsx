import { DashboardViewAccessBoundary } from '@/components/dashboard-shell';
import { ServicePackageRecordConversionPage } from '@/components/servicePackagesRecords/ServicePackageRecordConversionPage';

export default function ServicePackageRecordConvertRoute() {
  return (
    <DashboardViewAccessBoundary module="SERVICE_PACKAGES" requiredOperation="READ">
      <DashboardViewAccessBoundary module="SERVICE_PACKAGES" requiredOperation="CONVERT">
        <ServicePackageRecordConversionPage />
      </DashboardViewAccessBoundary>
    </DashboardViewAccessBoundary>
  );
}
