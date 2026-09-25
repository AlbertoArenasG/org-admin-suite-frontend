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

export type CustomerServiceRecordRequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type CustomerServiceRecordSortDirection = 'asc' | 'desc';
export interface CustomerServiceRecordDerivedStatus {
  code: string;
  name: string;
  nameKey: string | null;
  colorHex: string;
  source: { code: string; name: string; nameKey: string };
  effectiveStartDate: string | null;
}

export interface CustomerServiceRecordOption {
  value: string;
  label: string;
}

export interface CustomerServiceRecordLocalizedValue {
  code: string;
  name: string;
  nameKey: string | null;
}

export interface CustomerServiceRecordAttachment {
  fileId: string;
  originalName: string;
  mimeType: string;
  size: number;
  downloadUrl: string;
  previewUrl: string;
}

export interface CustomerServiceRecordDetail {
  customerServiceRecordId: string;
  serviceNumber: string;
  serviceType: { serviceTypeCode: string; name: string };
  requestedAt: string;
  observations: string | null;
  operationalStatus: CustomerServiceRecordLocalizedValue & {
    code: CustomerServiceRecordOperationalStatus;
  };
  customer: {
    customerId: string;
    name: string;
    users: Array<{ userId: string; name: string; email: string }>;
  };
  assets: Array<{
    assetId: string;
    name: string;
    identifier: string;
    brand: string;
    model: string;
    serialNumber: string;
    observations: string | null;
    intakeConditionFiles: CustomerServiceRecordAttachment[];
    deliveryConditionFiles: CustomerServiceRecordAttachment[];
    reports: CustomerServiceRecordAttachment[];
  }>;
  customerDelivery: {
    receivedAt: string | null;
    estimatedDeliveryInterval: string | null;
    estimatedDeliveryAt: string | null;
    deliveredToCustomerAt: string | null;
    statusPolicyId: string | null;
    notificationPolicyId: string | null;
    statusMaterialization: CustomerServiceRecordDerivedStatus | null;
    notificationMaterialization: unknown | null;
  };
  provider: {
    providerId: string;
    name: string;
    workOrderReference: string | null;
    deliveredToProviderAt: string | null;
    estimatedReturnInterval: string | null;
    estimatedReturnAt: string | null;
    returnedFromProviderAt: string | null;
    statusPolicyId: string | null;
    notificationPolicyId: string | null;
    followUp: boolean;
    statusMaterialization: CustomerServiceRecordDerivedStatus | null;
    notificationMaterialization: unknown | null;
    followUpMaterialization: unknown[];
  } | null;
  attachmentsCount: number;
  quotation: { referenceNumber: string | null; files: CustomerServiceRecordAttachment[] };
  purchaseOrder: { referenceNumber: string | null; files: CustomerServiceRecordAttachment[] };
  invoice: { referenceNumber: string | null; files: CustomerServiceRecordAttachment[] };
  otherFiles: CustomerServiceRecordAttachment[];
  createdAt: string | null;
  updatedAt: string | null;
}

export interface UpdateCustomerServiceRecordDetailsPayload {
  serviceTypeCode: string;
  requestedAt: string;
  observations: string | null;
  operationalStatus: CustomerServiceRecordOperationalStatus;
}

export interface CustomerServiceRecordsListFilters {
  operationalStatus: CustomerServiceRecordOperationalStatus | null;
  serviceTypeCode: string | null;
  customerId: string | null;
  providerId: string | null;
  hasProvider: boolean | null;
  requestedAtFrom: string | null;
  requestedAtTo: string | null;
  receivedAtFrom: string | null;
  receivedAtTo: string | null;
  estimatedCustomerDeliveryAtFrom: string | null;
  estimatedCustomerDeliveryAtTo: string | null;
  providerEstimatedReturnAtFrom: string | null;
  providerEstimatedReturnAtTo: string | null;
}

export interface CustomerServiceRecordsListSort {
  field: CustomerServiceRecordSortField;
  direction: CustomerServiceRecordSortDirection;
}

export interface FetchCustomerServiceRecordsParams {
  page?: number;
  limit?: number;
  itemsPerPage?: number;
  search?: string | null;
  filters?: Partial<CustomerServiceRecordsListFilters>;
  sorts?: CustomerServiceRecordsListSort[];
  sortStrategy?: 'work_priority' | null;
}
export interface CustomerServiceRecordListItem {
  customerServiceRecordId: string;
  serviceNumber: string;
  observations: string | null;
  serviceType: { serviceTypeCode: string; name: string };
  requestedAt: string;
  customer: { customerId: string; name: string };
  assets: Array<{
    assetId: string;
    name: string;
    identifier: string;
    brand: string;
    model: string;
    serialNumber: string;
    observations: string | null;
  }>;
  operationalStatus: {
    code: CustomerServiceRecordOperationalStatus;
    name: string;
    nameKey: string;
  };
  customerDelivery: {
    receivedAt: string | null;
    estimatedDeliveryAt: string | null;
    deliveredToCustomerAt: string | null;
    statusMaterialization: CustomerServiceRecordDerivedStatus | null;
  };
  provider: {
    estimatedReturnAt: string | null;
    statusMaterialization: CustomerServiceRecordDerivedStatus | null;
  } | null;
  updatedAt: string | null;
}

export interface CustomerServiceRecordCreateValues {
  serviceTypeCode: string;
  requestedAt: string;
  customerId: string;
  customerUserIds: string[];
  asset: {
    name: string;
    identifier: string;
    brand: string;
    model: string;
    serialNumber: string;
  };
}

export interface CreateCustomerServiceRecordPayload {
  serviceTypeCode: string;
  requestedAt: string;
  observations: null;
  customer: { customerId: string; customerUserIds: string[] };
  assets: [
    {
      name: string;
      identifier: string;
      brand: string;
      model: string;
      serialNumber: string;
      observations: null;
    },
  ];
}

export interface CustomerServiceRecordsState {
  list: {
    items: CustomerServiceRecordListItem[];
    status: CustomerServiceRecordRequestStatus;
    error: string | null;
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  options: {
    serviceTypes: CustomerServiceRecordOption[];
    providers: CustomerServiceRecordOption[];
    status: CustomerServiceRecordRequestStatus;
    error: string | null;
  };
  detail: {
    record: CustomerServiceRecordDetail | null;
    status: CustomerServiceRecordRequestStatus;
    error: string | null;
    currentRecordId: string | null;
  };
  detailOptions: {
    serviceTypes: CustomerServiceRecordOption[];
    status: CustomerServiceRecordRequestStatus;
    error: string | null;
  };
  mutations: {
    createStatus: CustomerServiceRecordRequestStatus;
    deleteStatus: CustomerServiceRecordRequestStatus;
    error: string | null;
    message: string | null;
    lastCreatedRecordId: string | null;
    currentRecordId: string | null;
    updateDetailsStatus: CustomerServiceRecordRequestStatus;
    updateDetailsError: string | null;
  };
}
