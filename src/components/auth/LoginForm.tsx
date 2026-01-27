import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { login, resetStatus } from '@/features/auth';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { StatusAlert } from '@/components/shared/StatusAlert';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { ForgotPasswordDialog } from '@/components/auth/ForgotPasswordDialog';

type TranslateFn = ReturnType<typeof useTranslationHydrated>['t'];

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFeedbackProps {
  successMessage: string | null;
  error: string | null;
  t: TranslateFn;
}

function LoginFeedback({ successMessage, error, t }: LoginFeedbackProps) {
  if (!successMessage && !error) {
    return null;
  }

  return (
    <div className="mb-4 space-y-3">
      {successMessage ? (
        <StatusAlert
          icon={CheckCircle2}
          title={t('common:done')}
          description={successMessage ?? t('genericSuccess')}
          size="md"
        />
      ) : null}
      {error ? (
        <StatusAlert
          variant="destructive"
          icon={AlertCircle}
          title={t('common:errorTitle')}
          description={error ?? t('genericError')}
          size="md"
        />
      ) : null}
    </div>
  );
}

interface LoginFieldsProps {
  register: UseFormRegister<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  t: TranslateFn;
  onForgotPassword: () => void;
}

function LoginFields({ register, errors, t, onForgotPassword }: LoginFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">{t('emailLabel')}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t('emailPlaceholder')}
          {...register('email', {
            required: t('emailRequired'),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t('emailInvalid'),
            },
          })}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email ? (
          <p className="text-sm text-destructive">{errors.email.message ?? t('emailInvalid')}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">{t('passwordLabel')}</Label>
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="ml-auto inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            <span>{showPassword ? t('hidePassword') : t('showPassword')}</span>
          </button>
        </div>
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
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
        {errors.password ? (
          <p className="text-sm text-destructive">
            {errors.password.message ?? t('passwordRequired')}
          </p>
        ) : null}
        <button
          type="button"
          onClick={onForgotPassword}
          className="ml-auto mt-1 inline-flex items-center text-sm text-primary underline-offset-4 hover:underline"
        >
          {t('forgotPassword')}
        </button>
      </div>
    </div>
  );
}

interface LoginSubmitButtonProps {
  isLoading: boolean;
  t: TranslateFn;
}

function LoginSubmitButton({ isLoading, t }: LoginSubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={isLoading} aria-busy={isLoading}>
      {isLoading ? (
        <>
          <Spinner className="size-4" aria-label={t('common:loading')} />
          {t('submitting')}
        </>
      ) : (
        t('submit')
      )}
    </Button>
  );
}

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const dispatch = useAppDispatch();
  const { status, error, successMessage } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const { t } = useTranslationHydrated('auth');
  const searchParams = useSearchParams();
  const nextParam = searchParams?.get('next');
  const nextRoute = nextParam && nextParam.startsWith('/') ? nextParam : null;
  const [forgotOpen, setForgotOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(
    () => () => {
      dispatch(resetStatus());
    },
    [dispatch]
  );

  const onSubmit = handleSubmit(async (values) => {
    await dispatch(login(values));
  });

  const isLoading = status === 'loading' || isSubmitting;

  useEffect(() => {
    if (status === 'succeeded') {
      router.replace(nextRoute ?? '/dashboard');
    }
  }, [status, router, nextRoute]);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('loginTitle')}</CardTitle>
          <CardDescription className="text-sm">{t('loginSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginFeedback successMessage={successMessage} error={error} t={t} />
          <form onSubmit={onSubmit} className="grid gap-6" noValidate>
            <LoginFields
              register={register}
              errors={errors}
              t={t}
              onForgotPassword={() => setForgotOpen(true)}
            />
            <LoginSubmitButton isLoading={isLoading} t={t} />
          </form>
        </CardContent>
      </Card>
      <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <span />
      </ForgotPasswordDialog>
    </div>
  );
}
