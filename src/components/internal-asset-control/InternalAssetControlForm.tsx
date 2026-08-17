'use client';

import { useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Loader2, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  buildInternalAssetControlInitialValues,
  EMPTY_INTERNAL_ASSET_CONTROL_RULE,
  type InternalAssetControlFormValues,
} from '@/components/internal-asset-control/formTypes';
import type {
  InternalAssetMaintenanceCatalogItem,
  InternalAssetMaintenanceInterval,
  InternalAssetMaintenanceRecordDetail,
  InternalAssetMaintenanceRecordStatusId,
  InternalAssetMaintenanceTypeId,
} from '@/features/internal-asset-control/types';
import type { ExpirationStatusPolicyOption } from '@/features/expiration-status-policies/types';
import type { ExpirationNotificationPolicyOption } from '@/features/expiration-notification-policies/types';
import type { RecipientGroupListItem } from '@/features/recipient-groups/types';

interface InternalAssetControlFormProps {
  mode: 'create' | 'edit';
  record?: InternalAssetMaintenanceRecordDetail | null;
  assetMaintenanceTypes: InternalAssetMaintenanceCatalogItem<InternalAssetMaintenanceTypeId>[];
  statuses: InternalAssetMaintenanceCatalogItem<InternalAssetMaintenanceRecordStatusId>[];
  expirationStatusPolicyOptions: ExpirationStatusPolicyOption[];
  expirationNotificationPolicyOptions: ExpirationNotificationPolicyOption[];
  recipientGroups: RecipientGroupListItem[];
  onSubmit: (values: {
    assetName: string;
    assetIdentifier: string;
    assetMaintenanceType: InternalAssetMaintenanceTypeId;
    lastMaintenanceAt: string;
    interval: InternalAssetMaintenanceInterval;
    expirationDate: string | null;
    observations: string | null;
    statusId: InternalAssetMaintenanceRecordStatusId;
    expirationStatusPolicyId: string | null;
    expirationNotificationPolicyId: string | null;
    provider: {
      sentToProvider: boolean;
      providerName: string | null;
      sentToProviderAt: string | null;
      providerLeadTime: InternalAssetMaintenanceInterval | null;
      providerNotes: string | null;
    } | null;
    providerFollowUp: {
      enabled: boolean;
      rules: Array<{
        offset: InternalAssetMaintenanceInterval;
        recipientGroupIds: string[];
        ccRecipientGroupIds: string[];
      }>;
    } | null;
  }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  disableActions?: boolean;
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function calculateExpirationDate(
  lastMaintenanceAt: string,
  interval: InternalAssetMaintenanceInterval
) {
  if (!lastMaintenanceAt) {
    return '';
  }

  const baseDate = new Date(`${lastMaintenanceAt}T12:00:00`);
  if (Number.isNaN(baseDate.getTime())) {
    return '';
  }

  const nextDate = new Date(baseDate);
  nextDate.setFullYear(nextDate.getFullYear() + (Number(interval.years) || 0));
  nextDate.setMonth(nextDate.getMonth() + (Number(interval.months) || 0));
  nextDate.setDate(
    nextDate.getDate() + (Number(interval.weeks) || 0) * 7 + (Number(interval.days) || 0)
  );

  return toDateInputValue(nextDate);
}

function normalizeInterval(
  interval: InternalAssetMaintenanceInterval
): InternalAssetMaintenanceInterval {
  return {
    years: Number(interval.years) || 0,
    months: Number(interval.months) || 0,
    weeks: Number(interval.weeks) || 0,
    days: Number(interval.days) || 0,
  };
}

function hasAnyIntervalValue(interval: InternalAssetMaintenanceInterval | null) {
  if (!interval) {
    return false;
  }

  return [interval.years, interval.months, interval.weeks, interval.days].some(
    (value) => Number(value) > 0
  );
}

export function InternalAssetControlForm({
  mode,
  record,
  assetMaintenanceTypes,
  statuses,
  expirationStatusPolicyOptions,
  expirationNotificationPolicyOptions,
  recipientGroups,
  onSubmit,
  onCancel,
  isSubmitting = false,
  disableActions = false,
}: InternalAssetControlFormProps) {
  const { t } = useTranslation('internalAssetControl');
  const [expirationDateTouched, setExpirationDateTouched] = useState(Boolean(record));
  const editableStatuses = statuses.filter((status) => status.code !== 'DELETED');

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<InternalAssetControlFormValues>({
    defaultValues: buildInternalAssetControlInitialValues(record),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'providerFollowUpRules',
  });

  useEffect(() => {
    reset(buildInternalAssetControlInitialValues(record));
    setExpirationDateTouched(Boolean(record));
  }, [record, reset]);

  const effectiveDisabled = disableActions || isSubmitting || isFormSubmitting;
  const lastMaintenanceAt = watch('lastMaintenanceAt');
  const interval = watch('interval');
  const expirationDate = watch('expirationDate');
  const sentToProvider = watch('sentToProvider');
  const providerFollowUpEnabled = watch('providerFollowUpEnabled');
  const watchedRules = watch('providerFollowUpRules');
  const suggestedExpirationDate = useMemo(
    () => calculateExpirationDate(lastMaintenanceAt, normalizeInterval(interval)),
    [interval, lastMaintenanceAt]
  );

  useEffect(() => {
    if (expirationDateTouched) {
      return;
    }

    setValue('expirationDate', suggestedExpirationDate, { shouldDirty: false });
  }, [expirationDateTouched, setValue, suggestedExpirationDate]);

  const groupedRecipientGroups = useMemo(
    () => recipientGroups.filter((group) => group.statusId === 'ACTIVE'),
    [recipientGroups]
  );

  const submitHandler = handleSubmit((values) => {
    const normalizedInterval = normalizeInterval(values.interval);
    const normalizedProviderLeadTime = normalizeInterval(values.providerLeadTime);

    const hasProviderData =
      values.sentToProvider ||
      values.providerName.trim().length > 0 ||
      values.sentToProviderAt.trim().length > 0 ||
      hasAnyIntervalValue(normalizedProviderLeadTime) ||
      values.providerNotes.trim().length > 0;

    const normalizedRules = values.providerFollowUpRules.map((rule) => ({
      offset: normalizeInterval(rule.offset),
      recipientGroupIds: Array.from(new Set(rule.recipientGroupIds)),
      ccRecipientGroupIds: Array.from(new Set(rule.ccRecipientGroupIds)),
    }));

    onSubmit({
      assetName: values.assetName.trim(),
      assetIdentifier: values.assetIdentifier.trim(),
      assetMaintenanceType: values.assetMaintenanceType,
      lastMaintenanceAt: values.lastMaintenanceAt,
      interval: normalizedInterval,
      expirationDate: values.expirationDate.trim() || null,
      observations: values.observations.trim() || null,
      statusId: values.statusId,
      expirationStatusPolicyId: values.expirationStatusPolicyId || null,
      expirationNotificationPolicyId: values.expirationNotificationPolicyId || null,
      provider: hasProviderData
        ? {
            sentToProvider: values.sentToProvider,
            providerName: values.providerName.trim() || null,
            sentToProviderAt: values.sentToProviderAt.trim() || null,
            providerLeadTime: hasAnyIntervalValue(normalizedProviderLeadTime)
              ? normalizedProviderLeadTime
              : null,
            providerNotes: values.providerNotes.trim() || null,
          }
        : null,
      providerFollowUp:
        values.providerFollowUpEnabled || normalizedRules.length > 0
          ? {
              enabled: values.providerFollowUpEnabled,
              rules: normalizedRules,
            }
          : null,
    });
  });

  return (
    <form onSubmit={submitHandler} className="flex h-full flex-col gap-6" noValidate>
      <div className="flex flex-col gap-6 p-4">
        <div className="grid gap-4 rounded-2xl border border-border/60 bg-card/40 p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="internal-asset-name">{t('form.labels.assetName')}</Label>
              <Input
                id="internal-asset-name"
                placeholder={t('form.placeholders.assetName')}
                disabled={effectiveDisabled}
                {...register('assetName', { required: t('form.errors.assetNameRequired') })}
              />
              {errors.assetName ? (
                <p className="text-sm text-destructive">{errors.assetName.message}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="internal-asset-identifier">{t('form.labels.assetIdentifier')}</Label>
              <Input
                id="internal-asset-identifier"
                placeholder={t('form.placeholders.assetIdentifier')}
                disabled={effectiveDisabled}
                {...register('assetIdentifier', {
                  required: t('form.errors.assetIdentifierRequired'),
                })}
              />
              {errors.assetIdentifier ? (
                <p className="text-sm text-destructive">{errors.assetIdentifier.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="internal-asset-type">{t('form.labels.assetMaintenanceType')}</Label>
              <Controller
                control={control}
                name="assetMaintenanceType"
                render={({ field }) => (
                  <select
                    id="internal-asset-type"
                    value={field.value}
                    disabled={effectiveDisabled}
                    onChange={(event) =>
                      field.onChange(event.target.value as InternalAssetMaintenanceTypeId)
                    }
                    className="h-10 rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {assetMaintenanceTypes.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="internal-asset-status">{t('form.labels.status')}</Label>
              <Controller
                control={control}
                name="statusId"
                render={({ field }) => (
                  <select
                    id="internal-asset-status"
                    value={field.value}
                    disabled={effectiveDisabled}
                    onChange={(event) =>
                      field.onChange(event.target.value as InternalAssetMaintenanceRecordStatusId)
                    }
                    className="h-10 rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {editableStatuses.map((status) => (
                      <option key={status.code} value={status.code}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="internal-asset-last-maintenance">
                {t('form.labels.lastMaintenanceAt')}
              </Label>
              <Input
                id="internal-asset-last-maintenance"
                type="date"
                disabled={effectiveDisabled}
                {...register('lastMaintenanceAt', {
                  required: t('form.errors.lastMaintenanceAtRequired'),
                })}
              />
              {errors.lastMaintenanceAt ? (
                <p className="text-sm text-destructive">{errors.lastMaintenanceAt.message}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl border border-border/60 bg-card/40 p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{t('form.sections.schedule')}</p>
            <p className="text-sm text-muted-foreground">{t('form.hints.schedule')}</p>
          </div>

          <div className="grid gap-2">
            <Label>{t('form.labels.interval')}</Label>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="grid gap-2">
                <Label htmlFor="interval-years">{t('form.labels.years')}</Label>
                <Input
                  id="interval-years"
                  type="number"
                  min={0}
                  disabled={effectiveDisabled}
                  {...register('interval.years', { valueAsNumber: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="interval-months">{t('form.labels.months')}</Label>
                <Input
                  id="interval-months"
                  type="number"
                  min={0}
                  disabled={effectiveDisabled}
                  {...register('interval.months', { valueAsNumber: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="interval-weeks">{t('form.labels.weeks')}</Label>
                <Input
                  id="interval-weeks"
                  type="number"
                  min={0}
                  disabled={effectiveDisabled}
                  {...register('interval.weeks', { valueAsNumber: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="interval-days">{t('form.labels.days')}</Label>
                <Input
                  id="interval-days"
                  type="number"
                  min={0}
                  disabled={effectiveDisabled}
                  {...register('interval.days', { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-2 md:max-w-xs">
            <Label htmlFor="internal-asset-expiration-date">
              {t('form.labels.expirationDate')}
            </Label>
            <Input
              id="internal-asset-expiration-date"
              type="date"
              disabled={effectiveDisabled}
              {...register('expirationDate')}
              onChange={(event) => {
                setExpirationDateTouched(true);
                setValue('expirationDate', event.target.value, { shouldDirty: true });
              }}
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">{t('form.hints.expirationDate')}</p>
              {expirationDateTouched ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={effectiveDisabled || !suggestedExpirationDate}
                  onClick={() => {
                    setExpirationDateTouched(false);
                    setValue('expirationDate', suggestedExpirationDate, { shouldDirty: true });
                  }}
                >
                  {t('form.actions.useSuggestedExpirationDate')}
                </Button>
              ) : null}
            </div>
            {expirationDateTouched && expirationDate !== suggestedExpirationDate ? (
              <p className="text-sm text-primary">
                {t('form.hints.manualExpirationOverride', {
                  defaultValue: 'Estás usando una fecha de vencimiento editada manualmente.',
                })}
              </p>
            ) : suggestedExpirationDate ? (
              <p className="text-sm text-muted-foreground">
                {t('form.hints.suggestedExpirationDate', {
                  defaultValue: 'Fecha sugerida: {{date}}',
                  date: suggestedExpirationDate,
                })}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl border border-border/60 bg-card/40 p-4">
          <div className="grid gap-2">
            <Label htmlFor="internal-asset-observations">{t('form.labels.observations')}</Label>
            <Textarea
              id="internal-asset-observations"
              placeholder={t('form.placeholders.observations')}
              disabled={effectiveDisabled}
              {...register('observations')}
            />
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl border border-border/60 bg-card/40 p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{t('form.sections.policies')}</p>
            <p className="text-sm text-muted-foreground">{t('form.hints.policies')}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="internal-asset-exp-status-policy">
                {t('form.labels.expirationStatusPolicy')}
              </Label>
              <Controller
                control={control}
                name="expirationStatusPolicyId"
                render={({ field }) => (
                  <select
                    id="internal-asset-exp-status-policy"
                    value={field.value}
                    disabled={effectiveDisabled}
                    onChange={(event) => field.onChange(event.target.value)}
                    className="h-10 rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="">{t('form.placeholders.expirationStatusPolicy')}</option>
                    {expirationStatusPolicyOptions.map((option) => (
                      <option
                        key={option.expirationStatusPolicyId}
                        value={option.expirationStatusPolicyId}
                      >
                        {option.name}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="internal-asset-exp-notification-policy">
                {t('form.labels.expirationNotificationPolicy')}
              </Label>
              <Controller
                control={control}
                name="expirationNotificationPolicyId"
                render={({ field }) => (
                  <select
                    id="internal-asset-exp-notification-policy"
                    value={field.value}
                    disabled={effectiveDisabled}
                    onChange={(event) => field.onChange(event.target.value)}
                    className="h-10 rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="">{t('form.placeholders.expirationNotificationPolicy')}</option>
                    {expirationNotificationPolicyOptions.map((option) => (
                      <option
                        key={option.expirationNotificationPolicyId}
                        value={option.expirationNotificationPolicyId}
                      >
                        {option.name}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl border border-border/60 bg-card/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">{t('form.sections.provider')}</p>
              <p className="text-sm text-muted-foreground">{t('form.hints.provider')}</p>
            </div>
            {!sentToProvider ? (
              <span className="text-sm text-muted-foreground">
                {t('form.hints.providerCollapsed')}
              </span>
            ) : null}
          </div>

          <label className="flex items-center gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={sentToProvider}
              disabled={effectiveDisabled}
              onChange={(event) =>
                setValue('sentToProvider', event.target.checked, { shouldDirty: true })
              }
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            {t('form.labels.sentToProvider')}
          </label>

          {sentToProvider ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="internal-asset-provider-name">
                    {t('form.labels.providerName')}
                  </Label>
                  <Input
                    id="internal-asset-provider-name"
                    placeholder={t('form.placeholders.providerName')}
                    disabled={effectiveDisabled}
                    {...register('providerName')}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="internal-asset-sent-to-provider-at">
                    {t('form.labels.sentToProviderAt')}
                  </Label>
                  <Input
                    id="internal-asset-sent-to-provider-at"
                    type="date"
                    disabled={effectiveDisabled}
                    {...register('sentToProviderAt')}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>{t('form.labels.providerLeadTime')}</Label>
                <div className="grid gap-3 md:grid-cols-4">
                  <div className="grid gap-2">
                    <Label htmlFor="provider-lead-time-years">{t('form.labels.years')}</Label>
                    <Input
                      id="provider-lead-time-years"
                      type="number"
                      min={0}
                      disabled={effectiveDisabled}
                      {...register('providerLeadTime.years', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="provider-lead-time-months">{t('form.labels.months')}</Label>
                    <Input
                      id="provider-lead-time-months"
                      type="number"
                      min={0}
                      disabled={effectiveDisabled}
                      {...register('providerLeadTime.months', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="provider-lead-time-weeks">{t('form.labels.weeks')}</Label>
                    <Input
                      id="provider-lead-time-weeks"
                      type="number"
                      min={0}
                      disabled={effectiveDisabled}
                      {...register('providerLeadTime.weeks', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="provider-lead-time-days">{t('form.labels.days')}</Label>
                    <Input
                      id="provider-lead-time-days"
                      type="number"
                      min={0}
                      disabled={effectiveDisabled}
                      {...register('providerLeadTime.days', { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="internal-asset-provider-notes">
                  {t('form.labels.providerNotes')}
                </Label>
                <Textarea
                  id="internal-asset-provider-notes"
                  placeholder={t('form.placeholders.providerNotes')}
                  disabled={effectiveDisabled}
                  {...register('providerNotes')}
                />
              </div>
            </>
          ) : null}
        </div>

        <div className="grid gap-4 rounded-2xl border border-border/60 bg-card/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {t('form.sections.providerFollowUp')}
              </p>
              <p className="text-sm text-muted-foreground">{t('form.hints.providerFollowUp')}</p>
            </div>
            <label className="flex items-center gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={providerFollowUpEnabled}
                disabled={effectiveDisabled}
                onChange={(event) =>
                  setValue('providerFollowUpEnabled', event.target.checked, { shouldDirty: true })
                }
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              {t('form.labels.providerFollowUpEnabled')}
            </label>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={effectiveDisabled}
              onClick={() => append(EMPTY_INTERNAL_ASSET_CONTROL_RULE)}
            >
              <Plus className="mr-2 size-4" />
              {t('form.actions.addFollowUpRule')}
            </Button>
          </div>

          {fields.length ? (
            <div className="grid gap-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-2xl border border-border/60 bg-background/60 p-4"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      {t('form.followUp.ruleLabel', { index: index + 1 })}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={effectiveDisabled}
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="mr-2 size-4" />
                      {t('form.actions.removeRule')}
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>{t('form.labels.followUpOffset')}</Label>
                      <div className="grid gap-3 md:grid-cols-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`follow-up-${field.id}-years`}>
                            {t('form.labels.years')}
                          </Label>
                          <Input
                            id={`follow-up-${field.id}-years`}
                            type="number"
                            min={0}
                            disabled={effectiveDisabled}
                            {...register(`providerFollowUpRules.${index}.offset.years`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`follow-up-${field.id}-months`}>
                            {t('form.labels.months')}
                          </Label>
                          <Input
                            id={`follow-up-${field.id}-months`}
                            type="number"
                            min={0}
                            disabled={effectiveDisabled}
                            {...register(`providerFollowUpRules.${index}.offset.months`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`follow-up-${field.id}-weeks`}>
                            {t('form.labels.weeks')}
                          </Label>
                          <Input
                            id={`follow-up-${field.id}-weeks`}
                            type="number"
                            min={0}
                            disabled={effectiveDisabled}
                            {...register(`providerFollowUpRules.${index}.offset.weeks`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`follow-up-${field.id}-days`}>
                            {t('form.labels.days')}
                          </Label>
                          <Input
                            id={`follow-up-${field.id}-days`}
                            type="number"
                            min={0}
                            disabled={effectiveDisabled}
                            {...register(`providerFollowUpRules.${index}.offset.days`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-3">
                        <Label>{t('form.labels.recipientGroups')}</Label>
                        <div className="grid gap-2">
                          {groupedRecipientGroups.map((group) => {
                            const isSelected =
                              watchedRules[index]?.recipientGroupIds.includes(
                                group.recipientGroupId
                              ) ?? false;
                            return (
                              <label
                                key={`to-${field.id}-${group.recipientGroupId}`}
                                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2 text-sm transition ${
                                  isSelected
                                    ? 'border-primary/50 bg-primary/5'
                                    : 'border-border/60 bg-card/40 hover:bg-muted/30'
                                } ${effectiveDisabled ? 'cursor-not-allowed opacity-70' : ''}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  disabled={effectiveDisabled}
                                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                  onChange={(event) => {
                                    const current = watchedRules[index]?.recipientGroupIds ?? [];
                                    const next = event.target.checked
                                      ? [...current, group.recipientGroupId]
                                      : current.filter((value) => value !== group.recipientGroupId);
                                    setValue(
                                      `providerFollowUpRules.${index}.recipientGroupIds`,
                                      Array.from(new Set(next)),
                                      { shouldDirty: true }
                                    );
                                  }}
                                />
                                <div>
                                  <p className="font-medium text-foreground">{group.name}</p>
                                  <p className="text-xs text-muted-foreground">{group.code}</p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <Label>{t('form.labels.ccRecipientGroups')}</Label>
                        <div className="grid gap-2">
                          {groupedRecipientGroups.map((group) => {
                            const isSelected =
                              watchedRules[index]?.ccRecipientGroupIds.includes(
                                group.recipientGroupId
                              ) ?? false;
                            return (
                              <label
                                key={`cc-${field.id}-${group.recipientGroupId}`}
                                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2 text-sm transition ${
                                  isSelected
                                    ? 'border-primary/50 bg-primary/5'
                                    : 'border-border/60 bg-card/40 hover:bg-muted/30'
                                } ${effectiveDisabled ? 'cursor-not-allowed opacity-70' : ''}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  disabled={effectiveDisabled}
                                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                  onChange={(event) => {
                                    const current = watchedRules[index]?.ccRecipientGroupIds ?? [];
                                    const next = event.target.checked
                                      ? [...current, group.recipientGroupId]
                                      : current.filter((value) => value !== group.recipientGroupId);
                                    setValue(
                                      `providerFollowUpRules.${index}.ccRecipientGroupIds`,
                                      Array.from(new Set(next)),
                                      { shouldDirty: true }
                                    );
                                  }}
                                />
                                <div>
                                  <p className="font-medium text-foreground">{group.name}</p>
                                  <p className="text-xs text-muted-foreground">{group.code}</p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/60 px-4 py-6 text-sm text-muted-foreground">
              {t('form.empty.followUpRules')}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-border/60 px-4 py-4">
        {onCancel ? (
          <Button type="button" variant="ghost" disabled={effectiveDisabled} onClick={onCancel}>
            {t('form.cancel')}
          </Button>
        ) : null}
        <Button type="submit" disabled={effectiveDisabled}>
          {effectiveDisabled ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          {mode === 'create' ? t('form.submit.create') : t('form.submit.edit')}
        </Button>
      </div>
    </form>
  );
}
