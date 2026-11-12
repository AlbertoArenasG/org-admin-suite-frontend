import { format, isValid, parse } from 'date-fns';
import { z } from 'zod';
import type { ServicePackageRecordDetail } from '@/features/servicePackagesRecords';
import type { ServicePackageConversionRecord } from '@/features/servicePackagesRecords/servicePackageConversionThunks';

const text = z.string().trim().min(1);
const date = z.string().refine((value) => {
  const parsed = parse(value, 'yyyy-MM-dd', new Date());
  return isValid(parsed) && format(parsed, 'yyyy-MM-dd') === value;
});

export const servicePackageRecordConversionSchema = z.object({
  records: z
    .array(
      z.object({
        equipmentIndex: z.number().int().nonnegative(),
        customerId: text,
        customerUserIds: z.array(z.string()),
        serviceTypeCode: text,
        requestedAt: date,
        receivedAt: z.union([date, z.literal('')]),
        asset: z.object({
          name: text,
          identifier: text,
          brand: text,
          model: text,
          serialNumber: text,
          observations: z.string().nullable(),
        }),
        photoFileIds: z.array(z.string()),
      })
    )
    .min(1),
});

export type ServicePackageRecordConversionValues = z.infer<
  typeof servicePackageRecordConversionSchema
>;

export function getConversionDefaults(
  source: ServicePackageRecordDetail
): ServicePackageRecordConversionValues {
  const receivedAt = source.visitDate?.slice(0, 10) || '';
  return {
    records: source.details.equipment.map((item, equipmentIndex) => ({
      equipmentIndex,
      customerId: '',
      customerUserIds: [],
      serviceTypeCode: '',
      requestedAt: '',
      receivedAt,
      asset: {
        name: item.equipment ?? '',
        identifier: item.identification ?? '',
        brand: item.brand ?? '',
        model: item.model ?? '',
        serialNumber: item.serialNumber ?? '',
        observations: null,
      },
      photoFileIds: [],
    })),
  };
}

export function buildConversionPayload(
  values: ServicePackageRecordConversionValues
): ServicePackageConversionRecord[] {
  return values.records.map((record) => ({
    ...record,
    receivedAt: record.receivedAt || null,
    asset: {
      name: record.asset.name.trim(),
      identifier: record.asset.identifier.trim(),
      brand: record.asset.brand.trim(),
      model: record.asset.model.trim(),
      serialNumber: record.asset.serialNumber.trim(),
      observations: record.asset.observations?.trim() || null,
    },
  }));
}
