import type { SortingState } from '@tanstack/react-table';
import type {
  ContactListFilters,
  ContactListSort,
  ContactSortField,
} from '@/features/contacts/types';

const SORT_COLUMN_FIELD_MAP: Record<string, ContactSortField> = {
  fullName: 'name',
  status: 'status',
  createdAt: 'created_at',
};

const FIELD_COLUMN_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(SORT_COLUMN_FIELD_MAP).map(([column, field]) => [field, column])
);

export function mapContactSortingToApi(sorting: SortingState): ContactListSort[] {
  return sorting
    .map((sort) => {
      const field = SORT_COLUMN_FIELD_MAP[sort.id];
      if (!field) {
        return null;
      }

      return {
        field,
        direction: sort.desc ? 'desc' : 'asc',
      } as const satisfies ContactListSort;
    })
    .filter(Boolean) as ContactListSort[];
}

export function parseContactSortingFromParams(params: URLSearchParams): SortingState {
  const buckets = new Map<number, { field?: string; direction?: string }>();

  for (const [key, value] of params.entries()) {
    const match = key.match(/^sort\[(\d+)\]\[(field|direction)\]$/);
    if (!match) {
      continue;
    }

    const index = Number(match[1]);
    const prop = match[2] as 'field' | 'direction';
    const bucket = buckets.get(index) ?? {};
    bucket[prop] = value;
    buckets.set(index, bucket);
  }

  return Array.from(buckets.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, bucket]) => {
      if (!bucket.field) {
        return null;
      }

      const columnId = FIELD_COLUMN_MAP[bucket.field];
      if (!columnId) {
        return null;
      }

      return {
        id: columnId,
        desc: (bucket.direction ?? 'asc').toLowerCase() === 'desc',
      };
    })
    .filter(Boolean) as SortingState;
}

export function buildContactsQuery(params: {
  pageIndex: number;
  pageSize: number;
  search: string;
  sorting: SortingState;
  filters: ContactListFilters;
  baseParams: URLSearchParams;
}) {
  const currentParams = new URLSearchParams(params.baseParams.toString());
  currentParams.set('page', String(params.pageIndex + 1));
  currentParams.set('limit', String(params.pageSize));

  if (params.search.trim()) {
    currentParams.set('search', params.search.trim());
  } else {
    currentParams.delete('search');
  }

  if (params.filters.status) {
    currentParams.set('status', params.filters.status);
  } else {
    currentParams.delete('status');
  }

  if (params.filters.type) {
    currentParams.set('type', params.filters.type);
  } else {
    currentParams.delete('type');
  }

  Array.from(currentParams.keys())
    .filter((key) => key.startsWith('sort['))
    .forEach((key) => currentParams.delete(key));

  mapContactSortingToApi(params.sorting).forEach((sort, index) => {
    currentParams.set(`sort[${index}][field]`, sort.field);
    currentParams.set(`sort[${index}][direction]`, sort.direction);
  });

  return currentParams;
}
