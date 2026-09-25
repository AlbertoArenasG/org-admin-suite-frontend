import { z } from 'zod';

import type {
  CustomerServiceRecordDetail,
  CustomerServiceRecordOperationalStatus,
} from '@/features/customer-service-records';

export type CustomerServiceRecordGeneralDetailsValues = {
  serviceTypeCode: string;
  requestedAt: string;
  operationalStatus: CustomerServiceRecordOperationalStatus;
  observations: string;
};

type CustomerServiceRecordGeneralDetailsValidationMessages = {
  required: string;
  invalidDate: string;
};

export function createCustomerServiceRecordGeneralDetailsSchema({
  invalidDate,
  required,
}: CustomerServiceRecordGeneralDetailsValidationMessages) {
  return z.object({
    serviceTypeCode: z.string().trim().min(1, required),
    requestedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, invalidDate),
    operationalStatus: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
    observations: z.string(),
  });
}

export function getCustomerServiceRecordGeneralDetailsDefaultValues(
  record: CustomerServiceRecordDetail
): CustomerServiceRecordGeneralDetailsValues {
  return {
    serviceTypeCode: record.serviceType.serviceTypeCode,
    requestedAt: record.requestedAt,
    operationalStatus: record.operationalStatus.code,
    observations: record.observations ?? '',
  };
}
