'use client';

import { useTranslation } from 'react-i18next';

import { RolesTableContainer } from '@/components/roles/RolesTableContainer';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';

export default function RolesPage() {
  const { t } = useTranslation(['roles', 'breadcrumbs']);

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
            label: t('breadcrumbs:roles'),
          },
        ]}
      />

      <RolesTableContainer />
    </div>
  );
}
