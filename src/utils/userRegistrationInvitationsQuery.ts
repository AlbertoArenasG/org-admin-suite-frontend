import type { SortingState } from '@tanstack/react-table';

import type {
  InvitationSortField,
  UserRegistrationInvitationsFilters,
  UserRegistrationInvitationsSort,
} from '@/features/user-registration-invitations';

const SORT_COLUMN_FIELD_MAP: Record<string, InvitationSortField> = {
  status: 'status',
  createdAt: 'created_at',
};

const FIELD_COLUMN_MAP: Record<InvitationSortField, string> = {
  status: 'status',
  created_at: 'createdAt',
};

export function mapUserRegistrationInvitationSortingToApi(
  sorting: SortingState
): UserRegistrationInvitationsSort[] {
  return sorting
    .map((sort) => {
      const field = SORT_COLUMN_FIELD_MAP[sort.id];
      if (!field) {
        return null;
      }

      return {
        field,
        direction: sort.desc ? 'desc' : 'asc',
      } as const satisfies UserRegistrationInvitationsSort;
    })
    .filter(Boolean) as UserRegistrationInvitationsSort[];
}

export function parseUserRegistrationInvitationSortingFromParams(params: URLSearchParams) {
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
      if (bucket.field !== 'status' && bucket.field !== 'created_at') {
        return null;
      }

      return {
        id: FIELD_COLUMN_MAP[bucket.field],
        desc: (bucket.direction ?? 'asc').toLowerCase() === 'desc',
      };
    })
    .filter(Boolean) as SortingState;
}

export function buildUserRegistrationInvitationsQuery(params: {
  pageIndex: number;
  pageSize: number;
  search: string;
  sorting: SortingState;
  filters: UserRegistrationInvitationsFilters;
  baseParams: URLSearchParams;
}) {
  const query = new URLSearchParams(params.baseParams.toString());
  query.set('page', String(params.pageIndex + 1));
  query.set('limit', String(params.pageSize));

  if (params.search.trim()) {
    query.set('search', params.search.trim());
  } else {
    query.delete('search');
  }

  if (params.filters.status) {
    query.set('status', params.filters.status);
  } else {
    query.delete('status');
  }

  Array.from(query.keys())
    .filter((key) => key.startsWith('sort['))
    .forEach((key) => query.delete(key));

  mapUserRegistrationInvitationSortingToApi(params.sorting).forEach((sort, index) => {
    query.set(`sort[${index}][field]`, sort.field);
    query.set(`sort[${index}][direction]`, sort.direction);
  });

  return query;
}
