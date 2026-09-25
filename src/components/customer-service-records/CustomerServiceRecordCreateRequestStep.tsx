'use client';

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
  useWatch,
} from 'react-hook-form';

import {
  FormCombobox,
  FormDateInput,
  FormField,
  FormMultiSelect,
  type FormSelectOption,
} from '@/components/forms';
import { FieldGroup } from '@/components/ui/field';
import type { CustomerServiceRecordCreateValues } from '@/features/customer-service-records';

type CustomerServiceRecordCreateRequestStepProps = {
  control: Control<CustomerServiceRecordCreateValues>;
  errors: FieldErrors<CustomerServiceRecordCreateValues>;
  setValue: UseFormSetValue<CustomerServiceRecordCreateValues>;
  serviceTypes: FormSelectOption[];
  customers: FormSelectOption[];
  customerUsers: FormSelectOption[];
  customerUsersLoading: boolean;
  disabled: boolean;
  labels: {
    serviceType: string;
    requestedAt: string;
    customer: string;
    customerUsers: string;
    serviceTypePlaceholder: string;
    customerPlaceholder: string;
    customerUsersPlaceholder: string;
    searchOptions: string;
    noOptions: string;
    openCalendar: string;
    invalidDate: string;
    required: string;
  };
  onCustomerChange: (customerId: string | null) => void;
};

export function CustomerServiceRecordCreateRequestStep({
  control,
  customerUsers,
  customerUsersLoading,
  customers,
  disabled,
  errors,
  labels,
  onCustomerChange,
  serviceTypes,
  setValue,
}: CustomerServiceRecordCreateRequestStepProps) {
  const customerId = useWatch({ control, name: 'customerId' });

  return (
    <FieldGroup>
      <Controller
        control={control}
        name="serviceTypeCode"
        render={({ field }) => (
          <FormField
            label={labels.serviceType}
            orientation="responsive"
            error={errors.serviceTypeCode ? labels.required : undefined}
          >
            <FormCombobox
              id="customer-service-record-create-service-type"
              ariaLabel={labels.serviceType}
              disabled={disabled}
              invalid={Boolean(errors.serviceTypeCode)}
              options={serviceTypes}
              value={field.value || null}
              onValueChange={(value) => field.onChange(value ?? '')}
              placeholder={labels.serviceTypePlaceholder}
              searchPlaceholder={labels.searchOptions}
              emptyMessage={labels.noOptions}
            />
          </FormField>
        )}
      />
      <Controller
        control={control}
        name="requestedAt"
        render={({ field }) => (
          <FormField
            htmlFor="customer-service-record-create-requested-at"
            label={labels.requestedAt}
            orientation="responsive"
            error={errors.requestedAt ? labels.invalidDate : undefined}
          >
            <FormDateInput
              id="customer-service-record-create-requested-at"
              disabled={disabled}
              value={field.value}
              onValueChange={field.onChange}
              openCalendarLabel={labels.openCalendar}
              invalidDateMessage={labels.invalidDate}
            />
          </FormField>
        )}
      />
      <Controller
        control={control}
        name="customerId"
        render={({ field }) => (
          <FormField
            label={labels.customer}
            orientation="responsive"
            error={errors.customerId ? labels.required : undefined}
          >
            <FormCombobox
              id="customer-service-record-create-customer"
              ariaLabel={labels.customer}
              disabled={disabled}
              invalid={Boolean(errors.customerId)}
              options={customers}
              value={field.value || null}
              onValueChange={(value) => {
                field.onChange(value ?? '');
                setValue('customerUserIds', [], { shouldDirty: true, shouldValidate: true });
                onCustomerChange(value);
              }}
              placeholder={labels.customerPlaceholder}
              searchPlaceholder={labels.searchOptions}
              emptyMessage={labels.noOptions}
            />
          </FormField>
        )}
      />
      {customerId ? (
        <Controller
          control={control}
          name="customerUserIds"
          render={({ field }) => (
            <FormField label={labels.customerUsers} orientation="responsive">
              <FormMultiSelect
                id="customer-service-record-create-customer-users"
                ariaLabel={labels.customerUsers}
                disabled={disabled || customerUsersLoading}
                options={customerUsers}
                value={field.value}
                onValueChange={field.onChange}
                placeholder={labels.customerUsersPlaceholder}
                searchPlaceholder={labels.searchOptions}
                emptyMessage={labels.noOptions}
              />
            </FormField>
          )}
        />
      ) : null}
    </FieldGroup>
  );
}
