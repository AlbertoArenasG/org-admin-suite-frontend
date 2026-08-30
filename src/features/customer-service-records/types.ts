export type CustomerServiceRecordOperationalStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';
export type CustomerServiceRecordSortField =
  | 'service_number'
  | 'requested_at'
  | 'received_at'
  | 'estimated_customer_delivery_at'
  | 'provider_estimated_return_at'
  | 'operational_status'
  | 'created_at';
export interface CustomerServiceRecordInterval {
  years: number;
  months: number;
  weeks: number;
  days: number;
}
export interface CustomerServiceRecordDerivedStatus {
  code: string;
  name: string;
  nameKey: string | null;
  colorHex: string;
  source: { code: string; name: string; nameKey: string };
  effectiveStartDate: string | null;
}
export interface CustomerServiceRecordListItem {
  customerServiceRecordId: string;
  serviceNumber: string;
  serviceType: { serviceTypeCode: string; name: string };
  requestedAt: string;
  customer: { customerId: string; name: string };
  assets: Array<{ assetId: string; name: string; identifier: string }>;
  operationalStatus: {
    code: CustomerServiceRecordOperationalStatus;
    name: string;
    nameKey: string;
  };
  customerDelivery: {
    estimatedDeliveryAt: string | null;
    statusMaterialization: CustomerServiceRecordDerivedStatus | null;
  };
  provider: {
    estimatedReturnAt: string | null;
    statusMaterialization: CustomerServiceRecordDerivedStatus | null;
  } | null;
  updatedAt: string | null;
}
export interface CustomerServiceRecordsState {
  list: {
    items: CustomerServiceRecordListItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    page: number;
    perPage: number;
    total: number;
  };
}
