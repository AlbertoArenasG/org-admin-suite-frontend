import type {
  CustomerServiceRecordBillingStatus,
  CustomerServiceRecordDetail,
  CustomerServiceRecordListItem,
  CustomerServiceRecordOption,
  CustomerServiceRecordRequestStatus,
  UploadedCustomerServiceRecordFile,
} from '@/features/customer-service-records/types';

export type BillingCustomerServiceRecordStatus = Exclude<
  CustomerServiceRecordBillingStatus,
  'NOT_SUBMITTED'
>;

export type BillingCustomerServiceRecordMutationError = {
  message: string;
  status: number | null;
};

export interface FetchBillingCustomerServiceRecordsParams {
  page?: number;
  limit?: number;
  search?: string | null;
  billingStatus?: BillingCustomerServiceRecordStatus | null;
}

export interface BillingCustomerServiceRecordsState {
  list: {
    items: CustomerServiceRecordListItem[];
    status: CustomerServiceRecordRequestStatus;
    error: string | null;
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  detail: {
    record: CustomerServiceRecordDetail | null;
    status: CustomerServiceRecordRequestStatus;
    error: string | null;
    currentRecordId: string | null;
  };
  options: {
    items: CustomerServiceRecordOption[];
    status: CustomerServiceRecordRequestStatus;
    error: string | null;
  };
  mutations: {
    invoiceStatus: CustomerServiceRecordRequestStatus;
    invoiceError: string | null;
    billingStatus: CustomerServiceRecordRequestStatus;
    billingError: string | null;
    uploadStatus: CustomerServiceRecordRequestStatus;
    uploadError: string | null;
  };
}

export type BillingCustomerServiceRecord = CustomerServiceRecordDetail;
export type BillingCustomerServiceRecordRow = CustomerServiceRecordListItem;
export type BillingCustomerServiceRecordOption = CustomerServiceRecordOption;
export type BillingUploadedFile = UploadedCustomerServiceRecordFile;
