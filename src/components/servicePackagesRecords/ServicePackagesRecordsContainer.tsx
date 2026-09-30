'use client';

import { DashboardContentReveal } from '@/components/dashboard-shell';
import { ServicePackagesRecordsTable } from './ServicePackagesRecordsTable';
import { useServicePackageRecordRowActions } from './useServicePackageRecordRowActions';
import { useServicePackagesRecordsListController } from './useServicePackagesRecordsListController';

export function ServicePackagesRecordsContainer() {
  const controller = useServicePackagesRecordsListController();
  const { rowActions, deletionDialog } = useServicePackageRecordRowActions({
    onDeleted: controller.refetch,
  });

  return (
    <DashboardContentReveal>
      <ServicePackagesRecordsTable controller={controller} rowActions={rowActions} />
      {deletionDialog}
    </DashboardContentReveal>
  );
}
