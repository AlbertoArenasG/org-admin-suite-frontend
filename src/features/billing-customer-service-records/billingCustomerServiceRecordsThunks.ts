import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  mapCustomerServiceRecordDetail,
  mapCustomerServiceRecordListItem,
  type ApiCustomerServiceRecordDetail,
  type ApiCustomerServiceRecordListItem,
  type ApiLocalizedValue,
} from '@/features/customer-service-records/customerServiceRecordMappers';
import { uploadCustomerServiceRecordFilesRequest } from '@/features/customer-service-records/customerServiceRecordFileUpload';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type {
  BillingCustomerServiceRecord,
  BillingCustomerServiceRecordOption,
  BillingCustomerServiceRecordRow,
  BillingUploadedFile,
  FetchBillingCustomerServiceRecordsParams,
} from './types';

type PaginationMeta = { page: number; per_page: number; total: number; total_pages: number };

function getAuthToken(state: RootState) {
  return state.auth.token;
}

export const fetchBillingCustomerServiceRecords = createAsyncThunk<
  {
    items: BillingCustomerServiceRecordRow[];
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  },
  FetchBillingCustomerServiceRecordsParams | undefined,
  { state: RootState; rejectValue: string }
>('billingCustomerServiceRecords/fetchAll', async (params = {}, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  const { page = 1, limit = 10, search, billingStatus } = params;
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search?.trim()) query.set('search', search.trim());
  if (billingStatus) query.set('billing_status', billingStatus);

  try {
    const response = await jsonRequest<
      ApiCustomerServiceRecordListItem[],
      { pagination?: PaginationMeta }
    >(`/v1/billing/customer-service-records?${query.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      token,
    });
    const items = Array.isArray(response.data)
      ? response.data.map(mapCustomerServiceRecordListItem)
      : [];
    const pagination = response.meta?.pagination;
    return {
      items,
      page: pagination?.page ?? page,
      perPage: pagination?.per_page ?? limit,
      total: pagination?.total ?? items.length,
      totalPages: pagination?.total_pages ?? 1,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible obtener los registros de facturación'
    );
  }
});

export const fetchBillingCustomerServiceRecordDetail = createAsyncThunk<
  BillingCustomerServiceRecord,
  { recordId: string },
  { state: RootState; rejectValue: string }
>('billingCustomerServiceRecords/fetchDetail', async ({ recordId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  try {
    const response = await jsonRequest<ApiCustomerServiceRecordDetail>(
      `/v1/billing/customer-service-records/${recordId}`,
      { method: 'GET', headers: { Accept: 'application/json' }, token }
    );
    return mapCustomerServiceRecordDetail(response.data);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible obtener el registro de facturación'
    );
  }
});

export const fetchBillingCustomerServiceRecordStatusOptions = createAsyncThunk<
  BillingCustomerServiceRecordOption[],
  void,
  { state: RootState; rejectValue: string }
>('billingCustomerServiceRecords/fetchStatusOptions', async (_, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  try {
    const response = await jsonRequest<ApiLocalizedValue[]>(
      '/v1/billing/customer-service-records/billing-statuses/options',
      { method: 'GET', headers: { Accept: 'application/json' }, token }
    );
    return response.data.map(({ code, name }) => ({ value: code, label: name }));
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible obtener los estados de facturación'
    );
  }
});

export const updateBillingCustomerServiceRecordInvoice = createAsyncThunk<
  { record: BillingCustomerServiceRecord; message: string | null },
  { recordId: string; referenceNumber: string | null; fileIds: string[] },
  { state: RootState; rejectValue: string }
>(
  'billingCustomerServiceRecords/updateInvoice',
  async ({ recordId, referenceNumber, fileIds }, thunkAPI) => {
    const token = getAuthToken(thunkAPI.getState());
    if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

    try {
      const response = await jsonRequest<ApiCustomerServiceRecordDetail>(
        `/v1/billing/customer-service-records/${recordId}/invoice`,
        {
          method: 'PUT',
          headers: { Accept: 'application/json' },
          body: { reference_number: referenceNumber, file_ids: fileIds },
          token,
        }
      );
      return {
        record: mapCustomerServiceRecordDetail(response.data),
        message: response.successMessage,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error instanceof Error ? error.message : 'No fue posible guardar la factura'
      );
    }
  }
);

export const markBillingCustomerServiceRecordInvoiced = createAsyncThunk<
  { record: BillingCustomerServiceRecord; message: string | null },
  { recordId: string },
  { state: RootState; rejectValue: string }
>('billingCustomerServiceRecords/markInvoiced', async ({ recordId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  try {
    const response = await jsonRequest<ApiCustomerServiceRecordDetail>(
      `/v1/billing/customer-service-records/${recordId}/billing-status`,
      {
        method: 'PATCH',
        headers: { Accept: 'application/json' },
        body: { billing_status: 'INVOICED' },
        token,
      }
    );
    return {
      record: mapCustomerServiceRecordDetail(response.data),
      message: response.successMessage,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible marcar como facturado'
    );
  }
});

export const uploadBillingCustomerServiceRecordFiles = createAsyncThunk<
  BillingUploadedFile[],
  { files: File[] },
  { state: RootState; rejectValue: string }
>('billingCustomerServiceRecords/uploadFiles', async ({ files }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');
  try {
    return await uploadCustomerServiceRecordFilesRequest(files, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible subir los archivos'
    );
  }
});
