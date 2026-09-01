'use client';

import { useTranslation } from 'react-i18next';

import { UsersTableContainer } from '@/components/users2/UsersTableContainer';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';

export default function UsersPage() {
  const { t } = useTranslation(['users', 'breadcrumbs']);

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
            label: t('breadcrumbs:users'),
          },
        ]}
      />

      <UsersTableContainer />
    </div>
  );
}
