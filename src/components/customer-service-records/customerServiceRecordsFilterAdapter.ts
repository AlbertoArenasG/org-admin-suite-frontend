import type { TableFilterDateRangeValue } from '@/components/table-filter';
import type {
  CustomerServiceRecordOperationalStatus,
  CustomerServiceRecordsListFilters,
} from '@/features/customer-service-records';

export type CustomerServiceRecordsDateFieldId =
  | 'requestedAt'
  | 'receivedAt'
  | 'estimatedCustomerDeliveryAt'
  | 'providerEstimatedReturnAt';

type CustomerServiceRecordsDateFilterKey =
  | 'requestedAtFrom'
  | 'requestedAtTo'
  | 'receivedAtFrom'
  | 'receivedAtTo'
  | 'estimatedCustomerDeliveryAtFrom'
  | 'estimatedCustomerDeliveryAtTo'
  | 'providerEstimatedReturnAtFrom'
  | 'providerEstimatedReturnAtTo';

export interface CustomerServiceRecordsFilterDialogValue {
  serviceTypeCode: string | null;
  customerId: string | null;
  operationalStatus: CustomerServiceRecordOperationalStatus | null;
  providerId: string | null;
  hasProvider: boolean | null;
  dateRange: TableFilterDateRangeValue;
}

const dateFieldKeys: Record<
  CustomerServiceRecordsDateFieldId,
  readonly [CustomerServiceRecordsDateFilterKey, CustomerServiceRecordsDateFilterKey]
> = {
  requestedAt: ['requestedAtFrom', 'requestedAtTo'],
  receivedAt: ['receivedAtFrom', 'receivedAtTo'],
  estimatedCustomerDeliveryAt: ['estimatedCustomerDeliveryAtFrom', 'estimatedCustomerDeliveryAtTo'],
  providerEstimatedReturnAt: ['providerEstimatedReturnAtFrom', 'providerEstimatedReturnAtTo'],
};

const dateFields = Object.keys(dateFieldKeys) as CustomerServiceRecordsDateFieldId[];

function getActiveDateFields(filters: CustomerServiceRecordsListFilters) {
  return dateFields.filter((fieldId) => {
    const [fromKey, toKey] = dateFieldKeys[fieldId];
    return Boolean(filters[fromKey] || filters[toKey]);
  });
}

function clearDateFilters(filters: CustomerServiceRecordsListFilters) {
  const next = { ...filters };
  dateFields.forEach((fieldId) => {
    const [fromKey, toKey] = dateFieldKeys[fieldId];
    next[fromKey] = null;
    next[toKey] = null;
  });
  return next;
}

export function clearCustomerServiceRecordsListFilters(
  filters: CustomerServiceRecordsListFilters
): CustomerServiceRecordsListFilters {
  return clearDateFilters({
    ...filters,
    serviceTypeCode: null,
    customerId: null,
    operationalStatus: null,
    providerId: null,
    hasProvider: null,
  });
}

export function getCustomerServiceRecordsAppliedFilterCount(
  filters: CustomerServiceRecordsListFilters
) {
  const hasPeriod = getActiveDateFields(filters).length > 0;

  return [
    filters.serviceTypeCode !== null,
    filters.customerId !== null,
    filters.operationalStatus !== null,
    filters.providerId !== null,
    filters.hasProvider !== null,
    hasPeriod,
  ].filter(Boolean).length;
}

export function toCustomerServiceRecordsFilterDialogValue(
  filters: CustomerServiceRecordsListFilters
): CustomerServiceRecordsFilterDialogValue {
  const activeDateFields = getActiveDateFields(filters);
  const activeDateField = activeDateFields.length === 1 ? activeDateFields[0] : null;
  const dateRange = activeDateField
    ? (() => {
        const [fromKey, toKey] = dateFieldKeys[activeDateField];
        return {
          fieldId: activeDateField,
          from: filters[fromKey] as string | null,
          to: filters[toKey] as string | null,
        };
      })()
    : { fieldId: null, from: null, to: null };

  return {
    serviceTypeCode: filters.serviceTypeCode,
    customerId: filters.customerId,
    operationalStatus: filters.operationalStatus,
    providerId: filters.providerId,
    hasProvider: filters.hasProvider,
    dateRange,
  };
}

export function cloneCustomerServiceRecordsFilterDialogValue(
  value: CustomerServiceRecordsFilterDialogValue
): CustomerServiceRecordsFilterDialogValue {
  return { ...value, dateRange: { ...value.dateRange } };
}

export function createEmptyCustomerServiceRecordsFilterDialogValue(): CustomerServiceRecordsFilterDialogValue {
  return {
    serviceTypeCode: null,
    customerId: null,
    operationalStatus: null,
    providerId: null,
    hasProvider: null,
    dateRange: { fieldId: null, from: null, to: null },
  };
}

export function toCustomerServiceRecordsListFilters(
  value: CustomerServiceRecordsFilterDialogValue,
  currentFilters: CustomerServiceRecordsListFilters
): CustomerServiceRecordsListFilters {
  const next: CustomerServiceRecordsListFilters = {
    ...currentFilters,
    serviceTypeCode: value.serviceTypeCode,
    customerId: value.customerId,
    operationalStatus: value.operationalStatus,
    providerId: value.providerId,
    hasProvider: value.hasProvider,
  };

  const normalized = clearDateFilters(next);
  const fieldId = value.dateRange.fieldId as CustomerServiceRecordsDateFieldId | null;
  if (!fieldId || (!value.dateRange.from && !value.dateRange.to)) return normalized;

  const [fromKey, toKey] = dateFieldKeys[fieldId];
  normalized[fromKey] = value.dateRange.from;
  normalized[toKey] = value.dateRange.to;
  return normalized;
}

export function areCustomerServiceRecordsFilterDialogValuesEqual(
  left: CustomerServiceRecordsFilterDialogValue,
  right: CustomerServiceRecordsFilterDialogValue
) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function hasCustomerServiceRecordsFilterCriteria(
  value: CustomerServiceRecordsFilterDialogValue
) {
  return Boolean(
    value.serviceTypeCode ||
      value.customerId ||
      value.operationalStatus ||
      value.providerId ||
      value.hasProvider !== null ||
      value.dateRange.from ||
      value.dateRange.to
  );
}
