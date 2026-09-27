'use client';

import { useTranslation } from 'react-i18next';

import { ResourceFormRoute } from '@/components/resource-form';

type CustomerServiceRecordDetailRouteProps = {
  children: React.ReactNode;
};

/** Owns the record navigation while ResourceFormRoute owns layout and scroll behavior. */
export function CustomerServiceRecordDetailRoute({
  children,
}: CustomerServiceRecordDetailRouteProps) {
  const { t } = useTranslation('customerServiceRecords');

  return (
    <ResourceFormRoute
      className="mx-auto w-full max-w-6xl"
      navigation={{
        ariaLabel: t('detail.navigationLabel'),
        items: [
          { id: 'general-details', label: t('detail.general.title') },
          { id: 'customer-delivery', label: t('detail.customerDelivery.title') },
          { id: 'equipment', label: t('detail.equipment.title') },
          { id: 'provider-follow-up', label: t('detail.provider.title') },
          { id: 'documents', label: t('detail.documents.title') },
        ],
        sticky: true,
        variant: { base: 'tabs', md: 'sidebar' },
      }}
    >
      <div className="space-y-5">{children}</div>
    </ResourceFormRoute>
  );
}
