import { z } from 'zod';
import { format, isValid, parse } from 'date-fns';

import type {
  CreateCustomerServiceRecordPayload,
  CustomerServiceRecordCreateValues,
} from '@/features/customer-service-records';

const requiredText = z.string().trim().min(1, 'required');
const validIsoDate = z.string().refine((value) => {
  const parsed = parse(value, 'yyyy-MM-dd', new Date());
  return isValid(parsed) && format(parsed, 'yyyy-MM-dd') === value;
}, 'invalidDate');

export const customerServiceRecordCreateSchema = z.object({
  serviceTypeCode: requiredText,
  requestedAt: validIsoDate,
  customerId: requiredText,
  customerUserIds: z.array(z.string()),
  asset: z.object({
    name: requiredText,
    identifier: requiredText,
    brand: requiredText,
    model: requiredText,
    serialNumber: requiredText,
  }),
});

export const customerServiceRecordCreateRequestFields = [
  'serviceTypeCode',
  'requestedAt',
  'customerId',
  'customerUserIds',
] as const;

export const customerServiceRecordCreateAssetFields = [
  'asset.name',
  'asset.identifier',
  'asset.brand',
  'asset.model',
  'asset.serialNumber',
] as const;

export function getCustomerServiceRecordCreateDefaultValues(): CustomerServiceRecordCreateValues {
  const now = new Date();
  const requestedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;

  return {
    serviceTypeCode: '',
    requestedAt,
    customerId: '',
    customerUserIds: [],
    asset: { name: '', identifier: '', brand: '', model: '', serialNumber: '' },
  };
}

export function buildCustomerServiceRecordCreatePayload(
  values: CustomerServiceRecordCreateValues
): CreateCustomerServiceRecordPayload {
  return {
    serviceTypeCode: values.serviceTypeCode.trim(),
    requestedAt: values.requestedAt,
    observations: null,
    customer: {
      customerId: values.customerId,
      customerUserIds: values.customerUserIds,
    },
    assets: [
      {
        name: values.asset.name.trim(),
        identifier: values.asset.identifier.trim(),
        brand: values.asset.brand.trim(),
        model: values.asset.model.trim(),
        serialNumber: values.asset.serialNumber.trim(),
        observations: null,
      },
    ],
  };
}
