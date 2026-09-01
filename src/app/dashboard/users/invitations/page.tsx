'use client';

import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { UserRegistrationInvitationsTableContainer } from '@/components/user-registration-invitations/UserRegistrationInvitationsTableContainer';
import { useTranslation } from 'react-i18next';

export default function UserRegistrationInvitationsPage() {
  const { t } = useTranslation(['userRegistrationInvitations', 'breadcrumbs']);

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
            label: t('breadcrumbs:users'),
            href: '/dashboard/users',
            hideOnDesktop: true,
          },
          {
            label: t('breadcrumbs:userRegistrationInvitations'),
          },
        ]}
      />

      <UserRegistrationInvitationsTableContainer />
    </div>
  );
}
