'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiError, jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type {
  ServicePackageRecordDetail,
  ServicePackageRecordDetailError,
  ServicePackageRecordListItem,
  ServicePackagesRecordsPagination,
  ServicePackageRecordServiceTypeOption,
} from '@/features/servicePackagesRecords/types';
import {
  mapServicePackageRecordDetail,
  mapServicePackageRecordListItem,
  type ApiServicePackageRecordDetail,
  type ApiServicePackageRecordListItem,
} from '@/features/servicePackagesRecords/servicePackagesRecordsMappers';

interface ApiPagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface FetchServicePackagesRecordsParams {
  page?: number;
  limit?: number;
  search?: string;
  serviceType?: string | null;
}

export const fetchServicePackagesRecords = createAsyncThunk<
  { records: ServicePackageRecordListItem[]; pagination: ServicePackagesRecordsPagination },
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

  const response = await jsonRequest<
    ApiServicePackageRecordListItem[],
    { pagination?: ApiPagination }
  >(`/v1/service-packages/records${query.toString() ? `?${query.toString()}` : ''}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    token,
  });

  const pagination = response.meta?.pagination;

  return {
    records: Array.isArray(response.data) ? response.data.map(mapServicePackageRecordListItem) : [],
    pagination: {
      page: pagination?.page ?? params.page ?? 1,
      perPage: pagination?.per_page ?? params.limit ?? 10,
      total: pagination?.total ?? 0,
      totalPages: pagination?.total_pages ?? 1,
    },
  };
});

export const fetchServicePackageRecordDetail = createAsyncThunk<
  ServicePackageRecordDetail,
  { recordId: string },
  { state: RootState; rejectValue: ServicePackageRecordDetailError }
>('servicePackagesRecords/fetchDetail', async ({ recordId }, thunkAPI) => {
  const token = thunkAPI.getState().auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue({
      message: 'No hay token de autenticación',
      status: 401,
    });
  }

  try {
    const response = await jsonRequest<ApiServicePackageRecordDetail>(
      `/v1/service-packages/records/${recordId}`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
        token,
      }
    );

    return mapServicePackageRecordDetail(response.data);
  } catch (error) {
    return thunkAPI.rejectWithValue({
      message:
        error instanceof Error && error.message
          ? error.message
          : 'No fue posible obtener el registro de servicio.',
      status: error instanceof ApiError ? error.status : 0,
    });
  }
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
