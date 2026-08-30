'use client';

import { useTranslation } from 'react-i18next';
import { CustomerServiceRecordsTableContainer } from '@/components/customer-service-records/CustomerServiceRecordsTableContainer';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthorization } from '@/features/auth';

export default function CustomerServiceRecordsPage() {
  const { t } = useTranslation(['customerServiceRecords', 'breadcrumbs']);
  const { hasPermission } = useAuthorization();
  const canRead = hasPermission('CUSTOMER_SERVICE_RECORDS', 'READ');

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
              { label: t('breadcrumbs:customerServiceRecords') },
            ]}
          />
        </div>
      </header>

      {canRead ? (
        <CustomerServiceRecordsTableContainer />
      ) : (
        <section className="rounded-3xl border border-border/60 bg-card p-6">
          <h1 className="text-xl font-semibold">{t('list.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('list.readRestricted')}</p>
        </section>
      )}
    </div>
  );
}
