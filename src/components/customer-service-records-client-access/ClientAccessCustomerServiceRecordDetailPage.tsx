'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { CustomerServiceRecordDetailRoute } from '@/components/customer-service-records/CustomerServiceRecordDetailRoute';
import {
  DashboardContentReveal,
  DashboardPageComposition,
  DashboardPageContentScroller,
} from '@/components/dashboard-shell';
import { useNextDashboardBreadcrumbs } from '@/components/dashboard-shell/migration';
import { ResourceFormSkeleton, type ResourceFormNavigationItem } from '@/components/resource-form';
import {
  fetchClientAccessCustomerServiceRecordDetail,
  resetClientAccessCustomerServiceRecordDetail,
} from '@/features/customer-service-records-client-access';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Button } from '@/components/ui/button';
import {
  ClientAccessCustomerServiceRecordCustomerDeliverySection,
  ClientAccessCustomerServiceRecordEquipmentSection,
  ClientAccessCustomerServiceRecordGeneralDetailsSection,
} from './ClientAccessCustomerServiceRecordReadOnlySections';
import { ClientAccessCustomerServiceRecordDocumentsSection } from './ClientAccessCustomerServiceRecordDocumentsSection';
import { ClientAccessCustomerServiceRecordTimeline } from './ClientAccessCustomerServiceRecordTimeline';

const navigationIds = [
  ['general-details', 'general'],
  ['customer-delivery', 'customerDelivery'],
  ['equipment', 'equipment'],
  ['documents', 'documents'],
] as const;

export function ClientAccessCustomerServiceRecordDetailPage() {
  const params = useParams<{ recordId: string }>();
  const dispatch = useAppDispatch();
  const pageContentScrollerRef = useRef<HTMLDivElement>(null);
  const { resetSegments, setSegments } = useNextDashboardBreadcrumbs();
  const { t } = useTranslation(['clientAccessServices', 'breadcrumbs']);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const detail = useAppSelector((state) => state.customerServiceRecordsClientAccess.detail);
  const navigationItems: readonly ResourceFormNavigationItem[] = navigationIds.map(([id, key]) => ({
    id,
    label: t(`detail.sections.${key}`),
  }));
  const navigationLabel = t('detail.navigationLabel');
  const synchronizeBreadcrumb = useCallback(
    (folio: string) => {
      setSegments([
        { label: t('breadcrumbs:portal'), href: '/dashboard' },
        { label: t('breadcrumbs:portalServices'), href: '/dashboard/portal/services' },
        { label: t('detail.breadcrumb', { folio }) },
      ]);
    },
    [setSegments, t]
  );

  useEffect(() => {
    if (!params.recordId || !authHydrated) return;

    void dispatch(fetchClientAccessCustomerServiceRecordDetail({ recordId: params.recordId }));
  }, [authHydrated, dispatch, params.recordId]);

  useEffect(
    () => () => {
      dispatch(resetClientAccessCustomerServiceRecordDetail());
    },
    [dispatch]
  );

  useEffect(() => {
    if (!detail.record) return;

    synchronizeBreadcrumb(detail.record.serviceNumberDisplay);

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

  return (
    <DashboardPageComposition>
      <DashboardPageContentScroller padding="default" ref={pageContentScrollerRef}>
        <div className="flex w-full min-w-0 flex-col gap-6">
          {isLoading ? (
            <CustomerServiceRecordDetailRoute
              loading
              navigationItems={navigationItems}
              navigationLabel={navigationLabel}
              scrollContainerRef={pageContentScrollerRef}
            >
              <ResourceFormSkeleton
                contentSurface={{ base: 'bare', md: 'inset' }}
                density={{ base: 'compact', md: 'comfortable' }}
                dividers="hidden"
                groups={[{ fields: 4, orientation: 'responsive' }]}
                headerActions={0}
                surface={{ base: 'bare', md: 'card' }}
              />
            </CustomerServiceRecordDetailRoute>
          ) : null}
          {loadError ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
              <p>{loadError}</p>
              <Button
                className="mt-4"
                onClick={() =>
                  void dispatch(
                    fetchClientAccessCustomerServiceRecordDetail({ recordId: params.recordId })
                  )
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
              <CustomerServiceRecordDetailRoute
                navigationSupplement={
                  <ClientAccessCustomerServiceRecordTimeline record={detail.record} />
                }
                navigationItems={navigationItems}
                navigationLabel={navigationLabel}
                scrollContainerRef={pageContentScrollerRef}
              >
                <section className="scroll-mt-24 md:scroll-mt-5" id="general-details" tabIndex={-1}>
                  <ClientAccessCustomerServiceRecordGeneralDetailsSection record={detail.record} />
                </section>
                <section
                  className="scroll-mt-24 md:scroll-mt-5"
                  id="customer-delivery"
                  tabIndex={-1}
                >
                  <ClientAccessCustomerServiceRecordCustomerDeliverySection
                    record={detail.record}
                  />
                </section>
                <section className="scroll-mt-24 md:scroll-mt-5" id="equipment" tabIndex={-1}>
                  <ClientAccessCustomerServiceRecordEquipmentSection
                    asset={detail.record.assets[0] ?? null}
                  />
                </section>
                <section className="scroll-mt-24 md:scroll-mt-5" id="documents" tabIndex={-1}>
                  <ClientAccessCustomerServiceRecordDocumentsSection record={detail.record} />
                </section>
              </CustomerServiceRecordDetailRoute>
            </DashboardContentReveal>
          ) : null}
        </div>
      </DashboardPageContentScroller>
    </DashboardPageComposition>
  );
}
