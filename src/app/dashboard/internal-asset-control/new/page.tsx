'use client';

import { useTranslation } from 'react-i18next';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthorization } from '@/features/auth';
import { InternalAssetControlPlaceholder } from '@/components/internal-asset-control/InternalAssetControlPlaceholder';

export default function InternalAssetControlCreatePage() {
  const { t } = useTranslation(['internalAssetControl', 'breadcrumbs']);
  const { hasPermission } = useAuthorization();
  const canCreate = hasPermission('INTERNAL_ASSET_MAINTENANCE_RECORDS', 'CREATE');

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
              { label: t('create.title') },
            ]}
          />
        </div>
      </header>

      <InternalAssetControlPlaceholder
        title={t('create.title')}
        description={t('create.description')}
        restrictedMessage={t('create.restricted')}
        allowed={canCreate}
      />
    </div>
  );
}
