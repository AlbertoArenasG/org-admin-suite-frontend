'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { CustomerServiceRecordForm } from '@/components/customer-service-records/CustomerServiceRecordForm';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { fetchCustomerOptions } from '@/features/customers';
import {
  createCustomerServiceRecord,
  fetchCustomerServiceRecordById,
  fetchCustomerServiceRecordOptions,
  updateCustomerServiceRecord,
  type CustomerServiceRecordMutationPayload,
} from '@/features/customer-service-records';
import type { CustomerServiceRecordDetail } from '@/features/customer-service-records';
import { fetchExpirationNotificationPolicyOptions } from '@/features/expiration-notification-policies';
import { fetchExpirationStatusPolicyOptions } from '@/features/expiration-status-policies';
import { fetchRecipientGroups } from '@/features/recipient-groups';
import { fetchCustomerRelatedUserOptions } from '@/features/user-customer-relationships/userCustomerRelationshipsThunks';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';

interface CustomerServiceRecordFormPageContainerProps {
  mode: 'create' | 'edit';
  recordId?: string;
}

function dateOnly(value: string | null) {
  return value?.slice(0, 10) ?? null;
}

function buildUpdatePayload(
  record: CustomerServiceRecordDetail,
  payload: CustomerServiceRecordMutationPayload
) {
  const original: CustomerServiceRecordMutationPayload = {
    serviceTypeCode: record.serviceType.serviceTypeCode,
    requestedAt: dateOnly(record.requestedAt) ?? '',
    observations: record.observations,
    customer: {
      customerId: record.customer.customerId,
      customerUserIds: record.customer.users.map((user) => user.userId),
    },
    assets: record.assets.map((asset) => ({
      name: asset.name,
      identifier: asset.identifier,
      brand: asset.brand,
      model: asset.model,
      serialNumber: asset.serialNumber,
      observations: asset.observations,
    })),
    customerDelivery: {
      receivedAt: dateOnly(record.customerDelivery.receivedAt),
      estimatedDeliveryInterval: record.customerDelivery.estimatedDeliveryInterval,
      estimatedDeliveryAt: dateOnly(record.customerDelivery.estimatedDeliveryAt),
      deliveredToCustomerAt: dateOnly(record.customerDelivery.deliveredToCustomerAt),
      statusPolicyId: record.customerDelivery.statusPolicyId,
      notificationPolicyId: record.customerDelivery.notificationPolicyId,
    },
    provider: record.provider
      ? {
          providerId: record.provider.providerId,
          deliveredToProviderAt: dateOnly(record.provider.deliveredToProviderAt),
          estimatedReturnInterval: record.provider.estimatedReturnInterval,
          estimatedReturnAt: dateOnly(record.provider.estimatedReturnAt),
          returnedFromProviderAt: dateOnly(record.provider.returnedFromProviderAt),
          statusPolicyId: record.provider.statusPolicyId,
          notificationPolicyId: record.provider.notificationPolicyId,
          followUp: record.provider.followUp,
        }
      : null,
    operationalStatus: record.operationalStatus.code,
  };
  return Object.fromEntries(
    Object.entries(payload).filter(
      ([key, value]) =>
        JSON.stringify(value) !==
        JSON.stringify(original[key as keyof CustomerServiceRecordMutationPayload])
    )
  ) as Partial<CustomerServiceRecordMutationPayload>;
}

export function CustomerServiceRecordFormPageContainer({
  mode,
  recordId,
}: CustomerServiceRecordFormPageContainerProps) {
  const { t } = useTranslation(['customerServiceRecords', 'breadcrumbs']);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const feature = useAppSelector((state) => state.customerServiceRecords);
  const customerOptions = useAppSelector((state) => state.customers.options);
  const recipientGroups = useAppSelector((state) => state.recipientGroups.list);
  const statusPolicies = useAppSelector((state) => state.expirationStatusPolicies.catalogs.options);
  const notificationPolicies = useAppSelector(
    (state) => state.expirationNotificationPolicies.catalogs.options
  );
  const relatedUserOptions = useAppSelector(
    (state) => state.userCustomerRelationships.relatedOptions
  );
  const record = feature.detail.item;
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  useEffect(() => {
    if (feature.options.status === 'idle') void dispatch(fetchCustomerServiceRecordOptions());
    if (customerOptions.status === 'idle') void dispatch(fetchCustomerOptions());
    if (recipientGroups.status === 'idle') {
      void dispatch(
        fetchRecipientGroups({ limit: 100, itemsPerPage: 100, filters: { status: 'ACTIVE' } })
      );
    }
    void dispatch(fetchExpirationStatusPolicyOptions({ status: 'ACTIVE' }));
    void dispatch(fetchExpirationNotificationPolicyOptions({ status: 'ACTIVE' }));
  }, [customerOptions.status, dispatch, feature.options.status, recipientGroups.status]);

  useEffect(() => {
    if (mode === 'edit' && recordId && feature.detail.currentRecordId !== recordId) {
      void dispatch(fetchCustomerServiceRecordById({ recordId }));
    }
  }, [dispatch, feature.detail.currentRecordId, mode, recordId]);

  const loadCustomerUsers = useCallback(
    (customerId: string | null) => {
      setSelectedCustomerId(customerId);
      if (!customerId) return;
      void dispatch(
        fetchCustomerRelatedUserOptions({
          customerId,
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    if (
      record?.customer.customerId &&
      relatedUserOptions.customerId !== record.customer.customerId
    ) {
      loadCustomerUsers(record.customer.customerId);
    }
  }, [loadCustomerUsers, record?.customer.customerId, relatedUserOptions.customerId]);

  const submit = async (payload: CustomerServiceRecordMutationPayload) => {
    try {
      if (mode === 'create') {
        const result = await dispatch(createCustomerServiceRecord(payload)).unwrap();
        showSnackbar({ message: result.message ?? t('feedback.created'), severity: 'success' });
        router.replace(
          `/dashboard/customer-service-records/${result.record.customerServiceRecordId}`
        );
        return;
      }
      if (!recordId) return;
      if (!record) return;
      const result = await dispatch(
        updateCustomerServiceRecord({ recordId, payload: buildUpdatePayload(record, payload) })
      ).unwrap();
      showSnackbar({ message: result.message ?? t('feedback.updated'), severity: 'success' });
      router.replace(
        `/dashboard/customer-service-records/${result.record.customerServiceRecordId}`
      );
    } catch (error) {
      showSnackbar({
        message: typeof error === 'string' ? error : t('feedback.error'),
        severity: 'error',
      });
    }
  };

  const isLoadingRecord = mode === 'edit' && feature.detail.status === 'loading';
  const recordReady = mode === 'create' || (feature.detail.status === 'succeeded' && record);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <PageBreadcrumbs
          segments={[
            { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
            {
              label: t('breadcrumbs:customerServiceRecords'),
              href: '/dashboard/customer-service-records',
            },
            { label: mode === 'create' ? t('create.title') : t('edit.title') },
          ]}
        />
      </header>
      {isLoadingRecord ? (
        <p className="text-sm text-muted-foreground">{t('form.loading')}</p>
      ) : null}
      {mode === 'edit' && feature.detail.error ? (
        <p className="text-sm text-destructive">{feature.detail.error}</p>
      ) : null}
      {recordReady ? (
        <CustomerServiceRecordForm
          key={record?.customerServiceRecordId ?? 'create'}
          mode={mode}
          record={record}
          serviceTypes={feature.options.serviceTypes}
          customers={customerOptions.items.map((item) => ({
            value: item.id,
            label: item.companyName,
          }))}
          customerUsers={(relatedUserOptions.customerId === selectedCustomerId
            ? relatedUserOptions.users
            : []
          ).map((user) => ({ value: user.id, label: user.fullName, description: user.email }))}
          providers={feature.options.providers}
          statusPolicies={statusPolicies.map((item) => ({
            value: item.expirationStatusPolicyId,
            label: item.name,
          }))}
          notificationPolicies={notificationPolicies.map((item) => ({
            value: item.expirationNotificationPolicyId,
            label: item.name,
          }))}
          recipientGroups={recipientGroups.items.map((item) => ({
            value: item.recipientGroupId,
            label: item.name,
            description: item.code,
          }))}
          onCustomerChange={loadCustomerUsers}
          onSubmit={submit}
          onCancel={() => router.back()}
          isSubmitting={
            feature.mutations.createStatus === 'loading' ||
            feature.mutations.updateStatus === 'loading'
          }
          labels={{
            general: t('form.sections.general'),
            serviceType: t('form.labels.serviceType'),
            requestedAt: t('form.labels.requestedAt'),
            operationalStatus: t('form.labels.operationalStatus'),
            observations: t('form.labels.observations'),
            observationsPlaceholder: t('form.placeholders.observations'),
            customer: t('form.labels.customer'),
            customerUsers: t('form.labels.customerUsers'),
            asset: t('form.sections.asset'),
            name: t('form.labels.assetName'),
            identifier: t('form.labels.identifier'),
            brand: t('form.labels.brand'),
            model: t('form.labels.model'),
            serialNumber: t('form.labels.serialNumber'),
            assetObservations: t('form.labels.assetObservations'),
            customerCommitment: t('form.sections.customerCommitment'),
            receivedAt: t('form.labels.receivedAt'),
            estimatedDeliveryAt: t('form.labels.estimatedDeliveryAt'),
            deliveredToCustomerAt: t('form.labels.deliveredToCustomerAt'),
            estimatedInterval: t('form.labels.estimatedInterval'),
            statusPolicy: t('form.labels.statusPolicy'),
            notificationPolicy: t('form.labels.notificationPolicy'),
            provider: t('form.sections.provider'),
            useProvider: t('form.labels.useProvider'),
            deliveredToProviderAt: t('form.labels.deliveredToProviderAt'),
            estimatedReturnAt: t('form.labels.estimatedReturnAt'),
            returnedFromProviderAt: t('form.labels.returnedFromProviderAt'),
            followUp: t('form.labels.followUp'),
            recipients: t('form.labels.recipients'),
            copyRecipients: t('form.labels.copyRecipients'),
            addRule: t('form.actions.addRule'),
            removeRule: t('form.actions.removeRule'),
            providerDisabled: t('form.hints.providerDisabled'),
            years: t('form.labels.years'),
            months: t('form.labels.months'),
            weeks: t('form.labels.weeks'),
            days: t('form.labels.days'),
            noOptions: t('form.noOptions'),
            pending: t('statuses.pending'),
            inProgress: t('statuses.inProgress'),
            completed: t('statuses.completed'),
            cancelled: t('statuses.cancelled'),
            cancel: t('form.actions.cancel'),
            create: t('form.actions.create'),
            save: t('form.actions.save'),
          }}
        />
      ) : null}
    </div>
  );
}
