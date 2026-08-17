'use client';

import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Loader2, Plus, Trash2 } from 'lucide-react';

import {
  buildEmptyExpirationNotificationPolicyOffset,
  buildEmptyExpirationNotificationPolicyRule,
  buildExpirationNotificationPolicyInitialValues,
  hasExpirationNotificationPolicyOffsetValue,
  normalizeExpirationNotificationPolicyOffset,
  type ExpirationNotificationPolicyFormValues,
} from '@/components/expiration-notification-policies/formTypes';
import { formatExpirationNotificationPolicyOffset } from '@/components/expiration-notification-policies/formatExpirationNotificationPolicyOffset';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
  ExpirationNotificationPolicyAnchorCode,
  ExpirationNotificationPolicyCatalogItem,
  ExpirationNotificationPolicyDetail,
  ExpirationNotificationPolicyRepeatUntilCode,
  ExpirationNotificationPolicyStatusCatalogItem,
  ExpirationNotificationPolicyTriggerModeCode,
} from '@/features/expiration-notification-policies/types';
import type { RecipientGroupListItem } from '@/features/recipient-groups/types';

interface ExpirationNotificationPolicyFormProps {
  mode: 'create' | 'edit';
  policy?: ExpirationNotificationPolicyDetail | null;
  statuses: ExpirationNotificationPolicyStatusCatalogItem[];
  anchors: ExpirationNotificationPolicyCatalogItem<ExpirationNotificationPolicyAnchorCode>[];
  triggerModes: ExpirationNotificationPolicyCatalogItem<ExpirationNotificationPolicyTriggerModeCode>[];
  repeatUntilValues: ExpirationNotificationPolicyCatalogItem<ExpirationNotificationPolicyRepeatUntilCode>[];
  recipientGroups: RecipientGroupListItem[];
  onSubmit: (values: {
    name: string;
    description: string | null;
    statusId: ExpirationNotificationPolicyStatusCatalogItem['code'];
    rules: Array<{
      ruleId?: string;
      anchor: ExpirationNotificationPolicyAnchorCode;
      startOffset: {
        years: number;
        months: number;
        weeks: number;
        days: number;
      };
      triggerMode: ExpirationNotificationPolicyTriggerModeCode;
      recipientGroupIds: string[];
      repeatEvery: {
        years: number;
        months: number;
        weeks: number;
        days: number;
      } | null;
      repeatUntil: ExpirationNotificationPolicyRepeatUntilCode | null;
      repeatFor: {
        years: number;
        months: number;
        weeks: number;
        days: number;
      } | null;
    }>;
  }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  disableActions?: boolean;
}

function buildRecipientGroupNamesMap(recipientGroups: RecipientGroupListItem[]) {
  return new Map(recipientGroups.map((group) => [group.recipientGroupId, group.name]));
}

export function ExpirationNotificationPolicyForm({
  mode,
  policy,
  statuses,
  anchors,
  triggerModes,
  repeatUntilValues,
  recipientGroups,
  onSubmit,
  onCancel,
  isSubmitting = false,
  disableActions = false,
}: ExpirationNotificationPolicyFormProps) {
  const { t } = useTranslation('expirationNotificationPolicies');

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<ExpirationNotificationPolicyFormValues>({
    defaultValues: buildExpirationNotificationPolicyInitialValues(policy),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rules',
  });

  useEffect(() => {
    reset(buildExpirationNotificationPolicyInitialValues(policy));
  }, [policy, reset]);

  const watchedRules = watch('rules');
  const effectiveDisabled = disableActions || isSubmitting || isFormSubmitting;
  const hasRules = watchedRules.length > 0;
  const recipientGroupNames = buildRecipientGroupNamesMap(recipientGroups);

  const submitHandler = handleSubmit((values) => {
    onSubmit({
      name: values.name.trim(),
      description: values.description.trim() || null,
      statusId: values.statusId,
      rules: values.rules.map((rule) => {
        const normalizedStartOffset = normalizeExpirationNotificationPolicyOffset(rule.startOffset);
        const isRecurring = rule.triggerMode === 'RECURRING';
        const shouldSendRepeatFor = rule.repeatUntil === 'FIXED_DURATION';

        return {
          ruleId: rule.ruleId,
          anchor: rule.anchor,
          startOffset: normalizedStartOffset,
          triggerMode: rule.triggerMode,
          recipientGroupIds: Array.from(new Set(rule.recipientGroupIds)),
          repeatEvery:
            isRecurring && rule.repeatEvery
              ? normalizeExpirationNotificationPolicyOffset(rule.repeatEvery)
              : null,
          repeatUntil: isRecurring ? (rule.repeatUntil ?? null) : null,
          repeatFor:
            isRecurring && shouldSendRepeatFor && rule.repeatFor
              ? normalizeExpirationNotificationPolicyOffset(rule.repeatFor)
              : null,
        };
      }),
    });
  });

  return (
    <form onSubmit={submitHandler} className="flex h-full flex-col gap-6" noValidate>
      <div className="flex flex-col gap-6 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="expiration-notification-policy-name">{t('form.labels.name')}</Label>
            <Input
              id="expiration-notification-policy-name"
              placeholder={t('form.placeholders.name')}
              disabled={disableActions}
              {...register('name', {
                required: t('form.errors.nameRequired'),
                validate: (value) => value.trim().length > 0 || t('form.errors.nameRequired'),
              })}
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="expiration-notification-policy-status">{t('form.labels.status')}</Label>
            <Controller
              control={control}
              name="statusId"
              render={({ field }) => (
                <select
                  id="expiration-notification-policy-status"
                  value={field.value}
                  disabled={disableActions}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value as ExpirationNotificationPolicyStatusCatalogItem['code']
                    )
                  }
                  className="h-10 rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {statuses.map((status) => (
                    <option key={status.code} value={status.code}>
                      {status.name}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="expiration-notification-policy-description">
            {t('form.labels.description')}
          </Label>
          <Input
            id="expiration-notification-policy-description"
            placeholder={t('form.placeholders.description')}
            disabled={disableActions}
            {...register('description')}
          />
        </div>

        <div className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">{t('form.labels.rules')}</p>
              <p className="text-sm text-muted-foreground">{t('form.hints.rules')}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={disableActions}
              onClick={() => append(buildEmptyExpirationNotificationPolicyRule())}
            >
              <Plus className="mr-2 size-4" />
              {t('form.actions.addRule')}
            </Button>
          </div>

          {fields.length ? (
            <div className="grid gap-4">
              {fields.map((field, index) => {
                const currentRule = watchedRules[index];
                const isRecurring = currentRule?.triggerMode === 'RECURRING';
                const requiresRepeatFor = currentRule?.repeatUntil === 'FIXED_DURATION';
                const startOffsetLabel = currentRule
                  ? formatExpirationNotificationPolicyOffset(currentRule.startOffset, t)
                  : t('offset.sameDay');
                const selectedRecipientGroupNames =
                  currentRule?.recipientGroupIds
                    .map((recipientGroupId) => recipientGroupNames.get(recipientGroupId))
                    .filter(Boolean) ?? [];

                return (
                  <div
                    key={field.id}
                    className="rounded-2xl border border-border/60 bg-card/40 p-4"
                  >
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {t('form.rules.ruleLabel', { index: index + 1 })}
                        </p>
                        <p className="text-sm text-muted-foreground">{startOffsetLabel}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={disableActions}
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        {t('form.actions.removeRule')}
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor={`rule-anchor-${field.id}`}>
                            {t('form.labels.anchor')}
                          </Label>
                          <Controller
                            control={control}
                            name={`rules.${index}.anchor`}
                            render={({ field: anchorField }) => (
                              <select
                                id={`rule-anchor-${field.id}`}
                                value={anchorField.value}
                                disabled={disableActions}
                                onChange={(event) =>
                                  anchorField.onChange(
                                    event.target.value as ExpirationNotificationPolicyAnchorCode
                                  )
                                }
                                className="h-10 rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                              >
                                {anchors.map((anchor) => (
                                  <option key={anchor.code} value={anchor.code}>
                                    {anchor.name}
                                  </option>
                                ))}
                              </select>
                            )}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor={`rule-trigger-mode-${field.id}`}>
                            {t('form.labels.triggerMode')}
                          </Label>
                          <Controller
                            control={control}
                            name={`rules.${index}.triggerMode`}
                            render={({ field: triggerModeField }) => (
                              <select
                                id={`rule-trigger-mode-${field.id}`}
                                value={triggerModeField.value}
                                disabled={disableActions}
                                onChange={(event) => {
                                  const nextValue = event.target
                                    .value as ExpirationNotificationPolicyTriggerModeCode;
                                  triggerModeField.onChange(nextValue);

                                  if (nextValue === 'ONE_TIME') {
                                    setValue(`rules.${index}.repeatEvery`, null, {
                                      shouldValidate: true,
                                    });
                                    setValue(`rules.${index}.repeatUntil`, null, {
                                      shouldValidate: true,
                                    });
                                    setValue(`rules.${index}.repeatFor`, null, {
                                      shouldValidate: true,
                                    });
                                  } else {
                                    if (!watch(`rules.${index}.repeatEvery`)) {
                                      setValue(
                                        `rules.${index}.repeatEvery`,
                                        buildEmptyExpirationNotificationPolicyOffset(),
                                        { shouldValidate: true }
                                      );
                                    }

                                    if (!watch(`rules.${index}.repeatUntil`)) {
                                      setValue(`rules.${index}.repeatUntil`, 'EXPIRATION_DATE', {
                                        shouldValidate: true,
                                      });
                                    }
                                  }
                                }}
                                className="h-10 rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                              >
                                {triggerModes.map((triggerMode) => (
                                  <option key={triggerMode.code} value={triggerMode.code}>
                                    {triggerMode.name}
                                  </option>
                                ))}
                              </select>
                            )}
                          />
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`rule-start-years-${field.id}`}>
                            {t('form.labels.years')}
                          </Label>
                          <Input
                            id={`rule-start-years-${field.id}`}
                            type="number"
                            min={0}
                            disabled={disableActions}
                            {...register(`rules.${index}.startOffset.years`, {
                              valueAsNumber: true,
                              min: 0,
                            })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`rule-start-months-${field.id}`}>
                            {t('form.labels.months')}
                          </Label>
                          <Input
                            id={`rule-start-months-${field.id}`}
                            type="number"
                            min={0}
                            disabled={disableActions}
                            {...register(`rules.${index}.startOffset.months`, {
                              valueAsNumber: true,
                              min: 0,
                            })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`rule-start-weeks-${field.id}`}>
                            {t('form.labels.weeks')}
                          </Label>
                          <Input
                            id={`rule-start-weeks-${field.id}`}
                            type="number"
                            min={0}
                            disabled={disableActions}
                            {...register(`rules.${index}.startOffset.weeks`, {
                              valueAsNumber: true,
                              min: 0,
                            })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`rule-start-days-${field.id}`}>
                            {t('form.labels.days')}
                          </Label>
                          <Input
                            id={`rule-start-days-${field.id}`}
                            type="number"
                            min={0}
                            disabled={disableActions}
                            {...register(`rules.${index}.startOffset.days`, {
                              valueAsNumber: true,
                              min: 0,
                            })}
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label>{t('form.labels.recipientGroups')}</Label>
                        {recipientGroups.length ? (
                          <div className="grid gap-2 md:grid-cols-2">
                            {recipientGroups.map((recipientGroup) => {
                              const isSelected =
                                currentRule?.recipientGroupIds.includes(
                                  recipientGroup.recipientGroupId
                                ) ?? false;

                              return (
                                <label
                                  key={recipientGroup.recipientGroupId}
                                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                                    isSelected
                                      ? 'border-primary/50 bg-primary/5'
                                      : 'border-border/60 bg-card/40 hover:bg-muted/30'
                                  } ${disableActions ? 'cursor-not-allowed opacity-70' : ''}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    disabled={disableActions}
                                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                                    onChange={(event) => {
                                      const currentIds = currentRule?.recipientGroupIds ?? [];
                                      const nextIds = event.target.checked
                                        ? [...currentIds, recipientGroup.recipientGroupId]
                                        : currentIds.filter(
                                            (recipientGroupId) =>
                                              recipientGroupId !== recipientGroup.recipientGroupId
                                          );

                                      setValue(
                                        `rules.${index}.recipientGroupIds`,
                                        Array.from(new Set(nextIds)),
                                        { shouldValidate: true }
                                      );
                                    }}
                                  />
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">
                                      {recipientGroup.name}
                                    </p>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-dashed border-border/60 px-4 py-4 text-sm text-muted-foreground">
                            {t('form.hints.noRecipientGroups')}
                          </div>
                        )}
                        {selectedRecipientGroupNames.length ? (
                          <p className="text-xs text-muted-foreground">
                            {selectedRecipientGroupNames.join(' · ')}
                          </p>
                        ) : null}
                        {!currentRule?.recipientGroupIds.length ? (
                          <p className="text-sm text-destructive">
                            {t('form.errors.recipientGroupsRequired')}
                          </p>
                        ) : null}
                      </div>

                      {isRecurring ? (
                        <div className="grid gap-4 rounded-2xl border border-border/60 bg-background/60 p-4">
                          <div className="grid gap-2 md:max-w-xs">
                            <Label htmlFor={`rule-repeat-until-${field.id}`}>
                              {t('form.labels.repeatUntil')}
                            </Label>
                            <Controller
                              control={control}
                              name={`rules.${index}.repeatUntil`}
                              render={({ field: repeatUntilField }) => (
                                <select
                                  id={`rule-repeat-until-${field.id}`}
                                  value={repeatUntilField.value ?? ''}
                                  disabled={disableActions}
                                  onChange={(event) => {
                                    const nextValue = event.target.value
                                      ? (event.target
                                          .value as ExpirationNotificationPolicyRepeatUntilCode)
                                      : null;

                                    repeatUntilField.onChange(nextValue);

                                    if (nextValue !== 'FIXED_DURATION') {
                                      setValue(`rules.${index}.repeatFor`, null, {
                                        shouldValidate: true,
                                      });
                                    } else if (!watch(`rules.${index}.repeatFor`)) {
                                      setValue(
                                        `rules.${index}.repeatFor`,
                                        buildEmptyExpirationNotificationPolicyOffset(),
                                        { shouldValidate: true }
                                      );
                                    }
                                  }}
                                  className="h-10 rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                                >
                                  <option value="">{t('form.placeholders.repeatUntil')}</option>
                                  {repeatUntilValues.map((repeatUntil) => (
                                    <option key={repeatUntil.code} value={repeatUntil.code}>
                                      {repeatUntil.name}
                                    </option>
                                  ))}
                                </select>
                              )}
                            />
                            {!currentRule?.repeatUntil ? (
                              <p className="text-sm text-destructive">
                                {t('form.errors.repeatUntilRequired')}
                              </p>
                            ) : null}
                          </div>

                          <div className="grid gap-3">
                            <p className="text-sm font-medium text-foreground">
                              {t('form.labels.repeatEvery')}
                            </p>
                            <div className="grid gap-3 md:grid-cols-4">
                              <div className="grid gap-2">
                                <Label htmlFor={`rule-repeat-every-years-${field.id}`}>
                                  {t('form.labels.years')}
                                </Label>
                                <Input
                                  id={`rule-repeat-every-years-${field.id}`}
                                  type="number"
                                  min={0}
                                  disabled={disableActions}
                                  {...register(`rules.${index}.repeatEvery.years` as const, {
                                    valueAsNumber: true,
                                    min: 0,
                                  })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor={`rule-repeat-every-months-${field.id}`}>
                                  {t('form.labels.months')}
                                </Label>
                                <Input
                                  id={`rule-repeat-every-months-${field.id}`}
                                  type="number"
                                  min={0}
                                  disabled={disableActions}
                                  {...register(`rules.${index}.repeatEvery.months` as const, {
                                    valueAsNumber: true,
                                    min: 0,
                                  })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor={`rule-repeat-every-weeks-${field.id}`}>
                                  {t('form.labels.weeks')}
                                </Label>
                                <Input
                                  id={`rule-repeat-every-weeks-${field.id}`}
                                  type="number"
                                  min={0}
                                  disabled={disableActions}
                                  {...register(`rules.${index}.repeatEvery.weeks` as const, {
                                    valueAsNumber: true,
                                    min: 0,
                                  })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor={`rule-repeat-every-days-${field.id}`}>
                                  {t('form.labels.days')}
                                </Label>
                                <Input
                                  id={`rule-repeat-every-days-${field.id}`}
                                  type="number"
                                  min={0}
                                  disabled={disableActions}
                                  {...register(`rules.${index}.repeatEvery.days` as const, {
                                    valueAsNumber: true,
                                    min: 0,
                                  })}
                                />
                              </div>
                            </div>
                            {!hasExpirationNotificationPolicyOffsetValue(
                              currentRule?.repeatEvery
                            ) ? (
                              <p className="text-sm text-destructive">
                                {t('form.errors.repeatEveryRequired')}
                              </p>
                            ) : null}
                          </div>

                          {requiresRepeatFor ? (
                            <div className="grid gap-3">
                              <p className="text-sm font-medium text-foreground">
                                {t('form.labels.repeatFor')}
                              </p>
                              <div className="grid gap-3 md:grid-cols-4">
                                <div className="grid gap-2">
                                  <Label htmlFor={`rule-repeat-for-years-${field.id}`}>
                                    {t('form.labels.years')}
                                  </Label>
                                  <Input
                                    id={`rule-repeat-for-years-${field.id}`}
                                    type="number"
                                    min={0}
                                    disabled={disableActions}
                                    {...register(`rules.${index}.repeatFor.years` as const, {
                                      valueAsNumber: true,
                                      min: 0,
                                    })}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor={`rule-repeat-for-months-${field.id}`}>
                                    {t('form.labels.months')}
                                  </Label>
                                  <Input
                                    id={`rule-repeat-for-months-${field.id}`}
                                    type="number"
                                    min={0}
                                    disabled={disableActions}
                                    {...register(`rules.${index}.repeatFor.months` as const, {
                                      valueAsNumber: true,
                                      min: 0,
                                    })}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor={`rule-repeat-for-weeks-${field.id}`}>
                                    {t('form.labels.weeks')}
                                  </Label>
                                  <Input
                                    id={`rule-repeat-for-weeks-${field.id}`}
                                    type="number"
                                    min={0}
                                    disabled={disableActions}
                                    {...register(`rules.${index}.repeatFor.weeks` as const, {
                                      valueAsNumber: true,
                                      min: 0,
                                    })}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor={`rule-repeat-for-days-${field.id}`}>
                                    {t('form.labels.days')}
                                  </Label>
                                  <Input
                                    id={`rule-repeat-for-days-${field.id}`}
                                    type="number"
                                    min={0}
                                    disabled={disableActions}
                                    {...register(`rules.${index}.repeatFor.days` as const, {
                                      valueAsNumber: true,
                                      min: 0,
                                    })}
                                  />
                                </div>
                              </div>
                              {!hasExpirationNotificationPolicyOffsetValue(
                                currentRule?.repeatFor
                              ) ? (
                                <p className="text-sm text-destructive">
                                  {t('form.errors.repeatForRequired')}
                                </p>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 px-4 py-8 text-sm text-muted-foreground">
              {t('form.errors.rulesRequired')}
            </div>
          )}

          {!hasRules ? (
            <p className="text-sm text-destructive">{t('form.errors.rulesRequired')}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t border-border/50 bg-muted/10 p-4 sm:flex-row sm:justify-end sm:gap-3">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={effectiveDisabled}>
            {t('form.cancel')}
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={effectiveDisabled || !hasRules}
          className="sm:min-w-[10rem]"
        >
          {effectiveDisabled ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('form.submitting')}
            </>
          ) : (
            t(`form.submit.${mode}`)
          )}
        </Button>
      </div>
    </form>
  );
}
