'use client';

import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Loader2, Plus, Trash2 } from 'lucide-react';

import {
  buildExpirationStatusPolicyInitialValues,
  sortExpirationStatusPolicyRules,
  type ExpirationStatusPolicyFormValues,
} from '@/components/expiration-status-policies/formTypes';
import { formatExpirationStatusPolicyOffset } from '@/components/expiration-status-policies/formatExpirationStatusPolicyOffset';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
  ExpirationStatusPolicyDetail,
  ExpirationStatusPolicyStatusCatalogItem,
} from '@/features/expiration-status-policies/types';

interface ExpirationStatusPolicyFormProps {
  mode: 'create' | 'edit';
  policy?: ExpirationStatusPolicyDetail | null;
  statuses: ExpirationStatusPolicyStatusCatalogItem[];
  onSubmit: (values: {
    name: string;
    description: string | null;
    statusId: ExpirationStatusPolicyStatusCatalogItem['code'];
    rules: Array<{
      ruleId?: string;
      label: string;
      colorHex: string;
      startOffset: {
        years: number;
        months: number;
        weeks: number;
        days: number;
      };
    }>;
  }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  disableActions?: boolean;
}

const EMPTY_RULE = {
  label: '',
  colorHex: '#16a34a',
  startOffset: {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
  },
};

export function ExpirationStatusPolicyForm({
  mode,
  policy,
  statuses,
  onSubmit,
  onCancel,
  isSubmitting = false,
  disableActions = false,
}: ExpirationStatusPolicyFormProps) {
  const { t } = useTranslation('expirationStatusPolicies');

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
    reset,
    watch,
  } = useForm<ExpirationStatusPolicyFormValues>({
    defaultValues: buildExpirationStatusPolicyInitialValues(policy),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rules',
  });

  useEffect(() => {
    reset(buildExpirationStatusPolicyInitialValues(policy));
  }, [policy, reset]);

  const effectiveDisabled = disableActions || isSubmitting || isFormSubmitting;
  const watchedRules = watch('rules');

  const submitHandler = handleSubmit((values) => {
    onSubmit({
      name: values.name.trim(),
      description: values.description.trim() || null,
      statusId: values.statusId,
      rules: sortExpirationStatusPolicyRules(
        values.rules.map((rule) => ({
          ruleId: rule.ruleId,
          label: rule.label.trim(),
          colorHex: rule.colorHex,
          startOffset: {
            years: Number(rule.startOffset.years) || 0,
            months: Number(rule.startOffset.months) || 0,
            weeks: Number(rule.startOffset.weeks) || 0,
            days: Number(rule.startOffset.days) || 0,
          },
        }))
      ),
    });
  });

  const hasRules = watchedRules.length > 0;

  return (
    <form onSubmit={submitHandler} className="flex h-full flex-col gap-6" noValidate>
      <div className="flex flex-col gap-6 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="expiration-status-policy-name">{t('form.labels.name')}</Label>
            <Input
              id="expiration-status-policy-name"
              placeholder={t('form.placeholders.name')}
              disabled={disableActions}
              {...register('name', {
                required: t('form.errors.nameRequired'),
                validate: (value) => {
                  if (value.trim().length < 1) {
                    return t('form.errors.nameRequired');
                  }

                  return true;
                },
              })}
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="expiration-status-policy-status">{t('form.labels.status')}</Label>
            <Controller
              control={control}
              name="statusId"
              render={({ field }) => (
                <select
                  id="expiration-status-policy-status"
                  value={field.value}
                  disabled={disableActions}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value as ExpirationStatusPolicyStatusCatalogItem['code']
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
          <Label htmlFor="expiration-status-policy-description">
            {t('form.labels.description')}
          </Label>
          <Input
            id="expiration-status-policy-description"
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
              onClick={() => append(EMPTY_RULE)}
            >
              <Plus className="mr-2 size-4" />
              {t('form.actions.addRule')}
            </Button>
          </div>

          {fields.length ? (
            <div className="grid gap-4">
              {fields.map((field, index) => {
                const currentRule = watchedRules[index];
                const offsetLabel = currentRule
                  ? formatExpirationStatusPolicyOffset(currentRule.startOffset, t)
                  : t('offset.sameDay');

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
                        <p className="text-sm text-muted-foreground">{offsetLabel}</p>
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
                      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                        <div className="grid gap-2">
                          <Label htmlFor={`rule-label-${field.id}`}>
                            {t('form.labels.ruleLabel')}
                          </Label>
                          <Input
                            id={`rule-label-${field.id}`}
                            placeholder={t('form.placeholders.ruleLabel')}
                            disabled={disableActions}
                            {...register(`rules.${index}.label`, {
                              required: t('form.errors.ruleLabelRequired'),
                              validate: (value) => {
                                if (value.trim().length < 1) {
                                  return t('form.errors.ruleLabelRequired');
                                }

                                return true;
                              },
                            })}
                          />
                          {errors.rules?.[index]?.label ? (
                            <p className="text-sm text-destructive">
                              {errors.rules[index]?.label?.message}
                            </p>
                          ) : null}
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor={`rule-color-${field.id}`}>
                            {t('form.labels.ruleColor')}
                          </Label>
                          <Controller
                            control={control}
                            name={`rules.${index}.colorHex`}
                            rules={{
                              required: t('form.errors.ruleColorRequired'),
                            }}
                            render={({ field: colorField }) => (
                              <input
                                id={`rule-color-${field.id}`}
                                type="color"
                                value={colorField.value}
                                disabled={disableActions}
                                onChange={colorField.onChange}
                                className="h-10 w-16 rounded-lg border border-border/60 bg-background p-1"
                              />
                            )}
                          />
                          {errors.rules?.[index]?.colorHex ? (
                            <p className="text-sm text-destructive">
                              {errors.rules[index]?.colorHex?.message}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-4">
                        <div className="grid gap-2">
                          <Label htmlFor={`rule-years-${field.id}`}>{t('form.labels.years')}</Label>
                          <Input
                            id={`rule-years-${field.id}`}
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
                          <Label htmlFor={`rule-months-${field.id}`}>
                            {t('form.labels.months')}
                          </Label>
                          <Input
                            id={`rule-months-${field.id}`}
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
                          <Label htmlFor={`rule-weeks-${field.id}`}>{t('form.labels.weeks')}</Label>
                          <Input
                            id={`rule-weeks-${field.id}`}
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
                          <Label htmlFor={`rule-days-${field.id}`}>{t('form.labels.days')}</Label>
                          <Input
                            id={`rule-days-${field.id}`}
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
