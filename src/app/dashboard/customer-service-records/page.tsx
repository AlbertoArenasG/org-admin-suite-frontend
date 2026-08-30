'use client';
import { useTranslation } from 'react-i18next';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { useAuthorization } from '@/features/auth';
export default function CustomerServiceRecordsPage() {
  const { t } = useTranslation(['customerServiceRecords', 'breadcrumbs']);
  const { hasPermission } = useAuthorization();
  const allowed = hasPermission('CUSTOMER_SERVICE_RECORDS', 'READ');
  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageBreadcrumbs
        segments={[
          { label: t('breadcrumbs:dashboard'), href: '/dashboard' },
          { label: t('breadcrumbs:customerServiceRecords') },
        ]}
      />
      <section className="rounded-3xl border border-border/60 bg-card p-6">
        <h1 className="text-xl font-semibold">{t('list.title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {allowed ? t('list.description') : t('list.readRestricted')}
        </p>
      </section>
    </div>
  );
}
