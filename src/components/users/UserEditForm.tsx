'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { z } from 'zod';

import {
  FormCombobox,
  FormField,
  FormMultiSelect,
  FormReadValue,
  FormValueChips,
  PhoneInput,
  type PhoneValue,
} from '@/components/forms';
import { Button } from '@/components/ui/button';
import { RadioGroup } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  ResourceFormActions,
  ResourceFormFrame,
  ResourceFormSection,
  type ResourceFormMode,
} from '@/components/resource-form';
import type { CustomerOption } from '@/features/customers';
import type { AuthSystemRole } from '@/features/auth/types';
import type { User, UserRoleInfo } from '@/features/users/usersSlice';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

export type UserEditValues = {
  name: string;
  lastname: string;
  email: string;
  roleId: string;
  cellPhone: PhoneValue;
  isInternalStaff: boolean;
  customerIds: string[];
};

type UserEditFormProps = {
  user: User;
  mode: ResourceFormMode;
  roleOptions: readonly UserRoleInfo[];
  customerOptions: readonly CustomerOption[];
  customerOptionsLoading: boolean;
  onCustomerOptionsRequired: () => void;
  onModeChange: (mode: ResourceFormMode) => void;
  onSubmit: (values: UserEditValues, systemRole: AuthSystemRole) => Promise<void>;
  onOpenPassword: () => void;
  canUpdateUser: boolean;
  canUpdatePassword: boolean;
  isSubmitting: boolean;
};

export function UserEditForm({
  canUpdateUser,
  canUpdatePassword,
  customerOptions,
  customerOptionsLoading,
  isSubmitting,
  mode,
  onCustomerOptionsRequired,
  onModeChange,
  onOpenPassword,
  onSubmit,
  roleOptions,
  user,
}: UserEditFormProps) {
  const { t } = useTranslationHydrated('users');
  const form = useForm<UserEditValues>({
    resolver: zodResolver(
      z.object({
        name: z.string().trim(),
        lastname: z.string().trim(),
        email: z.string().trim().email(t('form.errors.emailInvalid')),
        roleId: z.string().min(1, t('form.errors.roleRequired')),
        cellPhone: z.object({ countryCode: z.string(), number: z.string() }),
        isInternalStaff: z.boolean(),
        customerIds: z.array(z.string()),
      })
    ),
    defaultValues: getDefaultValues(user),
  });
  const selectedRoleId = form.watch('roleId');
  const selectedRole = roleOptions.find((role) => role.roleId === selectedRoleId);
  const selectedSystemRole = selectedRole?.systemRole ?? user.systemRole;
  const isCustomerRole = selectedSystemRole === 'USER';

  useEffect(() => {
    form.reset(getDefaultValues(user));
  }, [form, user]);

  useEffect(() => {
    if (isCustomerRole) {
      onCustomerOptionsRequired();
    }
  }, [isCustomerRole, onCustomerOptionsRequired]);

  useEffect(() => {
    if (!isCustomerRole) {
      form.setValue('customerIds', []);
      form.setValue('isInternalStaff', true);
    }
  }, [form, isCustomerRole]);

  const submit = async (values: UserEditValues) => {
    await onSubmit(values, selectedSystemRole);
  };
  const isReadOnly = mode === 'read';
  const roleSelectOptions = roleOptions.map((role) => ({
    value: role.roleId,
    label: role.roleName,
  }));
  const customerSelectOptions = customerOptions.map((customer) => ({
    value: customer.id,
    label: customer.companyName,
  }));

  return (
    <form onSubmit={form.handleSubmit(submit)}>
      <ResourceFormFrame
        contentSurface={{ base: 'bare', md: 'inset' }}
        density={{ base: 'compact', md: 'comfortable' }}
        dividers="hidden"
        headerActions={
          (isReadOnly && canUpdateUser) || canUpdatePassword ? (
            <div className="flex flex-wrap items-center justify-end gap-2">
              {isReadOnly && canUpdateUser ? (
                <Button onClick={() => onModeChange('edit')} type="button">
                  {t('edit.start')}
                </Button>
              ) : null}
              {canUpdatePassword ? (
                <Button onClick={onOpenPassword} size="sm" type="button" variant="outline">
                  {t('passwordDialog.open')}
                </Button>
              ) : null}
            </div>
          ) : null
        }
        description={t('detail.formDescription')}
        footerActions={
          !isReadOnly ? (
            <ResourceFormActions
              cancelAction={{
                label: t('form.cancel'),
                onClick: () => {
                  form.reset(getDefaultValues(user));
                  onModeChange('read');
                },
              }}
              primaryAction={{ label: t('form.submit.edit'), loadingLabel: t('form.submitting') }}
              status={isSubmitting ? 'saving' : 'idle'}
            />
          ) : null
        }
        mode={mode}
        surface={{ base: 'bare', md: 'card' }}
        title={t('detail.formTitle')}
      >
        <div className="grid gap-5">
          <ResourceFormSection
            description={t('edit.generalDescription')}
            surface="bare"
            title={t('edit.generalTitle')}
          >
            <div className="grid min-w-0 gap-4 md:grid-cols-2">
              <TextField
                disabled={isReadOnly}
                error={form.formState.errors.name?.message}
                label={t('form.labels.name')}
                readValue={user.name}
                registration={form.register('name')}
              />
              <TextField
                disabled={isReadOnly}
                error={form.formState.errors.lastname?.message}
                label={t('form.labels.lastname')}
                readValue={user.lastname}
                registration={form.register('lastname')}
              />
              <TextField
                disabled={isReadOnly}
                error={form.formState.errors.email?.message}
                label={t('form.labels.email')}
                readValue={user.email}
                registration={form.register('email')}
                type="email"
              />
              <Controller
                control={form.control}
                name="cellPhone"
                render={({ field, fieldState }) => (
                  <FormField label={t('edit.phone')} error={fieldState.error?.message}>
                    {isReadOnly ? (
                      <FormReadValue>{formatPhone(field.value)}</FormReadValue>
                    ) : (
                      <PhoneInput
                        countryPlaceholder={t('edit.countryPlaceholder')}
                        countrySearchPlaceholder={t('edit.countrySearchPlaceholder')}
                        countryLabels={{
                          MX: t('edit.countries.mx'),
                          US: t('edit.countries.us'),
                          CA: t('edit.countries.ca'),
                        }}
                        emptyCountryMessage={t('edit.countryEmpty')}
                        invalid={fieldState.invalid}
                        onValueChange={(values) => field.onChange(values)}
                        placeholder={t('form.placeholders.phoneNumber')}
                        value={field.value}
                      />
                    )}
                  </FormField>
                )}
              />
            </div>
          </ResourceFormSection>

          <Separator />

          <ResourceFormSection
            description={t('edit.accessDescription')}
            surface="bare"
            title={t('edit.accessTitle')}
          >
            <div className="grid min-w-0 gap-4 md:grid-cols-2">
              <Controller
                control={form.control}
                name="roleId"
                render={({ field, fieldState }) => (
                  <FormField label={t('form.labels.role')} error={fieldState.error?.message}>
                    {isReadOnly ? (
                      <FormReadValue>
                        {selectedRole?.roleName ?? user.roleName ?? '—'}
                      </FormReadValue>
                    ) : (
                      <FormCombobox
                        emptyMessage={t('edit.roleEmpty')}
                        invalid={fieldState.invalid}
                        onValueChange={(value) => field.onChange(value ?? '')}
                        options={roleSelectOptions}
                        placeholder={t('edit.rolePlaceholder')}
                        searchPlaceholder={t('edit.roleSearchPlaceholder')}
                        value={field.value || null}
                      />
                    )}
                  </FormField>
                )}
              />
              {isCustomerRole ? (
                <Controller
                  control={form.control}
                  name="isInternalStaff"
                  render={({ field }) => (
                    <FormField label={t('classification.label')}>
                      <RadioGroup
                        aria-label={t('classification.group')}
                        name="isInternalStaff"
                        onValueChange={(value) => field.onChange(value === 'true')}
                        options={[
                          { label: t('classification.yes'), value: 'true' },
                          { label: t('classification.no'), value: 'false' },
                        ]}
                        readOnly={isReadOnly}
                        value={String(field.value)}
                        variant="bare"
                      />
                    </FormField>
                  )}
                />
              ) : null}
            </div>
            {isCustomerRole ? (
              <div className="mt-4 min-w-0">
                <Controller
                  control={form.control}
                  name="customerIds"
                  render={({ field, fieldState }) => (
                    <FormField label={t('form.labels.customers')} error={fieldState.error?.message}>
                      {isReadOnly ? (
                        <FormReadValue className="flex min-h-10 items-center">
                          <FormValueChips
                            items={selectedCustomerNames(field.value, customerOptions)}
                          />
                        </FormReadValue>
                      ) : (
                        <FormMultiSelect
                          disabled={customerOptionsLoading}
                          emptyMessage={t('form.customers.noOptions')}
                          invalid={fieldState.invalid}
                          onValueChange={field.onChange}
                          options={customerSelectOptions}
                          placeholder={
                            customerOptionsLoading
                              ? t('form.customers.loading')
                              : t('form.placeholders.customers')
                          }
                          removeItemLabel={(option) =>
                            t('form.customers.remove', { customer: option.label })
                          }
                          searchPlaceholder={t('form.placeholders.customers')}
                          value={field.value}
                        />
                      )}
                    </FormField>
                  )}
                />
              </div>
            ) : null}
          </ResourceFormSection>
        </div>
      </ResourceFormFrame>
    </form>
  );
}

function getDefaultValues(user: User): UserEditValues {
  return {
    name: user.name ?? '',
    lastname: user.lastname ?? '',
    email: user.email,
    roleId: user.roleId ?? '',
    cellPhone: {
      countryCode: user.cellPhone?.countryCode ?? '+52',
      number: user.cellPhone?.number ?? '',
    },
    isInternalStaff: user.isInternalStaff,
    customerIds: user.customers?.map((customer) => customer.id) ?? [],
  };
}

function TextField({
  disabled,
  error,
  label,
  readValue,
  registration,
  type = 'text',
}: {
  disabled: boolean;
  error?: string;
  label: string;
  readValue: string;
  registration: UseFormRegisterReturn;
  type?: string;
}) {
  return (
    <FormField label={label} error={error}>
      {disabled ? (
        <FormReadValue>{readValue || '—'}</FormReadValue>
      ) : (
        <input
          aria-invalid={Boolean(error) || undefined}
          className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          type={type}
          {...registration}
        />
      )}
    </FormField>
  );
}

function formatPhone(value: PhoneValue) {
  return value.number ? `${value.countryCode} ${value.number}` : '—';
}

function selectedCustomerNames(ids: readonly string[], customers: readonly CustomerOption[]) {
  return ids.map((id) => customers.find((customer) => customer.id === id)?.companyName ?? id);
}
