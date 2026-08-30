'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { useAuthorization } from '@/features/auth';

export default function CustomerServiceRecordEditPage() {
  const { recordId } = useParams<{ recordId: string }>();
  const { t } = useTranslation(['customerServiceRecords', 'breadcrumbs']);
  const { hasPermission } = useAuthorization();
  const allowed = hasPermission('CUSTOMER_SERVICE_RECORDS', 'UPDATE');

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageBreadcrumbs
        segments={[
          { label: t('breadcrumbs:dashboard'), href: '/dashboard' },
          {
            label: t('breadcrumbs:customerServiceRecords'),
            href: '/dashboard/customer-service-records',
          },
          { label: recordId, href: `/dashboard/customer-service-records/${recordId}` },
          { label: t('edit.title') },
        ]}
      />
      <section className="rounded-3xl border border-border/60 bg-card p-6">
        <h1 className="text-xl font-semibold">{t('edit.title')}</h1>
        {!allowed ? <p className="mt-2 text-muted-foreground">{t('edit.restricted')}</p> : null}
      </section>
    </div>
  );
}
