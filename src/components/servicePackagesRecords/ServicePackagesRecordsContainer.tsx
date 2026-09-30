'use client';

import { DashboardContentReveal } from '@/components/dashboard-shell';
import { ServicePackagesRecordsTable } from './ServicePackagesRecordsTable';
import { useServicePackagesRecordsListController } from './useServicePackagesRecordsListController';

export function ServicePackagesRecordsContainer() {
  const controller = useServicePackagesRecordsListController();

  return (
    <DashboardContentReveal>
      <ServicePackagesRecordsTable controller={controller} />
    </DashboardContentReveal>
  );
}
