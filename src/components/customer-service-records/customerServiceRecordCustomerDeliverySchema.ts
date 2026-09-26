import { z } from 'zod';
import { format, isValid, parse } from 'date-fns';

import type {
  CustomerServiceRecordDetail,
  CustomerServiceRecordInterval,
  UpdateCustomerServiceRecordCustomerDeliveryPayload,
} from '@/features/customer-service-records';

const emptyInterval: CustomerServiceRecordInterval = {
  years: 0,
  months: 0,
  weeks: 0,
  days: 0,
};

function isIsoDate(value: string) {
  const parsed = parse(value, 'yyyy-MM-dd', new Date());
  return isValid(parsed) && format(parsed, 'yyyy-MM-dd') === value;
}

export function createCustomerServiceRecordCustomerDeliverySchema(messages: {
  required: string;
  invalidDate: string;
  invalidInterval: string;
}) {
  const optionalIsoDate = z
    .string()
    .refine((value) => !value || isIsoDate(value), messages.invalidDate);
  const intervalValue = z.number().int(messages.invalidInterval).min(0, messages.invalidInterval);

  return z.object({
    customerId: z.string().trim().min(1, messages.required),
    customerUserIds: z.array(z.string()),
    receivedAt: optionalIsoDate,
    estimatedDeliveryInterval: z.object({
      years: intervalValue,
      months: intervalValue,
      weeks: intervalValue,
      days: intervalValue,
    }),
    estimatedDeliveryAt: optionalIsoDate,
    deliveredToCustomerAt: optionalIsoDate,
    statusPolicyId: z.string(),
    notificationPolicyId: z.string(),
  });
}

export type CustomerServiceRecordCustomerDeliveryValues = z.infer<
  ReturnType<typeof createCustomerServiceRecordCustomerDeliverySchema>
>;

export function getCustomerServiceRecordCustomerDeliveryDefaultValues(
  record: CustomerServiceRecordDetail
): CustomerServiceRecordCustomerDeliveryValues {
  return {
    customerId: record.customer.customerId,
    customerUserIds: record.customer.users.map((user) => user.userId),
    receivedAt: record.customerDelivery.receivedAt ?? '',
    estimatedDeliveryInterval: record.customerDelivery.estimatedDeliveryInterval ?? emptyInterval,
    estimatedDeliveryAt: record.customerDelivery.estimatedDeliveryAt ?? '',
    deliveredToCustomerAt: record.customerDelivery.deliveredToCustomerAt ?? '',
    statusPolicyId: record.customerDelivery.statusPolicyId ?? '',
    notificationPolicyId: record.customerDelivery.notificationPolicyId ?? '',
  };
}

export function buildCustomerServiceRecordCustomerDeliveryPayload(
  values: CustomerServiceRecordCustomerDeliveryValues
): UpdateCustomerServiceRecordCustomerDeliveryPayload {
  return {
    customer: {
      customerId: values.customerId.trim(),
      customerUserIds: values.customerUserIds,
    },
    customerDelivery: {
      receivedAt: values.receivedAt || null,
      estimatedDeliveryInterval: values.estimatedDeliveryInterval,
      estimatedDeliveryAt: values.estimatedDeliveryAt || null,
      deliveredToCustomerAt: values.deliveredToCustomerAt || null,
      statusPolicyId: values.statusPolicyId || null,
      notificationPolicyId: values.notificationPolicyId || null,
    },
  };
}

export function calculateEstimatedDeliveryDate(
  receivedAt: string,
  interval: CustomerServiceRecordInterval
) {
  if (!receivedAt || !isIsoDate(receivedAt)) return '';

  const [year, month, day] = receivedAt.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCFullYear(date.getUTCFullYear() + interval.years);
  date.setUTCMonth(date.getUTCMonth() + interval.months);
  date.setUTCDate(date.getUTCDate() + interval.weeks * 7 + interval.days);

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(
    date.getUTCDate()
  ).padStart(2, '0')}`;
}

export function isEstimatedDeliveryDateExplicit(record: CustomerServiceRecordDetail) {
  const estimatedDate = record.customerDelivery.estimatedDeliveryAt;
  if (!estimatedDate) return false;

  return (
    estimatedDate !==
    calculateEstimatedDeliveryDate(
      record.customerDelivery.receivedAt ?? '',
      record.customerDelivery.estimatedDeliveryInterval
    )
  );
}
