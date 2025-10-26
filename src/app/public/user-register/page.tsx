'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ModeToggle } from '@/components/shared/ModeToggle';
import SelectLang from '@/components/shared/LangToggle';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { jsonRequest } from '@/lib/api-client';
import { useTranslation } from 'react-i18next';
import { useRegistrationStore } from '@/stores/useRegistrationStore';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { login } from '@/features/auth/authThunks';
import { FullScreenLoader } from '@/components/ui/full-screen-loader';

interface InvitationData {
  scope: string;
  type: string;
  status: string;
  email: string;
  role: string;
  role_name?: string;
  user_data: {
    name: string;
    lastname: string;
    cell_phone: {
      country_code: string;
      number: string;
    } | null;
  };
  created_at: string;
}

type InvitationStatus = 'idle' | 'loading' | 'success' | 'error';

const registrationSchema = z
  .object({
    name: z.string().trim().min(1, 'users.register.errors.nameRequired'),
    lastname: z.string().trim().min(1, 'users.register.errors.lastnameRequired'),
    password: z.string().min(6, 'users.register.errors.passwordLength'),
    confirmPassword: z.string(),
    cellPhoneCode: z.string().trim(),
    cellPhoneNumber: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'users.register.errors.passwordMismatch',
    path: ['confirmPassword'],
  });

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function PublicUserRegisterPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { showSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const setStoredEmail = useRegistrationStore((state) => state.setEmail);
  const setStoredPassword = useRegistrationStore((state) => state.setPassword);
  const resetCredentials = useRegistrationStore((state) => state.reset);

  const [invitationStatus, setInvitationStatus] = useState<InvitationStatus>('idle');
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      lastname: '',
      password: '',
      confirmPassword: '',
      cellPhoneCode: '',
      cellPhoneNumber: '',
    },
  });

  useEffect(() => {
    if (!token) {
      setInvitationStatus('error');
      setErrorMessage(
        t('users.register.errors.missingToken', { defaultValue: 'No token provided.' })
      );
      return;
    }

    setInvitationStatus('loading');
    setErrorMessage(null);

    void jsonRequest<InvitationData>(`/v1/user-registration-invitations/${token}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        setInvitationData(response.data);
        form.reset({
          name: response.data.user_data.name ?? '',
          lastname: response.data.user_data.lastname ?? '',
          password: '',
          confirmPassword: '',
          cellPhoneCode: response.data.user_data.cell_phone?.country_code ?? '',
          cellPhoneNumber: response.data.user_data.cell_phone?.number ?? '',
        });
        setStoredEmail(response.data.email);
        setInvitationStatus('success');
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error && error.message
            ? error.message
            : t('users.register.errors.fetchFailed', {
                defaultValue: 'We could not validate your invitation. Please try again later.',
              });
        setErrorMessage(message);
        setInvitationStatus('error');
      });
  }, [form, t, token, setStoredEmail]);

  useEffect(() => () => resetCredentials(), [resetCredentials]);

  const isPendingRegistration = useMemo(
    () => invitationStatus === 'success' && invitationData?.status === 'PENDING',
    [invitationData, invitationStatus]
  );

  const invitationRoleLabel = useMemo(() => {
    if (invitationStatus !== 'success' || !invitationData) {
      return null;
    }
    return invitationData.role_name ?? invitationData.role;
  }, [invitationData, invitationStatus]);

  const onSubmit = form.handleSubmit((values) => {
    if (!token || !invitationData) {
      return;
    }

    const payload = {
      password: values.password,
      name: values.name.trim(),
      lastname: values.lastname.trim(),
      cell_phone: {
        country_code: values.cellPhoneCode.trim(),
        number: values.cellPhoneNumber.trim(),
      },
    };

    form.clearErrors();
    setIsSubmitting(true);

    void jsonRequest(`/v1/user-registration-invitations/${token}/complete-registration`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: payload,
    })
      .then(() => {
        showSnackbar({
          message: t('users.register.success', {
            defaultValue: 'Registration completed successfully.',
          }),
          severity: 'success',
        });
        setStoredPassword(values.password);
        return dispatch(
          login({
            email: invitationData.email,
            password: values.password,
          })
        )
          .unwrap()
          .then(() => {
            resetCredentials();
            router.push('/dashboard');
          })
          .catch((error: unknown) => {
            const message =
              typeof error === 'string'
                ? error
                : t('users.register.errors.autoLoginFailed', {
                    defaultValue: 'Registration succeeded, but we could not start your session.',
                  });
            showSnackbar({ message, severity: 'error' });
            resetCredentials();
            router.push('/login');
          });
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error && error.message
            ? error.message
            : t('users.register.errors.submitFailed', {
                defaultValue: 'We could not complete your registration.',
              });
        showSnackbar({ message, severity: 'error' });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  });

  const renderContent = () => {
    if (!token) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <Typography variant="h6">
            {t('users.register.errors.missingToken', { defaultValue: 'Missing invitation token.' })}
          </Typography>
          <Button onClick={() => router.push('/login')}>
            {t('users.register.actions.backToLogin', { defaultValue: 'Back to login' })}
          </Button>
        </div>
      );
    }

    if (invitationStatus === 'loading') {
      return (
        <div className="flex flex-1 items-center justify-center p-12">
          <CircularProgress />
        </div>
      );
    }

    if (invitationStatus === 'error') {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <Typography variant="h6">
            {t('users.register.errors.invalidInvitation', {
              defaultValue: 'We could not validate your invitation.',
            })}
          </Typography>
          {errorMessage ? (
            <Typography variant="body2" color="text.secondary">
              {errorMessage}
            </Typography>
          ) : null}
          <Button onClick={() => router.push('/login')}>
            {t('users.register.actions.backToLogin', { defaultValue: 'Back to login' })}
          </Button>
        </div>
      );
    }

    if (!isPendingRegistration) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <Typography variant="h6">
            {t('users.register.errors.alreadyUsed', {
              defaultValue: 'This invitation is no longer available.',
            })}
          </Typography>
          <Button onClick={() => router.push('/login')}>
            {t('users.register.actions.backToLogin', { defaultValue: 'Back to login' })}
          </Button>
        </div>
      );
    }

    if (!invitationData) {
      return null;
    }

    const isFormBusy = isSubmitting || form.formState.isSubmitting;

    return (
      <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-4 p-6">
        <div className="grid gap-2">
          <Label>{t('users.register.fields.email')}</Label>
          <Input value={invitationData.email} disabled />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="register-name">{t('users.register.fields.name')}</Label>
          <Input id="register-name" {...form.register('name')} />
          {form.formState.errors.name ? (
            <p className="text-sm text-destructive">
              {t(form.formState.errors.name.message ?? 'users.register.errors.nameRequired', {
                defaultValue: 'Name is required.',
              })}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="register-lastname">{t('users.register.fields.lastname')}</Label>
          <Input id="register-lastname" {...form.register('lastname')} />
          {form.formState.errors.lastname ? (
            <p className="text-sm text-destructive">
              {t(
                form.formState.errors.lastname.message ?? 'users.register.errors.lastnameRequired',
                {
                  defaultValue: 'Last name is required.',
                }
              )}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="register-password">{t('users.register.fields.password')}</Label>
          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              {...form.register('password')}
              className="pr-12"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {form.formState.errors.password ? (
            <p className="text-sm text-destructive">
              {t(form.formState.errors.password.message ?? 'users.register.errors.passwordLength', {
                defaultValue: 'Password must be at least 6 characters.',
              })}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="register-confirm-password">
            {t('users.register.fields.confirmPassword', { defaultValue: 'Confirm password' })}
          </Label>
          <div className="relative">
            <Input
              id="register-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              {...form.register('confirmPassword')}
              className="pr-12"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {form.formState.errors.confirmPassword ? (
            <p className="text-sm text-destructive">
              {t(
                form.formState.errors.confirmPassword.message ??
                  'users.register.errors.passwordMismatch',
                {
                  defaultValue: 'Passwords must match.',
                }
              )}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2 md:grid-cols-[0.9fr_1fr] md:gap-4">
          <div className="grid gap-2">
            <Label htmlFor="register-phone-code">{t('users.register.fields.phoneCode')}</Label>
            <Input id="register-phone-code" {...form.register('cellPhoneCode')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="register-phone-number">{t('users.register.fields.phoneNumber')}</Label>
            <Input id="register-phone-number" {...form.register('cellPhoneNumber')} />
          </div>
        </div>
        <div className="mt-auto flex flex-col gap-2 border-t border-border/50 pt-4 sm:flex-row sm:justify-end sm:gap-3">
          <Button type="button" variant="ghost" onClick={() => router.push('/login')}>
            {t('users.register.actions.backToLogin', { defaultValue: 'Back to login' })}
          </Button>
          <Button type="submit" disabled={isFormBusy}>
            {isFormBusy
              ? t('users.form.submitting')
              : t('users.register.actions.complete', { defaultValue: 'Complete registration' })}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(147,197,253,0.25),_rgba(59,130,246,0.1)_35%,_transparent)] p-4">
      {isSubmitting ? (
        <FullScreenLoader
          text={t('users.register.loading', { defaultValue: 'Processing your registration...' })}
        />
      ) : null}
      <header className="mb-6 flex items-center justify-end gap-2">
        <ModeToggle
          buttonVariant="ghost"
          buttonSize="icon"
          buttonClassName="size-10 rounded-xl border-none bg-white/20 text-foreground hover:bg-white/40 dark:bg-white/10"
        />
        <SelectLang
          buttonVariant="ghost"
          buttonSize="icon"
          buttonClassName="size-10 rounded-xl border-none bg-white/20 text-foreground hover:bg-white/40 dark:bg-white/10"
        />
      </header>
      <div className="flex flex-1 items-center justify-center">
        <Paper
          elevation={0}
          sx={{
            borderRadius: '24px',
            border: '1px solid var(--surface-border)',
            bgcolor: 'var(--surface-bg)',
            color: 'var(--foreground)',
            boxShadow: 'var(--surface-shadow)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            width: 'min(680px, 100%)',
            minHeight: '60vh',
          }}
        >
          <Box
            sx={{
              px: { xs: 2.5, md: 4 },
              py: 3,
              borderBottom: '1px solid var(--surface-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
              {t('users.register.title', { defaultValue: 'Complete your registration' })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('users.register.subtitle', {
                defaultValue: 'Fill in the details below to activate your account.',
              })}
            </Typography>
            {invitationRoleLabel ? (
              <Typography variant="caption" color="text.secondary">
                {t('users.register.roleLabel', { defaultValue: 'Role:' })}{' '}
                <strong>{invitationRoleLabel}</strong>
              </Typography>
            ) : null}
          </Box>
          {renderContent()}
        </Paper>
      </div>
    </div>
  );
}
