'use client';

import { useCallback, useEffect, useRef } from 'react';
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
import { ResourceFormFrame, ResourceFormSkeleton } from '@/components/resource-form';
import {
  fetchCustomerServiceRecordDetail,
  fetchCustomerServiceRecordDetailOptions,
  fetchCustomerServiceRecordCustomerDeliveryOptions,
  fetchCustomerServiceRecordCustomerUsers,
  fetchCustomerServiceRecordProviderOptions,
  resetCustomerServiceRecordDetail,
  updateCustomerServiceRecordCustomerDelivery,
  updateCustomerServiceRecordDetails,
  updateCustomerServiceRecordAsset,
  updateCustomerServiceRecordProvider,
  updateCustomerServiceRecordDocument,
  uploadCustomerServiceRecordFiles,
  type CustomerServiceRecordDetail,
  type CustomerServiceRecordDocumentType,
  type UpdateCustomerServiceRecordCustomerDeliveryPayload,
  type UpdateCustomerServiceRecordDetailsPayload,
  type UpdateCustomerServiceRecordAssetPayload,
  type UpdateCustomerServiceRecordProviderPayload,
} from '@/features/customer-service-records';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { CustomerServiceRecordGeneralDetailsForm } from './CustomerServiceRecordGeneralDetailsForm';
import { CustomerServiceRecordCustomerDeliveryForm } from './CustomerServiceRecordCustomerDeliveryForm';
import { CustomerServiceRecordEquipmentForm } from './CustomerServiceRecordEquipmentForm';
import {
  CustomerServiceRecordAssetDocumentsSection,
  type CustomerServiceRecordAssetDocumentType,
} from './CustomerServiceRecordAssetDocumentsSection';
import { CustomerServiceRecordProviderFollowUpForm } from './CustomerServiceRecordProviderFollowUpForm';
import { CustomerServiceRecordDocumentsSection } from './CustomerServiceRecordDocumentsSection';
import { CustomerServiceRecordDetailRoute } from './CustomerServiceRecordDetailRoute';
import { CustomerServiceRecordTimeline } from './CustomerServiceRecordTimeline';

export function CustomerServiceRecordDetailPage() {
  const params = useParams<{ recordId: string }>();
  const dispatch = useAppDispatch();
  const pageContentScrollerRef = useRef<HTMLDivElement>(null);
  const { can } = useDashboardViewAccess();
  const { resetSegments, setSegments } = useNextDashboardBreadcrumbs();
  const { t } = useTranslation(['customerServiceRecords', 'breadcrumbs']);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const detail = useAppSelector((state) => state.customerServiceRecords.detail);
  const detailOptions = useAppSelector((state) => state.customerServiceRecords.detailOptions);
  const customerDeliveryOptions = useAppSelector(
    (state) => state.customerServiceRecords.detailCustomerDeliveryOptions
  );
  const customerUsers = useAppSelector((state) => state.customerServiceRecords.detailCustomerUsers);
  const providerOptions = useAppSelector(
    (state) => state.customerServiceRecords.detailProviderOptions
  );
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
    void dispatch(fetchCustomerServiceRecordCustomerDeliveryOptions());
    void dispatch(fetchCustomerServiceRecordProviderOptions());
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

  const updateCustomerDelivery = async (
    payload: UpdateCustomerServiceRecordCustomerDeliveryPayload
  ) => {
    const result = await dispatch(
      updateCustomerServiceRecordCustomerDelivery({ recordId: params.recordId, payload })
    ).unwrap();
    return { message: result.message };
  };

  const updateAsset = async (payload: UpdateCustomerServiceRecordAssetPayload) => {
    const result = await dispatch(
      updateCustomerServiceRecordAsset({ recordId: params.recordId, payload })
    ).unwrap();
    return { message: result.message };
  };

  const updateAssetDocument = async ({
    asset,
    documentType,
    existingFileIds,
    files,
  }: {
    asset: CustomerServiceRecordDetail['assets'][number];
    documentType: CustomerServiceRecordAssetDocumentType;
    existingFileIds: string[];
    files: File[];
  }) => {
    const uploadedFiles = await dispatch(uploadCustomerServiceRecordFiles({ files })).unwrap();
    const fileIds = [...existingFileIds, ...uploadedFiles.map((file) => file.fileId)];
    const result = await dispatch(
      updateCustomerServiceRecordAsset({
        recordId: params.recordId,
        payload: {
          assetId: asset.assetId,
          intakeConditionFileIds: documentType === 'intake-condition' ? fileIds : undefined,
          deliveryConditionFileIds: documentType === 'delivery-condition' ? fileIds : undefined,
          reportFileIds: documentType === 'reports' ? fileIds : undefined,
        },
      })
    ).unwrap();

    return { message: result.message, record: result.record };
  };

  const updateProvider = async (payload: UpdateCustomerServiceRecordProviderPayload) => {
    const result = await dispatch(
      updateCustomerServiceRecordProvider({ recordId: params.recordId, payload })
    ).unwrap();
    return { message: result.message };
  };

  const updateDocument = async ({
    documentType,
    existingFileIds,
    files,
    referenceNumber,
  }: {
    documentType: CustomerServiceRecordDocumentType;
    existingFileIds: string[];
    files: File[];
    referenceNumber?: string | null;
  }) => {
    const uploadedFiles = await dispatch(uploadCustomerServiceRecordFiles({ files })).unwrap();
    return dispatch(
      updateCustomerServiceRecordDocument({
        recordId: params.recordId,
        payload: {
          documentType,
          fileIds: [...existingFileIds, ...uploadedFiles.map((file) => file.fileId)],
          ...(documentType !== 'other-files' ? { referenceNumber: referenceNumber ?? null } : {}),
        },
      })
    ).unwrap();
  };

  return (
    <DashboardPageComposition>
      <DashboardPageContentScroller padding="default" ref={pageContentScrollerRef}>
        <div className="flex w-full min-w-0 flex-col gap-6">
          {isLoading ? (
            <CustomerServiceRecordDetailRoute loading scrollContainerRef={pageContentScrollerRef}>
              <ResourceFormSkeleton
                contentSurface={{ base: 'bare', md: 'inset' }}
                density={{ base: 'compact', md: 'comfortable' }}
                dividers="hidden"
                groups={[{ fields: 4, orientation: 'responsive' }]}
                headerActions={1}
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
              <CustomerServiceRecordDetailRoute
                navigationSupplement={<CustomerServiceRecordTimeline record={detail.record} />}
                scrollContainerRef={pageContentScrollerRef}
              >
                <section className="scroll-mt-24 md:scroll-mt-5" id="general-details" tabIndex={-1}>
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
                </section>
                <section
                  className="scroll-mt-24 md:scroll-mt-5"
                  id="customer-delivery"
                  tabIndex={-1}
                >
                  <CustomerServiceRecordCustomerDeliveryForm
                    canUpdate={canUpdate}
                    customerUsers={customerUsers.users}
                    customerUsersCustomerId={customerUsers.customerId}
                    customerUsersError={customerUsers.error}
                    customerUsersLoading={customerUsers.status === 'loading'}
                    customers={customerDeliveryOptions.customers}
                    notificationPolicies={customerDeliveryOptions.notificationPolicies}
                    onCustomerUsersRequired={(customerId) =>
                      void dispatch(fetchCustomerServiceRecordCustomerUsers({ customerId }))
                    }
                    onRetryOptions={() =>
                      void dispatch(fetchCustomerServiceRecordCustomerDeliveryOptions())
                    }
                    onSubmit={updateCustomerDelivery}
                    optionsError={customerDeliveryOptions.error}
                    optionsLoading={customerDeliveryOptions.status === 'loading'}
                    record={detail.record}
                    statusPolicies={customerDeliveryOptions.statusPolicies}
                  />
                </section>
                <section className="scroll-mt-24 md:scroll-mt-5" id="equipment" tabIndex={-1}>
                  {detail.record.assets[0] ? (
                    <ResourceFormFrame
                      contentSurface={{ base: 'bare', md: 'inset' }}
                      density={{ base: 'compact', md: 'comfortable' }}
                      description={t('detail.equipment.description')}
                      dividers="hidden"
                      headerDensity="compact"
                      mode="read"
                      surface={{ base: 'bare', md: 'card' }}
                      title={t('detail.equipment.title')}
                    >
                      <CustomerServiceRecordEquipmentForm
                        asset={detail.record.assets[0]}
                        canUpdate={canUpdate}
                        onSubmit={updateAsset}
                      />
                      <CustomerServiceRecordAssetDocumentsSection
                        asset={detail.record.assets[0]}
                        canUpdate={canUpdate}
                        onSubmit={updateAssetDocument}
                      />
                    </ResourceFormFrame>
                  ) : (
                    <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
                      <h2 className="font-semibold text-foreground">
                        {t('detail.equipment.title')}
                      </h2>
                      <p className="mt-2">{t('detail.equipment.unavailable')}</p>
                    </div>
                  )}
                </section>
                <section className="scroll-mt-24 md:scroll-mt-5" id="documents" tabIndex={-1}>
                  <CustomerServiceRecordDocumentsSection
                    canUpdate={canUpdate}
                    onSubmit={updateDocument}
                    record={detail.record}
                  />
                </section>
                <section
                  className="scroll-mt-24 md:scroll-mt-5"
                  id="provider-follow-up"
                  tabIndex={-1}
                >
                  <CustomerServiceRecordProviderFollowUpForm
                    canUpdate={canUpdate}
                    notificationPolicies={providerOptions.notificationPolicies}
                    onRetryOptions={() =>
                      void dispatch(fetchCustomerServiceRecordProviderOptions())
                    }
                    onSubmit={updateProvider}
                    optionsError={providerOptions.error}
                    optionsLoading={providerOptions.status === 'loading'}
                    providers={providerOptions.providers}
                    recipientGroups={providerOptions.recipientGroups}
                    record={detail.record}
                    statusPolicies={providerOptions.statusPolicies}
                  />
                </section>
              </CustomerServiceRecordDetailRoute>
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
