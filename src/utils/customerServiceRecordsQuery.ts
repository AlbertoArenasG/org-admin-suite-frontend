import type {
  CustomerServiceRecordsListFilters,
  CustomerServiceRecordsListSort,
  CustomerServiceRecordSortField,
} from '@/features/customer-service-records';

const SORT_FIELDS = {
  serviceNumber: 'service_number',
  receivedAt: 'received_at',
  estimatedDeliveryAt: 'estimated_customer_delivery_at',
  providerReturn: 'provider_estimated_return_at',
} as const satisfies Record<string, CustomerServiceRecordSortField>;

const COLUMN_BY_FIELD = Object.fromEntries(
  Object.entries(SORT_FIELDS).map(([columnId, field]) => [field, columnId])
) as Record<string, keyof typeof SORT_FIELDS>;

const DATE_FILTER_FIELDS = [
  ['requestedAtFrom', 'requestedAtTo'],
  ['receivedAtFrom', 'receivedAtTo'],
  ['estimatedCustomerDeliveryAtFrom', 'estimatedCustomerDeliveryAtTo'],
  ['providerEstimatedReturnAtFrom', 'providerEstimatedReturnAtTo'],
] as const satisfies ReadonlyArray<
  readonly [keyof CustomerServiceRecordsListFilters, keyof CustomerServiceRecordsListFilters]
>;

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

export type CustomerServiceRecordsTableSorting = {
  columnId: keyof typeof SORT_FIELDS;
  direction: 'asc' | 'desc';
};

function normalizePositiveInteger(value: string | null, fallback: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function emptyFilters(): CustomerServiceRecordsListFilters {
  return {
    operationalStatus: null,
    serviceTypeCode: null,
    customerId: null,
    providerId: null,
    hasProvider: null,
    requestedAtFrom: null,
    requestedAtTo: null,
    receivedAtFrom: null,
    receivedAtTo: null,
    estimatedCustomerDeliveryAtFrom: null,
    estimatedCustomerDeliveryAtTo: null,
    providerEstimatedReturnAtFrom: null,
    providerEstimatedReturnAtTo: null,
  };
}

export function getCustomerServiceRecordsInitialPagination(params: URLSearchParams) {
  return {
    page: normalizePositiveInteger(params.get('page'), 1, 10000),
    limit: normalizePositiveInteger(params.get('limit'), 10, 100),
  };
}

export function parseCustomerServiceRecordsSorting(
  params: URLSearchParams
): CustomerServiceRecordsTableSorting | null {
  const field = params.get('sort[0][field]');
  const direction = params.get('sort[0][direction]');
  const columnId = field ? COLUMN_BY_FIELD[field] : undefined;

  return columnId && (direction === 'asc' || direction === 'desc') ? { columnId, direction } : null;
}

export function mapCustomerServiceRecordsSortingToApi(
  sorting: CustomerServiceRecordsTableSorting | null
): CustomerServiceRecordsListSort[] {
  return sorting ? [{ field: SORT_FIELDS[sorting.columnId], direction: sorting.direction }] : [];
}

export function parseCustomerServiceRecordsFiltersFromParams(
  params: URLSearchParams
): CustomerServiceRecordsListFilters {
  const operationalStatus = params.get('operational_status');
  const filters = emptyFilters();
  filters.operationalStatus =
    operationalStatus === 'PENDING' ||
    operationalStatus === 'IN_PROGRESS' ||
    operationalStatus === 'COMPLETED' ||
    operationalStatus === 'CANCELLED'
      ? operationalStatus
      : null;
  filters.serviceTypeCode = params.get('service_type_code');
  filters.customerId = params.get('customer_id');
  filters.providerId = params.get('provider_id');
  filters.hasProvider =
    params.get('has_provider') === 'true'
      ? true
      : params.get('has_provider') === 'false'
        ? false
        : null;

  const activeDateFields = DATE_FILTER_FIELDS.filter(([fromKey, toKey]) => {
    const from = params.get(FILTER_PARAM_MAP[fromKey]);
    const to = params.get(FILTER_PARAM_MAP[toKey]);
    return Boolean(from || to);
  });
  const [fromKey, toKey] = activeDateFields[0] ?? [];
  if (fromKey && toKey) {
    filters[fromKey] = params.get(FILTER_PARAM_MAP[fromKey]);
    filters[toKey] = params.get(FILTER_PARAM_MAP[toKey]);
  }

  return filters;
}

export function buildCustomerServiceRecordsQuery(value: {
  page: number;
  limit: number;
  search: string;
  sorting: CustomerServiceRecordsTableSorting | null;
  filters: CustomerServiceRecordsListFilters;
}) {
  const params = new URLSearchParams({ page: String(value.page), limit: String(value.limit) });
  if (value.search.trim()) params.set('search', value.search.trim());

  (Object.keys(FILTER_PARAM_MAP) as Array<keyof CustomerServiceRecordsListFilters>).forEach(
    (key) => {
      const filterValue = value.filters[key];
      if (filterValue !== null && filterValue !== '') {
        params.set(FILTER_PARAM_MAP[key], String(filterValue));
      }
    }
  );

  if (value.sorting) {
    params.set('sort[0][field]', SORT_FIELDS[value.sorting.columnId]);
    params.set('sort[0][direction]', value.sorting.direction);
  } else {
    params.set('sort_strategy', 'work_priority');
  }

  return params;
}
