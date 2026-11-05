import type {
  CustomerServiceRecordBillingStatus,
  CustomerServiceRecordDetail,
  CustomerServiceRecordListItem,
  CustomerServiceRecordOption,
  CustomerServiceRecordRequestStatus,
  UploadedCustomerServiceRecordFile,
  CustomerServiceRecordAttachment,
  CustomerServiceRecordLocalizedValue,
  CustomerServiceRecordInterval,
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
  invoiceStatusOptions: {
    items: CustomerServiceRecordOption[];
    status: CustomerServiceRecordRequestStatus;
    error: string | null;
  };
  archives: {
    recordId: string | null;
    items: BillingArchiveSummary[];
    selected: BillingArchiveDetail | null;
    status: CustomerServiceRecordRequestStatus;
    detailStatus: CustomerServiceRecordRequestStatus;
    error: string | null;
    page: number;
    totalPages: number;
  };
  comments: {
    recordId: string | null;
    items: BillingComment[];
    status: CustomerServiceRecordRequestStatus;
    error: string | null;
    page: number;
    totalPages: number;
  };
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

export type BillingInvoiceStatus =
  | 'PENDING'
  | 'IN_PROCESS_PAYMENT'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED'
  | 'REJECTED';
export type BillingDetailsChanges = Partial<{
  issuedAt: string | null;
  deliveredAt: string | null;
  paymentTerm: CustomerServiceRecordInterval | null;
  estimatedPaymentAt: string | null;
  paidAt: string | null;
}>;
export interface BillingArchiveSummary {
  archiveId: string;
  invoiceRevision: number;
  referenceNumber: string | null;
  invoiceStatus: CustomerServiceRecordLocalizedValue | null;
  archivedAt: string;
  archivedBy: string;
}
export interface BillingArchiveDetail extends BillingArchiveSummary {
  invoice: {
    referenceNumber: string | null;
    files: CustomerServiceRecordAttachment[];
    removedFiles: CustomerServiceRecordAttachment[];
    paymentComplements: Array<{
      complementId: string;
      referenceNumber: string | null;
      files: CustomerServiceRecordAttachment[];
      removedFiles: CustomerServiceRecordAttachment[];
    }>;
  };
  billing: {
    invoiceStatus: CustomerServiceRecordLocalizedValue | null;
    issuedAt: string | null;
    deliveredAt: string | null;
    paymentTerm: CustomerServiceRecordInterval | null;
    estimatedPaymentAt: string | null;
    paidAt: string | null;
  };
}
export interface BillingComment {
  commentId: string;
  text: string;
  visibility: 'INTERNAL' | 'EXTERNAL';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
