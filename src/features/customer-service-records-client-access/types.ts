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

export interface ClientAccessInterval {
  years: number;
  months: number;
  weeks: number;
  days: number;
}

export interface ClientAccessAttachment {
  fileId: string;
  originalName: string;
  mimeType: string;
  size: number;
  downloadUrl: string;
  previewUrl: string;
}

export interface ClientAccessStatusMaterialization {
  code: string;
  name: string;
  nameKey: string | null;
  colorHex: string;
  source: { code: string; name: string; nameKey: string | null };
  effectiveStartDate: string | null;
}

export interface ClientAccessCustomerDelivery {
  receivedAt: string | null;
  estimatedDeliveryInterval: ClientAccessInterval;
  estimatedDeliveryAt: string | null;
  deliveredToCustomerAt: string | null;
  statusPolicyId: string | null;
  notificationPolicyId: string | null;
  statusMaterialization: ClientAccessStatusMaterialization | null;
  notificationMaterialization: unknown | null;
}

export interface ClientAccessAsset {
  id: string;
  name: string;
  identifier: string;
  brand: string;
  model: string;
  serialNumber: string;
  observations: string | null;
}

export interface ClientAccessAssetDetail extends ClientAccessAsset {
  intakeConditionFiles: ClientAccessAttachment[];
  deliveryConditionFiles: ClientAccessAttachment[];
  reports: ClientAccessAttachment[];
}

export interface ClientAccessCustomerServiceRecord {
  id: string;
  serviceNumber: number;
  serviceNumberDisplay: string;
  serviceType: { code: string; name: string };
  customer: { id: string; name: string };
  assets: ClientAccessAsset[];
  observations: string | null;
  operationalStatus: { code: string; name: string; nameKey: string | null };
  customerDelivery: ClientAccessCustomerDelivery;
}

export interface ClientAccessCustomerServiceRecordDetail
  extends Omit<ClientAccessCustomerServiceRecord, 'assets' | 'customer'> {
  customer: {
    id: string;
    name: string;
    users: Array<{ id: string; name: string; email: string }>;
  };
  assets: ClientAccessAssetDetail[];
  quotation: { referenceNumber: string | null; files: ClientAccessAttachment[] };
  purchaseOrder: { referenceNumber: string | null; files: ClientAccessAttachment[] };
  invoice: { referenceNumber: string | null; files: ClientAccessAttachment[] };
  otherFiles: ClientAccessAttachment[];
  createdAt: string | null;
}

export interface FetchClientAccessCustomerServiceRecordsParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: ClientAccessSort | null;
  sortStrategy?: 'work_priority' | null;
}

export interface FetchClientAccessCustomerServiceRecordDetailParams {
  recordId: string;
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
  detail: {
    record: ClientAccessCustomerServiceRecordDetail | null;
    status: ClientAccessRequestStatus;
    error: string | null;
    currentRecordId: string | null;
    activeRequestId: string | null;
  };
}
