'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { createProvider } from '@/features/providers/providersThunks';
import { resetProviderCreate } from '@/features/providers/providersSlice';
import { useSnackbar } from '@/components/providers/useSnackbarStore';

export interface ProviderFormValues {
  companyName: string;
  providerCode: string;
}

export function ProviderForm() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const createState = useAppSelector((state) => state.providers.create);

  const defaultValues = useMemo<ProviderFormValues>(
    () => ({
      companyName: '',
      providerCode: '',
    }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setFocus,
  } = useForm<ProviderFormValues>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    setFocus('companyName');
  }, [setFocus]);

  useEffect(() => {
    if (createState.status === 'succeeded' && createState.lastCreatedId) {
      showSnackbar({
        message:
          createState.message ??
          t('providers.create.success', { defaultValue: 'Proveedor creado correctamente.' }),
        severity: 'success',
      });
      router.replace(`/dashboard/providers/${createState.lastCreatedId}`);
      dispatch(resetProviderCreate());
    } else if (createState.status === 'failed' && createState.error) {
      showSnackbar({
        message: createState.error,
        severity: 'error',
      });
    }
  }, [createState, dispatch, router, showSnackbar, t]);

  useEffect(
    () => () => {
      dispatch(resetProviderCreate());
    },
    [dispatch]
  );

  const onSubmit = handleSubmit((values) => {
    void dispatch(
      createProvider({
        companyName: values.companyName.trim(),
        providerCode: values.providerCode.trim(),
      })
    );
  });

  const isLoading = createState.status === 'loading' || isSubmitting;

  const fieldLabels = {
    company: t('providers.create.fields.companyName'),
    providerCode: t('providers.create.fields.providerCode'),
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="companyName">{fieldLabels.company}</Label>
          <Input
            id="companyName"
            {...register('companyName', {
              required: t('providers.create.errors.companyNameRequired') ?? 'Campo requerido',
              minLength: {
                value: 3,
                message: t('providers.create.errors.companyNameLength') ?? 'Muy corto',
              },
            })}
            placeholder={
              t('providers.create.placeholders.companyName') ?? 'Comercializadora Ejemplo'
            }
            disabled={isLoading}
          />
          {errors.companyName ? (
            <p className="text-sm text-destructive">{errors.companyName.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="providerCode">{fieldLabels.providerCode}</Label>
          <Input
            id="providerCode"
            {...register('providerCode', {
              required: t('providers.create.errors.providerCodeRequired') ?? 'Campo requerido',
              minLength: {
                value: 3,
                message: t('providers.create.errors.providerCodeLength') ?? 'Muy corto',
              },
              pattern: {
                value: /^[A-Za-z0-9-_]+$/,
                message: t('providers.create.errors.providerCodeFormat') ?? 'Formato inválido',
              },
            })}
            placeholder={t('providers.create.placeholders.providerCode') ?? 'PROV-001'}
            disabled={isLoading}
          />
          {errors.providerCode ? (
            <p className="text-sm text-destructive">{errors.providerCode.message}</p>
          ) : null}
        </div>
      </div>

      {createState.status === 'failed' && createState.error ? (
        <Alert variant="destructive">
          <AlertDescription>{createState.error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-wrap justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          disabled={isLoading}
          onClick={() => router.push('/dashboard/providers')}
        >
          {t('providers.create.actions.cancel')}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? t('providers.create.actions.processing')
            : t('providers.create.actions.submit')}
        </Button>
      </div>
    </form>
  );
}
