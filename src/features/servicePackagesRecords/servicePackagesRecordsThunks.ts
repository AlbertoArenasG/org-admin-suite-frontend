'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type {
  ServicePackageRecord,
  ServicePackageRecordDetails,
  ServicePackageRecordEquipment,
  ServicePackageRecordFile,
  ServicePackagesRecordsPagination,
} from '@/features/servicePackagesRecords/types';

interface ApiFile {
  file_id: string;
  relative_path: string;
  original_name: string;
  s3_key: string;
  size: number;
  content_type: string;
}

interface ApiRecordDetails extends Omit<ServicePackageRecordDetails, 'equipment' | 'raw'> {
  equipment?: ServicePackageRecordEquipment[];
  raw?: Record<string, unknown>;
}

interface ApiRecord {
  record_id: string;
  package_id: string;
  service_order: string;
  original_filename: string;
  s3_folder_key: string;
  details?: ApiRecordDetails | null;
  company: string;
  collector_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  visit_date: string;
  service_type: string;
  purpose: string;
  status: string;
  created_at: string;
  updated_at: string | null;
  files?: ApiFile[];
}

interface ApiPagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

function mapFile(file: ApiFile): ServicePackageRecordFile {
  return {
    id: file.file_id,
    relativePath: file.relative_path,
    originalName: file.original_name,
    url: file.s3_key,
    size: file.size,
    contentType: file.content_type,
  };
}

function mapRecord(record: ApiRecord): ServicePackageRecord {
  return {
    id: record.record_id,
    packageId: record.package_id,
    serviceOrder: record.service_order,
    originalFilename: record.original_filename,
    folderKey: record.s3_folder_key,
    details: record.details
      ? {
          ...record.details,
          observations: record.details.observations ?? null,
          equipment: record.details.equipment ?? [],
        }
      : null,
    company: record.company,
    collectorName: record.collector_name,
    contactPerson: record.contact_person,
    email: record.email,
    phone: record.phone,
    address: record.address,
    visitDate: record.visit_date,
    serviceType: record.service_type,
    purpose: record.purpose,
    status: record.status,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
    files: Array.isArray(record.files) ? record.files.map(mapFile) : [],
  };
}

export interface FetchServicePackagesRecordsParams {
  page?: number;
  limit?: number;
  search?: string;
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

export const fetchServicePackageRecordById = createAsyncThunk<
  ServicePackageRecord,
  { id: string },
  { state: RootState }
>('servicePackagesRecords/fetchById', async ({ id }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  const response = await jsonRequest<ApiRecord>(`/v1/service-packages/records/${id}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    token,
  });

  return mapRecord(response.data);
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
