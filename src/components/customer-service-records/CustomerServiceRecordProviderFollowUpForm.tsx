'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';

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
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type {
  CustomerServiceRecordDetail,
  CustomerServiceRecordOption,
  UpdateCustomerServiceRecordProviderPayload,
} from '@/features/customer-service-records';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import {
  buildCustomerServiceRecordProviderUpdatePayload,
  calculateEstimatedReturnDate,
  createCustomerServiceRecordProviderFollowUpSchema,
  emptyCustomerServiceRecordProviderFollowUpRule,
  getCustomerServiceRecordProviderFollowUpDefaultValues,
  isEstimatedReturnDateExplicit,
  type CustomerServiceRecordProviderFollowUpValues,
} from './customerServiceRecordProviderFollowUpSchema';

const SUCCESS_FEEDBACK_DURATION_MS = 800;

type CustomerServiceRecordProviderFollowUpFormProps = {
  record: CustomerServiceRecordDetail;
  canUpdate: boolean;
  providers: readonly CustomerServiceRecordOption[];
  statusPolicies: readonly CustomerServiceRecordOption[];
  notificationPolicies: readonly CustomerServiceRecordOption[];
  recipientGroups: readonly CustomerServiceRecordOption[];
  optionsLoading: boolean;
  optionsError: string | null;
  onRetryOptions: () => void;
  onSubmit: (
    payload: UpdateCustomerServiceRecordProviderPayload
  ) => Promise<{ message: string | null }>;
};

export function CustomerServiceRecordProviderFollowUpForm({
  canUpdate,
  notificationPolicies,
  onRetryOptions,
  onSubmit,
  optionsError,
  optionsLoading,
  providers,
  recipientGroups,
  record,
  statusPolicies,
}: CustomerServiceRecordProviderFollowUpFormProps) {
  const { t } = useTranslationHydrated('customerServiceRecords');
  const [mode, setMode] = useState<ResourceFormMode>('read');
  const [estimatedReturnIsExplicit, setEstimatedReturnIsExplicit] = useState(() =>
    isEstimatedReturnDateExplicit(record)
  );
  const [mutationFeedback, setMutationFeedback] = useState<MutationFeedback>();
  const [mutationRecovery, setMutationRecovery] = useState<MutationRecovery>();
  const successTimeoutRef = useRef<number | null>(null);
  const form = useForm<CustomerServiceRecordProviderFollowUpValues>({
    resolver: zodResolver(
      createCustomerServiceRecordProviderFollowUpSchema({
        required: t('detail.errors.required'),
        invalidDate: t('detail.errors.invalidDate'),
        invalidInterval: t('detail.errors.invalidInterval'),
      })
    ),
    defaultValues: getCustomerServiceRecordProviderFollowUpDefaultValues(record),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'followUpRules',
  });
  const hasProvider = useWatch({ control: form.control, name: 'hasProvider' });
  const followUpEnabled = useWatch({ control: form.control, name: 'followUpEnabled' });
  const deliveredToProviderAt = useWatch({ control: form.control, name: 'deliveredToProviderAt' });
  const estimatedReturnInterval = useWatch({
    control: form.control,
    name: 'estimatedReturnInterval',
  });
  const isReadOnly = mode === 'read';
  const isMutationLocked =
    mutationFeedback?.status === 'saving' || mutationFeedback?.status === 'success';

  useEffect(() => {
    form.reset(getCustomerServiceRecordProviderFollowUpDefaultValues(record));
    setEstimatedReturnIsExplicit(isEstimatedReturnDateExplicit(record));
  }, [form, record]);

  useEffect(() => {
    if (!canUpdate) setMode('read');
  }, [canUpdate]);

  useEffect(() => {
    if (estimatedReturnIsExplicit) return;

    form.setValue(
      'estimatedReturnAt',
      calculateEstimatedReturnDate(deliveredToProviderAt, estimatedReturnInterval),
      { shouldDirty: mode === 'edit', shouldValidate: true }
    );
  }, [deliveredToProviderAt, estimatedReturnInterval, estimatedReturnIsExplicit, form, mode]);

  useEffect(
    () => () => {
      if (successTimeoutRef.current) window.clearTimeout(successTimeoutRef.current);
    },
    []
  );

  const cancel = () => {
    form.reset(getCustomerServiceRecordProviderFollowUpDefaultValues(record));
    setEstimatedReturnIsExplicit(isEstimatedReturnDateExplicit(record));
    setMutationFeedback(undefined);
    setMutationRecovery(undefined);
    setMode('read');
  };

  const submit = async (values: CustomerServiceRecordProviderFollowUpValues) => {
    setMutationRecovery(undefined);
    setMutationFeedback({ status: 'saving', title: t('detail.feedback.saving') });

    try {
      const result = await onSubmit(buildCustomerServiceRecordProviderUpdatePayload(values));
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
  const provider = record.provider;

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
        title={t('detail.provider.title')}
      >
        <ResourceFormSection surface="bare" title={t('detail.provider.providerTitle')}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="hasProvider"
              render={({ field }) => (
                <FormField label={t('form.labels.useProvider')} orientation="responsive">
                  {isReadOnly ? (
                    <FormReadValue>{field.value ? t('labels.yes') : t('labels.no')}</FormReadValue>
                  ) : (
                    <label className="flex min-h-10 items-center gap-3 rounded-md border border-input px-3 text-sm">
                      <input
                        checked={field.value}
                        className="size-4 accent-primary"
                        disabled={isMutationLocked}
                        onChange={(event) => field.onChange(event.target.checked)}
                        type="checkbox"
                      />
                      {t('form.labels.useProvider')}
                    </label>
                  )}
                </FormField>
              )}
            />
            {isReadOnly && !provider ? (
              <FormReadValue>{t('detail.provider.none')}</FormReadValue>
            ) : null}
            {!isReadOnly && !hasProvider ? (
              <p className="text-sm text-muted-foreground">{t('detail.provider.none')}</p>
            ) : null}
            {(isReadOnly ? Boolean(provider) : hasProvider) ? (
              <>
                <Controller
                  control={form.control}
                  name="providerId"
                  render={({ field, fieldState }) => (
                    <FormField
                      description={optionError}
                      error={fieldState.error?.message}
                      label={t('form.labels.provider')}
                      orientation="responsive"
                    >
                      {isReadOnly ? (
                        <FormReadValue>{provider?.name ?? '—'}</FormReadValue>
                      ) : (
                        <FormCombobox
                          disabled={isMutationLocked || optionsLoading || Boolean(optionsError)}
                          emptyMessage={t('form.noOptions')}
                          invalid={fieldState.invalid}
                          onValueChange={(value) => field.onChange(value ?? '')}
                          options={providers}
                          placeholder={t('detail.placeholders.provider')}
                          searchPlaceholder={t('detail.searchOptions')}
                          value={field.value || null}
                        />
                      )}
                    </FormField>
                  )}
                />
                <Controller
                  control={form.control}
                  name="workOrderReference"
                  render={({ field, fieldState }) => (
                    <FormField
                      error={fieldState.error?.message}
                      htmlFor={isReadOnly ? undefined : 'customer-service-record-provider-order'}
                      label={t('form.labels.workOrderReference')}
                      orientation="responsive"
                    >
                      {isReadOnly ? (
                        <FormReadValue>{field.value.trim() || '—'}</FormReadValue>
                      ) : (
                        <Input
                          aria-invalid={fieldState.invalid || undefined}
                          disabled={isMutationLocked}
                          id="customer-service-record-provider-order"
                          {...field}
                        />
                      )}
                    </FormField>
                  )}
                />
                <ProviderDateFields
                  form={form}
                  isMutationLocked={isMutationLocked}
                  isReadOnly={isReadOnly}
                  onEstimatedReturnChange={(value) => setEstimatedReturnIsExplicit(Boolean(value))}
                  t={t}
                />
                <IntervalField
                  disabled={isMutationLocked}
                  form={form}
                  isMutationLocked={isMutationLocked}
                  isReadOnly={isReadOnly}
                  label={t('detail.provider.interval')}
                  name="estimatedReturnInterval"
                  t={t}
                />
                <ProviderPolicies
                  form={form}
                  isMutationLocked={isMutationLocked}
                  isReadOnly={isReadOnly}
                  notificationPolicies={notificationPolicies}
                  optionError={optionError}
                  optionsError={Boolean(optionsError)}
                  optionsLoading={optionsLoading}
                  statusPolicies={statusPolicies}
                  t={t}
                />
              </>
            ) : null}
          </FieldGroup>
        </ResourceFormSection>
        {(isReadOnly ? Boolean(provider) : hasProvider) ? (
          <ResourceFormSection surface="bare" title={t('detail.provider.followUpTitle')}>
            <FieldGroup>
              <Controller
                control={form.control}
                name="followUpEnabled"
                render={({ field }) => (
                  <FormField
                    label={t('form.labels.providerFollowUpEnabled')}
                    orientation="responsive"
                  >
                    {isReadOnly ? (
                      <FormReadValue>
                        {field.value ? t('labels.yes') : t('labels.no')}
                      </FormReadValue>
                    ) : (
                      <label className="flex min-h-10 items-center gap-3 rounded-md border border-input px-3 text-sm">
                        <input
                          checked={field.value}
                          className="size-4 accent-primary"
                          disabled={isMutationLocked}
                          onChange={(event) => field.onChange(event.target.checked)}
                          type="checkbox"
                        />
                        {t('form.labels.providerFollowUpEnabled')}
                      </label>
                    )}
                  </FormField>
                )}
              />
              {(isReadOnly ? provider?.followUp.enabled : followUpEnabled) ? (
                <FollowUpRules
                  disabled={isMutationLocked || optionsLoading || Boolean(optionsError)}
                  fields={fields}
                  form={form}
                  isReadOnly={isReadOnly}
                  onAdd={() => append(emptyCustomerServiceRecordProviderFollowUpRule)}
                  onRemove={remove}
                  optionError={optionError}
                  recipientGroups={recipientGroups}
                  t={t}
                />
              ) : null}
            </FieldGroup>
          </ResourceFormSection>
        ) : null}
      </ResourceFormFrame>
    </form>
  );
}

type FormProps = {
  form: ReturnType<typeof useForm<CustomerServiceRecordProviderFollowUpValues>>;
  isReadOnly: boolean;
  isMutationLocked: boolean;
  t: (key: string, options?: Record<string, unknown>) => string;
};

function ProviderDateFields({
  form,
  isMutationLocked,
  isReadOnly,
  onEstimatedReturnChange,
  t,
}: FormProps & { onEstimatedReturnChange: (value: string) => void }) {
  const dateFields: Array<{
    name: 'deliveredToProviderAt' | 'estimatedReturnAt' | 'returnedFromProviderAt';
    label: string;
  }> = [
    { name: 'deliveredToProviderAt', label: t('form.labels.deliveredToProviderAt') },
    { name: 'estimatedReturnAt', label: t('form.labels.estimatedReturnAt') },
    { name: 'returnedFromProviderAt', label: t('form.labels.returnedFromProviderAt') },
  ];

  return dateFields.map(({ label, name }) => (
    <Controller
      control={form.control}
      key={name}
      name={name}
      render={({ field, fieldState }) => (
        <FormField error={fieldState.error?.message} label={label} orientation="responsive">
          {isReadOnly ? (
            <FormReadValue>{formatDate(field.value)}</FormReadValue>
          ) : (
            <FormDateInput
              allowEmpty
              disabled={isMutationLocked}
              invalid={fieldState.invalid}
              invalidDateMessage={t('detail.errors.invalidDate')}
              onValueChange={(value) => {
                if (name === 'estimatedReturnAt') onEstimatedReturnChange(value);
                field.onChange(value);
              }}
              openCalendarLabel={t('createWizard.openCalendar')}
              value={field.value}
            />
          )}
        </FormField>
      )}
    />
  ));
}

function IntervalField({
  disabled,
  form,
  isReadOnly,
  label,
  name,
  t,
}: FormProps & {
  disabled: boolean;
  label: string;
  name: 'estimatedReturnInterval' | `followUpRules.${number}.interval`;
}) {
  const interval = form.getValues(name);
  const ruleIndex = name.startsWith('followUpRules.') ? Number(name.split('.')[1]) : null;
  const error =
    ruleIndex === null
      ? form.formState.errors.estimatedReturnInterval
      : form.formState.errors.followUpRules?.[ruleIndex]?.interval;
  const intervalLabels = {
    years: t('form.labels.years'),
    months: t('form.labels.months'),
    weeks: t('form.labels.weeks'),
    days: t('form.labels.days'),
  };

  return (
    <FormField label={label} orientation="responsive">
      {isReadOnly ? (
        <FormReadValue>
          <FormIntervalDisplay labels={intervalLabels} value={interval} />
        </FormReadValue>
      ) : (
        <FormIntervalInput
          disabled={disabled}
          errors={{
            years: error?.years?.message,
            months: error?.months?.message,
            weeks: error?.weeks?.message,
            days: error?.days?.message,
          }}
          idPrefix={`customer-service-record-provider-${name.replaceAll('.', '-')}`}
          labels={intervalLabels}
          onValueChange={(value) =>
            form.setValue(name, value, { shouldDirty: true, shouldValidate: true })
          }
          value={interval}
        />
      )}
    </FormField>
  );
}

function ProviderPolicies({
  form,
  isMutationLocked,
  isReadOnly,
  notificationPolicies,
  optionError,
  optionsError,
  optionsLoading,
  statusPolicies,
  t,
}: FormProps & {
  notificationPolicies: readonly CustomerServiceRecordOption[];
  optionError: React.ReactNode;
  optionsError: boolean;
  optionsLoading: boolean;
  statusPolicies: readonly CustomerServiceRecordOption[];
}) {
  return (
    <>
      <PolicyField
        form={form}
        disabled={isMutationLocked || optionsLoading || optionsError}
        isReadOnly={isReadOnly}
        label={t('form.labels.statusPolicy')}
        name="statusPolicyId"
        optionError={optionError}
        options={statusPolicies}
        t={t}
      />
      <PolicyField
        form={form}
        disabled={isMutationLocked || optionsLoading || optionsError}
        isReadOnly={isReadOnly}
        label={t('form.labels.notificationPolicy')}
        name="notificationPolicyId"
        optionError={optionError}
        options={notificationPolicies}
        t={t}
      />
    </>
  );
}

function PolicyField({
  disabled,
  form,
  isReadOnly,
  label,
  name,
  optionError,
  options,
  t,
}: {
  disabled: boolean;
  form: ReturnType<typeof useForm<CustomerServiceRecordProviderFollowUpValues>>;
  isReadOnly: boolean;
  label: string;
  name: 'statusPolicyId' | 'notificationPolicyId';
  optionError: React.ReactNode;
  options: readonly CustomerServiceRecordOption[];
  t: FormProps['t'];
}) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormField description={optionError} label={label} orientation="responsive">
          {isReadOnly ? (
            <FormReadValue>
              {options.find((option) => option.value === field.value)?.label ?? '—'}
            </FormReadValue>
          ) : (
            <FormCombobox
              disabled={disabled}
              emptyMessage={t('form.noOptions')}
              onValueChange={(value) => field.onChange(value ?? '')}
              options={options}
              placeholder={t('detail.placeholders.policy')}
              searchPlaceholder={t('detail.searchOptions')}
              value={field.value || null}
            />
          )}
        </FormField>
      )}
    />
  );
}

function FollowUpRules({
  disabled,
  fields,
  form,
  isReadOnly,
  onAdd,
  onRemove,
  optionError,
  recipientGroups,
  t,
}: {
  disabled: boolean;
  fields: ReturnType<
    typeof useFieldArray<CustomerServiceRecordProviderFollowUpValues, 'followUpRules'>
  >['fields'];
  form: ReturnType<typeof useForm<CustomerServiceRecordProviderFollowUpValues>>;
  isReadOnly: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
  optionError: React.ReactNode;
  recipientGroups: readonly CustomerServiceRecordOption[];
  t: FormProps['t'];
}) {
  if (isReadOnly && !fields.length)
    return <FormReadValue>{t('detail.provider.noRules')}</FormReadValue>;
  return (
    <div className="grid gap-4">
      {fields.map((item, index) => (
        <div className="grid gap-4 rounded-lg border border-border p-4" key={item.id}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-medium">{t('detail.provider.rule', { index: index + 1 })}</h3>
            {!isReadOnly ? (
              <Button
                disabled={disabled}
                onClick={() => onRemove(index)}
                size="sm"
                type="button"
                variant="outline"
              >
                <Trash2 aria-hidden="true" className="size-4" />
                {t('form.actions.removeRule')}
              </Button>
            ) : null}
          </div>
          <IntervalField
            disabled={disabled}
            form={form}
            isMutationLocked={disabled}
            isReadOnly={isReadOnly}
            label={t('detail.provider.ruleInterval')}
            name={`followUpRules.${index}.interval`}
            t={t}
          />
          <RuleGroupField
            disabled={disabled}
            form={form}
            index={index}
            isReadOnly={isReadOnly}
            label={t('form.labels.recipients')}
            name="recipientGroupIds"
            optionError={optionError}
            options={recipientGroups}
            t={t}
          />
          <RuleGroupField
            disabled={disabled}
            form={form}
            index={index}
            isReadOnly={isReadOnly}
            label={t('form.labels.copyRecipients')}
            name="ccRecipientGroupIds"
            optionError={optionError}
            options={recipientGroups}
            t={t}
          />
        </div>
      ))}
      {!isReadOnly ? (
        <Button disabled={disabled} onClick={onAdd} type="button" variant="outline">
          <Plus aria-hidden="true" className="size-4" />
          {t('form.actions.addRule')}
        </Button>
      ) : null}
    </div>
  );
}

function RuleGroupField({
  disabled,
  form,
  index,
  isReadOnly,
  label,
  name,
  optionError,
  options,
  t,
}: {
  disabled: boolean;
  form: ReturnType<typeof useForm<CustomerServiceRecordProviderFollowUpValues>>;
  index: number;
  isReadOnly: boolean;
  label: string;
  name: 'recipientGroupIds' | 'ccRecipientGroupIds';
  optionError: React.ReactNode;
  options: readonly CustomerServiceRecordOption[];
  t: FormProps['t'];
}) {
  return (
    <Controller
      control={form.control}
      name={`followUpRules.${index}.${name}`}
      render={({ field }) => (
        <FormField description={optionError} label={label} orientation="responsive">
          {isReadOnly ? (
            <FormReadValue>
              <FormValueChips
                items={options
                  .filter((option) => field.value.includes(option.value))
                  .map((option) => option.label)}
              />
            </FormReadValue>
          ) : (
            <FormMultiSelect
              disabled={disabled}
              emptyMessage={t('form.noOptions')}
              onValueChange={field.onChange}
              options={options}
              placeholder={t('detail.placeholders.recipientGroups')}
              searchPlaceholder={t('detail.searchOptions')}
              value={field.value}
            />
          )}
        </FormField>
      )}
    />
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
