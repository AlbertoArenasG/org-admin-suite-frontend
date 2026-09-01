'use client';

import { ExpirationStatusPoliciesTableContainer } from '@/components/expiration-status-policies/ExpirationStatusPoliciesTableContainer';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

export default function ExpirationStatusPoliciesPage() {
  const { t } = useTranslationHydrated(['expirationStatusPolicies', 'breadcrumbs']);

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
            label: t('breadcrumbs:expirationStatusPolicies'),
          },
        ]}
      />

      <ExpirationStatusPoliciesTableContainer />
    </div>
  );
}
