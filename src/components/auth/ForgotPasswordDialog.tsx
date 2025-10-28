'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusAlert } from '@/components/shared/StatusAlert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { requestPasswordReset, type PasswordResetRequestPayload } from '@/features/auth/authThunks';

interface ForgotPasswordDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ForgotPasswordFormValues {
  email: string;
}

export function ForgotPasswordDialog({
  children,
  open: controlledOpen,
  onOpenChange,
}: ForgotPasswordDialogProps) {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslationHydrated(['auth', 'common']);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus('loading');
    setMessage(null);
    try {
      const payload: PasswordResetRequestPayload = {
        email: values.email,
        lang: i18n.language,
      };
      const result = await dispatch(requestPasswordReset(payload)).unwrap();
      setStatus('success');
      setMessage(result.message ?? t('auth:reset.successRequest'));
      reset();
    } catch (error) {
      setStatus('error');
      setMessage((error as string) ?? t('auth:reset.errorRequest'));
    }
  });

  const description = useMemo(() => t('auth:reset.description'), [t]);

  const closeDialog = () => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setUncontrolledOpen(false);
    }
    setStatus('idle');
    setMessage(null);
  };

  const handleOpenChange = (value: boolean) => {
    if (value) {
      if (onOpenChange) {
        onOpenChange(true);
      } else {
        setUncontrolledOpen(true);
      }
    } else {
      closeDialog();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('auth:reset.title')}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {status === 'success' && message ? (
          <StatusAlert
            icon={CheckCircle2}
            title={t('common:done')}
            description={message}
            size="sm"
          />
        ) : null}
        {status === 'error' && message ? (
          <StatusAlert
            variant="destructive"
            icon={AlertCircle}
            title={t('common:errorTitle')}
            description={message}
            size="sm"
          />
        ) : null}
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="forgot-email">{t('auth:emailLabel')}</Label>
            <Input
              id="forgot-email"
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
              <p className="text-sm text-destructive">{errors.email.message}</p>
            ) : null}
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={closeDialog}
              disabled={status === 'loading'}
            >
              {t('common:cancel')}
            </Button>
            <Button type="submit" disabled={status === 'loading'} className="sm:min-w-[10rem]">
              {t('auth:reset.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
