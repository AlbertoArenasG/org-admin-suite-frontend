'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiError, jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type {
  FetchServicePackagesRecordsParams,
  ServicePackageRecordDetail,
  ServicePackageRecordDetailError,
  ServicePackageRecordListItem,
  ServicePackageRecordServiceTypeOption,
} from '@/features/servicePackagesRecords/types';
import {
  mapServicePackageRecordDetail,
  mapServicePackageRecordListItem,
  type ApiServicePackageRecordDetail,
  type ApiServicePackageRecordListItem,
} from '@/features/servicePackagesRecords/servicePackagesRecordsMappers';

type ApiPagination = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

type ServicePackagesRecordsListResult = {
  items: ServicePackageRecordListItem[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export const fetchServicePackagesRecords = createAsyncThunk<
  ServicePackagesRecordsListResult,
  FetchServicePackagesRecordsParams | undefined,
  { state: RootState; rejectValue: string }
>('servicePackagesRecords/fetchAll', async (params = {}, thunkAPI) => {
  const token = thunkAPI.getState().auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticacion');
  }

  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  const search = params.search?.trim();
  const serviceType = params.filters?.serviceType?.trim();

  if (search) query.set('search', search);
  if (serviceType) query.set('service_type', serviceType);

  try {
    const response = await jsonRequest<
      ApiServicePackageRecordListItem[],
      { pagination?: ApiPagination }
    >(`/v1/service-packages/records?${query.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      token,
    });
    const pagination = response.meta?.pagination;

    return {
      items: Array.isArray(response.data) ? response.data.map(mapServicePackageRecordListItem) : [],
      page: pagination?.page ?? page,
      perPage: pagination?.per_page ?? limit,
      total: pagination?.total ?? 0,
      totalPages: pagination?.total_pages ?? 1,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible obtener los registros de servicio.'
    );
  }
});

export const fetchServicePackageRecordServiceTypeOptions = createAsyncThunk<
  ServicePackageRecordServiceTypeOption[],
  void,
  { state: RootState; rejectValue: string }
>('servicePackagesRecords/fetchServiceTypeOptions', async (_, thunkAPI) => {
  const token = thunkAPI.getState().auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticacion');
  }

  try {
    const response = await jsonRequest<{ service_types?: ServicePackageRecordServiceTypeOption[] }>(
      '/v1/service-packages/records/options',
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
        token,
      }
    );

    return response.data.service_types ?? [];
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible obtener los tipos de servicio.'
    );
  }
});

export const deleteServicePackageRecord = createAsyncThunk<
  { recordId: string; message: string | null },
  { recordId: string },
  { state: RootState; rejectValue: string }
>('servicePackagesRecords/delete', async ({ recordId }, thunkAPI) => {
  const token = thunkAPI.getState().auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticacion');
  }

  try {
    const response = await jsonRequest<{ record_id?: string }>(
      `/v1/service-packages/records/${recordId}`,
      {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
        token,
      }
    );

    return { recordId: response.data.record_id ?? recordId, message: response.successMessage };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible eliminar el registro.'
    );
  }
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
