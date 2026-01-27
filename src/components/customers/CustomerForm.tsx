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
import { createCustomer, updateCustomer } from '@/features/customers/customersThunks';
import { resetCustomerCreate, resetCustomerUpdate } from '@/features/customers/customersSlice';
import { useSnackbar } from '@/components/providers/useSnackbarStore';

export interface CustomerFormValues {
  companyName: string;
  clientCode: string;
}

interface CustomerFormProps {
  mode: 'create' | 'edit';
  customerId?: string;
  initialValues?: CustomerFormValues;
}

export function CustomerForm({ mode, customerId, initialValues }: CustomerFormProps) {
  const { t } = useTranslation('customers');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const createState = useAppSelector((state) => state.customers.create);
  const updateState = useAppSelector((state) => state.customers.update);

  const defaultValues = useMemo<CustomerFormValues>(
    () => ({
      companyName: initialValues?.companyName ?? '',
      clientCode: initialValues?.clientCode ?? '',
    }),
    [initialValues]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setFocus,
  } = useForm<CustomerFormValues>({
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
            t('create.success', { defaultValue: 'Cliente creado correctamente.' }),
          severity: 'success',
        });
        router.replace(`/dashboard/customers/${createState.lastCreatedId}`);
        dispatch(resetCustomerCreate());
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
            t('edit.success', { defaultValue: 'Cliente actualizado correctamente.' }),
          severity: 'success',
        });
        router.replace(`/dashboard/customers/${updateState.lastUpdatedId}`);
        dispatch(resetCustomerUpdate());
      } else if (updateState.status === 'failed' && updateState.error) {
        showSnackbar({
          message: updateState.error,
          severity: 'error',
        });
      }
    }
  }, [createState, updateState, mode, dispatch, router, showSnackbar, t]);

  useEffect(
    () => () => {
      if (mode === 'create') {
        dispatch(resetCustomerCreate());
      } else {
        dispatch(resetCustomerUpdate());
      }
    },
    [dispatch, mode]
  );

  const onSubmit = handleSubmit((values) => {
    if (mode === 'create') {
      void dispatch(
        createCustomer({
          companyName: values.companyName.trim(),
          clientCode: values.clientCode.trim(),
        })
      );
    } else if (customerId) {
      void dispatch(
        updateCustomer({
          id: customerId,
          companyName: values.companyName.trim(),
          clientCode: values.clientCode.trim(),
        })
      );
    }
  });

  const isLoading = formState.status === 'loading' || isSubmitting;

  const fieldLabels = {
    company: t('create.fields.companyName'),
    clientCode: t('create.fields.clientCode'),
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
          <Label htmlFor="clientCode">{fieldLabels.clientCode}</Label>
          <Input
            id="clientCode"
            {...register('clientCode', {
              required: t('create.errors.clientCodeRequired') ?? 'Campo requerido',
              minLength: {
                value: 3,
                message: t('create.errors.clientCodeLength') ?? 'Muy corto',
              },
              pattern: {
                value: /^[A-Za-z0-9-_]+$/,
                message: t('create.errors.clientCodeFormat') ?? 'Formato inválido',
              },
            })}
            placeholder={t('create.placeholders.clientCode') ?? 'CLT-001'}
            disabled={isLoading}
          />
          {errors.clientCode ? (
            <p className="text-sm text-destructive">{errors.clientCode.message}</p>
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
          onClick={() => router.push('/dashboard/customers')}
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
