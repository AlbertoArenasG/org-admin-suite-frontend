'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

import {
  DashboardContentReveal,
  DashboardPageComposition,
  DashboardPageContentScroller,
} from '@/components/dashboard-shell';
import { CustomerServiceRecordAssetPageHeader } from '@/components/customer-service-records/CustomerServiceRecordAssetPageHeader';
import { FormReadValue } from '@/components/forms';
import {
  ResourceFormFrame,
  ResourceFormRoute,
  ResourceFormSkeleton,
} from '@/components/resource-form';
import { Button } from '@/components/ui/button';
import {
  fetchBillingCustomerServiceRecordDetail,
  resetBillingCustomerServiceRecordDetail,
} from '@/features/billing-customer-service-records';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

export function BillingCustomerServiceRecordDetailPage() {
  const params = useParams<{ recordId: string }>();
  const dispatch = useAppDispatch();
  const { t } = useTranslationHydrated('billingCustomerServiceRecords');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const detail = useAppSelector((state) => state.billingCustomerServiceRecords.detail);

  useEffect(() => {
    if (params.recordId && authHydrated) {
      void dispatch(fetchBillingCustomerServiceRecordDetail({ recordId: params.recordId }));
    }
  }, [authHydrated, dispatch, params.recordId]);
  useEffect(
    () => () => {
      dispatch(resetBillingCustomerServiceRecordDetail());
    },
    [dispatch]
  );

  const isLoading =
    !authHydrated || detail.currentRecordId !== params.recordId || detail.status === 'loading';
  const loadError = !isLoading && detail.status === 'failed' ? detail.error : null;
  const record = !isLoading && !loadError ? detail.record : null;

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
        {isLoading ? (
          <ResourceFormRoute>
            <ResourceFormSkeleton
              contentSurface={{ base: 'bare', md: 'inset' }}
              density={{ base: 'compact', md: 'comfortable' }}
              dividers="hidden"
              groups={[{ fields: 4, orientation: 'responsive' }]}
              surface={{ base: 'bare', md: 'card' }}
            />
          </ResourceFormRoute>
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
            <ResourceFormRoute>
              <ResourceFormFrame
                contentSurface={{ base: 'bare', md: 'inset' }}
                density={{ base: 'compact', md: 'comfortable' }}
                dividers="hidden"
                headerDensity="compact"
                mode="read"
                surface={{ base: 'bare', md: 'card' }}
                title={t('detail.summaryTitle')}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('table.columns.serviceNumber')}
                    </p>
                    <FormReadValue>{record.serviceNumber}</FormReadValue>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('table.columns.customer')}
                    </p>
                    <FormReadValue>{record.customer.name}</FormReadValue>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('table.columns.serviceType')}
                    </p>
                    <FormReadValue>{record.serviceType.name}</FormReadValue>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('table.columns.billingStatus')}
                    </p>
                    <FormReadValue>{record.billingStatus.name}</FormReadValue>
                  </div>
                </div>
              </ResourceFormFrame>
            </ResourceFormRoute>
          </DashboardContentReveal>
        ) : null}
      </DashboardPageContentScroller>
    </DashboardPageComposition>
  );
}
