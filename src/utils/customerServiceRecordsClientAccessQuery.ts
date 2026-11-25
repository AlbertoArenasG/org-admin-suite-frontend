import type {
  ClientAccessSort,
  ClientAccessListFilters,
} from '@/features/customer-service-records-client-access';

export const EMPTY_CLIENT_ACCESS_FILTERS: ClientAccessListFilters = {
  customerId: null,
  serviceTypeCode: null,
  dateRange: { fieldId: null, from: null, to: null },
};

export function parseClientAccessFilters(params: URLSearchParams): ClientAccessListFilters {
  const fieldId = params.get('date_field');
  return {
    customerId: params.get('customer_id'),
    serviceTypeCode: params.get('service_type_code'),
    dateRange: {
      fieldId: fieldId === 'receivedAt' || fieldId === 'estimatedDeliveryAt' ? fieldId : null,
      from: params.get('date_from'),
      to: params.get('date_to'),
    },
  };
}

const SORT_FIELDS = {
  serviceNumber: 'service_number',
  receivedAt: 'received_at',
  estimatedDeliveryAt: 'estimated_customer_delivery_at',
} as const;

const COLUMN_BY_FIELD = Object.fromEntries(
  Object.entries(SORT_FIELDS).map(([columnId, field]) => [field, columnId])
) as Record<string, keyof typeof SORT_FIELDS>;

export type ClientAccessTableSorting = {
  columnId: keyof typeof SORT_FIELDS;
  direction: 'asc' | 'desc';
};

function normalizePositiveInteger(value: string | null, fallback: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

export function getClientAccessInitialPagination(params: URLSearchParams, fallbackLimit = 10) {
  return {
    page: normalizePositiveInteger(params.get('page'), 1, 10000),
    limit: normalizePositiveInteger(params.get('limit'), fallbackLimit, 100),
  };
}

export function parseClientAccessSorting(params: URLSearchParams): ClientAccessTableSorting | null {
  const field = params.get('sort[0][field]');
  const direction = params.get('sort[0][direction]');
  const columnId = field ? COLUMN_BY_FIELD[field] : undefined;
  return columnId && (direction === 'asc' || direction === 'desc') ? { columnId, direction } : null;
}

export function mapClientAccessSortingToApi(
  sorting: ClientAccessTableSorting | null
): ClientAccessSort | null {
  return sorting ? { field: SORT_FIELDS[sorting.columnId], direction: sorting.direction } : null;
}

export function buildClientAccessQuery(value: {
  page: number;
  limit: number;
  search: string;
  sorting: ClientAccessTableSorting | null;
  filters: ClientAccessListFilters;
}) {
  const params = new URLSearchParams({ page: String(value.page), limit: String(value.limit) });
  if (value.search.trim()) params.set('search', value.search.trim());
  if (value.filters.customerId) params.set('customer_id', value.filters.customerId);
  if (value.filters.serviceTypeCode) params.set('service_type_code', value.filters.serviceTypeCode);
  if (value.filters.dateRange.fieldId) {
    params.set('date_field', value.filters.dateRange.fieldId);
    if (value.filters.dateRange.from) params.set('date_from', value.filters.dateRange.from);
    if (value.filters.dateRange.to) params.set('date_to', value.filters.dateRange.to);
  }
  if (value.sorting) {
    params.set('sort[0][field]', SORT_FIELDS[value.sorting.columnId]);
    params.set('sort[0][direction]', value.sorting.direction);
  } else {
    params.set('sort_strategy', 'work_priority');
  }
  return params;
}
