import { createAsyncThunk } from '@reduxjs/toolkit';

import { readPersistedAuthToken } from '@/features/auth/persistence';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';

import type {
  CreateExpirationNotificationPolicyPayload,
  ExpirationNotificationPolicyAnchorCode,
  DeleteExpirationNotificationPolicyPayload,
  ExpirationNotificationPolicyActorSummary,
  ExpirationNotificationPolicyCatalog,
  ExpirationNotificationPolicyCatalogItem,
  ExpirationNotificationPolicyChannelSummary,
  ExpirationNotificationPolicyDetail,
  ExpirationNotificationPolicyListItem,
  ExpirationNotificationPolicyMutationPayload,
  ExpirationNotificationPolicyOffset,
  ExpirationNotificationPolicyOption,
  ExpirationNotificationPolicyRepeatUntilCode,
  ExpirationNotificationPolicyRecipientGroupSummary,
  ExpirationNotificationPolicyRule,
  ExpirationNotificationPolicyStatusId,
  ExpirationNotificationPolicyTriggerModeCode,
  FetchExpirationNotificationPoliciesParams,
  FetchExpirationNotificationPoliciesResult,
  FetchExpirationNotificationPolicyOptionsParams,
  UpdateExpirationNotificationPolicyPayload,
} from './types';

interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface ApiExpirationNotificationPolicyActorSummary {
  user_id: string;
  name: string | null;
  email: string | null;
}

interface ApiExpirationNotificationPolicyCatalogItem {
  code: string;
  name: string;
  name_key: string;
}

interface ApiExpirationNotificationPolicyOffset {
  years: number;
  months: number;
  weeks: number;
  days: number;
}

interface ApiExpirationNotificationPolicyChannelSummary {
  code: string;
  name: string;
  name_key: string | null;
}

interface ApiExpirationNotificationPolicyRecipientGroupSummary {
  recipient_group_id: string;
  name: string;
  code: string;
  status_id: string;
  status_name: string;
  enabled_channels: ApiExpirationNotificationPolicyChannelSummary[];
}

interface ApiExpirationNotificationPolicyRule {
  rule_id: string;
  anchor: ApiExpirationNotificationPolicyCatalogItem;
  start_offset: ApiExpirationNotificationPolicyOffset;
  trigger_mode: ApiExpirationNotificationPolicyCatalogItem;
  recipient_group_ids: string[];
  repeat_every: ApiExpirationNotificationPolicyOffset | null;
  repeat_until: ApiExpirationNotificationPolicyCatalogItem | null;
  repeat_for: ApiExpirationNotificationPolicyOffset | null;
  recipient_groups: ApiExpirationNotificationPolicyRecipientGroupSummary[];
}

interface ApiExpirationNotificationPolicyListItem {
  expiration_notification_policy_id: string;
  name: string;
  code: string;
  status_id: ExpirationNotificationPolicyListItem['statusId'];
  status_name: string;
  rules_count: number;
  created_at: string | null;
  updated_at: string | null;
}

interface ApiExpirationNotificationPolicyDetail extends ApiExpirationNotificationPolicyListItem {
  description: string | null;
  rules: ApiExpirationNotificationPolicyRule[];
  created_by: ApiExpirationNotificationPolicyActorSummary | null;
  updated_by: ApiExpirationNotificationPolicyActorSummary | null;
}

interface ApiExpirationNotificationPolicyOption {
  expiration_notification_policy_id: string;
  name: string;
  code: string;
  status_id: ExpirationNotificationPolicyOption['statusId'];
  status_name: string;
}

interface ApiExpirationNotificationPolicyCatalog {
  statuses: ApiExpirationNotificationPolicyCatalogItem[];
  anchors: ApiExpirationNotificationPolicyCatalogItem[];
  trigger_modes: ApiExpirationNotificationPolicyCatalogItem[];
  repeat_until_values: ApiExpirationNotificationPolicyCatalogItem[];
}

function getAuthToken(state: RootState) {
  return state.auth.token ?? readPersistedAuthToken();
}

const mapActorSummary = (
  actor: ApiExpirationNotificationPolicyActorSummary | null
): ExpirationNotificationPolicyActorSummary | null =>
  actor
    ? {
        userId: actor.user_id,
        name: actor.name,
        email: actor.email,
      }
    : null;

const mapOffset = (
  offset: ApiExpirationNotificationPolicyOffset
): ExpirationNotificationPolicyOffset => ({
  years: offset.years,
  months: offset.months,
  weeks: offset.weeks,
  days: offset.days,
});

const mapCatalogItem = <TCode extends string>(
  item: ApiExpirationNotificationPolicyCatalogItem
): ExpirationNotificationPolicyCatalogItem<TCode> => ({
  code: item.code as TCode,
  name: item.name,
  nameKey: item.name_key,
});

const mapChannelSummary = (
  channel: ApiExpirationNotificationPolicyChannelSummary
): ExpirationNotificationPolicyChannelSummary => ({
  code: channel.code,
  name: channel.name,
  nameKey: channel.name_key,
});

const mapRecipientGroupSummary = (
  recipientGroup: ApiExpirationNotificationPolicyRecipientGroupSummary
): ExpirationNotificationPolicyRecipientGroupSummary => ({
  recipientGroupId: recipientGroup.recipient_group_id,
  name: recipientGroup.name,
  code: recipientGroup.code,
  statusId: recipientGroup.status_id,
  statusName: recipientGroup.status_name,
  enabledChannels: Array.isArray(recipientGroup.enabled_channels)
    ? recipientGroup.enabled_channels.map(mapChannelSummary)
    : [],
});

const mapRule = (rule: ApiExpirationNotificationPolicyRule): ExpirationNotificationPolicyRule => ({
  ruleId: rule.rule_id,
  anchor: mapCatalogItem(rule.anchor),
  startOffset: mapOffset(rule.start_offset),
  triggerMode: mapCatalogItem(rule.trigger_mode),
  recipientGroupIds: Array.isArray(rule.recipient_group_ids) ? rule.recipient_group_ids : [],
  repeatEvery: rule.repeat_every ? mapOffset(rule.repeat_every) : null,
  repeatUntil: rule.repeat_until ? mapCatalogItem(rule.repeat_until) : null,
  repeatFor: rule.repeat_for ? mapOffset(rule.repeat_for) : null,
  recipientGroups: Array.isArray(rule.recipient_groups)
    ? rule.recipient_groups.map(mapRecipientGroupSummary)
    : [],
});

const mapListItem = (
  item: ApiExpirationNotificationPolicyListItem
): ExpirationNotificationPolicyListItem => ({
  expirationNotificationPolicyId: item.expiration_notification_policy_id,
  name: item.name,
  code: item.code,
  statusId: item.status_id,
  statusName: item.status_name,
  rulesCount: item.rules_count,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

const mapDetail = (
  item: ApiExpirationNotificationPolicyDetail
): ExpirationNotificationPolicyDetail => ({
  ...mapListItem(item),
  description: item.description,
  rules: Array.isArray(item.rules) ? item.rules.map(mapRule) : [],
  createdBy: mapActorSummary(item.created_by),
  updatedBy: mapActorSummary(item.updated_by),
});

const mapOption = (
  item: ApiExpirationNotificationPolicyOption
): ExpirationNotificationPolicyOption => ({
  expirationNotificationPolicyId: item.expiration_notification_policy_id,
  name: item.name,
  code: item.code,
  statusId: item.status_id,
  statusName: item.status_name,
});

const mapCatalog = (
  item: ApiExpirationNotificationPolicyCatalog
): ExpirationNotificationPolicyCatalog => ({
  statuses: Array.isArray(item.statuses)
    ? item.statuses.map((catalogItem) =>
        mapCatalogItem<ExpirationNotificationPolicyStatusId>(catalogItem)
      )
    : [],
  anchors: Array.isArray(item.anchors)
    ? item.anchors.map((catalogItem) =>
        mapCatalogItem<ExpirationNotificationPolicyAnchorCode>(catalogItem)
      )
    : [],
  triggerModes: Array.isArray(item.trigger_modes)
    ? item.trigger_modes.map((catalogItem) =>
        mapCatalogItem<ExpirationNotificationPolicyTriggerModeCode>(catalogItem)
      )
    : [],
  repeatUntilValues: Array.isArray(item.repeat_until_values)
    ? item.repeat_until_values.map((catalogItem) =>
        mapCatalogItem<ExpirationNotificationPolicyRepeatUntilCode>(catalogItem)
      )
    : [],
});

function buildMutationBody(payload: ExpirationNotificationPolicyMutationPayload) {
  return {
    name: payload.name,
    ...(payload.description ? { description: payload.description } : {}),
    status: payload.statusId,
    rules: payload.rules.map((rule) => ({
      ...(rule.ruleId ? { rule_id: rule.ruleId } : {}),
      anchor: rule.anchor,
      start_offset: {
        years: rule.startOffset.years,
        months: rule.startOffset.months,
        weeks: rule.startOffset.weeks,
        days: rule.startOffset.days,
      },
      trigger_mode: rule.triggerMode,
      recipient_group_ids: rule.recipientGroupIds,
      ...(rule.repeatEvery
        ? {
            repeat_every: {
              years: rule.repeatEvery.years,
              months: rule.repeatEvery.months,
              weeks: rule.repeatEvery.weeks,
              days: rule.repeatEvery.days,
            },
          }
        : {}),
      ...(rule.repeatUntil ? { repeat_until: rule.repeatUntil } : {}),
      ...(rule.repeatFor
        ? {
            repeat_for: {
              years: rule.repeatFor.years,
              months: rule.repeatFor.months,
              weeks: rule.repeatFor.weeks,
              days: rule.repeatFor.days,
            },
          }
        : {}),
    })),
  };
}

export const fetchExpirationNotificationPolicies = createAsyncThunk<
  FetchExpirationNotificationPoliciesResult,
  FetchExpirationNotificationPoliciesParams | undefined,
  { state: RootState }
>('expirationNotificationPolicies/fetchAll', async (params = {}, thunkAPI) => {
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
      ApiExpirationNotificationPolicyListItem[],
      { pagination?: PaginationMeta }
    >(`/v1/expiration-notification-policies?${query.toString()}`, {
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
        : 'No fue posible obtener las políticas de notificación por vencimiento';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchExpirationNotificationPolicyCatalog = createAsyncThunk<
  ExpirationNotificationPolicyCatalog,
  void,
  { state: RootState }
>('expirationNotificationPolicies/fetchCatalog', async (_, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiExpirationNotificationPolicyCatalog>(
      '/v1/expiration-notification-policies/catalog',
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
        : 'No fue posible obtener el catálogo de políticas de notificación por vencimiento';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchExpirationNotificationPolicyOptions = createAsyncThunk<
  ExpirationNotificationPolicyOption[],
  FetchExpirationNotificationPolicyOptionsParams | undefined,
  { state: RootState }
>('expirationNotificationPolicies/fetchOptions', async (params = {}, thunkAPI) => {
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
    const response = await jsonRequest<ApiExpirationNotificationPolicyOption[]>(
      `/v1/expiration-notification-policies/options${query.size ? `?${query.toString()}` : ''}`,
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
        : 'No fue posible obtener las opciones de políticas de notificación por vencimiento';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchExpirationNotificationPolicyById = createAsyncThunk<
  { expirationNotificationPolicy: ExpirationNotificationPolicyDetail },
  { expirationNotificationPolicyId: string },
  { state: RootState }
>(
  'expirationNotificationPolicies/fetchById',
  async ({ expirationNotificationPolicyId }, thunkAPI) => {
    const token = getAuthToken(thunkAPI.getState());

    if (!token) {
      return thunkAPI.rejectWithValue('No hay token de autenticación');
    }

    try {
      const response = await jsonRequest<ApiExpirationNotificationPolicyDetail>(
        `/v1/expiration-notification-policies/${expirationNotificationPolicyId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          token,
        }
      );

      return { expirationNotificationPolicy: mapDetail(response.data) };
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'No fue posible obtener la política de notificación por vencimiento';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createExpirationNotificationPolicy = createAsyncThunk<
  { expirationNotificationPolicy: ExpirationNotificationPolicyDetail; message: string | null },
  CreateExpirationNotificationPolicyPayload,
  { state: RootState }
>('expirationNotificationPolicies/createOne', async (payload, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiExpirationNotificationPolicyDetail>(
      '/v1/expiration-notification-policies',
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
      expirationNotificationPolicy: mapDetail(response.data),
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible crear la política de notificación por vencimiento';
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateExpirationNotificationPolicy = createAsyncThunk<
  { expirationNotificationPolicy: ExpirationNotificationPolicyDetail; message: string | null },
  UpdateExpirationNotificationPolicyPayload,
  { state: RootState }
>(
  'expirationNotificationPolicies/updateOne',
  async ({ expirationNotificationPolicyId, ...payload }, thunkAPI) => {
    const token = getAuthToken(thunkAPI.getState());

    if (!token) {
      return thunkAPI.rejectWithValue('No hay token de autenticación');
    }

    try {
      const response = await jsonRequest<ApiExpirationNotificationPolicyDetail>(
        `/v1/expiration-notification-policies/${expirationNotificationPolicyId}`,
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
        expirationNotificationPolicy: mapDetail(response.data),
        message: response.successMessage ?? null,
      };
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'No fue posible actualizar la política de notificación por vencimiento';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteExpirationNotificationPolicy = createAsyncThunk<
  { expirationNotificationPolicyId: string; message: string | null },
  DeleteExpirationNotificationPolicyPayload,
  { state: RootState }
>(
  'expirationNotificationPolicies/deleteOne',
  async ({ expirationNotificationPolicyId }, thunkAPI) => {
    const token = getAuthToken(thunkAPI.getState());

    if (!token) {
      return thunkAPI.rejectWithValue('No hay token de autenticación');
    }

    try {
      const response = await jsonRequest<unknown>(
        `/v1/expiration-notification-policies/${expirationNotificationPolicyId}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
          },
          token,
        }
      );

      return {
        expirationNotificationPolicyId,
        message: response.successMessage ?? null,
      };
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'No fue posible eliminar la política de notificación por vencimiento';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
