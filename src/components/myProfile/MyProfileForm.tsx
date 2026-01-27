'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface MyProfileFormValues {
  name: string;
  lastname: string;
  cellPhone: {
    countryCode: string;
    number: string;
  };
  password: string;
  confirmPassword: string;
}

export interface MyProfileFormProps {
  defaultValues?: Partial<MyProfileFormValues> & {
    email?: string;
  };
  email: string;
  onSubmit: (values: MyProfileFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

function buildInitialValues(defaultValues?: Partial<MyProfileFormValues>): MyProfileFormValues {
  return {
    name: defaultValues?.name ?? '',
    lastname: defaultValues?.lastname ?? '',
    cellPhone: {
      countryCode: defaultValues?.cellPhone?.countryCode ?? '',
      number: defaultValues?.cellPhone?.number ?? '',
    },
    password: defaultValues?.password ?? '',
    confirmPassword: defaultValues?.confirmPassword ?? '',
  };
}

export function MyProfileForm({
  defaultValues,
  email,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: MyProfileFormProps) {
  const { t } = useTranslation('myProfile', { keyPrefix: 'form' });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting: isFormSubmitting },
    reset,
    setValue,
    clearErrors,
  } = useForm<MyProfileFormValues>({
    defaultValues: buildInitialValues(defaultValues),
  });

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    reset(buildInitialValues(defaultValues));
    setPasswordOpen(false);
  }, [defaultValues, reset]);

  const effectiveSubmitting = isSubmitting || isFormSubmitting;

  const submitHandler = handleSubmit((values) => {
    const trimmed: MyProfileFormValues = {
      name: values.name.trim(),
      lastname: values.lastname.trim(),
      cellPhone: {
        countryCode: values.cellPhone.countryCode.trim(),
        number: values.cellPhone.number.trim(),
      },
      password: values.password.trim(),
      confirmPassword: values.confirmPassword.trim(),
    };
    onSubmit(trimmed);
  });

  const handlePasswordToggle = (nextOpen: boolean) => {
    setPasswordOpen(nextOpen);
    if (!nextOpen) {
      setValue('password', '');
      setValue('confirmPassword', '');
      clearErrors(['password', 'confirmPassword']);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex h-full flex-col gap-6" noValidate>
      <div className="flex flex-col gap-4 p-4">
        <div className="grid gap-1 rounded-xl border border-border/60 bg-muted/10 px-4 py-3">
          <span className="text-xs text-muted-foreground">{t('emailLabel')}</span>
          <span className="text-sm font-medium text-foreground">{email}</span>
        </div>

        <div className="grid gap-2 md:grid-cols-2 md:gap-4">
          <div className="grid gap-2">
            <Label htmlFor="profile-name">{t('fields.name')}</Label>
            <Input
              id="profile-name"
              autoComplete="given-name"
              placeholder={t('placeholders.name')}
              {...register('name')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="profile-lastname">{t('fields.lastname')}</Label>
            <Input
              id="profile-lastname"
              autoComplete="family-name"
              placeholder={t('placeholders.lastname')}
              {...register('lastname')}
            />
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-[0.9fr_1fr] md:gap-4">
          <div className="grid gap-2">
            <Label htmlFor="profile-phone-code">{t('fields.phoneCode')}</Label>
            <Input
              id="profile-phone-code"
              placeholder={t('placeholders.phoneCode')}
              {...register('cellPhone.countryCode')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="profile-phone-number">{t('fields.phoneNumber')}</Label>
            <Input
              id="profile-phone-number"
              placeholder={t('placeholders.phoneNumber')}
              {...register('cellPhone.number')}
            />
          </div>
        </div>

        <Collapsible
          open={passwordOpen}
          onOpenChange={handlePasswordToggle}
          className="rounded-xl border border-border/60 bg-muted/10 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                {t('password.sectionTitle')}
              </h3>
              <p className="text-xs text-muted-foreground">{t('password.sectionHint')}</p>
            </div>
            <CollapsibleTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                {passwordOpen ? t('password.toggleClose') : t('password.toggleOpen')}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-4 grid gap-4">
            <div className="grid gap-2 md:max-w-[420px]">
              <Label htmlFor="profile-password">{t('password.new')}</Label>
              <div className="relative">
                <Input
                  id="profile-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder={t('password.placeholder')}
                  {...register('password', {
                    validate: (value) => {
                      if (!value) {
                        return true;
                      }
                      if (value.length < 6) {
                        return t('password.minLength');
                      }
                      return true;
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition hover:text-foreground"
                  aria-label={showPassword ? t('password.toggleHide') : t('password.toggleShow')}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password ? (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2 md:max-w-[420px]">
              <Label htmlFor="profile-confirm-password">{t('password.confirm')}</Label>
              <div className="relative">
                <Input
                  id="profile-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder={t('password.confirmPlaceholder')}
                  {...register('confirmPassword', {
                    validate: (value) => {
                      const password = watch('password');
                      if (!password && !value) {
                        return true;
                      }
                      if (password !== value) {
                        return t('password.mismatch');
                      }
                      return true;
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition hover:text-foreground"
                  aria-label={
                    showConfirmPassword ? t('password.toggleHide') : t('password.toggleShow')
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword ? (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              ) : null}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t border-border/50 bg-muted/10 p-4 sm:flex-row sm:justify-end sm:gap-3">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={effectiveSubmitting}>
            {t('actions.cancel')}
          </Button>
        ) : null}
        <Button type="submit" disabled={effectiveSubmitting} className="sm:min-w-[10rem]">
          {effectiveSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('actions.saving')}
            </>
          ) : (
            t('actions.save')
          )}
        </Button>
      </div>
    </form>
  );
}
