import type {
  InternalAssetMaintenanceInterval,
  InternalAssetMaintenanceRecordDetail,
  InternalAssetMaintenanceRecordStatusId,
  InternalAssetMaintenanceTypeId,
} from '@/features/internal-asset-control/types';

export interface InternalAssetControlFormRuleValues {
  offset: InternalAssetMaintenanceInterval;
  recipientGroupIds: string[];
  ccRecipientGroupIds: string[];
}

export interface InternalAssetControlFormValues {
  assetName: string;
  assetIdentifier: string;
  assetMaintenanceType: InternalAssetMaintenanceTypeId;
  statusId: InternalAssetMaintenanceRecordStatusId;
  lastMaintenanceAt: string;
  interval: InternalAssetMaintenanceInterval;
  expirationDate: string;
  observations: string;
  expirationStatusPolicyId: string;
  expirationNotificationPolicyId: string;
  sentToProvider: boolean;
  providerName: string;
  sentToProviderAt: string;
  providerLeadTime: InternalAssetMaintenanceInterval;
  providerNotes: string;
  providerFollowUpEnabled: boolean;
  providerFollowUpRules: InternalAssetControlFormRuleValues[];
}

const EMPTY_INTERVAL: InternalAssetMaintenanceInterval = {
  years: 0,
  months: 0,
  weeks: 0,
  days: 0,
};

export const EMPTY_INTERNAL_ASSET_CONTROL_RULE: InternalAssetControlFormRuleValues = {
  offset: {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
  },
  recipientGroupIds: [],
  ccRecipientGroupIds: [],
};

export function cloneInterval(
  interval?: InternalAssetMaintenanceInterval | null
): InternalAssetMaintenanceInterval {
  if (!interval) {
    return { ...EMPTY_INTERVAL };
  }

  return {
    years: interval.years ?? 0,
    months: interval.months ?? 0,
    weeks: interval.weeks ?? 0,
    days: interval.days ?? 0,
  };
}

function toInputDate(value?: string | null) {
  if (!value) {
    return '';
  }

  return value.slice(0, 10);
}

export function buildInternalAssetControlInitialValues(
  record?: InternalAssetMaintenanceRecordDetail | null
): InternalAssetControlFormValues {
  return {
    assetName: record?.assetName ?? '',
    assetIdentifier: record?.assetIdentifier ?? '',
    assetMaintenanceType: record?.assetMaintenanceType.code ?? 'CALIBRATION',
    statusId: record?.statusId ?? 'PENDING',
    lastMaintenanceAt: toInputDate(record?.lastMaintenanceAt),
    interval: cloneInterval(record?.interval),
    expirationDate: toInputDate(record?.expirationDate),
    observations: record?.observations ?? '',
    expirationStatusPolicyId: record?.expirationStatusPolicy?.id ?? '',
    expirationNotificationPolicyId: record?.expirationNotificationPolicy?.id ?? '',
    sentToProvider: record?.provider?.sentToProvider ?? false,
    providerName: record?.provider?.providerName ?? '',
    sentToProviderAt: toInputDate(record?.provider?.sentToProviderAt),
    providerLeadTime: cloneInterval(record?.provider?.providerLeadTime),
    providerNotes: record?.provider?.providerNotes ?? '',
    providerFollowUpEnabled: record?.providerFollowUp?.enabled ?? false,
    providerFollowUpRules:
      record?.providerFollowUp?.rules.map((rule) => ({
        offset: cloneInterval(rule.offset),
        recipientGroupIds: [...rule.recipientGroupIds],
        ccRecipientGroupIds: [...rule.ccRecipientGroupIds],
      })) ?? [],
  };
}
