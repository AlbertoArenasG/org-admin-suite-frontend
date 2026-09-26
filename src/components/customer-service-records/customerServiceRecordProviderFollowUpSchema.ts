import { format, isValid, parse } from 'date-fns';
import { z } from 'zod';

import type {
  CustomerServiceRecordDetail,
  CustomerServiceRecordInterval,
  UpdateCustomerServiceRecordProviderPayload,
} from '@/features/customer-service-records';

const emptyInterval: CustomerServiceRecordInterval = {
  years: 0,
  months: 0,
  weeks: 0,
  days: 0,
};

export type CustomerServiceRecordProviderFollowUpValues = {
  hasProvider: boolean;
  providerId: string;
  workOrderReference: string;
  deliveredToProviderAt: string;
  estimatedReturnInterval: CustomerServiceRecordInterval;
  estimatedReturnAt: string;
  returnedFromProviderAt: string;
  statusPolicyId: string;
  notificationPolicyId: string;
  followUpEnabled: boolean;
  followUpRules: Array<{
    interval: CustomerServiceRecordInterval;
    recipientGroupIds: string[];
    ccRecipientGroupIds: string[];
  }>;
};

function isIsoDate(value: string) {
  const parsed = parse(value, 'yyyy-MM-dd', new Date());
  return isValid(parsed) && format(parsed, 'yyyy-MM-dd') === value;
}

export function createCustomerServiceRecordProviderFollowUpSchema(messages: {
  required: string;
  invalidDate: string;
  invalidInterval: string;
}) {
  const optionalDate = z
    .string()
    .refine((value) => !value || isIsoDate(value), messages.invalidDate);
  const intervalValue = z.number().int(messages.invalidInterval).min(0, messages.invalidInterval);
  const interval = z.object({
    years: intervalValue,
    months: intervalValue,
    weeks: intervalValue,
    days: intervalValue,
  });

  return z
    .object({
      hasProvider: z.boolean(),
      providerId: z.string(),
      workOrderReference: z.string(),
      deliveredToProviderAt: optionalDate,
      estimatedReturnInterval: interval,
      estimatedReturnAt: optionalDate,
      returnedFromProviderAt: optionalDate,
      statusPolicyId: z.string(),
      notificationPolicyId: z.string(),
      followUpEnabled: z.boolean(),
      followUpRules: z.array(
        z.object({
          interval,
          recipientGroupIds: z.array(z.string()),
          ccRecipientGroupIds: z.array(z.string()),
        })
      ),
    })
    .superRefine((values, context) => {
      if (values.hasProvider && !values.providerId.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.required,
          path: ['providerId'],
        });
      }
    });
}

export function getCustomerServiceRecordProviderFollowUpDefaultValues(
  record: CustomerServiceRecordDetail
): CustomerServiceRecordProviderFollowUpValues {
  const provider = record.provider;

  return {
    hasProvider: Boolean(provider),
    providerId: provider?.providerId ?? '',
    workOrderReference: provider?.workOrderReference ?? '',
    deliveredToProviderAt: provider?.deliveredToProviderAt ?? '',
    estimatedReturnInterval: provider?.estimatedReturnInterval ?? emptyInterval,
    estimatedReturnAt: provider?.estimatedReturnAt ?? '',
    returnedFromProviderAt: provider?.returnedFromProviderAt ?? '',
    statusPolicyId: provider?.statusPolicyId ?? '',
    notificationPolicyId: provider?.notificationPolicyId ?? '',
    followUpEnabled: provider?.followUp.enabled ?? false,
    followUpRules:
      provider?.followUp.rules.map((rule) => ({
        interval: rule.interval,
        recipientGroupIds: rule.recipientGroupIds,
        ccRecipientGroupIds: rule.ccRecipientGroupIds,
      })) ?? [],
  };
}

export function buildCustomerServiceRecordProviderUpdatePayload(
  values: CustomerServiceRecordProviderFollowUpValues
): UpdateCustomerServiceRecordProviderPayload {
  if (!values.hasProvider) {
    return { provider: null };
  }

  return {
    provider: {
      providerId: values.providerId.trim(),
      workOrderReference: values.workOrderReference.trim() || null,
      deliveredToProviderAt: values.deliveredToProviderAt || null,
      estimatedReturnInterval: values.estimatedReturnInterval,
      estimatedReturnAt: values.estimatedReturnAt || null,
      returnedFromProviderAt: values.returnedFromProviderAt || null,
      statusPolicyId: values.statusPolicyId || null,
      notificationPolicyId: values.notificationPolicyId || null,
      followUp: {
        enabled: values.followUpEnabled,
        rules: values.followUpRules.map((rule) => ({
          interval: rule.interval,
          recipientGroupIds: rule.recipientGroupIds,
          ccRecipientGroupIds: rule.ccRecipientGroupIds,
        })),
      },
    },
  };
}

export function calculateEstimatedReturnDate(
  deliveredToProviderAt: string,
  interval: CustomerServiceRecordInterval
) {
  if (!deliveredToProviderAt || !isIsoDate(deliveredToProviderAt)) return '';

  const [year, month, day] = deliveredToProviderAt.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCFullYear(date.getUTCFullYear() + interval.years);
  date.setUTCMonth(date.getUTCMonth() + interval.months);
  date.setUTCDate(date.getUTCDate() + interval.weeks * 7 + interval.days);

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(
    date.getUTCDate()
  ).padStart(2, '0')}`;
}

export function isEstimatedReturnDateExplicit(record: CustomerServiceRecordDetail) {
  const provider = record.provider;
  if (!provider?.estimatedReturnAt) return false;

  return (
    provider.estimatedReturnAt !==
    calculateEstimatedReturnDate(
      provider.deliveredToProviderAt ?? '',
      provider.estimatedReturnInterval
    )
  );
}

export const emptyCustomerServiceRecordProviderFollowUpRule = {
  interval: emptyInterval,
  recipientGroupIds: [],
  ccRecipientGroupIds: [],
};
