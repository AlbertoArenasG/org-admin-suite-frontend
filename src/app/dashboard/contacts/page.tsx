'use client';

import { useTranslation } from 'react-i18next';

import { ContactsTableContainer } from '@/components/contacts/ContactsTableContainer';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';

export default function ContactsPage() {
  const { t } = useTranslation(['contacts', 'breadcrumbs']);

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
            label: t('breadcrumbs:contacts'),
          },
        ]}
      />

      <ContactsTableContainer />
    </div>
  );
}
