import type { SortingState } from '@tanstack/react-table';
import type {
  CustomerServiceRecordsListFilters,
  CustomerServiceRecordsListSort,
  CustomerServiceRecordSortField,
} from '@/features/customer-service-records';

const SORT_COLUMN_FIELD_MAP: Record<string, CustomerServiceRecordSortField> = {
  serviceNumber: 'service_number',
  requestedAt: 'requested_at',
  customerDeliveryAt: 'estimated_customer_delivery_at',
  providerReturnAt: 'provider_estimated_return_at',
  operationalStatus: 'operational_status',
  createdAt: 'created_at',
};

const FIELD_COLUMN_MAP = Object.fromEntries(
  Object.entries(SORT_COLUMN_FIELD_MAP).map(([column, field]) => [field, column])
);

const FILTER_PARAM_MAP: Record<keyof CustomerServiceRecordsListFilters, string> = {
  operationalStatus: 'operational_status',
  serviceTypeCode: 'service_type_code',
  customerId: 'customer_id',
  providerId: 'provider_id',
  hasProvider: 'has_provider',
  requestedAtFrom: 'requested_at_from',
  requestedAtTo: 'requested_at_to',
  receivedAtFrom: 'received_at_from',
  receivedAtTo: 'received_at_to',
  estimatedCustomerDeliveryAtFrom: 'estimated_customer_delivery_at_from',
  estimatedCustomerDeliveryAtTo: 'estimated_customer_delivery_at_to',
  providerEstimatedReturnAtFrom: 'provider_estimated_return_at_from',
  providerEstimatedReturnAtTo: 'provider_estimated_return_at_to',
};

export function mapCustomerServiceRecordsSortingToApi(
  sorting: SortingState
): CustomerServiceRecordsListSort[] {
  return sorting.flatMap((sort) => {
    const field = SORT_COLUMN_FIELD_MAP[sort.id];
    return field ? [{ field, direction: sort.desc ? 'desc' : 'asc' }] : [];
  });
}

export function parseCustomerServiceRecordsSortingFromParams(
  params: URLSearchParams
): SortingState {
  const buckets = new Map<number, { field?: string; direction?: string }>();

  for (const [key, value] of params.entries()) {
    const match = key.match(/^sort\[(\d+)\]\[(field|direction)\]$/);
    if (!match) continue;

    const index = Number(match[1]);
    const property = match[2] as 'field' | 'direction';
    const bucket = buckets.get(index) ?? {};
    bucket[property] = value;
    buckets.set(index, bucket);
  }

  return Array.from(buckets.entries())
    .sort(([left], [right]) => left - right)
    .flatMap(([, bucket]) => {
      const columnId = bucket.field ? FIELD_COLUMN_MAP[bucket.field] : null;
      return columnId ? [{ id: columnId, desc: bucket.direction === 'desc' }] : [];
    });
}

export function parseCustomerServiceRecordsFiltersFromParams(
  params: URLSearchParams
): CustomerServiceRecordsListFilters {
  const operationalStatus = params.get('operational_status');
  return {
    operationalStatus:
      operationalStatus === 'PENDING' ||
      operationalStatus === 'IN_PROGRESS' ||
      operationalStatus === 'COMPLETED' ||
      operationalStatus === 'CANCELLED'
        ? operationalStatus
        : null,
    serviceTypeCode: params.get('service_type_code'),
    customerId: params.get('customer_id'),
    providerId: params.get('provider_id'),
    hasProvider:
      params.get('has_provider') === 'true'
        ? true
        : params.get('has_provider') === 'false'
          ? false
          : null,
    requestedAtFrom: params.get('requested_at_from'),
    requestedAtTo: params.get('requested_at_to'),
    receivedAtFrom: params.get('received_at_from'),
    receivedAtTo: params.get('received_at_to'),
    estimatedCustomerDeliveryAtFrom: params.get('estimated_customer_delivery_at_from'),
    estimatedCustomerDeliveryAtTo: params.get('estimated_customer_delivery_at_to'),
    providerEstimatedReturnAtFrom: params.get('provider_estimated_return_at_from'),
    providerEstimatedReturnAtTo: params.get('provider_estimated_return_at_to'),
  };
}

export function buildCustomerServiceRecordsQuery(input: {
  pageIndex: number;
  pageSize: number;
  search: string;
  sorting: SortingState;
  filters: CustomerServiceRecordsListFilters;
  baseParams: URLSearchParams;
}) {
  const params = new URLSearchParams(input.baseParams.toString());
  params.set('page', String(input.pageIndex + 1));
  params.set('limit', String(input.pageSize));

  if (input.search.trim()) params.set('search', input.search.trim());
  else params.delete('search');

  (Object.keys(FILTER_PARAM_MAP) as Array<keyof CustomerServiceRecordsListFilters>).forEach(
    (key) => {
      const parameter = FILTER_PARAM_MAP[key];
      const value = input.filters[key];
      if (value === null || value === '') params.delete(parameter);
      else params.set(parameter, String(value));
    }
  );

  Array.from(params.keys())
    .filter((key) => key.startsWith('sort['))
    .forEach((key) => params.delete(key));
  mapCustomerServiceRecordsSortingToApi(input.sorting).forEach((sort, index) => {
    params.set(`sort[${index}][field]`, sort.field);
    params.set(`sort[${index}][direction]`, sort.direction);
  });

  return params;
}
