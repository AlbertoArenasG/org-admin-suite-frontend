'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { z } from 'zod';

import {
  MutationFeedback,
  MutationRecovery,
  type MutationFeedbackData,
  type MutationRecoveryData,
} from '@/components/feedback';
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
import { showToast } from '@/components/toast';
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
  const { t } = useTranslationHydrated('users');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [mutationFeedback, setMutationFeedback] = useState<MutationFeedbackData>();
  const [mutationRecovery, setMutationRecovery] = useState<MutationRecoveryData>();
  const isMutationLocked = mutationFeedback?.status === 'saving';
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

  const handleOpenChange = (nextOpen: boolean, force = false) => {
    if (!nextOpen && isMutationLocked && !force) return;

    if (!nextOpen) {
      form.reset();
      setShowPassword(false);
      setShowConfirmation(false);
      setMutationFeedback(undefined);
      setMutationRecovery(undefined);
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = async (values: PasswordValues) => {
    setMutationRecovery(undefined);
    setMutationFeedback({ status: 'saving', title: t('passwordDialog.submitting') });

    try {
      await dispatch(updateUserPassword({ id: userId, password: values.password })).unwrap();
      handleOpenChange(false, true);
      showToast({
        duration: 4000,
        title: t('passwordDialog.success'),
        type: 'success',
      });
    } catch (error) {
      setMutationFeedback(undefined);
      setMutationRecovery({
        guidance: t('passwordDialog.recovery.guidance'),
        message: getMutationErrorMessage(error, t('passwordDialog.error')),
        title: t('passwordDialog.recovery.title'),
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
            disabled={isMutationLocked}
            registration={form.register('password')}
          />
          <PasswordField
            error={form.formState.errors.confirmPassword?.message}
            id="user-password-confirmation"
            label={t('passwordDialog.confirmPassword')}
            onToggle={() => setShowConfirmation((current) => !current)}
            show={showConfirmation}
            disabled={isMutationLocked}
            registration={form.register('confirmPassword')}
          />
          <DialogFooter className="flex-col gap-3 sm:flex-col sm:space-x-0">
            {isMutationLocked && mutationFeedback ? (
              <div className="flex w-full justify-end">
                <MutationFeedback {...mutationFeedback} />
              </div>
            ) : (
              <>
                {mutationRecovery ? <MutationRecovery {...mutationRecovery} /> : null}
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button onClick={() => handleOpenChange(false)} type="button" variant="outline">
                    {t('passwordDialog.cancel')}
                  </Button>
                  <Button type="submit">{t('passwordDialog.submit')}</Button>
                </div>
              </>
            )}
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
  disabled,
}: {
  disabled: boolean;
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
          disabled={disabled}
          id={id}
          type={show ? 'text' : 'password'}
          {...registration}
        />
        <Button
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="absolute right-1 top-1/2 -translate-y-1/2"
          disabled={disabled}
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

function getMutationErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'string') return error;
  if (error instanceof Error && error.message) return error.message;

  return fallback;
}
