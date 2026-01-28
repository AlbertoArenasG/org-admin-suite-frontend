'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { StatusAlert } from '@/components/shared/StatusAlert';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { confirmPasswordReset } from '@/features/auth/authThunks';
import { useRouter } from 'next/navigation';

interface ResetPasswordFormProps {
  token: string | null;
  className?: string;
}

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export function ResetPasswordForm({ token, className }: ResetPasswordFormProps) {
  const { t, i18n } = useTranslationHydrated('auth');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: { password: '', confirmPassword: '' },
  });

  const isTokenMissing = !token;

  const submitHandler = handleSubmit(async (values) => {
    if (!token) {
      return;
    }
    setStatus('loading');
    setMessage(null);
    try {
      const result = await dispatch(
        confirmPasswordReset({ token, password: values.password, lang: i18n.language })
      ).unwrap();
      setStatus('success');
      setMessage(result.message ?? t('reset.successConfirm'));
    } catch (error) {
      setStatus('error');
      setMessage((error as string) ?? t('reset.errorConfirm'));
    }
  });

  const successDescription = useMemo(() => message ?? t('reset.successConfirm'), [message, t]);

  if (isTokenMissing) {
    return (
      <Card className={className}>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('reset.invalidTokenTitle')}</CardTitle>
          <CardDescription>{t('reset.invalidTokenDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button onClick={() => router.push('/login')} className="min-w-[12rem]">
            {t('reset.backToLogin')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === 'success') {
    return (
      <Card className={className}>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('reset.successTitle')}</CardTitle>
          <CardDescription>{t('reset.successSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <StatusAlert
            icon={CheckCircle2}
            title={t('common:done')}
            description={successDescription}
            size="md"
          />
          <Button onClick={() => router.push('/login')} className="w-full">
            {t('reset.backToLogin')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t('reset.formTitle')}</CardTitle>
        <CardDescription>{t('reset.formSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'error' && message ? (
          <StatusAlert
            variant="destructive"
            icon={AlertCircle}
            title={t('common:errorTitle')}
            description={message}
            size="sm"
          />
        ) : null}
        <form onSubmit={submitHandler} className="mt-4 space-y-5" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="reset-password">{t('passwordLabel')}</Label>
            <div className="relative">
              <Input
                id="reset-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder={t('passwordPlaceholder')}
                {...register('password', {
                  required: t('passwordRequired'),
                  minLength: {
                    value: 6,
                    message: t('passwordMinLength'),
                  },
                })}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password ? (
              <p className="text-sm text-destructive">
                {errors.password.message ?? t('passwordMinLength')}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reset-confirm-password">{t('reset.confirmPasswordLabel')}</Label>
            <div className="relative">
              <Input
                id="reset-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder={t('reset.confirmPasswordPlaceholder')}
                {...register('confirmPassword', {
                  validate: (value) => {
                    const password = watch('password');
                    if (!value) {
                      return t('reset.confirmPasswordRequired');
                    }
                    if (value.length < 6) {
                      return t('passwordMinLength');
                    }
                    if (value !== password) {
                      return t('reset.passwordMismatch');
                    }
                    return true;
                  },
                })}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword ? (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message ?? t('reset.passwordMismatch')}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={status === 'loading' || isSubmitting}
            aria-busy={status === 'loading' || isSubmitting}
          >
            {status === 'loading' || isSubmitting
              ? t('reset.submitting')
              : t('reset.submitNewPassword')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
