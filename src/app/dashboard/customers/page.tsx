'use client';

import { useTranslation } from 'react-i18next';

import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { CustomersListContainer } from '@/components/customers/CustomersListContainer';

export default function CustomersPage() {
  const { t } = useTranslation(['customers', 'breadcrumbs']);

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
            label: t('breadcrumbs:customers'),
          },
        ]}
      />

      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </section>

      <CustomersListContainer />
    </div>
  );
}
