import type { ServicePackagesRecordsListFilters } from '@/features/servicePackagesRecords';

const EMPTY_FILTERS: ServicePackagesRecordsListFilters = {
  serviceType: null,
};

function normalizePositiveInteger(value: string | null, fallback: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

export function getServicePackagesRecordsInitialPagination(
  params: URLSearchParams,
  fallbackLimit = 10
) {
  return {
    page: normalizePositiveInteger(params.get('page'), 1, 10000),
    limit: normalizePositiveInteger(params.get('limit'), fallbackLimit, 100),
  };
}

export function parseServicePackagesRecordsFilters(
  params: URLSearchParams
): ServicePackagesRecordsListFilters {
  const serviceType = params.get('service_type')?.trim() ?? '';
  return { ...EMPTY_FILTERS, serviceType: serviceType || null };
}

export function buildServicePackagesRecordsQuery(value: {
  page: number;
  limit: number;
  search: string;
  filters: ServicePackagesRecordsListFilters;
}) {
  const params = new URLSearchParams({ page: String(value.page), limit: String(value.limit) });
  const search = value.search.trim();
  const serviceType = value.filters.serviceType?.trim();

  if (search) params.set('search', search);
  if (serviceType) params.set('service_type', serviceType);

  return params;
}
