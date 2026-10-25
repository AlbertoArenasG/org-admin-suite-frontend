'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

import { CustomerServiceRecordAssetPageHeader } from '@/components/customer-service-records/CustomerServiceRecordAssetPageHeader';
import { CustomerServiceRecordDetailRoute } from '@/components/customer-service-records/CustomerServiceRecordDetailRoute';
import {
  DashboardContentReveal,
  DashboardPageComposition,
  DashboardPageContentScroller,
  useDashboardViewAccess,
} from '@/components/dashboard-shell';
import { useNextDashboardBreadcrumbs } from '@/components/dashboard-shell/migration';
import { ResourceFormSkeleton } from '@/components/resource-form';
import { Button } from '@/components/ui/button';
import {
  fetchBillingCustomerServiceRecordDetail,
  resetBillingCustomerServiceRecordDetail,
} from '@/features/billing-customer-service-records';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { BillingCustomerServiceRecordInvoiceSection } from './BillingCustomerServiceRecordInvoiceSection';
import { BillingCustomerServiceRecordReadOnlySections } from './BillingCustomerServiceRecordReadOnlySections';

export function BillingCustomerServiceRecordDetailPage() {
  const params = useParams<{ recordId: string }>();
  const dispatch = useAppDispatch();
  const { can } = useDashboardViewAccess();
  const { resetSegments, setSegments } = useNextDashboardBreadcrumbs();
  const { t } = useTranslationHydrated('billingCustomerServiceRecords');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const detail = useAppSelector((state) => state.billingCustomerServiceRecords.detail);
  const record = detail.currentRecordId === params.recordId ? detail.record : null;
  const loading =
    !authHydrated ||
    (!record && (detail.currentRecordId !== params.recordId || detail.status === 'loading'));
  const loadError =
    detail.status === 'failed' && detail.currentRecordId === params.recordId ? detail.error : null;
  const synchronizeBreadcrumb = useCallback(
    (serviceNumber: string) => {
      setSegments([
        { label: t('detail.dashboard'), href: '/dashboard', hideOnDesktop: true },
        { label: t('detail.list'), href: '/dashboard/billing/customer-service-records' },
        { label: t('detail.breadcrumb', { folio: serviceNumber }) },
      ]);
    },
    [setSegments, t]
  );

  useEffect(() => {
    if (params.recordId && authHydrated)
      void dispatch(fetchBillingCustomerServiceRecordDetail({ recordId: params.recordId }));
  }, [authHydrated, dispatch, params.recordId]);
  useEffect(
    () => () => {
      dispatch(resetBillingCustomerServiceRecordDetail());
    },
    [dispatch]
  );
  useEffect(() => {
    if (!record) return;
    synchronizeBreadcrumb(record.serviceNumber);
    return resetSegments;
  }, [record, resetSegments, synchronizeBreadcrumb]);

  const navigationItems = [
    { id: 'general-details', label: t('detail.service.title') },
    { id: 'customer-delivery', label: t('detail.customerDelivery.title') },
    { id: 'equipment', label: t('detail.equipment.title') },
    { id: 'documents', label: t('detail.documents.title') },
    { id: 'billing', label: t('detail.billing.title') },
  ];

  return (
    <DashboardPageComposition>
      {record ? (
        <CustomerServiceRecordAssetPageHeader
          asset={record.assets[0]}
          customerName={record.customer.name}
          labels={{
            customer: t('detail.customer'),
            unnamedAsset: t('detail.unnamedAsset'),
            brand: t('detail.brand'),
            model: t('detail.model'),
            identifier: t('detail.identifier'),
          }}
        />
      ) : null}
      <DashboardPageContentScroller padding="default" ref={scrollContainerRef}>
        {loading ? (
          <CustomerServiceRecordDetailRoute
            loading
            navigationItems={navigationItems}
            navigationLabel={t('detail.navigationLabel')}
            scrollContainerRef={scrollContainerRef}
          >
            <ResourceFormSkeleton
              contentSurface={{ base: 'bare', md: 'inset' }}
              density={{ base: 'compact', md: 'comfortable' }}
              dividers="hidden"
              groups={[{ fields: 4, orientation: 'responsive' }]}
              surface={{ base: 'bare', md: 'card' }}
            />
          </CustomerServiceRecordDetailRoute>
        ) : null}
        {loadError ? (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
            <p role="alert">{loadError}</p>
            <Button
              className="mt-4"
              size="sm"
              type="button"
              variant="outline"
              onClick={() =>
                void dispatch(
                  fetchBillingCustomerServiceRecordDetail({ recordId: params.recordId })
                )
              }
            >
              {t('actions.retry')}
            </Button>
          </div>
        ) : null}
        {record ? (
          <DashboardContentReveal>
            <CustomerServiceRecordDetailRoute
              navigationItems={navigationItems}
              navigationLabel={t('detail.navigationLabel')}
              scrollContainerRef={scrollContainerRef}
            >
              <BillingCustomerServiceRecordReadOnlySections record={record} />
              <BillingCustomerServiceRecordInvoiceSection
                canUpdate={can('UPDATE')}
                record={record}
              />
            </CustomerServiceRecordDetailRoute>
          </DashboardContentReveal>
        ) : null}
      </DashboardPageContentScroller>
    </DashboardPageComposition>
  );
}
