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
import { createProvider, updateProvider } from '@/features/providers/providersThunks';
import { resetProviderCreate, resetProviderUpdate } from '@/features/providers/providersSlice';
import { useSnackbar } from '@/components/providers/useSnackbarStore';

export interface ProviderFormValues {
  companyName: string;
  providerCode: string;
}

interface ProviderFormProps {
  mode: 'create' | 'edit';
  providerId?: string;
  initialValues?: ProviderFormValues;
}

export function ProviderForm({ mode, providerId, initialValues }: ProviderFormProps) {
  const { t } = useTranslation('providers');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const createState = useAppSelector((state) => state.providers.create);
  const updateState = useAppSelector((state) => state.providers.update);

  const defaultValues = useMemo<ProviderFormValues>(
    () => ({
      companyName: initialValues?.companyName ?? '',
      providerCode: initialValues?.providerCode ?? '',
    }),
    [initialValues]
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

  const formState = mode === 'create' ? createState : updateState;

  useEffect(() => {
    if (mode === 'create') {
      if (createState.status === 'succeeded' && createState.lastCreatedId) {
        showSnackbar({
          message:
            createState.message ??
            t('create.success', { defaultValue: 'Proveedor creado correctamente.' }),
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
    } else if (mode === 'edit') {
      if (updateState.status === 'succeeded' && updateState.lastUpdatedId) {
        showSnackbar({
          message:
            updateState.message ??
            t('edit.success', { defaultValue: 'Proveedor actualizado correctamente.' }),
          severity: 'success',
        });
        router.replace(`/dashboard/providers/${updateState.lastUpdatedId}`);
        dispatch(resetProviderUpdate());
      } else if (updateState.status === 'failed' && updateState.error) {
        showSnackbar({
          message: updateState.error,
          severity: 'error',
        });
      }
    }
  }, [createState, dispatch, mode, router, showSnackbar, t, updateState]);

  useEffect(
    () => () => {
      if (mode === 'create') {
        dispatch(resetProviderCreate());
      } else {
        dispatch(resetProviderUpdate());
      }
    },
    [dispatch, mode]
  );

  const onSubmit = handleSubmit((values) => {
    if (mode === 'create') {
      void dispatch(
        createProvider({
          companyName: values.companyName.trim(),
          providerCode: values.providerCode.trim(),
        })
      );
    } else if (providerId) {
      void dispatch(
        updateProvider({
          id: providerId,
          companyName: values.companyName.trim(),
          providerCode: values.providerCode.trim(),
        })
      );
    }
  });

  const isLoading = formState.status === 'loading' || isSubmitting;

  const fieldLabels = {
    company: t('create.fields.companyName'),
    providerCode: t('create.fields.providerCode'),
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="companyName">{fieldLabels.company}</Label>
          <Input
            id="companyName"
            {...register('companyName', {
              required: t('create.errors.companyNameRequired') ?? 'Campo requerido',
              minLength: {
                value: 3,
                message: t('create.errors.companyNameLength') ?? 'Muy corto',
              },
            })}
            placeholder={t('create.placeholders.companyName') ?? 'Comercializadora Ejemplo'}
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
              required: t('create.errors.providerCodeRequired') ?? 'Campo requerido',
              minLength: {
                value: 3,
                message: t('create.errors.providerCodeLength') ?? 'Muy corto',
              },
              pattern: {
                value: /^[A-Za-z0-9-_]+$/,
                message: t('create.errors.providerCodeFormat') ?? 'Formato inválido',
              },
            })}
            placeholder={t('create.placeholders.providerCode') ?? 'PROV-001'}
            disabled={isLoading}
          />
          {errors.providerCode ? (
            <p className="text-sm text-destructive">{errors.providerCode.message}</p>
          ) : null}
        </div>
      </div>

      {formState.status === 'failed' && formState.error ? (
        <Alert variant="destructive">
          <AlertDescription>{formState.error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-wrap justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          disabled={isLoading}
          onClick={() => router.push('/dashboard/providers')}
        >
          {mode === 'create' ? t('create.actions.cancel') : t('edit.actions.cancel')}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? mode === 'create'
              ? t('create.actions.processing')
              : t('edit.actions.processing')
            : mode === 'create'
              ? t('create.actions.submit')
              : t('edit.actions.submit')}
        </Button>
      </div>
    </form>
  );
}
