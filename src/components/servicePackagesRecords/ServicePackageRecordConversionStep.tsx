'use client';

import { Controller, type UseFormReturn } from 'react-hook-form';
import { FormCombobox, FormDateInput, FormField, FormMultiSelect } from '@/components/forms';
import { ResourceFormFrame, ResourceFormSection } from '@/components/resource-form';
import { Input } from '@/components/ui/input';
import type {
  ServicePackageConversionOption,
  ServicePackageRecordDetail,
} from '@/features/servicePackagesRecords';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import type { ServicePackageRecordConversionValues } from './servicePackageRecordConversionSchema';

type Props = {
  form: UseFormReturn<ServicePackageRecordConversionValues>;
  source: ServicePackageRecordDetail;
  index: number;
  customers: ServicePackageConversionOption[];
  serviceTypes: ServicePackageConversionOption[];
  users: ServicePackageConversionOption[];
  usersLoading: boolean;
  disabled: boolean;
  onCustomerChange: (customerId: string) => void;
};

export function ServicePackageRecordConversionStep({
  form,
  source,
  index,
  customers,
  serviceTypes,
  users,
  usersLoading,
  disabled,
  onCustomerChange,
}: Props) {
  const { t } = useTranslationHydrated('servicePackagesRecords');
  const values = form.watch(`records.${index}`);
  const errors = form.formState.errors.records?.[index];
  const comboboxCopy = {
    searchPlaceholder: t('conversion.search'),
    emptyMessage: t('conversion.noOptions'),
  };
  return (
    <ResourceFormFrame
      title={t('conversion.equipmentStep', {
        number: index + 1,
        total: source.details.equipment.length,
      })}
      mode="edit"
      surface={{ base: 'card', md: 'card' }}
      contentSurface={{ base: 'inset', md: 'inset' }}
      headerDensity="compact"
    >
      <ResourceFormSection surface="bare">
        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            control={form.control}
            name={`records.${index}.customerId`}
            render={({ field }) => (
              <FormField
                label={t('conversion.customer')}
                error={errors?.customerId ? t('conversion.required') : undefined}
              >
                <FormCombobox
                  id={`conversion-customer-${index}`}
                  ariaLabel={t('conversion.customer')}
                  options={customers}
                  value={field.value || null}
                  disabled={disabled}
                  invalid={Boolean(errors?.customerId)}
                  onValueChange={(value) => {
                    field.onChange(value ?? '');
                    form.setValue(`records.${index}.customerUserIds`, [], { shouldDirty: true });
                    if (value) onCustomerChange(value);
                  }}
                  placeholder={t('conversion.selectCustomer')}
                  {...comboboxCopy}
                />
              </FormField>
            )}
          />
          <Controller
            control={form.control}
            name={`records.${index}.serviceTypeCode`}
            render={({ field }) => (
              <FormField
                label={t('conversion.serviceType')}
                error={errors?.serviceTypeCode ? t('conversion.required') : undefined}
              >
                <FormCombobox
                  id={`conversion-service-type-${index}`}
                  ariaLabel={t('conversion.serviceType')}
                  options={serviceTypes}
                  value={field.value || null}
                  disabled={disabled}
                  invalid={Boolean(errors?.serviceTypeCode)}
                  onValueChange={(value) => field.onChange(value ?? '')}
                  placeholder={t('conversion.selectServiceType')}
                  {...comboboxCopy}
                />
              </FormField>
            )}
          />
          {values?.customerId ? (
            <Controller
              control={form.control}
              name={`records.${index}.customerUserIds`}
              render={({ field }) => (
                <FormField label={t('conversion.customerUsers')}>
                  <FormMultiSelect
                    id={`conversion-users-${index}`}
                    ariaLabel={t('conversion.customerUsers')}
                    options={users}
                    value={field.value}
                    disabled={disabled || usersLoading}
                    onValueChange={field.onChange}
                    placeholder={t('conversion.selectUsers')}
                    {...comboboxCopy}
                  />
                </FormField>
              )}
            />
          ) : null}
          <Controller
            control={form.control}
            name={`records.${index}.requestedAt`}
            render={({ field }) => (
              <FormField
                label={t('conversion.requestedAt')}
                error={errors?.requestedAt ? t('conversion.invalidDate') : undefined}
              >
                <FormDateInput
                  id={`conversion-requested-${index}`}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                  openCalendarLabel={t('conversion.openCalendar')}
                  invalidDateMessage={t('conversion.invalidDate')}
                />
              </FormField>
            )}
          />
          <Controller
            control={form.control}
            name={`records.${index}.receivedAt`}
            render={({ field }) => (
              <FormField
                label={t('conversion.receivedAt')}
                error={errors?.receivedAt ? t('conversion.invalidDate') : undefined}
              >
                <FormDateInput
                  id={`conversion-received-${index}`}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                  openCalendarLabel={t('conversion.openCalendar')}
                  invalidDateMessage={t('conversion.invalidDate')}
                />
              </FormField>
            )}
          />
          {(['name', 'identifier', 'brand', 'model', 'serialNumber'] as const).map((key) => (
            <FormField
              key={key}
              label={t(`conversion.asset.${key}`)}
              htmlFor={`conversion-${index}-${key}`}
              error={errors?.asset?.[key] ? t('conversion.required') : undefined}
            >
              <Input
                id={`conversion-${index}-${key}`}
                disabled={disabled}
                aria-invalid={Boolean(errors?.asset?.[key])}
                {...form.register(`records.${index}.asset.${key}`)}
              />
            </FormField>
          ))}
        </div>
      </ResourceFormSection>
    </ResourceFormFrame>
  );
}
