'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserRole } from '@/features/users/roles';

export interface UserFormValues {
  email: string;
  roleId: UserRole;
  name: string;
  lastname: string;
  cellPhone: {
    countryCode: string;
    number: string;
  };
}

export interface UserFormProps {
  defaultValues?: Partial<UserFormValues>;
  mode: 'create' | 'edit';
  roleOptions: Array<{ value: UserRole; label: string; disabled?: boolean }>;
  onSubmit: (values: UserFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

function buildInitialValues(defaultValues?: Partial<UserFormValues>): UserFormValues {
  return {
    email: defaultValues?.email ?? '',
    roleId: defaultValues?.roleId ?? 'STAFF',
    name: defaultValues?.name ?? '',
    lastname: defaultValues?.lastname ?? '',
    cellPhone: {
      countryCode: defaultValues?.cellPhone?.countryCode ?? '',
      number: defaultValues?.cellPhone?.number ?? '',
    },
  };
}

export function UserForm({
  defaultValues,
  mode,
  onSubmit,
  onCancel,
  roleOptions,
  isSubmitting = false,
}: UserFormProps) {
  const { t } = useTranslation('common', { keyPrefix: 'users' });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
    reset,
  } = useForm<UserFormValues>({
    defaultValues: buildInitialValues(defaultValues),
  });

  useEffect(() => {
    reset(buildInitialValues(defaultValues));
  }, [defaultValues, reset]);

  const submitHandler = handleSubmit((values) => {
    const trimmed: UserFormValues = {
      ...values,
      email: values.email.trim(),
      name: values.name.trim(),
      lastname: values.lastname.trim(),
      cellPhone: {
        countryCode: values.cellPhone.countryCode.trim(),
        number: values.cellPhone.number.trim(),
      },
    };
    onSubmit(trimmed);
  });

  const effectiveSubmitting = isSubmitting || isFormSubmitting;

  return (
    <form onSubmit={submitHandler} className="flex h-full flex-col gap-6" noValidate>
      <div className="flex flex-col gap-4 p-4">
        <div className="grid gap-2">
          <Label htmlFor="user-email">{t('form.labels.email')}</Label>
          <Input
            id="user-email"
            type="email"
            autoComplete="email"
            placeholder={t('form.placeholders.email')}
            {...register('email', {
              required: t('form.errors.emailRequired'),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t('form.errors.emailInvalid'),
              },
            })}
            aria-invalid={errors.email ? 'true' : 'false'}
            disabled={mode === 'edit'}
          />
          {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="user-role">{t('form.labels.role')}</Label>
          <select
            id="user-role"
            className="border-input focus-visible:ring-ring/50 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none"
            {...register('roleId', {
              required: t('form.errors.roleRequired'),
            })}
          >
            {roleOptions.map((option, index) => (
              <option
                key={`${option.value}-${index}`}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          {errors.roleId ? (
            <p className="text-sm text-destructive">{errors.roleId.message}</p>
          ) : null}
        </div>

        <div className="grid gap-2 md:grid-cols-2 md:gap-4">
          <div className="grid gap-2">
            <Label htmlFor="user-name">{t('form.labels.name')}</Label>
            <Input
              id="user-name"
              autoComplete="given-name"
              placeholder={t('form.placeholders.name')}
              {...register('name')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="user-lastname">{t('form.labels.lastname')}</Label>
            <Input
              id="user-lastname"
              autoComplete="family-name"
              placeholder={t('form.placeholders.lastname')}
              {...register('lastname')}
            />
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-[0.9fr_1fr] md:gap-4">
          <div className="grid gap-2">
            <Label htmlFor="user-phone-code">{t('form.labels.phoneCode')}</Label>
            <Input
              id="user-phone-code"
              placeholder={t('form.placeholders.phoneCode')}
              {...register('cellPhone.countryCode')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="user-phone-number">{t('form.labels.phoneNumber')}</Label>
            <Input
              id="user-phone-number"
              placeholder={t('form.placeholders.phoneNumber')}
              {...register('cellPhone.number')}
            />
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t border-border/50 bg-muted/10 p-4 sm:flex-row sm:justify-end sm:gap-3">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={effectiveSubmitting}>
            {t('form.cancel')}
          </Button>
        ) : null}
        <Button type="submit" disabled={effectiveSubmitting} className="sm:min-w-[10rem]">
          {effectiveSubmitting ? t('form.submitting') : t(`form.submit.${mode}`)}
        </Button>
      </div>
    </form>
  );
}
