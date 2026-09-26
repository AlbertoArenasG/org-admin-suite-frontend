'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import type { MutationFeedback, MutationRecovery } from '@/components/feedback';
import { FormField, FormReadValue } from '@/components/forms';
import {
  ResourceFormActions,
  ResourceFormFrame,
  ResourceFormSection,
  type ResourceFormMode,
} from '@/components/resource-form';
import { showToast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  buildCustomerServiceRecordAssetUpdatePayload,
  type CustomerServiceRecordDetail,
  type UpdateCustomerServiceRecordAssetPayload,
} from '@/features/customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import {
  createCustomerServiceRecordEquipmentSchema,
  getCustomerServiceRecordEquipmentDefaultValues,
  type CustomerServiceRecordEquipmentValues,
} from './customerServiceRecordEquipmentSchema';

const SUCCESS_FEEDBACK_DURATION_MS = 800;

type CustomerServiceRecordAsset = CustomerServiceRecordDetail['assets'][number];

type CustomerServiceRecordEquipmentFormProps = {
  asset: CustomerServiceRecordAsset;
  canUpdate: boolean;
  onSubmit: (
    payload: UpdateCustomerServiceRecordAssetPayload
  ) => Promise<{ message: string | null }>;
};

export function CustomerServiceRecordEquipmentForm({
  asset,
  canUpdate,
  onSubmit,
}: CustomerServiceRecordEquipmentFormProps) {
  const { t } = useTranslationHydrated('customerServiceRecords');
  const [mode, setMode] = useState<ResourceFormMode>('read');
  const [mutationFeedback, setMutationFeedback] = useState<MutationFeedback>();
  const [mutationRecovery, setMutationRecovery] = useState<MutationRecovery>();
  const successTimeoutRef = useRef<number | null>(null);
  const form = useForm<CustomerServiceRecordEquipmentValues>({
    resolver: zodResolver(createCustomerServiceRecordEquipmentSchema(t('detail.errors.required'))),
    defaultValues: getCustomerServiceRecordEquipmentDefaultValues(asset),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const isReadOnly = mode === 'read';
  const isMutationLocked =
    mutationFeedback?.status === 'saving' || mutationFeedback?.status === 'success';

  useEffect(() => {
    form.reset(getCustomerServiceRecordEquipmentDefaultValues(asset));
  }, [asset, form]);

  useEffect(() => {
    if (!canUpdate) setMode('read');
  }, [canUpdate]);

  useEffect(
    () => () => {
      if (successTimeoutRef.current) window.clearTimeout(successTimeoutRef.current);
    },
    []
  );

  const cancel = () => {
    form.reset(getCustomerServiceRecordEquipmentDefaultValues(asset));
    setMutationFeedback(undefined);
    setMutationRecovery(undefined);
    setMode('read');
  };

  const submit = async (values: CustomerServiceRecordEquipmentValues) => {
    setMutationRecovery(undefined);
    setMutationFeedback({ status: 'saving', title: t('detail.feedback.saving') });

    try {
      const result = await onSubmit(buildCustomerServiceRecordAssetUpdatePayload(asset, values));
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

  const fields: ReadonlyArray<{
    name: Exclude<keyof CustomerServiceRecordEquipmentValues, 'observations'>;
    label: string;
    id: string;
  }> = [
    { name: 'name', label: t('form.labels.assetName'), id: 'customer-service-record-equipment' },
    {
      name: 'identifier',
      label: t('form.labels.identifier'),
      id: 'customer-service-record-equipment-identifier',
    },
    { name: 'brand', label: t('form.labels.brand'), id: 'customer-service-record-equipment-brand' },
    { name: 'model', label: t('form.labels.model'), id: 'customer-service-record-equipment-model' },
    {
      name: 'serialNumber',
      label: t('form.labels.serialNumber'),
      id: 'customer-service-record-equipment-serial-number',
    },
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
        title={t('detail.equipment.title')}
        description={t('detail.equipment.description')}
      >
        <ResourceFormSection surface="bare">
          <FieldGroup>
            {fields.map(({ id, label, name }) => (
              <Controller
                control={form.control}
                key={name}
                name={name}
                render={({ field, fieldState }) => (
                  <FormField
                    error={fieldState.error?.message}
                    htmlFor={isReadOnly ? undefined : id}
                    label={label}
                    orientation="responsive"
                  >
                    {isReadOnly ? (
                      <FormReadValue>{field.value}</FormReadValue>
                    ) : (
                      <Input
                        aria-invalid={fieldState.invalid || undefined}
                        disabled={isMutationLocked}
                        id={id}
                        {...field}
                      />
                    )}
                  </FormField>
                )}
              />
            ))}
            <Controller
              control={form.control}
              name="observations"
              render={({ field, fieldState }) => (
                <FormField
                  error={fieldState.error?.message}
                  htmlFor={
                    isReadOnly ? undefined : 'customer-service-record-equipment-observations'
                  }
                  label={t('form.labels.assetObservations')}
                  orientation="responsive"
                >
                  {isReadOnly ? (
                    <FormReadValue>{field.value.trim() || '—'}</FormReadValue>
                  ) : (
                    <Textarea
                      aria-invalid={fieldState.invalid || undefined}
                      disabled={isMutationLocked}
                      id="customer-service-record-equipment-observations"
                      placeholder={t('detail.placeholders.assetObservations')}
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

function getMutationErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'string') return error;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
