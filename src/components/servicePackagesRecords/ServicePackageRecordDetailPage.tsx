'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  DashboardContentReveal,
  DashboardPageComposition,
  DashboardPageContentScroller,
} from '@/components/dashboard-shell';
import { useNextDashboardBreadcrumbs } from '@/components/dashboard-shell/migration';
import { ResourceFormSkeleton, type ResourceFormNavigationItem } from '@/components/resource-form';
import {
  fetchServicePackageRecordDetail,
  resetServicePackageRecordDetail,
} from '@/features/servicePackagesRecords';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { ServicePackageRecordDetailRoute } from './ServicePackageRecordDetailRoute';
import { ServicePackageRecordAdditionalInformationSection } from './ServicePackageRecordAdditionalInformationSection';
import {
  ServicePackageRecordContactSection,
  ServicePackageRecordEquipmentSection,
  ServicePackageRecordServiceInformationSection,
  ServicePackageRecordSignaturesSection,
} from './ServicePackageRecordReadOnlySections';

const navigationIds = [
  ['service-information', 'general.serviceAndMetadata'],
  ['contact', 'general.contact'],
  ['equipment', 'equipment.title'],
  ['additional-information', 'general.additionalInformation'],
  ['signatures', 'general.signatures'],
] as const;

export function ServicePackageRecordDetailPage() {
  const params = useParams<{ recordId: string }>();
  const dispatch = useAppDispatch();
  const pageContentScrollerRef = useRef<HTMLDivElement>(null);
  const { resetSegments, setSegments } = useNextDashboardBreadcrumbs();
  const { t } = useTranslation(['servicePackagesRecords', 'breadcrumbs']);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const detail = useAppSelector((state) => state.servicePackagesRecords.detail);
  const navigationItems = useMemo<readonly ResourceFormNavigationItem[]>(
    () =>
      navigationIds.map(([id, key]) => ({
        id,
        label: t(`detail.${key}`),
      })),
    [t]
  );
  const navigationLabel = t('detail.navigationLabel');
  const synchronizeBreadcrumb = useCallback(
    (serviceOrder: string) => {
      setSegments([
        { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
        {
          label: t('breadcrumbs:servicePackagesRecords'),
          href: '/dashboard/service-packages-records',
        },
        { label: t('detail.breadcrumb', { folio: serviceOrder }) },
      ]);
    },
    [setSegments, t]
  );

  useEffect(() => {
    if (!params.recordId || !authHydrated) return;

    void dispatch(fetchServicePackageRecordDetail({ recordId: params.recordId }));
  }, [authHydrated, dispatch, params.recordId]);

  useEffect(
    () => () => {
      dispatch(resetServicePackageRecordDetail());
    },
    [dispatch]
  );

  useEffect(() => {
    if (!detail.record) return;

    synchronizeBreadcrumb(detail.record.serviceOrder);
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
  const isNotFound = loadError?.status === 404;

  return (
    <DashboardPageComposition>
      <DashboardPageContentScroller padding="default" ref={pageContentScrollerRef}>
        <div className="flex w-full min-w-0 flex-col gap-6">
          {isLoading ? (
            <ServicePackageRecordDetailRoute
              loading
              navigationItems={navigationItems}
              navigationLabel={navigationLabel}
              scrollContainerRef={pageContentScrollerRef}
            >
              <ResourceFormSkeleton
                contentSurface={{ base: 'bare', md: 'inset' }}
                density={{ base: 'compact', md: 'comfortable' }}
                dividers="hidden"
                groups={[{ fields: 5, orientation: 'responsive' }]}
                surface={{ base: 'bare', md: 'card' }}
              />
              <ResourceFormSkeleton
                contentSurface={{ base: 'bare', md: 'inset' }}
                density={{ base: 'compact', md: 'comfortable' }}
                dividers="hidden"
                groups={[
                  { fields: 11, orientation: 'vertical' },
                  { fields: 1, orientation: 'vertical' },
                ]}
                surface={{ base: 'bare', md: 'card' }}
              />
              <ResourceFormSkeleton
                contentSurface={{ base: 'bare', md: 'inset' }}
                density={{ base: 'compact', md: 'comfortable' }}
                dividers="hidden"
                groups={[{ fields: 3, orientation: 'responsive' }]}
                surface={{ base: 'bare', md: 'card' }}
              />
            </ServicePackageRecordDetailRoute>
          ) : null}
          {loadError && !isNotFound ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
              <p>{loadError.message}</p>
              <Button
                className="mt-4"
                onClick={() =>
                  void dispatch(fetchServicePackageRecordDetail({ recordId: params.recordId }))
                }
                size="sm"
                type="button"
                variant="outline"
              >
                {t('actions.retry')}
              </Button>
            </div>
          ) : null}
          {isNotFound ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              {t('detail.notFound')}
            </div>
          ) : null}
          {!isLoading && !loadError && detail.record ? (
            <DashboardContentReveal>
              <ServicePackageRecordDetailRoute
                navigationItems={navigationItems}
                navigationLabel={navigationLabel}
                scrollContainerRef={pageContentScrollerRef}
              >
                <div className="space-y-5">
                  <section
                    className="scroll-mt-24 md:scroll-mt-5"
                    id="service-information"
                    tabIndex={-1}
                  >
                    <ServicePackageRecordServiceInformationSection record={detail.record} />
                  </section>
                  <section className="scroll-mt-24 md:scroll-mt-5" id="contact" tabIndex={-1}>
                    <ServicePackageRecordContactSection record={detail.record} />
                  </section>
                </div>
                <section className="scroll-mt-24 md:scroll-mt-5" id="equipment" tabIndex={-1}>
                  <ServicePackageRecordEquipmentSection record={detail.record} />
                </section>
                <section
                  className="scroll-mt-24 md:scroll-mt-5"
                  id="additional-information"
                  tabIndex={-1}
                >
                  <ServicePackageRecordAdditionalInformationSection record={detail.record} />
                </section>
                <section className="scroll-mt-24 md:scroll-mt-5" id="signatures" tabIndex={-1}>
                  <ServicePackageRecordSignaturesSection record={detail.record} />
                </section>
              </ServicePackageRecordDetailRoute>
            </DashboardContentReveal>
          ) : null}
        </div>
      </DashboardPageContentScroller>
    </DashboardPageComposition>
  );
}
