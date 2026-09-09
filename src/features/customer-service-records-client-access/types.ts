export type ClientAccessRequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type ClientAccessSortField =
  | 'service_number'
  | 'received_at'
  | 'estimated_customer_delivery_at';

export type ClientAccessSortDirection = 'asc' | 'desc';

export interface ClientAccessSort {
  field: ClientAccessSortField;
  direction: ClientAccessSortDirection;
}

export interface ClientAccessCustomerServiceRecord {
  id: string;
  serviceNumber: number;
  serviceNumberDisplay: string;
  serviceType: { code: string; name: string };
  customer: { id: string; name: string };
  assets: Array<{
    id: string;
    name: string;
    identifier: string;
    brand: string;
    model: string;
    serialNumber: string;
    observations: string | null;
  }>;
  observations: string | null;
  operationalStatus: { code: string; name: string; nameKey: string | null };
  customerDelivery: {
    receivedAt: string | null;
    estimatedDeliveryAt: string | null;
    deliveredToCustomerAt: string | null;
    statusMaterialization: {
      code: string;
      name: string;
      nameKey: string | null;
      colorHex: string;
    } | null;
  };
}

export interface FetchClientAccessCustomerServiceRecordsParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: ClientAccessSort | null;
}

export interface ClientAccessCustomerServiceRecordsState {
  list: {
    items: ClientAccessCustomerServiceRecord[];
    status: ClientAccessRequestStatus;
    error: string | null;
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    activeRequestId: string | null;
  };
}
