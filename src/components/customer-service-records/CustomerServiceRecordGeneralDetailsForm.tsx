'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  FormCombobox,
  FormDateInput,
  FormField,
  FormReadValue,
  type FormSelectOption,
} from '@/components/forms';
import type { MutationFeedback, MutationRecovery } from '@/components/feedback';
import {
  ResourceFormActions,
  ResourceFormFrame,
  ResourceFormSection,
  type ResourceFormMode,
} from '@/components/resource-form';
import { showToast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import type {
  CustomerServiceRecordDetail,
  CustomerServiceRecordOperationalStatus,
  CustomerServiceRecordOption,
  UpdateCustomerServiceRecordDetailsPayload,
} from '@/features/customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import {
  createCustomerServiceRecordGeneralDetailsSchema,
  getCustomerServiceRecordGeneralDetailsDefaultValues,
  type CustomerServiceRecordGeneralDetailsValues,
} from './customerServiceRecordGeneralDetailsSchema';

const SUCCESS_FEEDBACK_DURATION_MS = 800;

type CustomerServiceRecordGeneralDetailsFormProps = {
  record: CustomerServiceRecordDetail;
  canUpdate: boolean;
  serviceTypes: readonly CustomerServiceRecordOption[];
  serviceTypesLoading: boolean;
  serviceTypesError: string | null;
  onRetryServiceTypes: () => void;
  onSubmit: (
    payload: UpdateCustomerServiceRecordDetailsPayload
  ) => Promise<{ message: string | null }>;
};

export function CustomerServiceRecordGeneralDetailsForm({
  canUpdate,
  onSubmit,
  onRetryServiceTypes,
  record,
  serviceTypesError,
  serviceTypes,
  serviceTypesLoading,
}: CustomerServiceRecordGeneralDetailsFormProps) {
  const { t } = useTranslationHydrated('customerServiceRecords');
  const [mode, setMode] = useState<ResourceFormMode>('read');
  const [mutationFeedback, setMutationFeedback] = useState<MutationFeedback>();
  const [mutationRecovery, setMutationRecovery] = useState<MutationRecovery>();
  const successTimeoutRef = useRef<number | null>(null);
  const form = useForm<CustomerServiceRecordGeneralDetailsValues>({
    resolver: zodResolver(
      createCustomerServiceRecordGeneralDetailsSchema({
        required: t('detail.errors.required'),
        invalidDate: t('detail.errors.invalidDate'),
      })
    ),
    defaultValues: getCustomerServiceRecordGeneralDetailsDefaultValues(record),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const isReadOnly = mode === 'read';
  const isMutationLocked =
    mutationFeedback?.status === 'saving' || mutationFeedback?.status === 'success';

  useEffect(() => {
    form.reset(getCustomerServiceRecordGeneralDetailsDefaultValues(record));
  }, [form, record]);

  useEffect(() => {
    if (!canUpdate) {
      setMode('read');
    }
  }, [canUpdate]);

  useEffect(
    () => () => {
      if (successTimeoutRef.current) {
        window.clearTimeout(successTimeoutRef.current);
      }
    },
    []
  );

  const cancel = () => {
    form.reset(getCustomerServiceRecordGeneralDetailsDefaultValues(record));
    setMutationFeedback(undefined);
    setMutationRecovery(undefined);
    setMode('read');
  };

  const submit = async (values: CustomerServiceRecordGeneralDetailsValues) => {
    setMutationRecovery(undefined);
    setMutationFeedback({ status: 'saving', title: t('detail.feedback.saving') });

    try {
      const result = await onSubmit({
        serviceTypeCode: values.serviceTypeCode,
        requestedAt: values.requestedAt,
        operationalStatus: values.operationalStatus,
        observations: values.observations.trim() || null,
      });
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

  const operationalStatusOptions: FormSelectOption[] = [
    { value: 'PENDING', label: t('statuses.pending') },
    { value: 'IN_PROGRESS', label: t('statuses.inProgress') },
    { value: 'COMPLETED', label: t('statuses.completed') },
    { value: 'CANCELLED', label: t('statuses.cancelled') },
  ];

  return (
    <form onSubmit={form.handleSubmit(submit)}>
      <ResourceFormFrame
        contentSurface={{ base: 'bare', md: 'inset' }}
        density={{ base: 'compact', md: 'comfortable' }}
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
        title={t('detail.general.title')}
        description={t('detail.general.description')}
      >
        <ResourceFormSection surface="bare">
          <FieldGroup>
            <Controller
              control={form.control}
              name="serviceTypeCode"
              render={({ field, fieldState }) => (
                <FormField
                  description={
                    serviceTypesError ? (
                      <span className="flex flex-wrap items-center gap-2 text-destructive">
                        {serviceTypesError}
                        <Button
                          onClick={onRetryServiceTypes}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          {t('actions.retry')}
                        </Button>
                      </span>
                    ) : undefined
                  }
                  error={fieldState.error?.message}
                  htmlFor={isReadOnly ? undefined : 'customer-service-record-service-type'}
                  label={t('form.labels.serviceType')}
                  orientation="responsive"
                >
                  {isReadOnly ? (
                    <FormReadValue>{record.serviceType.name}</FormReadValue>
                  ) : (
                    <FormCombobox
                      disabled={
                        isMutationLocked || serviceTypesLoading || Boolean(serviceTypesError)
                      }
                      emptyMessage={t('form.noOptions')}
                      id="customer-service-record-service-type"
                      invalid={fieldState.invalid}
                      onValueChange={(value) => field.onChange(value ?? '')}
                      options={serviceTypes}
                      placeholder={t('detail.placeholders.serviceType')}
                      searchPlaceholder={t('detail.searchOptions')}
                      value={field.value || null}
                    />
                  )}
                </FormField>
              )}
            />
            <Controller
              control={form.control}
              name="requestedAt"
              render={({ field, fieldState }) => (
                <FormField
                  error={fieldState.error?.message}
                  htmlFor={isReadOnly ? undefined : 'customer-service-record-requested-at'}
                  label={t('form.labels.requestedAt')}
                  orientation="responsive"
                >
                  {isReadOnly ? (
                    <FormReadValue>{formatDate(field.value)}</FormReadValue>
                  ) : (
                    <FormDateInput
                      disabled={isMutationLocked}
                      id="customer-service-record-requested-at"
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
              name="operationalStatus"
              render={({ field, fieldState }) => (
                <FormField
                  error={fieldState.error?.message}
                  htmlFor={isReadOnly ? undefined : 'customer-service-record-operational-status'}
                  label={t('form.labels.operationalStatus')}
                  orientation="responsive"
                >
                  {isReadOnly ? (
                    <FormReadValue>{record.operationalStatus.name}</FormReadValue>
                  ) : (
                    <FormCombobox
                      disabled={isMutationLocked}
                      emptyMessage={t('form.noOptions')}
                      id="customer-service-record-operational-status"
                      invalid={fieldState.invalid}
                      onValueChange={(value) =>
                        field.onChange(value as CustomerServiceRecordOperationalStatus)
                      }
                      options={operationalStatusOptions}
                      placeholder={t('detail.placeholders.operationalStatus')}
                      searchPlaceholder={t('detail.searchOptions')}
                      value={field.value}
                    />
                  )}
                </FormField>
              )}
            />
            <Controller
              control={form.control}
              name="observations"
              render={({ field, fieldState }) => (
                <FormField
                  error={fieldState.error?.message}
                  htmlFor={isReadOnly ? undefined : 'customer-service-record-observations'}
                  label={t('detail.labels.generalObservations')}
                  orientation="responsive"
                >
                  {isReadOnly ? (
                    <FormReadValue>{field.value.trim() || '—'}</FormReadValue>
                  ) : (
                    <Textarea
                      aria-invalid={fieldState.invalid || undefined}
                      disabled={isMutationLocked}
                      id="customer-service-record-observations"
                      placeholder={t('form.placeholders.observations')}
                      {...field}
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

function getMutationErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'string') return error;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
