import type { ClientAccessSort } from '@/features/customer-service-records-client-access';

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

export function getClientAccessInitialPagination(params: URLSearchParams) {
  return {
    page: normalizePositiveInteger(params.get('page'), 1, 10000),
    limit: normalizePositiveInteger(params.get('limit'), 10, 100),
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
}) {
  const params = new URLSearchParams({ page: String(value.page), limit: String(value.limit) });
  if (value.search.trim()) params.set('search', value.search.trim());
  if (value.sorting) {
    params.set('sort[0][field]', SORT_FIELDS[value.sorting.columnId]);
    params.set('sort[0][direction]', value.sorting.direction);
  } else {
    params.set('sort_strategy', 'work_priority');
  }
  return params;
}
