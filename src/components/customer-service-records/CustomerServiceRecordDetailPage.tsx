'use client';

import { useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  DashboardContentReveal,
  DashboardPageComposition,
  DashboardPageContentScroller,
  useDashboardViewAccess,
} from '@/components/dashboard-shell';
import { useNextDashboardBreadcrumbs } from '@/components/dashboard-shell/migration';
import { ResourceFormRoute, ResourceFormSkeleton } from '@/components/resource-form';
import {
  fetchCustomerServiceRecordDetail,
  fetchCustomerServiceRecordDetailOptions,
  resetCustomerServiceRecordDetail,
  updateCustomerServiceRecordDetails,
  type UpdateCustomerServiceRecordDetailsPayload,
} from '@/features/customer-service-records';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { CustomerServiceRecordGeneralDetailsForm } from './CustomerServiceRecordGeneralDetailsForm';

export function CustomerServiceRecordDetailPage() {
  const params = useParams<{ recordId: string }>();
  const dispatch = useAppDispatch();
  const { can } = useDashboardViewAccess();
  const { resetSegments, setSegments } = useNextDashboardBreadcrumbs();
  const { t } = useTranslation(['customerServiceRecords', 'breadcrumbs']);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const detail = useAppSelector((state) => state.customerServiceRecords.detail);
  const detailOptions = useAppSelector((state) => state.customerServiceRecords.detailOptions);
  const canUpdate = can('UPDATE');
  const synchronizeBreadcrumb = useCallback(
    (serviceNumber: string) => {
      setSegments([
        { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
        {
          label: t('breadcrumbs:customerServiceRecords'),
          href: '/dashboard/customer-service-records',
        },
        { label: t('detail.breadcrumb', { folio: serviceNumber }) },
      ]);
    },
    [setSegments, t]
  );

  useEffect(() => {
    if (!params.recordId || !authHydrated) return;

    void dispatch(fetchCustomerServiceRecordDetail({ recordId: params.recordId }));
    void dispatch(fetchCustomerServiceRecordDetailOptions());
  }, [authHydrated, dispatch, params.recordId]);

  useEffect(
    () => () => {
      dispatch(resetCustomerServiceRecordDetail());
    },
    [dispatch]
  );

  useEffect(() => {
    if (!detail.record) return;

    synchronizeBreadcrumb(detail.record.serviceNumber);

    return resetSegments;
  }, [detail.record, resetSegments, synchronizeBreadcrumb]);

  const isLoading =
    (!authHydrated && Boolean(params.recordId)) ||
    detail.currentRecordId !== params.recordId ||
    (detail.status === 'loading' && detail.currentRecordId === params.recordId);
  const loadError =
    authHydrated && detail.status === 'failed' && detail.currentRecordId === params.recordId
      ? detail.error
      : null;

  const updateDetails = async (payload: UpdateCustomerServiceRecordDetailsPayload) => {
    const result = await dispatch(
      updateCustomerServiceRecordDetails({ recordId: params.recordId, payload })
    ).unwrap();
    return { message: result.message };
  };

  return (
    <DashboardPageComposition>
      <DashboardPageContentScroller padding="default">
        <div className="flex w-full min-w-0 flex-col gap-6">
          {isLoading ? (
            <ResourceFormSkeleton
              className="mx-auto max-w-4xl"
              contentSurface={{ base: 'bare', md: 'inset' }}
              density={{ base: 'compact', md: 'comfortable' }}
              dividers="hidden"
              groups={[{ fields: 4, orientation: 'responsive' }]}
              headerActions={1}
              surface={{ base: 'bare', md: 'card' }}
            />
          ) : null}
          {loadError ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
              <p>{loadError}</p>
              <Button
                className="mt-4"
                onClick={() =>
                  void dispatch(fetchCustomerServiceRecordDetail({ recordId: params.recordId }))
                }
                size="sm"
                type="button"
                variant="outline"
              >
                {t('actions.retry')}
              </Button>
            </div>
          ) : null}
          {!isLoading && !loadError && detail.record ? (
            <DashboardContentReveal>
              <ResourceFormRoute className="mx-auto w-full max-w-4xl">
                <CustomerServiceRecordGeneralDetailsForm
                  canUpdate={canUpdate}
                  onSubmit={updateDetails}
                  record={detail.record}
                  onRetryServiceTypes={() =>
                    void dispatch(fetchCustomerServiceRecordDetailOptions())
                  }
                  serviceTypes={detailOptions.serviceTypes}
                  serviceTypesError={detailOptions.error}
                  serviceTypesLoading={detailOptions.status === 'loading'}
                />
              </ResourceFormRoute>
            </DashboardContentReveal>
          ) : null}
          {!isLoading && !loadError && !detail.record ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              {t('detail.notFound')}
            </div>
          ) : null}
        </div>
      </DashboardPageContentScroller>
    </DashboardPageComposition>
  );
}
