'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type {
  ServicePackageRecord,
  ServicePackagesRecordsPagination,
  ServicePackageRecordServiceTypeOption,
} from '@/features/servicePackagesRecords/types';

interface ApiRecord {
  record_id: string;
  service_order: string;
  company: string;
  collector_name: string;
  visit_date: string;
  service_type: string;
  created_at: string;
}

interface ApiPagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

function mapRecord(record: ApiRecord): ServicePackageRecord {
  return {
    id: record.record_id,
    serviceOrder: record.service_order,
    company: record.company,
    collectorName: record.collector_name,
    visitDate: record.visit_date,
    serviceType: record.service_type,
    createdAt: record.created_at,
  };
}

export interface FetchServicePackagesRecordsParams {
  page?: number;
  limit?: number;
  search?: string;
  serviceType?: string | null;
}

export const fetchServicePackagesRecords = createAsyncThunk<
  { records: ServicePackageRecord[]; pagination: ServicePackagesRecordsPagination },
  FetchServicePackagesRecordsParams | undefined,
  { state: RootState }
>('servicePackagesRecords/fetchAll', async (params = {}, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  const query = new URLSearchParams();
  if (params.page) {
    query.set('page', String(params.page));
  }
  if (params.limit) {
    query.set('limit', String(params.limit));
  }
  if (params.search && params.search.trim()) {
    query.set('search', params.search.trim());
  }
  if (params.serviceType && params.serviceType.trim()) {
    query.set('service_type', params.serviceType.trim());
  }

  const response = await jsonRequest<ApiRecord[], { pagination?: ApiPagination }>(
    `/v1/service-packages/records${query.toString() ? `?${query.toString()}` : ''}`,
    {
      method: 'GET',
      headers: { Accept: 'application/json' },
      token,
    }
  );

  const pagination = response.meta?.pagination;

  return {
    records: Array.isArray(response.data) ? response.data.map(mapRecord) : [],
    pagination: {
      page: pagination?.page ?? params.page ?? 1,
      perPage: pagination?.per_page ?? params.limit ?? 10,
      total: pagination?.total ?? 0,
      totalPages: pagination?.total_pages ?? 1,
    },
  };
});

export const fetchServicePackageRecordServiceTypeOptions = createAsyncThunk<
  ServicePackageRecordServiceTypeOption[],
  void,
  { state: RootState }
>('servicePackagesRecords/fetchServiceTypeOptions', async (_, thunkAPI) => {
  const token = thunkAPI.getState().auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  const response = await jsonRequest<{
    service_types?: ServicePackageRecordServiceTypeOption[];
  }>('/v1/service-packages/records/options', {
    method: 'GET',
    headers: { Accept: 'application/json' },
    token,
  });

  return response.data.service_types ?? [];
});

export const deleteServicePackageRecord = createAsyncThunk<
  { id: string; message: string | null },
  { id: string },
  { state: RootState }
>('servicePackagesRecords/delete', async ({ id }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<{ record_id: string }>(
      `/v1/service-packages/records/${id}`,
      {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
        token,
      }
    );

    return { id: response.data.record_id ?? id, message: response.successMessage };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible eliminar el registro.';
    return thunkAPI.rejectWithValue(message);
  }
});
