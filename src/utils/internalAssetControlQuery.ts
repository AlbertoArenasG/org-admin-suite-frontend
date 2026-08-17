import type { SortingState } from '@tanstack/react-table';
import type {
  InternalAssetMaintenanceRecordsListFilters,
  InternalAssetMaintenanceRecordsListSort,
  InternalAssetMaintenanceRecordSortField,
} from '@/features/internal-asset-control/types';

const SORT_COLUMN_FIELD_MAP: Record<string, InternalAssetMaintenanceRecordSortField> = {
  assetName: 'asset_name',
  assetIdentifier: 'asset_identifier',
  expirationDate: 'expiration_date',
  status: 'status',
  createdAt: 'created_at',
};

const FIELD_COLUMN_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(SORT_COLUMN_FIELD_MAP).map(([column, field]) => [field, column])
);

export function mapInternalAssetControlSortingToApi(
  sorting: SortingState
): InternalAssetMaintenanceRecordsListSort[] {
  return sorting
    .map((sort) => {
      const field = SORT_COLUMN_FIELD_MAP[sort.id];
      if (!field) {
        return null;
      }

      return {
        field,
        direction: sort.desc ? 'desc' : 'asc',
      } as const satisfies InternalAssetMaintenanceRecordsListSort;
    })
    .filter(Boolean) as InternalAssetMaintenanceRecordsListSort[];
}

export function parseInternalAssetControlSortingFromParams(params: URLSearchParams): SortingState {
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

export function buildInternalAssetControlQuery(params: {
  pageIndex: number;
  pageSize: number;
  search: string;
  sorting: SortingState;
  filters: InternalAssetMaintenanceRecordsListFilters;
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

  if (params.filters.assetMaintenanceType) {
    currentParams.set('asset_maintenance_type', params.filters.assetMaintenanceType);
  } else {
    currentParams.delete('asset_maintenance_type');
  }

  if (params.filters.status) {
    currentParams.set('status', params.filters.status);
  } else {
    currentParams.delete('status');
  }

  if (typeof params.filters.sentToProvider === 'boolean') {
    currentParams.set('sent_to_provider', String(params.filters.sentToProvider));
  } else {
    currentParams.delete('sent_to_provider');
  }

  Array.from(currentParams.keys())
    .filter((key) => key.startsWith('sort['))
    .forEach((key) => currentParams.delete(key));

  mapInternalAssetControlSortingToApi(params.sorting).forEach((sort, index) => {
    currentParams.set(`sort[${index}][field]`, sort.field);
    currentParams.set(`sort[${index}][direction]`, sort.direction);
  });

  return currentParams;
}
