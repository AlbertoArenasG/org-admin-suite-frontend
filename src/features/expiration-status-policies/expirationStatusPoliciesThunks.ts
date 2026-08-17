import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import { readPersistedAuthToken } from '@/features/auth/persistence';
import type { RootState } from '@/store';
import type {
  CreateExpirationStatusPolicyPayload,
  DeleteExpirationStatusPolicyPayload,
  ExpirationStatusPolicyCatalog,
  ExpirationStatusPolicyDetail,
  ExpirationStatusPolicyListItem,
  ExpirationStatusPolicyMutationPayload,
  ExpirationStatusPolicyOption,
  ExpirationStatusPolicyRule,
  FetchExpirationStatusPoliciesParams,
  FetchExpirationStatusPoliciesResult,
  FetchExpirationStatusPolicyOptionsParams,
  UpdateExpirationStatusPolicyPayload,
} from './types';

interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface ApiExpirationStatusPolicyActorSummary {
  user_id: string;
  name: string | null;
  email: string | null;
}

interface ApiExpirationStatusPolicyOffset {
  years: number;
  months: number;
  weeks: number;
  days: number;
}

interface ApiExpirationStatusPolicyRule {
  rule_id: string;
  start_offset: ApiExpirationStatusPolicyOffset;
  label: string;
  color_hex: string;
}

interface ApiExpirationStatusPolicyListItem {
  expiration_status_policy_id: string;
  name: string;
  code: string;
  description: string | null;
  status_id: ExpirationStatusPolicyListItem['statusId'];
  status_name: string;
  rules_count: number;
  created_at: string | null;
  updated_at: string | null;
}

interface ApiExpirationStatusPolicyDetail extends ApiExpirationStatusPolicyListItem {
  rules: ApiExpirationStatusPolicyRule[];
  created_by: ApiExpirationStatusPolicyActorSummary | null;
  updated_by: ApiExpirationStatusPolicyActorSummary | null;
}

interface ApiExpirationStatusPolicyOption {
  expiration_status_policy_id: string;
  name: string;
  code: string;
  status_id: ExpirationStatusPolicyOption['statusId'];
  status_name: string;
}

interface ApiExpirationStatusPolicyStatusCatalogItem {
  code: ExpirationStatusPolicyOption['statusId'];
  name: string;
  name_key: string;
}

interface ApiExpirationStatusPolicyCatalog {
  statuses: ApiExpirationStatusPolicyStatusCatalogItem[];
}

function getAuthToken(state: RootState) {
  return state.auth.token ?? readPersistedAuthToken();
}

const mapActorSummary = (
  actor: ApiExpirationStatusPolicyActorSummary | null
): ExpirationStatusPolicyDetail['createdBy'] | ExpirationStatusPolicyDetail['updatedBy'] =>
  actor
    ? {
        userId: actor.user_id,
        name: actor.name,
        email: actor.email,
      }
    : null;

const mapRule = (rule: ApiExpirationStatusPolicyRule): ExpirationStatusPolicyRule => ({
  ruleId: rule.rule_id,
  startOffset: {
    years: rule.start_offset.years,
    months: rule.start_offset.months,
    weeks: rule.start_offset.weeks,
    days: rule.start_offset.days,
  },
  label: rule.label,
  colorHex: rule.color_hex,
});

const mapListItem = (item: ApiExpirationStatusPolicyListItem): ExpirationStatusPolicyListItem => ({
  expirationStatusPolicyId: item.expiration_status_policy_id,
  name: item.name,
  code: item.code,
  description: item.description,
  statusId: item.status_id,
  statusName: item.status_name,
  rulesCount: item.rules_count,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

const mapDetail = (item: ApiExpirationStatusPolicyDetail): ExpirationStatusPolicyDetail => ({
  ...mapListItem(item),
  rules: Array.isArray(item.rules) ? item.rules.map(mapRule) : [],
  createdBy: mapActorSummary(item.created_by),
  updatedBy: mapActorSummary(item.updated_by),
});

const mapOption = (item: ApiExpirationStatusPolicyOption): ExpirationStatusPolicyOption => ({
  expirationStatusPolicyId: item.expiration_status_policy_id,
  name: item.name,
  code: item.code,
  statusId: item.status_id,
  statusName: item.status_name,
});

const mapCatalog = (item: ApiExpirationStatusPolicyCatalog): ExpirationStatusPolicyCatalog => ({
  statuses: Array.isArray(item.statuses)
    ? item.statuses.map((status) => ({
        code: status.code,
        name: status.name,
        nameKey: status.name_key,
      }))
    : [],
});

function buildMutationBody(payload: ExpirationStatusPolicyMutationPayload) {
  return {
    name: payload.name,
    ...(payload.description ? { description: payload.description } : {}),
    status: payload.statusId,
    rules: payload.rules.map((rule) => ({
      ...(rule.ruleId ? { rule_id: rule.ruleId } : {}),
      start_offset: {
        years: rule.startOffset.years,
        months: rule.startOffset.months,
        weeks: rule.startOffset.weeks,
        days: rule.startOffset.days,
      },
      label: rule.label,
      color_hex: rule.colorHex,
    })),
  };
}

export const fetchExpirationStatusPolicies = createAsyncThunk<
  FetchExpirationStatusPoliciesResult,
  FetchExpirationStatusPoliciesParams | undefined,
  { state: RootState }
>('expirationStatusPolicies/fetchAll', async (params = {}, thunkAPI) => {
  const { page = 1, limit = 10, itemsPerPage, search, filters = {}, sorts = [] } = params;
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    items_per_page: String(itemsPerPage ?? limit),
  });

  if (search?.trim()) {
    query.set('search', search.trim());
  }

  if (filters.status) {
    query.set('status', filters.status);
  }

  sorts.forEach((sort, index) => {
    query.set(`sort[${index}][field]`, sort.field);
    query.set(`sort[${index}][direction]`, sort.direction);
  });

  try {
    const response = await jsonRequest<
      ApiExpirationStatusPolicyListItem[],
      { pagination?: PaginationMeta }
    >(`/v1/expiration-status-policies?${query.toString()}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      token,
    });

    const items = Array.isArray(response.data) ? response.data.map(mapListItem) : [];
    const pagination = response.meta?.pagination ?? {
      page,
      per_page: limit,
      total: items.length,
      total_pages: 1,
    };

    return {
      items,
      pagination: {
        page: pagination.page,
        perPage: pagination.per_page,
        total: pagination.total,
        totalPages: pagination.total_pages,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible obtener las políticas de estatus por vencimiento';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchExpirationStatusPolicyCatalog = createAsyncThunk<
  ExpirationStatusPolicyCatalog,
  void,
  { state: RootState }
>('expirationStatusPolicies/fetchCatalog', async (_, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiExpirationStatusPolicyCatalog>(
      '/v1/expiration-status-policies/catalog',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        token,
      }
    );

    return mapCatalog(response.data);
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible obtener el catálogo de políticas de estatus por vencimiento';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchExpirationStatusPolicyOptions = createAsyncThunk<
  ExpirationStatusPolicyOption[],
  FetchExpirationStatusPolicyOptionsParams | undefined,
  { state: RootState }
>('expirationStatusPolicies/fetchOptions', async (params = {}, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  const query = new URLSearchParams();

  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }

  if (params.status) {
    query.set('status', params.status);
  }

  try {
    const response = await jsonRequest<ApiExpirationStatusPolicyOption[]>(
      `/v1/expiration-status-policies/options${query.size ? `?${query.toString()}` : ''}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        token,
      }
    );

    return Array.isArray(response.data) ? response.data.map(mapOption) : [];
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible obtener las opciones de políticas de estatus por vencimiento';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchExpirationStatusPolicyById = createAsyncThunk<
  { expirationStatusPolicy: ExpirationStatusPolicyDetail },
  { expirationStatusPolicyId: string },
  { state: RootState }
>('expirationStatusPolicies/fetchById', async ({ expirationStatusPolicyId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiExpirationStatusPolicyDetail>(
      `/v1/expiration-status-policies/${expirationStatusPolicyId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        token,
      }
    );

    return { expirationStatusPolicy: mapDetail(response.data) };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible obtener la política de estatus por vencimiento';
    return thunkAPI.rejectWithValue(message);
  }
});

export const createExpirationStatusPolicy = createAsyncThunk<
  { expirationStatusPolicy: ExpirationStatusPolicyDetail; message: string | null },
  CreateExpirationStatusPolicyPayload,
  { state: RootState }
>('expirationStatusPolicies/createOne', async (payload, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiExpirationStatusPolicyDetail>(
      '/v1/expiration-status-policies',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: buildMutationBody(payload),
        token,
      }
    );

    return {
      expirationStatusPolicy: mapDetail(response.data),
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible crear la política de estatus por vencimiento';
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateExpirationStatusPolicy = createAsyncThunk<
  { expirationStatusPolicy: ExpirationStatusPolicyDetail; message: string | null },
  UpdateExpirationStatusPolicyPayload,
  { state: RootState }
>(
  'expirationStatusPolicies/updateOne',
  async ({ expirationStatusPolicyId, ...payload }, thunkAPI) => {
    const token = getAuthToken(thunkAPI.getState());

    if (!token) {
      return thunkAPI.rejectWithValue('No hay token de autenticación');
    }

    try {
      const response = await jsonRequest<ApiExpirationStatusPolicyDetail>(
        `/v1/expiration-status-policies/${expirationStatusPolicyId}`,
        {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
          },
          body: buildMutationBody(payload),
          token,
        }
      );

      return {
        expirationStatusPolicy: mapDetail(response.data),
        message: response.successMessage ?? null,
      };
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'No fue posible actualizar la política de estatus por vencimiento';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteExpirationStatusPolicy = createAsyncThunk<
  { expirationStatusPolicyId: string; message: string | null },
  DeleteExpirationStatusPolicyPayload,
  { state: RootState }
>('expirationStatusPolicies/deleteOne', async ({ expirationStatusPolicyId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<unknown>(
      `/v1/expiration-status-policies/${expirationStatusPolicyId}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
        token,
      }
    );

    return {
      expirationStatusPolicyId,
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible eliminar la política de estatus por vencimiento';
    return thunkAPI.rejectWithValue(message);
  }
});
