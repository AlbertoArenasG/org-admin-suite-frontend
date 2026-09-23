'use client';

import { useTranslation } from 'react-i18next';
import { CustomerServiceRecordsContainer } from '@/components/customer-service-records/CustomerServiceRecordsContainer';
import { DashboardTableWorkspace } from '@/components/dashboard-shell';
import { useAuthorization } from '@/features/auth';

export default function CustomerServiceRecordsPage() {
  const { t } = useTranslation('customerServiceRecords');
  const { hasPermission } = useAuthorization();
  const canRead = hasPermission('CUSTOMER_SERVICE_RECORDS', 'READ');

  return (
    <DashboardTableWorkspace contentClassName="mx-auto max-w-[1600px]">
      {canRead ? (
        <CustomerServiceRecordsContainer />
      ) : (
        <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm">
          <h1 className="text-xl font-semibold">{t('list.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('list.readRestricted')}</p>
        </section>
      )}
    </DashboardTableWorkspace>
  );
}
