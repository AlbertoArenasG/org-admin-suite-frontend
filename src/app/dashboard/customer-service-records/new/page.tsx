'use client';

import { useTranslation } from 'react-i18next';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { useAuthorization } from '@/features/auth';

export default function CustomerServiceRecordCreatePage() {
  const { t } = useTranslation(['customerServiceRecords', 'breadcrumbs']);
  const { hasPermission } = useAuthorization();
  const allowed = hasPermission('CUSTOMER_SERVICE_RECORDS', 'CREATE');

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageBreadcrumbs
        segments={[
          { label: t('breadcrumbs:dashboard'), href: '/dashboard' },
          {
            label: t('breadcrumbs:customerServiceRecords'),
            href: '/dashboard/customer-service-records',
          },
          { label: t('create.title') },
        ]}
      />
      <section className="rounded-3xl border border-border/60 bg-card p-6">
        <h1 className="text-xl font-semibold">{t('create.title')}</h1>
        {!allowed ? <p className="mt-2 text-muted-foreground">{t('create.restricted')}</p> : null}
      </section>
    </div>
  );
}
