import type { SortingState } from '@tanstack/react-table';

const SORT_FIELD_MAP: Record<string, string> = {
  companyName: 'company_name',
  contactName: 'contact_name',
  serviceOrderIdentifier: 'service_order_identifier',
  categoryName: 'category_name',
  statusName: 'status_name',
  createdAt: 'created_at',
};

export function mapServiceEntrySortingToApi(sorting: SortingState) {
  return sorting
    .map((sort) => {
      const field = SORT_FIELD_MAP[sort.id];
      if (!field) {
        return null;
      }
      return { field, direction: sort.desc ? 'desc' : 'asc' } as const;
    })
    .filter(Boolean) as { field: string; direction: 'asc' | 'desc' }[];
}
