'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type {
  ServiceEntry,
  ServiceEntryDetail,
  ServiceEntryFileMetadata,
} from './serviceEntriesSlice';
import { readPersistedAuthToken } from '@/features/auth/persistence';
import { API_BASE_URL } from '@/config/env';

export interface FetchServiceEntriesParams {
  page?: number;
  limit?: number;
  search?: string;
  sorts?: Array<{ field: string; direction: 'asc' | 'desc' }>;
}

export interface FetchServiceEntriesResult {
  entries: ServiceEntry[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

interface ApiServiceEntry {
  service_entry_id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  service_order_identifier: string;
  category_id: string;
  category_name: string;
  calibration_certificate_file_id: string | null;
  attachment_file_ids: string[];
  status_id: string;
  status_name: string;
  survey_access_id: string | null;
  survey_template: {
    template_id: string;
    version: number;
  } | null;
  created_at: string;
  updated_at: string | null;
  files_metadata?: {
    calibration_certificate?: ServiceEntryFileMetadata | null;
    attachments?: ServiceEntryFileMetadata[] | null;
  };
  survey_status?: {
    completed: boolean;
    submitted_at: string | null;
  } | null;
  download_status?: {
    has_download: boolean;
    last_downloaded_at: string | null;
    download_count: number;
  } | null;
  public_access_token?: string | null;
}

interface ApiPagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface ApiCategory {
  category_id: string;
  category_name: string;
}

const mapServiceEntry = (entry: ApiServiceEntry): ServiceEntry => ({
  id: entry.service_entry_id,
  companyName: entry.company_name,
  contactName: entry.contact_name,
  contactEmail: entry.contact_email,
  serviceOrderIdentifier: entry.service_order_identifier,
  categoryId: entry.category_id,
  categoryName: entry.category_name,
  calibrationCertificateFileId: entry.calibration_certificate_file_id,
  attachmentFileIds: entry.attachment_file_ids,
  statusId: entry.status_id,
  statusName: entry.status_name,
  surveyAccessId: entry.survey_access_id,
  surveyTemplate: entry.survey_template,
  createdAt: entry.created_at,
  updatedAt: entry.updated_at,
  filesMetadata: entry.files_metadata ?? null,
  surveyStatus: entry.survey_status ?? null,
  downloadStatus: entry.download_status ?? null,
  publicAccessToken: entry.public_access_token ?? null,
});

function buildServiceEntriesQuery(params: FetchServiceEntriesParams) {
  const query = new URLSearchParams();
  if (params.page) {
    query.set('page', String(params.page));
  }
  if (params.limit) {
    query.set('limit', String(params.limit));
  }
  if (params.search) {
    query.set('search', params.search);
  }
  params.sorts?.forEach((sort, index) => {
    query.set(`sort[${index}][field]`, sort.field);
    query.set(`sort[${index}][direction]`, sort.direction);
  });
  return query.toString();
}

export const fetchServiceEntries = createAsyncThunk<
  FetchServiceEntriesResult,
  FetchServiceEntriesParams | undefined,
  { state: RootState }
>('serviceEntries/fetchAll', async (params = {}, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  const queryString = buildServiceEntriesQuery(params);
  const response = await jsonRequest<ApiServiceEntry[], { pagination?: ApiPagination }>(
    `/v1/services/service-entry?${queryString}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      token,
    }
  );

  const apiEntries = Array.isArray(response.data) ? response.data : [];
  const pagination = response.meta?.pagination;

  const inferredPerPage = params.limit ?? (apiEntries.length > 0 ? apiEntries.length : 10);

  return {
    entries: apiEntries.map(mapServiceEntry),
    pagination: {
      page: pagination?.page ?? params.page ?? 1,
      perPage: pagination?.per_page ?? inferredPerPage,
      total: pagination?.total ?? apiEntries.length,
      totalPages: pagination?.total_pages ?? 1,
    },
  };
});

export const fetchServiceEntryCategories = createAsyncThunk<
  ApiCategory[],
  void,
  { state: RootState }
>('serviceEntries/fetchCategories', async (_arg, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token ?? readPersistedAuthToken();

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiCategory[]>(`/v1/services/service-entry/categories`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      token,
    });

    return response.data ?? [];
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible obtener las categorías.';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchServiceEntryById = createAsyncThunk<
  ServiceEntryDetail,
  { id: string },
  { state: RootState }
>('serviceEntries/fetchById', async ({ id }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiServiceEntry>(`/v1/services/service-entry/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      token,
    });

    return mapServiceEntry(response.data);
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible obtener el servicio';
    return thunkAPI.rejectWithValue(message);
  }
});

interface UpsertServiceEntryPayload {
  companyName: string;
  contactName: string;
  contactEmail: string;
  serviceOrderIdentifier: string;
  categoryId: string;
  calibrationCertificateFileId: string | null;
  attachmentFileIds: string[];
}

export const createServiceEntry = createAsyncThunk<
  ServiceEntryDetail,
  UpsertServiceEntryPayload,
  { state: RootState }
>('serviceEntries/create', async (payload, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiServiceEntry>(`/v1/services/service-entry`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: {
        company_name: payload.companyName,
        contact_name: payload.contactName,
        contact_email: payload.contactEmail,
        service_order_identifier: payload.serviceOrderIdentifier,
        category_id: payload.categoryId,
        calibration_certificate_file_id: payload.calibrationCertificateFileId,
        attachment_file_ids: payload.attachmentFileIds,
      },
      token,
    });

    return mapServiceEntry(response.data);
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible crear la entrada de servicio';
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateServiceEntry = createAsyncThunk<
  ServiceEntryDetail,
  { id: string; data: UpsertServiceEntryPayload },
  { state: RootState }
>('serviceEntries/update', async ({ id, data }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiServiceEntry>(`/v1/services/service-entry/${id}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
      },
      body: {
        company_name: data.companyName,
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        service_order_identifier: data.serviceOrderIdentifier,
        category_id: data.categoryId,
        calibration_certificate_file_id: data.calibrationCertificateFileId,
        attachment_file_ids: data.attachmentFileIds,
      },
      token,
    });

    return mapServiceEntry(response.data);
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible actualizar la entrada de servicio';
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteServiceEntry = createAsyncThunk<
  { id: string; message: string | null },
  { id: string },
  { state: RootState }
>('serviceEntries/delete', async ({ id }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<null>(`/v1/services/service-entry/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
      token,
    });

    return { id, message: response.successMessage ?? null };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible eliminar la entrada de servicio';
    return thunkAPI.rejectWithValue(message);
  }
});

interface UploadFilesPayload {
  files: File[];
}

interface ApiUploadResponseItem {
  id: string;
  original_name: string;
  filename: string;
  mime_type: string;
  size: number;
  storage_key: string;
  bucket: string;
  url: string;
  uploaded_by: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export const uploadServiceEntryFiles = createAsyncThunk<
  ApiUploadResponseItem[],
  UploadFilesPayload,
  { state: RootState }
>('serviceEntries/uploadFiles', async ({ files }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token ?? readPersistedAuthToken();

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  if (!files.length) {
    return [];
  }

  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  try {
    const response = await fetch(`${API_BASE_URL}/v1/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'x-user-lang':
          typeof document !== 'undefined'
            ? (document.documentElement.getAttribute('lang') ?? 'es')
            : 'es',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('No fue posible subir los archivos');
    }

    const payload = (await response.json()) as {
      data?: ApiUploadResponseItem[];
      success?: boolean;
      success_message?: string | null;
    };

    return payload.data ?? [];
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : 'No fue posible subir los archivos';
    return thunkAPI.rejectWithValue(message);
  }
});
