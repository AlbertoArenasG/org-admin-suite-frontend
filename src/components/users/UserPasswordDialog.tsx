'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { updateUserPassword } from '@/features/users/usersThunks';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type PasswordValues = {
  password: string;
  confirmPassword: string;
};

type UserPasswordDialogProps = {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UserPasswordDialog({ onOpenChange, open, userId }: UserPasswordDialogProps) {
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslationHydrated('users');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const schema = z
    .object({
      password: z.string().min(6, t('passwordDialog.errors.length')),
      confirmPassword: z.string().min(1, t('passwordDialog.errors.confirmRequired')),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: t('passwordDialog.errors.mismatch'),
      path: ['confirmPassword'],
    });
  const form = useForm<PasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset();
      setShowPassword(false);
      setShowConfirmation(false);
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = async (values: PasswordValues) => {
    try {
      const result = await dispatch(
        updateUserPassword({ id: userId, password: values.password })
      ).unwrap();
      showSnackbar({
        message: result.message ?? t('passwordDialog.success'),
        severity: 'success',
      });
      handleOpenChange(false);
    } catch (error) {
      showSnackbar({
        message: typeof error === 'string' ? error : t('passwordDialog.error'),
        severity: 'error',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('passwordDialog.title')}</DialogTitle>
          <DialogDescription>{t('passwordDialog.description')}</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <PasswordField
            error={form.formState.errors.password?.message}
            id="user-password"
            label={t('passwordDialog.password')}
            onToggle={() => setShowPassword((current) => !current)}
            show={showPassword}
            registration={form.register('password')}
          />
          <PasswordField
            error={form.formState.errors.confirmPassword?.message}
            id="user-password-confirmation"
            label={t('passwordDialog.confirmPassword')}
            onToggle={() => setShowConfirmation((current) => !current)}
            show={showConfirmation}
            registration={form.register('confirmPassword')}
          />
          <DialogFooter className="gap-2 sm:gap-2">
            <Button onClick={() => handleOpenChange(false)} type="button" variant="outline">
              {t('passwordDialog.cancel')}
            </Button>
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting
                ? t('passwordDialog.submitting')
                : t('passwordDialog.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PasswordField({
  error,
  id,
  label,
  onToggle,
  registration,
  show,
}: {
  error?: string;
  id: string;
  label: string;
  onToggle: () => void;
  registration: UseFormRegisterReturn;
  show: boolean;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <Input
          aria-invalid={Boolean(error) || undefined}
          autoComplete="new-password"
          id={id}
          type={show ? 'text' : 'password'}
          {...registration}
        />
        <Button
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="absolute right-1 top-1/2 -translate-y-1/2"
          onClick={onToggle}
          size="icon-xs"
          type="button"
          variant="ghost"
        >
          {show ? <EyeOff /> : <Eye />}
        </Button>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
