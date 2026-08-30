'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { CustomerServiceRecordDetailView } from '@/components/customer-service-records/CustomerServiceRecordDetailView';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { useAuthorization } from '@/features/auth';

export default function CustomerServiceRecordDetailPage() {
  const { recordId } = useParams<{ recordId: string }>();
  const { t } = useTranslation(['customerServiceRecords', 'breadcrumbs']);
  const { hasPermission } = useAuthorization();
  const allowed = hasPermission('CUSTOMER_SERVICE_RECORDS', 'READ');

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageBreadcrumbs
        segments={[
          { label: t('breadcrumbs:dashboard'), href: '/dashboard' },
          {
            label: t('breadcrumbs:customerServiceRecords'),
            href: '/dashboard/customer-service-records',
          },
          { label: recordId },
        ]}
      />
      {allowed ? (
        <CustomerServiceRecordDetailView
          recordId={recordId}
          canUpdate={hasPermission('CUSTOMER_SERVICE_RECORDS', 'UPDATE')}
          canDelete={hasPermission('CUSTOMER_SERVICE_RECORDS', 'DELETE')}
        />
      ) : (
        <section className="rounded-3xl border border-border/60 bg-card p-6">
          <h1 className="text-xl font-semibold">{t('detail.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('detail.restricted')}</p>
        </section>
      )}
    </div>
  );
}
