import { z } from 'zod';

import type { CustomerServiceRecordDetail } from '@/features/customer-service-records';

type CustomerServiceRecordAsset = CustomerServiceRecordDetail['assets'][number];

export function createCustomerServiceRecordEquipmentSchema(required: string) {
  const requiredText = z.string().trim().min(1, required);

  return z.object({
    name: requiredText,
    identifier: requiredText,
    brand: requiredText,
    model: requiredText,
    serialNumber: requiredText,
    observations: z.string(),
  });
}

export type CustomerServiceRecordEquipmentValues = z.infer<
  ReturnType<typeof createCustomerServiceRecordEquipmentSchema>
>;

export function getCustomerServiceRecordEquipmentDefaultValues(
  asset: CustomerServiceRecordAsset
): CustomerServiceRecordEquipmentValues {
  return {
    name: asset.name,
    identifier: asset.identifier,
    brand: asset.brand,
    model: asset.model,
    serialNumber: asset.serialNumber,
    observations: asset.observations ?? '',
  };
}
