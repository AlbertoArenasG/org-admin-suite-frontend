'use client';

import { type FieldErrors, type UseFormRegister } from 'react-hook-form';

import { FormField } from '@/components/forms';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { CustomerServiceRecordCreateValues } from '@/features/customer-service-records';

type CustomerServiceRecordCreateAssetStepProps = {
  register: UseFormRegister<CustomerServiceRecordCreateValues>;
  errors: FieldErrors<CustomerServiceRecordCreateValues>;
  disabled: boolean;
  labels: {
    name: string;
    identifier: string;
    brand: string;
    model: string;
    serialNumber: string;
    required: string;
  };
};

export function CustomerServiceRecordCreateAssetStep({
  disabled,
  errors,
  labels,
  register,
}: CustomerServiceRecordCreateAssetStepProps) {
  const fields = [
    ['name', labels.name],
    ['identifier', labels.identifier],
    ['brand', labels.brand],
    ['model', labels.model],
    ['serialNumber', labels.serialNumber],
  ] as const;

  return (
    <FieldGroup>
      {fields.map(([field, label]) => {
        const id = `customer-service-record-create-asset-${field}`;
        const error = errors.asset?.[field];

        return (
          <FormField
            key={field}
            htmlFor={id}
            label={label}
            orientation="responsive"
            error={error ? labels.required : undefined}
          >
            <Input
              id={id}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              {...register(`asset.${field}`)}
            />
          </FormField>
        );
      })}
    </FieldGroup>
  );
}
