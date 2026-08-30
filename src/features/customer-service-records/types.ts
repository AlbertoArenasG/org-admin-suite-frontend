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

export interface CustomerServiceRecordOption {
  value: string;
  label: string;
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

export interface CustomerServiceRecordDetail extends CustomerServiceRecordListItem {
  observations: string | null;
  customer: CustomerServiceRecordListItem['customer'] & {
    users: Array<{ userId: string; name: string | null; email: string | null }>;
  };
  assets: Array<
    CustomerServiceRecordListItem['assets'][number] & {
      brand: string;
      model: string;
      serialNumber: string;
      observations: string | null;
    }
  >;
  customerDelivery: CustomerServiceRecordListItem['customerDelivery'] & {
    receivedAt: string | null;
    estimatedDeliveryInterval: CustomerServiceRecordInterval;
    deliveredToCustomerAt: string | null;
    statusPolicyId: string | null;
    notificationPolicyId: string | null;
  };
  provider:
    | (NonNullable<CustomerServiceRecordListItem['provider']> & {
        providerId: string;
        name: string;
        deliveredToProviderAt: string | null;
        estimatedReturnInterval: CustomerServiceRecordInterval;
        returnedFromProviderAt: string | null;
        statusPolicyId: string | null;
        notificationPolicyId: string | null;
        followUp: CustomerServiceRecordProviderFollowUp;
      })
    | null;
}

export interface CustomerServiceRecordProviderFollowUp {
  enabled: boolean;
  rules: Array<{
    interval: CustomerServiceRecordInterval;
    recipientGroupIds: string[];
    ccRecipientGroupIds: string[];
  }>;
}

export interface CustomerServiceRecordMutationPayload {
  serviceTypeCode: string;
  requestedAt: string;
  observations: string | null;
  customer: { customerId: string; customerUserIds: string[] };
  assets: Array<{
    name: string;
    identifier: string;
    brand: string;
    model: string;
    serialNumber: string;
    observations: string | null;
  }>;
  customerDelivery: {
    receivedAt: string | null;
    estimatedDeliveryInterval: CustomerServiceRecordInterval;
    estimatedDeliveryAt: string | null;
    deliveredToCustomerAt: string | null;
    statusPolicyId: string | null;
    notificationPolicyId: string | null;
  };
  provider: {
    providerId: string;
    deliveredToProviderAt: string | null;
    estimatedReturnInterval: CustomerServiceRecordInterval;
    estimatedReturnAt: string | null;
    returnedFromProviderAt: string | null;
    statusPolicyId: string | null;
    notificationPolicyId: string | null;
    followUp: CustomerServiceRecordProviderFollowUp;
  } | null;
  operationalStatus: CustomerServiceRecordOperationalStatus;
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
    item: CustomerServiceRecordDetail | null;
    status: CustomerServiceRecordRequestStatus;
    error: string | null;
    currentRecordId: string | null;
  };
  mutations: {
    createStatus: CustomerServiceRecordRequestStatus;
    updateStatus: CustomerServiceRecordRequestStatus;
    deleteStatus: CustomerServiceRecordRequestStatus;
    error: string | null;
    message: string | null;
    lastCreatedRecordId: string | null;
    currentRecordId: string | null;
  };
}
