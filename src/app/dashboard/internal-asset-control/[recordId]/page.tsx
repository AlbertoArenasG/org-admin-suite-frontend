'use client';

import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthorization } from '@/features/auth';
import { InternalAssetControlPlaceholder } from '@/components/internal-asset-control/InternalAssetControlPlaceholder';
import { InternalAssetControlDetailView } from '@/components/internal-asset-control/InternalAssetControlDetailView';

export default function InternalAssetControlDetailPage() {
  const { t } = useTranslation(['internalAssetControl', 'breadcrumbs']);
  const params = useParams<{ recordId: string }>();
  const { hasPermission } = useAuthorization();
  const canRead = hasPermission('INTERNAL_ASSET_MAINTENANCE_RECORDS', 'READ');
  const canUpdate = hasPermission('INTERNAL_ASSET_MAINTENANCE_RECORDS', 'UPDATE');
  const canDelete = hasPermission('INTERNAL_ASSET_MAINTENANCE_RECORDS', 'DELETE');
  const recordId = typeof params.recordId === 'string' ? params.recordId : '';

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
              {
                label: t('breadcrumbs:internalAssetControl'),
                href: '/dashboard/internal-asset-control',
                hideOnDesktop: true,
              },
              { label: t('detail.title') },
            ]}
          />
        </div>
      </header>

      {canRead ? (
        <InternalAssetControlDetailView
          recordId={recordId}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      ) : (
        <InternalAssetControlPlaceholder
          title={t('detail.title')}
          description={t('detail.description')}
          restrictedMessage={t('detail.restricted')}
          allowed={canRead}
        />
      )}
    </div>
  );
}
