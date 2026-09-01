'use client';

import { useTranslation } from 'react-i18next';

import { RecipientGroupsTableContainer } from '@/components/recipient-groups/RecipientGroupsTableContainer';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';

export default function RecipientGroupsPage() {
  const { t } = useTranslation(['recipientGroups', 'breadcrumbs']);

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
            label: t('breadcrumbs:recipientGroups'),
          },
        ]}
      />

      <RecipientGroupsTableContainer />
    </div>
  );
}
