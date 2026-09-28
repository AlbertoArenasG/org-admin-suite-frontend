'use client';

import { useTranslation } from 'react-i18next';
import type { RefObject } from 'react';

import { ResourceFormRoute } from '@/components/resource-form';
import { CustomerServiceRecordCompactNavigation } from './CustomerServiceRecordCompactNavigation';

type CustomerServiceRecordDetailRouteProps = {
  children: React.ReactNode;
  loading?: boolean;
  navigationSupplement?: React.ReactNode;
  scrollContainerRef: RefObject<HTMLElement | null>;
};

/** Owns the record navigation while ResourceFormRoute owns layout and scroll behavior. */
export function CustomerServiceRecordDetailRoute({
  children,
  loading = false,
  navigationSupplement,
  scrollContainerRef,
}: CustomerServiceRecordDetailRouteProps) {
  const { t } = useTranslation('customerServiceRecords');
  const navigationItems = [
    { id: 'general-details', label: t('detail.general.title') },
    { id: 'customer-delivery', label: t('detail.customerDelivery.title') },
    { id: 'equipment', label: t('detail.equipment.title') },
    { id: 'documents', label: t('detail.documents.title') },
    { id: 'provider-follow-up', label: t('detail.provider.title') },
  ];
  const navigationLabel = t('detail.navigationLabel');

  return (
    <ResourceFormRoute
      className="mx-auto w-full max-w-[90rem]"
      compactNavigation={
        <CustomerServiceRecordCompactNavigation
          ariaLabel={navigationLabel}
          items={navigationItems}
          scrollContainerRef={scrollContainerRef}
        />
      }
      navigationSupplement={navigationSupplement}
      navigation={{
        ariaLabel: navigationLabel,
        className: 'md:hidden lg:flex',
        items: navigationItems,
        loading,
        scrollContainerRef,
        sticky: true,
        variant: { base: 'tabs', md: 'sidebar' },
      }}
    >
      <div className="space-y-5">{children}</div>
    </ResourceFormRoute>
  );
}
