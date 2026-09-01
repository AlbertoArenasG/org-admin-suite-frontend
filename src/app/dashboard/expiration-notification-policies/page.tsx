'use client';

import { ExpirationNotificationPoliciesTableContainer } from '@/components/expiration-notification-policies/ExpirationNotificationPoliciesTableContainer';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

export default function ExpirationNotificationPoliciesPage() {
  const { t } = useTranslationHydrated(['expirationNotificationPolicies', 'breadcrumbs']);

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
            label: t('breadcrumbs:expirationNotificationPolicies'),
          },
        ]}
      />
      <ExpirationNotificationPoliciesTableContainer />
    </div>
  );
}
