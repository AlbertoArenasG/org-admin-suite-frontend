import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { login, resetStatus } from '@/features/auth';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { StatusAlert } from '@/components/shared/StatusAlert';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

type TranslateFn = ReturnType<typeof useTranslation>['t'];

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
          description={successMessage ?? t('auth:genericSuccess')}
          size="md"
        />
      ) : null}
      {error ? (
        <StatusAlert
          variant="destructive"
          icon={AlertCircle}
          title={t('common:errorTitle')}
          description={error ?? t('auth:genericError')}
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
}

function LoginFields({ register, errors, t }: LoginFieldsProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">{t('auth:emailLabel')}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t('auth:emailPlaceholder')}
          {...register('email', {
            required: t('auth:emailRequired'),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t('auth:emailInvalid'),
            },
          })}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email ? (
          <p className="text-sm text-destructive">
            {errors.email.message ?? t('auth:emailInvalid')}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">{t('auth:passwordLabel')}</Label>
          <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
            {t('auth:forgotPassword')}
          </a>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder={t('auth:passwordPlaceholder')}
          {...register('password', {
            required: t('auth:passwordRequired'),
            minLength: {
              value: 6,
              message: t('auth:passwordMinLength'),
            },
          })}
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">
            {errors.password.message ?? t('auth:passwordRequired')}
          </p>
        ) : null}
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
          {t('auth:submitting')}
        </>
      ) : (
        t('auth:submit')
      )}
    </Button>
  );
}

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const dispatch = useAppDispatch();
  const { status, error, successMessage } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const { t } = useTranslation(['auth', 'common']);

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
      router.replace('/dashboard');
    }
  }, [status, router]);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('auth:loginTitle')}</CardTitle>
          <CardDescription className="text-sm">{t('auth:loginSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginFeedback successMessage={successMessage} error={error} t={t} />
          <form onSubmit={onSubmit} className="grid gap-6" noValidate>
            <LoginFields register={register} errors={errors} t={t} />
            <LoginSubmitButton isLoading={isLoading} t={t} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
