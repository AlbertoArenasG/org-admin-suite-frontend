'use client';

import { useTranslation } from 'react-i18next';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { ServicePackagesRecordsTableContainer } from '@/components/servicePackagesRecords/ServicePackagesRecordsTableContainer';

export default function ServicePackagesRecordsPage() {
  const { t } = useTranslation(['servicePackagesRecords', 'breadcrumbs']);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <DashboardPageHeader
        segments={[
          {
            label: t('breadcrumbs:dashboard'),
            href: '/dashboard',
            hideOnDesktop: true,
          },
          {
            label: t('breadcrumbs:servicePackagesRecords'),
          },
        ]}
      />

      <ServicePackagesRecordsTableContainer />
    </div>
  );
}
