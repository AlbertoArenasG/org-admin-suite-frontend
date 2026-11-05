import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  mapCustomerServiceRecordDetail,
  type ApiCustomerServiceRecordDetail,
  type ApiLocalizedValue,
} from '@/features/customer-service-records/customerServiceRecordMappers';
import { ApiError, jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type {
  BillingArchiveDetail,
  BillingArchiveSummary,
  BillingComment,
  BillingDetailsChanges,
  BillingInvoiceStatus,
  BillingCustomerServiceRecordMutationError,
} from './types';
import type {
  CustomerServiceRecordAttachment,
  CustomerServiceRecordOption,
} from '@/features/customer-service-records';

const base = '/v1/billing/customer-service-records';
type Meta = { pagination?: { page: number; per_page: number; total: number; total_pages: number } };
type Failure = { state: RootState; rejectValue: BillingCustomerServiceRecordMutationError };

function token(state: RootState) {
  return state.auth.token;
}
function failure(error: unknown): BillingCustomerServiceRecordMutationError {
  return {
    message: error instanceof Error ? error.message : 'No fue posible completar la operación',
    status: error instanceof ApiError ? error.status : null,
  };
}
function requireToken(state: RootState) {
  const value = token(state);
  if (!value) throw new ApiError('No hay token de autenticación', 401);
  return value;
}
function mapFile(value: {
  file_id: string;
  original_name: string;
  mime_type: string;
  size: number;
  download_url: string;
  preview_url: string;
}): CustomerServiceRecordAttachment {
  return {
    fileId: value.file_id,
    originalName: value.original_name,
    mimeType: value.mime_type,
    size: value.size,
    downloadUrl: value.download_url,
    previewUrl: value.preview_url,
  };
}
type ApiFile = Parameters<typeof mapFile>[0];
type ApiSummary = {
  archive_id: string;
  invoice_revision: number;
  reference_number: string | null;
  invoice_status: ApiLocalizedValue | null;
  archived_at: string;
  archived_by: string;
};
type ApiArchive = ApiSummary & {
  invoice: {
    reference_number: string | null;
    files: ApiFile[];
    removed_files: ApiFile[];
    payment_complements: Array<{
      complement_id: string;
      reference_number: string | null;
      files: ApiFile[];
      removed_files: ApiFile[];
    }>;
  };
  billing: {
    invoice_status: ApiLocalizedValue | null;
    issued_at: string | null;
    delivered_at: string | null;
    payment_term: BillingArchiveDetail['billing']['paymentTerm'];
    estimated_payment_at: string | null;
    paid_at: string | null;
  };
};
type ApiComment = {
  comment_id: string;
  text: string;
  visibility: BillingComment['visibility'];
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
};
const mapStatus = (value: ApiLocalizedValue | null) =>
  value ? { code: value.code, name: value.name, nameKey: value.name_key } : null;
function mapSummary(value: ApiSummary): BillingArchiveSummary {
  return {
    archiveId: value.archive_id,
    invoiceRevision: value.invoice_revision,
    referenceNumber: value.reference_number,
    invoiceStatus: mapStatus(value.invoice_status),
    archivedAt: value.archived_at,
    archivedBy: value.archived_by,
  };
}
function mapArchive(value: ApiArchive): BillingArchiveDetail {
  return {
    ...mapSummary(value),
    invoice: {
      referenceNumber: value.invoice.reference_number,
      files: value.invoice.files.map(mapFile),
      removedFiles: value.invoice.removed_files.map(mapFile),
      paymentComplements: value.invoice.payment_complements.map((item) => ({
        complementId: item.complement_id,
        referenceNumber: item.reference_number,
        files: item.files.map(mapFile),
        removedFiles: item.removed_files.map(mapFile),
      })),
    },
    billing: {
      invoiceStatus: mapStatus(value.billing.invoice_status),
      issuedAt: value.billing.issued_at,
      deliveredAt: value.billing.delivered_at,
      paymentTerm: value.billing.payment_term,
      estimatedPaymentAt: value.billing.estimated_payment_at,
      paidAt: value.billing.paid_at,
    },
  };
}
function mapComment(value: ApiComment): BillingComment {
  return {
    commentId: value.comment_id,
    text: value.text,
    visibility: value.visibility,
    createdAt: value.created_at,
    updatedAt: value.updated_at,
    createdBy: value.created_by,
    updatedBy: value.updated_by,
  };
}

export const fetchBillingInvoiceStatusOptions = createAsyncThunk<
  CustomerServiceRecordOption[],
  void,
  Failure
>('billingCustomerServiceRecords/fetchInvoiceStatusOptions', async (_, api) => {
  try {
    const response = await jsonRequest<ApiLocalizedValue[]>(`${base}/invoice-statuses/options`, {
      method: 'GET',
      token: requireToken(api.getState()),
    });
    return response.data.map((item) => ({ value: item.code, label: item.name }));
  } catch (error) {
    return api.rejectWithValue(failure(error));
  }
});

type RecordResult = {
  record: ReturnType<typeof mapCustomerServiceRecordDetail>;
  message: string | null;
};
async function mutateRecord(
  path: string,
  method: 'PATCH' | 'PUT' | 'POST',
  body: unknown,
  state: RootState
): Promise<RecordResult> {
  const response = await jsonRequest<ApiCustomerServiceRecordDetail>(path, {
    method,
    body,
    token: requireToken(state),
  });
  return {
    record: mapCustomerServiceRecordDetail(response.data),
    message: response.successMessage,
  };
}

export const updateBillingRecordDetails = createAsyncThunk<
  RecordResult,
  { recordId: string; changes: BillingDetailsChanges },
  Failure
>('billingCustomerServiceRecords/updateDetails', async ({ recordId, changes }, api) => {
  try {
    return await mutateRecord(
      `${base}/${recordId}/billing-details`,
      'PATCH',
      {
        ...(changes.issuedAt === undefined ? {} : { issued_at: changes.issuedAt }),
        ...(changes.deliveredAt === undefined ? {} : { delivered_at: changes.deliveredAt }),
        ...(changes.paymentTerm === undefined ? {} : { payment_term: changes.paymentTerm }),
        ...(changes.estimatedPaymentAt === undefined
          ? {}
          : { estimated_payment_at: changes.estimatedPaymentAt }),
        ...(changes.paidAt === undefined ? {} : { paid_at: changes.paidAt }),
      },
      api.getState()
    );
  } catch (error) {
    return api.rejectWithValue(failure(error));
  }
});

export const updateBillingInvoiceStatus = createAsyncThunk<
  RecordResult,
  { recordId: string; status: BillingInvoiceStatus },
  Failure
>('billingCustomerServiceRecords/updateInvoiceStatus', async ({ recordId, status }, api) => {
  try {
    return await mutateRecord(
      `${base}/${recordId}/invoice-status`,
      'PATCH',
      { invoice_status: status },
      api.getState()
    );
  } catch (error) {
    return api.rejectWithValue(failure(error));
  }
});

export const updateBillingPurchaseOrder = createAsyncThunk<
  RecordResult,
  { recordId: string; referenceNumber: string | null; fileIds: string[] },
  Failure
>(
  'billingCustomerServiceRecords/updatePurchaseOrder',
  async ({ recordId, referenceNumber, fileIds }, api) => {
    try {
      return await mutateRecord(
        `${base}/${recordId}/purchase-order`,
        'PUT',
        { reference_number: referenceNumber, file_ids: fileIds },
        api.getState()
      );
    } catch (error) {
      return api.rejectWithValue(failure(error));
    }
  }
);

export const createBillingPaymentComplement = createAsyncThunk<
  RecordResult,
  { recordId: string; referenceNumber: string | null; fileIds: string[] },
  Failure
>(
  'billingCustomerServiceRecords/createComplement',
  async ({ recordId, referenceNumber, fileIds }, api) => {
    try {
      return await mutateRecord(
        `${base}/${recordId}/invoice/payment-complements`,
        'POST',
        { reference_number: referenceNumber, file_ids: fileIds },
        api.getState()
      );
    } catch (error) {
      return api.rejectWithValue(failure(error));
    }
  }
);

export const updateBillingPaymentComplement = createAsyncThunk<
  RecordResult,
  { recordId: string; complementId: string; referenceNumber: string | null; fileIds: string[] },
  Failure
>(
  'billingCustomerServiceRecords/updateComplement',
  async ({ recordId, complementId, referenceNumber, fileIds }, api) => {
    try {
      return await mutateRecord(
        `${base}/${recordId}/invoice/payment-complements/${complementId}`,
        'PUT',
        { reference_number: referenceNumber, file_ids: fileIds },
        api.getState()
      );
    } catch (error) {
      return api.rejectWithValue(failure(error));
    }
  }
);

export const archiveBillingInvoice = createAsyncThunk<
  { archiveId: string; record: RecordResult['record'] },
  { recordId: string },
  Failure
>('billingCustomerServiceRecords/archiveInvoice', async ({ recordId }, api) => {
  try {
    const response = await jsonRequest<{
      archive_id: string;
      record: ApiCustomerServiceRecordDetail;
    }>(`${base}/${recordId}/invoice/archive`, {
      method: 'POST',
      token: requireToken(api.getState()),
    });
    return {
      archiveId: response.data.archive_id,
      record: mapCustomerServiceRecordDetail(response.data.record),
    };
  } catch (error) {
    return api.rejectWithValue(failure(error));
  }
});

export const fetchBillingInvoiceArchives = createAsyncThunk<
  { recordId: string; items: BillingArchiveSummary[]; page: number; totalPages: number },
  { recordId: string; page?: number },
  Failure
>('billingCustomerServiceRecords/fetchArchives', async ({ recordId, page = 1 }, api) => {
  try {
    const response = await jsonRequest<ApiSummary[], Meta>(
      `${base}/${recordId}/invoice/archives?page=${page}&limit=10`,
      { method: 'GET', token: requireToken(api.getState()) }
    );
    return {
      recordId,
      items: response.data.map(mapSummary),
      page,
      totalPages: response.meta?.pagination?.total_pages ?? 1,
    };
  } catch (error) {
    return api.rejectWithValue(failure(error));
  }
});

export const fetchBillingInvoiceArchiveDetail = createAsyncThunk<
  BillingArchiveDetail,
  { recordId: string; archiveId: string },
  Failure
>('billingCustomerServiceRecords/fetchArchiveDetail', async ({ recordId, archiveId }, api) => {
  try {
    const response = await jsonRequest<ApiArchive>(
      `${base}/${recordId}/invoice/archives/${archiveId}`,
      { method: 'GET', token: requireToken(api.getState()) }
    );
    return mapArchive(response.data);
  } catch (error) {
    return api.rejectWithValue(failure(error));
  }
});

export const fetchBillingRecordComments = createAsyncThunk<
  { recordId: string; items: BillingComment[]; page: number; totalPages: number },
  { recordId: string; page?: number },
  Failure
>('billingCustomerServiceRecords/fetchComments', async ({ recordId, page = 1 }, api) => {
  try {
    const response = await jsonRequest<ApiComment[], Meta>(
      `${base}/${recordId}/comments?page=${page}&limit=10`,
      { method: 'GET', token: requireToken(api.getState()) }
    );
    return {
      recordId,
      items: response.data.map(mapComment),
      page,
      totalPages: response.meta?.pagination?.total_pages ?? 1,
    };
  } catch (error) {
    return api.rejectWithValue(failure(error));
  }
});

export const createBillingRecordComment = createAsyncThunk<
  BillingComment,
  { recordId: string; text: string; visibility: BillingComment['visibility'] },
  Failure
>('billingCustomerServiceRecords/createComment', async ({ recordId, text, visibility }, api) => {
  try {
    const response = await jsonRequest<ApiComment>(`${base}/${recordId}/comments`, {
      method: 'POST',
      body: { text, visibility },
      token: requireToken(api.getState()),
    });
    return mapComment(response.data);
  } catch (error) {
    return api.rejectWithValue(failure(error));
  }
});
