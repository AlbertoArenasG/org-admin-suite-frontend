import type { SortingState } from '@tanstack/react-table';

const SORT_COLUMN_FIELD_MAP: Record<string, string> = {
  fullName: 'lastname',
  email: 'email',
  roleName: 'role',
  statusName: 'status',
  createdAt: 'created_at',
};

const FIELD_COLUMN_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(SORT_COLUMN_FIELD_MAP).map(([column, field]) => [field, column])
);

export function mapSortingToApi(sorting: SortingState) {
  return sorting
    .map((sort) => {
      const field = SORT_COLUMN_FIELD_MAP[sort.id];
      if (!field) {
        return null;
      }
      return { field, direction: sort.desc ? 'desc' : 'asc' } as const;
    })
    .filter(Boolean) as { field: string; direction: 'asc' | 'desc' }[];
}

export function parseSortingFromParams(params: URLSearchParams): SortingState {
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
      const direction = (bucket.direction ?? 'asc').toLowerCase() === 'desc';
      return { id: columnId, desc: direction };
    })
    .filter(Boolean) as SortingState;
}

export function areSortingEqual(a: SortingState, b: SortingState) {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((sort, index) => sort.id === b[index].id && sort.desc === b[index].desc);
}

export function buildUserQuery(params: {
  pageIndex: number;
  pageSize: number;
  search: string;
  sorting: SortingState;
  baseParams: URLSearchParams;
}) {
  const currentParams = new URLSearchParams(params.baseParams.toString());
  const desiredPage = params.pageIndex + 1;
  currentParams.set('page', String(desiredPage));
  currentParams.set('limit', String(params.pageSize));
  currentParams.set('items_per_page', String(params.pageSize));

  if (params.search.trim()) {
    currentParams.set('search', params.search.trim());
  } else {
    currentParams.delete('search');
  }

  Array.from(currentParams.keys())
    .filter((key) => key.startsWith('sort['))
    .forEach((key) => currentParams.delete(key));

  mapSortingToApi(params.sorting).forEach((sort, index) => {
    currentParams.set(`sort[${index}][field]`, sort.field);
    currentParams.set(`sort[${index}][direction]`, sort.direction);
  });

  return currentParams;
}
