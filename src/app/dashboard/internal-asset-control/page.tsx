'use client';

import { useTranslation } from 'react-i18next';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { useAuthorization } from '@/features/auth';
import { InternalAssetControlPlaceholder } from '@/components/internal-asset-control/InternalAssetControlPlaceholder';
import { InternalAssetControlTableContainer } from '@/components/internal-asset-control/InternalAssetControlTableContainer';

export default function InternalAssetControlPage() {
  const { t } = useTranslation(['internalAssetControl', 'breadcrumbs']);
  const { hasPermission } = useAuthorization();
  const canRead = hasPermission('INTERNAL_ASSET_MAINTENANCE_RECORDS', 'READ');

  return (
    <div className="flex flex-1 flex-col gap-6">
      <DashboardPageHeader
        segments={[
          { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
          { label: t('breadcrumbs:internalAssetControl') },
        ]}
      />

      {canRead ? (
        <InternalAssetControlTableContainer />
      ) : (
        <InternalAssetControlPlaceholder
          title={t('list.title')}
          description={t('list.description')}
          restrictedMessage={t('list.readRestricted')}
          allowed={canRead}
        />
      )}
    </div>
  );
}
