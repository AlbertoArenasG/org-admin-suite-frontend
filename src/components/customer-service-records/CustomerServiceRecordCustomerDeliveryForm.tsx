'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import type { MutationFeedback, MutationRecovery } from '@/components/feedback';
import {
  FormCombobox,
  FormDateInput,
  FormField,
  FormIntervalDisplay,
  FormIntervalInput,
  FormMultiSelect,
  FormReadValue,
  FormValueChips,
} from '@/components/forms';
import {
  ResourceFormActions,
  ResourceFormFrame,
  ResourceFormSection,
  type ResourceFormMode,
} from '@/components/resource-form';
import { showToast } from '@/components/toast';
import { FieldGroup } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type {
  CustomerServiceRecordDetail,
  CustomerServiceRecordOption,
  UpdateCustomerServiceRecordCustomerDeliveryPayload,
} from '@/features/customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import {
  buildCustomerServiceRecordCustomerDeliveryPayload,
  calculateEstimatedDeliveryDate,
  createCustomerServiceRecordCustomerDeliverySchema,
  getCustomerServiceRecordCustomerDeliveryDefaultValues,
  isEstimatedDeliveryDateExplicit,
  type CustomerServiceRecordCustomerDeliveryValues,
} from './customerServiceRecordCustomerDeliverySchema';

const SUCCESS_FEEDBACK_DURATION_MS = 800;

type CustomerServiceRecordCustomerDeliveryFormProps = {
  record: CustomerServiceRecordDetail;
  canUpdate: boolean;
  customers: readonly CustomerServiceRecordOption[];
  customerUsers: readonly CustomerServiceRecordOption[];
  customerUsersCustomerId: string | null;
  customerUsersError: string | null;
  customerUsersLoading: boolean;
  optionsError: string | null;
  optionsLoading: boolean;
  statusPolicies: readonly CustomerServiceRecordOption[];
  notificationPolicies: readonly CustomerServiceRecordOption[];
  onRetryOptions: () => void;
  onCustomerUsersRequired: (customerId: string) => void;
  onSubmit: (
    payload: UpdateCustomerServiceRecordCustomerDeliveryPayload
  ) => Promise<{ message: string | null }>;
};

export function CustomerServiceRecordCustomerDeliveryForm({
  canUpdate,
  customerUsers,
  customerUsersCustomerId,
  customerUsersError,
  customerUsersLoading,
  customers,
  notificationPolicies,
  onCustomerUsersRequired,
  onRetryOptions,
  onSubmit,
  optionsError,
  optionsLoading,
  record,
  statusPolicies,
}: CustomerServiceRecordCustomerDeliveryFormProps) {
  const { t } = useTranslationHydrated('customerServiceRecords');
  const [mode, setMode] = useState<ResourceFormMode>('read');
  const [estimatedDateIsExplicit, setEstimatedDateIsExplicit] = useState(() =>
    isEstimatedDeliveryDateExplicit(record)
  );
  const [mutationFeedback, setMutationFeedback] = useState<MutationFeedback>();
  const [mutationRecovery, setMutationRecovery] = useState<MutationRecovery>();
  const successTimeoutRef = useRef<number | null>(null);
  const form = useForm<CustomerServiceRecordCustomerDeliveryValues>({
    resolver: zodResolver(
      createCustomerServiceRecordCustomerDeliverySchema({
        required: t('detail.errors.required'),
        invalidDate: t('detail.errors.invalidDate'),
        invalidInterval: t('detail.errors.invalidInterval'),
      })
    ),
    defaultValues: getCustomerServiceRecordCustomerDeliveryDefaultValues(record),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const customerId = useWatch({ control: form.control, name: 'customerId' });
  const receivedAt = useWatch({ control: form.control, name: 'receivedAt' });
  const interval = useWatch({ control: form.control, name: 'estimatedDeliveryInterval' });
  const isReadOnly = mode === 'read';
  const isMutationLocked =
    mutationFeedback?.status === 'saving' || mutationFeedback?.status === 'success';
  const availableCustomerUsers = customerUsersCustomerId === customerId ? customerUsers : [];
  const intervalLabels = {
    years: t('form.labels.years'),
    months: t('form.labels.months'),
    weeks: t('form.labels.weeks'),
    days: t('form.labels.days'),
  };

  useEffect(() => {
    form.reset(getCustomerServiceRecordCustomerDeliveryDefaultValues(record));
    setEstimatedDateIsExplicit(isEstimatedDeliveryDateExplicit(record));
  }, [form, record]);

  useEffect(() => {
    if (!canUpdate) setMode('read');
  }, [canUpdate]);

  useEffect(() => {
    if (!isReadOnly && customerId && customerUsersCustomerId !== customerId) {
      onCustomerUsersRequired(customerId);
    }
  }, [customerId, customerUsersCustomerId, isReadOnly, onCustomerUsersRequired]);

  useEffect(() => {
    if (estimatedDateIsExplicit) return;

    form.setValue('estimatedDeliveryAt', calculateEstimatedDeliveryDate(receivedAt, interval), {
      shouldDirty: mode === 'edit',
      shouldValidate: true,
    });
  }, [estimatedDateIsExplicit, form, interval, mode, receivedAt]);

  useEffect(
    () => () => {
      if (successTimeoutRef.current) window.clearTimeout(successTimeoutRef.current);
    },
    []
  );

  const cancel = () => {
    form.reset(getCustomerServiceRecordCustomerDeliveryDefaultValues(record));
    setEstimatedDateIsExplicit(isEstimatedDeliveryDateExplicit(record));
    setMutationFeedback(undefined);
    setMutationRecovery(undefined);
    setMode('read');
  };

  const submit = async (values: CustomerServiceRecordCustomerDeliveryValues) => {
    setMutationRecovery(undefined);
    setMutationFeedback({ status: 'saving', title: t('detail.feedback.saving') });

    try {
      const result = await onSubmit(buildCustomerServiceRecordCustomerDeliveryPayload(values));
      setMutationFeedback({ status: 'success', title: t('detail.feedback.success') });
      showToast({
        duration: 4000,
        title: result.message ?? t('feedback.updated'),
        type: 'success',
      });
      successTimeoutRef.current = window.setTimeout(() => {
        setMode('read');
        setMutationFeedback(undefined);
      }, SUCCESS_FEEDBACK_DURATION_MS);
    } catch (error) {
      setMutationFeedback(undefined);
      setMutationRecovery({
        title: t('detail.feedback.errorTitle'),
        message: getMutationErrorMessage(error, t('feedback.error')),
        guidance: t('detail.feedback.errorGuidance'),
      });
    }
  };

  const optionError = optionsError ? (
    <span className="flex flex-wrap items-center gap-2 text-destructive">
      {optionsError}
      <Button onClick={onRetryOptions} size="sm" type="button" variant="outline">
        {t('actions.retry')}
      </Button>
    </span>
  ) : undefined;

  return (
    <form onSubmit={form.handleSubmit(submit)}>
      <ResourceFormFrame
        contentSurface={{ base: 'bare', md: 'inset' }}
        density={{ base: 'compact', md: 'comfortable' }}
        headerDensity="compact"
        dividers="hidden"
        headerActions={
          canUpdate ? (
            <Button disabled={!isReadOnly} onClick={() => setMode('edit')} size="sm" type="button">
              <Pencil aria-hidden="true" className="size-4" />
              {t('actions.edit')}
            </Button>
          ) : null
        }
        footerActions={
          !isReadOnly ? (
            <ResourceFormActions
              cancelAction={{ label: t('form.actions.cancel'), onClick: cancel }}
              mutationFeedback={mutationFeedback}
              mutationRecovery={mutationRecovery}
              primaryAction={{
                label: t('form.actions.save'),
                loadingLabel: t('detail.feedback.saving'),
              }}
              status={mutationFeedback?.status === 'saving' ? 'saving' : 'idle'}
            />
          ) : null
        }
        mode={mode}
        status={mutationFeedback?.status === 'saving' ? 'saving' : 'idle'}
        surface={{ base: 'bare', md: 'card' }}
        title={t('detail.customerDelivery.title')}
      >
        <ResourceFormSection surface="bare">
          <FieldGroup>
            <Controller
              control={form.control}
              name="customerId"
              render={({ field, fieldState }) => (
                <FormField
                  description={optionError}
                  error={fieldState.error?.message}
                  label={t('form.labels.customer')}
                  orientation="responsive"
                >
                  {isReadOnly ? (
                    <FormReadValue>{record.customer.name}</FormReadValue>
                  ) : (
                    <FormCombobox
                      disabled={isMutationLocked || optionsLoading || Boolean(optionsError)}
                      emptyMessage={t('form.noOptions')}
                      invalid={fieldState.invalid}
                      onValueChange={(value) => {
                        const nextCustomerId = value ?? '';
                        field.onChange(nextCustomerId);
                        form.setValue('customerUserIds', [], {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        if (nextCustomerId) onCustomerUsersRequired(nextCustomerId);
                      }}
                      options={customers}
                      placeholder={t('detail.placeholders.customer')}
                      searchPlaceholder={t('detail.searchOptions')}
                      value={field.value || null}
                    />
                  )}
                </FormField>
              )}
            />
            <Controller
              control={form.control}
              name="customerUserIds"
              render={({ field }) => (
                <FormField
                  description={
                    customerUsersError ? (
                      <span className="flex flex-wrap items-center gap-2 text-destructive">
                        {customerUsersError}
                        {customerId ? (
                          <Button
                            onClick={() => onCustomerUsersRequired(customerId)}
                            size="sm"
                            type="button"
                            variant="outline"
                          >
                            {t('actions.retry')}
                          </Button>
                        ) : null}
                      </span>
                    ) : undefined
                  }
                  label={t('form.labels.customerUsers')}
                  orientation="responsive"
                >
                  {isReadOnly ? (
                    <FormReadValue>
                      <FormValueChips items={record.customer.users.map((user) => user.name)} />
                    </FormReadValue>
                  ) : (
                    <FormMultiSelect
                      disabled={
                        isMutationLocked ||
                        !customerId ||
                        customerUsersLoading ||
                        Boolean(customerUsersError)
                      }
                      emptyMessage={t('form.noOptions')}
                      onValueChange={field.onChange}
                      options={availableCustomerUsers}
                      placeholder={t('detail.placeholders.customerUsers')}
                      searchPlaceholder={t('detail.searchOptions')}
                      value={field.value}
                    />
                  )}
                </FormField>
              )}
            />
          </FieldGroup>
        </ResourceFormSection>
        <Separator />
        <ResourceFormSection surface="bare">
          <FieldGroup>
            <Controller
              control={form.control}
              name="receivedAt"
              render={({ field, fieldState }) => (
                <FormField
                  error={fieldState.error?.message}
                  label={t('form.labels.receivedAt')}
                  orientation="responsive"
                >
                  {isReadOnly ? (
                    <FormReadValue>{formatDate(field.value)}</FormReadValue>
                  ) : (
                    <FormDateInput
                      allowEmpty
                      disabled={isMutationLocked}
                      invalid={fieldState.invalid}
                      invalidDateMessage={t('detail.errors.invalidDate')}
                      onValueChange={field.onChange}
                      openCalendarLabel={t('createWizard.openCalendar')}
                      value={field.value}
                    />
                  )}
                </FormField>
              )}
            />
            <FormField label={t('detail.customerDelivery.interval')} orientation="responsive">
              {isReadOnly ? (
                <FormReadValue>
                  <FormIntervalDisplay labels={intervalLabels} value={interval} />
                </FormReadValue>
              ) : (
                <FormIntervalInput
                  disabled={isMutationLocked}
                  errors={{
                    years: form.formState.errors.estimatedDeliveryInterval?.years?.message,
                    months: form.formState.errors.estimatedDeliveryInterval?.months?.message,
                    weeks: form.formState.errors.estimatedDeliveryInterval?.weeks?.message,
                    days: form.formState.errors.estimatedDeliveryInterval?.days?.message,
                  }}
                  idPrefix="customer-service-record-delivery-interval"
                  labels={intervalLabels}
                  onValueChange={(value) =>
                    form.setValue('estimatedDeliveryInterval', value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  value={interval}
                />
              )}
            </FormField>
            <Controller
              control={form.control}
              name="estimatedDeliveryAt"
              render={({ field, fieldState }) => (
                <FormField
                  error={fieldState.error?.message}
                  label={t('form.labels.estimatedDeliveryAt')}
                  orientation="responsive"
                >
                  {isReadOnly ? (
                    <FormReadValue>{formatDate(field.value)}</FormReadValue>
                  ) : (
                    <FormDateInput
                      allowEmpty
                      disabled={isMutationLocked}
                      invalid={fieldState.invalid}
                      invalidDateMessage={t('detail.errors.invalidDate')}
                      onValueChange={(value) => {
                        setEstimatedDateIsExplicit(Boolean(value));
                        field.onChange(value);
                      }}
                      openCalendarLabel={t('createWizard.openCalendar')}
                      value={field.value}
                    />
                  )}
                </FormField>
              )}
            />
            <Controller
              control={form.control}
              name="deliveredToCustomerAt"
              render={({ field, fieldState }) => (
                <FormField
                  error={fieldState.error?.message}
                  label={t('form.labels.deliveredToCustomerAt')}
                  orientation="responsive"
                >
                  {isReadOnly ? (
                    <FormReadValue>{formatDate(field.value)}</FormReadValue>
                  ) : (
                    <FormDateInput
                      allowEmpty
                      disabled={isMutationLocked}
                      invalid={fieldState.invalid}
                      invalidDateMessage={t('detail.errors.invalidDate')}
                      onValueChange={field.onChange}
                      openCalendarLabel={t('createWizard.openCalendar')}
                      value={field.value}
                    />
                  )}
                </FormField>
              )}
            />
            <Controller
              control={form.control}
              name="statusPolicyId"
              render={({ field }) => (
                <FormField
                  description={optionError}
                  label={t('form.labels.statusPolicy')}
                  orientation="responsive"
                >
                  {isReadOnly ? (
                    <FormReadValue>{getOptionLabel(statusPolicies, field.value)}</FormReadValue>
                  ) : (
                    <FormCombobox
                      allowClear
                      disabled={isMutationLocked || optionsLoading || Boolean(optionsError)}
                      emptyMessage={t('form.noOptions')}
                      onValueChange={(value) => field.onChange(value ?? '')}
                      options={statusPolicies}
                      placeholder={t('detail.placeholders.statusPolicy')}
                      searchPlaceholder={t('detail.searchOptions')}
                      value={field.value || null}
                    />
                  )}
                </FormField>
              )}
            />
            <Controller
              control={form.control}
              name="notificationPolicyId"
              render={({ field }) => (
                <FormField
                  description={optionError}
                  label={t('form.labels.notificationPolicy')}
                  orientation="responsive"
                >
                  {isReadOnly ? (
                    <FormReadValue>
                      {getOptionLabel(notificationPolicies, field.value)}
                    </FormReadValue>
                  ) : (
                    <FormCombobox
                      allowClear
                      disabled={isMutationLocked || optionsLoading || Boolean(optionsError)}
                      emptyMessage={t('form.noOptions')}
                      onValueChange={(value) => field.onChange(value ?? '')}
                      options={notificationPolicies}
                      placeholder={t('detail.placeholders.notificationPolicy')}
                      searchPlaceholder={t('detail.searchOptions')}
                      value={field.value || null}
                    />
                  )}
                </FormField>
              )}
            />
          </FieldGroup>
        </ResourceFormSection>
      </ResourceFormFrame>
    </form>
  );
}

function formatDate(value: string) {
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}/${month}/${year}` : '—';
}

function getOptionLabel(options: readonly CustomerServiceRecordOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? '—';
}

function getMutationErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'string') return error;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
