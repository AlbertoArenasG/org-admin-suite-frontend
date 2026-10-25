import type { BillingCustomerServiceRecordStatus } from '@/features/billing-customer-service-records/types';

export interface BillingCustomerServiceRecordsQuery {
  page: number;
  limit: number;
  search: string;
  billingStatus: BillingCustomerServiceRecordStatus | null;
}

function positiveInteger(value: string | null, fallback: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

export function parseBillingCustomerServiceRecordsQuery(
  params: URLSearchParams,
  fallbackLimit = 10
): BillingCustomerServiceRecordsQuery {
  const status = params.get('billing_status');
  return {
    page: positiveInteger(params.get('page'), 1, 10000),
    limit: positiveInteger(params.get('limit'), fallbackLimit, 100),
    search: params.get('search') ?? '',
    billingStatus: status === 'SUBMITTED' || status === 'INVOICED' ? status : null,
  };
}

export function buildBillingCustomerServiceRecordsQuery(value: BillingCustomerServiceRecordsQuery) {
  const params = new URLSearchParams({ page: String(value.page), limit: String(value.limit) });
  if (value.search.trim()) params.set('search', value.search.trim());
  if (value.billingStatus) params.set('billing_status', value.billingStatus);
  return params;
}
