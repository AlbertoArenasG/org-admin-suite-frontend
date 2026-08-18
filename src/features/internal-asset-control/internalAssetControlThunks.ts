import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import { readPersistedAuthToken } from '@/features/auth/persistence';
import type { RootState } from '@/store';
import type {
  CreateInternalAssetMaintenanceRecordPayload,
  DeleteInternalAssetMaintenanceRecordPayload,
  FetchInternalAssetMaintenanceRecordsParams,
  FetchInternalAssetMaintenanceRecordsResult,
  InternalAssetMaintenanceActorSummary,
  InternalAssetMaintenanceCatalog,
  InternalAssetMaintenanceDerivedStatus,
  InternalAssetMaintenancePolicySummary,
  InternalAssetMaintenanceProvider,
  InternalAssetMaintenanceProviderFollowUpConfig,
  InternalAssetMaintenanceProviderFollowUpRule,
  InternalAssetMaintenanceRecordDetail,
  InternalAssetMaintenanceRecordListItem,
  InternalAssetMaintenanceRecordMutationPayload,
  InternalAssetMaintenanceRecipientGroupSummary,
  UpdateInternalAssetMaintenanceRecordPayload,
} from './types';

interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface ApiNameKeyItem {
  code: string;
  name: string;
  name_key: string;
}

interface ApiActorSummary {
  user_id: string;
  name: string | null;
  email: string | null;
}

interface ApiInterval {
  years: number;
  months: number;
  weeks: number;
  days: number;
}

interface ApiPolicySummary {
  expiration_status_policy_id?: string;
  expiration_notification_policy_id?: string;
  name: string;
  code: string;
  status_id: string;
}

interface ApiDerivedStatus {
  code: string;
  name: string;
  name_key: string | null;
  color_hex: string;
  source: 'POLICY' | 'SYSTEM';
}

interface ApiRecipientGroupSummary {
  recipient_group_id: string;
  name: string;
  code: string;
  status_id: string;
  enabled_channels: ApiNameKeyItem[];
}

interface ApiProviderFollowUpRule {
  offset: ApiInterval;
  recipient_group_ids: string[];
  cc_recipient_group_ids: string[];
  recipient_groups: ApiRecipientGroupSummary[];
  cc_recipient_groups: ApiRecipientGroupSummary[];
}

interface ApiProviderFollowUp {
  enabled: boolean;
  rules: ApiProviderFollowUpRule[];
  last_sent_at: string | null;
}

interface ApiProvider {
  sent_to_provider: boolean;
  provider_name: string | null;
  sent_to_provider_at: string | null;
  provider_lead_time: ApiInterval | null;
  provider_notes: string | null;
}

interface ApiMaintenanceType {
  code: string;
  name: string;
}

interface ApiListItem {
  internal_asset_maintenance_record_id: string;
  asset_name: string;
  asset_identifier: string;
  asset_maintenance_type: ApiMaintenanceType;
  last_maintenance_at: string;
  expiration_date: string;
  status_id: InternalAssetMaintenanceRecordListItem['statusId'];
  status_name: string;
  derived_status: ApiDerivedStatus;
  expiration_status_policy: ApiPolicySummary | null;
  expiration_notification_policy: ApiPolicySummary | null;
  sent_to_provider: boolean;
  provider_name: string | null;
  provider_lead_time: ApiInterval | null;
  provider_follow_up_enabled: boolean;
  provider_follow_up_rules_count: number;
  provider_follow_up_last_sent_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface ApiDetail
  extends Omit<ApiListItem, 'sent_to_provider' | 'provider_name' | 'provider_lead_time'> {
  interval: ApiInterval;
  observations: string | null;
  provider: ApiProvider | null;
  provider_follow_up: ApiProviderFollowUp | null;
  created_by: ApiActorSummary | null;
  updated_by: ApiActorSummary | null;
}

interface ApiCatalog {
  asset_maintenance_types: ApiNameKeyItem[];
  statuses: ApiNameKeyItem[];
}

function getAuthToken(state: RootState) {
  return state.auth.token ?? readPersistedAuthToken();
}

function mapInterval(
  interval: ApiInterval | null
): InternalAssetMaintenanceProvider['providerLeadTime'] {
  if (!interval) {
    return null;
  }

  return {
    years: interval.years,
    months: interval.months,
    weeks: interval.weeks,
    days: interval.days,
  };
}

function mapActor(actor: ApiActorSummary | null): InternalAssetMaintenanceActorSummary | null {
  if (!actor) {
    return null;
  }

  return {
    userId: actor.user_id,
    name: actor.name,
    email: actor.email,
  };
}

function mapDerivedStatus(status: ApiDerivedStatus): InternalAssetMaintenanceDerivedStatus {
  return {
    code: status.code,
    name: status.name,
    nameKey: status.name_key,
    colorHex: status.color_hex,
    source: status.source,
  };
}

function mapPolicySummary(
  policy: ApiPolicySummary | null,
  kind: 'expiration_status_policy_id' | 'expiration_notification_policy_id'
): InternalAssetMaintenancePolicySummary | null {
  if (!policy) {
    return null;
  }

  const id = policy[kind];

  if (!id) {
    return null;
  }

  return {
    id,
    name: policy.name,
    code: policy.code,
    statusId: policy.status_id,
  };
}

function mapRecipientGroup(
  group: ApiRecipientGroupSummary
): InternalAssetMaintenanceRecipientGroupSummary {
  return {
    recipientGroupId: group.recipient_group_id,
    name: group.name,
    code: group.code,
    statusId: group.status_id,
    enabledChannels: Array.isArray(group.enabled_channels)
      ? group.enabled_channels.map((channel) => ({
          code: channel.code,
          name: channel.name,
          nameKey: channel.name_key,
        }))
      : [],
  };
}

function mapProviderFollowUpRule(
  rule: ApiProviderFollowUpRule
): InternalAssetMaintenanceProviderFollowUpRule {
  return {
    offset: {
      years: rule.offset.years,
      months: rule.offset.months,
      weeks: rule.offset.weeks,
      days: rule.offset.days,
    },
    recipientGroupIds: rule.recipient_group_ids ?? [],
    ccRecipientGroupIds: rule.cc_recipient_group_ids ?? [],
    recipientGroups: Array.isArray(rule.recipient_groups)
      ? rule.recipient_groups.map(mapRecipientGroup)
      : [],
    ccRecipientGroups: Array.isArray(rule.cc_recipient_groups)
      ? rule.cc_recipient_groups.map(mapRecipientGroup)
      : [],
  };
}

function mapProviderFollowUp(
  providerFollowUp: ApiProviderFollowUp | null
): InternalAssetMaintenanceProviderFollowUpConfig | null {
  if (!providerFollowUp) {
    return null;
  }

  return {
    enabled: providerFollowUp.enabled,
    rules: Array.isArray(providerFollowUp.rules)
      ? providerFollowUp.rules.map(mapProviderFollowUpRule)
      : [],
    lastSentAt: providerFollowUp.last_sent_at,
  };
}

function mapProvider(provider: ApiProvider | null): InternalAssetMaintenanceProvider | null {
  if (!provider) {
    return null;
  }

  return {
    sentToProvider: provider.sent_to_provider,
    providerName: provider.provider_name,
    sentToProviderAt: provider.sent_to_provider_at,
    providerLeadTime: mapInterval(provider.provider_lead_time),
    providerNotes: provider.provider_notes,
  };
}

function mapListItem(item: ApiListItem): InternalAssetMaintenanceRecordListItem {
  return {
    internalAssetMaintenanceRecordId: item.internal_asset_maintenance_record_id,
    assetName: item.asset_name,
    assetIdentifier: item.asset_identifier,
    assetMaintenanceType: {
      code: item.asset_maintenance_type
        .code as InternalAssetMaintenanceRecordListItem['assetMaintenanceType']['code'],
      name: item.asset_maintenance_type.name,
    },
    lastMaintenanceAt: item.last_maintenance_at,
    expirationDate: item.expiration_date,
    statusId: item.status_id,
    statusName: item.status_name,
    derivedStatus: mapDerivedStatus(item.derived_status),
    expirationStatusPolicy: mapPolicySummary(
      item.expiration_status_policy,
      'expiration_status_policy_id'
    ),
    expirationNotificationPolicy: mapPolicySummary(
      item.expiration_notification_policy,
      'expiration_notification_policy_id'
    ),
    sentToProvider: item.sent_to_provider,
    providerName: item.provider_name,
    providerLeadTime: mapInterval(item.provider_lead_time),
    providerFollowUpEnabled: item.provider_follow_up_enabled,
    providerFollowUpRulesCount: item.provider_follow_up_rules_count,
    providerFollowUpLastSentAt: item.provider_follow_up_last_sent_at,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

function mapDetail(item: ApiDetail): InternalAssetMaintenanceRecordDetail {
  return {
    ...mapListItem({
      ...item,
      sent_to_provider: item.provider?.sent_to_provider ?? false,
      provider_name: item.provider?.provider_name ?? null,
      provider_lead_time: item.provider?.provider_lead_time ?? null,
      provider_follow_up_enabled: item.provider_follow_up?.enabled ?? false,
      provider_follow_up_rules_count: item.provider_follow_up?.rules?.length ?? 0,
      provider_follow_up_last_sent_at: item.provider_follow_up?.last_sent_at ?? null,
    }),
    interval: {
      years: item.interval.years,
      months: item.interval.months,
      weeks: item.interval.weeks,
      days: item.interval.days,
    },
    observations: item.observations,
    provider: mapProvider(item.provider),
    providerFollowUp: mapProviderFollowUp(item.provider_follow_up),
    createdBy: mapActor(item.created_by),
    updatedBy: mapActor(item.updated_by),
  };
}

function mapCatalog(item: ApiCatalog): InternalAssetMaintenanceCatalog {
  return {
    assetMaintenanceTypes: Array.isArray(item.asset_maintenance_types)
      ? item.asset_maintenance_types.map((entry) => ({
          code: entry.code as InternalAssetMaintenanceCatalog['assetMaintenanceTypes'][number]['code'],
          name: entry.name,
          nameKey: entry.name_key,
        }))
      : [],
    statuses: Array.isArray(item.statuses)
      ? item.statuses.map((entry) => ({
          code: entry.code as InternalAssetMaintenanceCatalog['statuses'][number]['code'],
          name: entry.name,
          nameKey: entry.name_key,
        }))
      : [],
  };
}

function buildMutationBody(payload: InternalAssetMaintenanceRecordMutationPayload) {
  return {
    asset_name: payload.assetName,
    asset_identifier: payload.assetIdentifier,
    asset_maintenance_type: payload.assetMaintenanceType,
    last_maintenance_at: payload.lastMaintenanceAt,
    interval: payload.interval,
    ...(payload.expirationDate ? { expiration_date: payload.expirationDate } : {}),
    ...(payload.observations ? { observations: payload.observations } : {}),
    ...(payload.statusId ? { status: payload.statusId } : {}),
    ...(payload.expirationStatusPolicyId
      ? { expiration_status_policy_id: payload.expirationStatusPolicyId }
      : {}),
    ...(payload.expirationNotificationPolicyId
      ? { expiration_notification_policy_id: payload.expirationNotificationPolicyId }
      : {}),
    ...(payload.provider
      ? {
          provider: {
            sent_to_provider: payload.provider.sentToProvider,
            ...(payload.provider.providerName
              ? { provider_name: payload.provider.providerName }
              : {}),
            ...(payload.provider.sentToProviderAt
              ? { sent_to_provider_at: payload.provider.sentToProviderAt }
              : {}),
            ...(payload.provider.providerLeadTime
              ? { provider_lead_time: payload.provider.providerLeadTime }
              : {}),
            ...(payload.provider.providerNotes
              ? { provider_notes: payload.provider.providerNotes }
              : {}),
          },
        }
      : {}),
    ...(payload.providerFollowUp
      ? {
          provider_follow_up: {
            enabled: payload.providerFollowUp.enabled,
            rules: payload.providerFollowUp.rules.map((rule) => ({
              offset: rule.offset,
              recipient_group_ids: rule.recipientGroupIds,
              cc_recipient_group_ids: rule.ccRecipientGroupIds,
            })),
          },
        }
      : {}),
  };
}

export const fetchInternalAssetMaintenanceCatalog = createAsyncThunk<
  InternalAssetMaintenanceCatalog,
  void,
  { state: RootState }
>('internalAssetControl/fetchCatalog', async (_, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiCatalog>(
      '/v1/internal-asset-maintenance-records/catalog',
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
        : 'No fue posible obtener el catálogo de control de activos internos';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchInternalAssetMaintenanceRecords = createAsyncThunk<
  FetchInternalAssetMaintenanceRecordsResult,
  FetchInternalAssetMaintenanceRecordsParams | undefined,
  { state: RootState }
>('internalAssetControl/fetchAll', async (params = {}, thunkAPI) => {
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

  if (filters.assetMaintenanceType) {
    query.set('asset_maintenance_type', filters.assetMaintenanceType);
  }

  if (filters.status) {
    query.set('status', filters.status);
  }

  if (filters.expirationStatusPolicyId) {
    query.set('expiration_status_policy_id', filters.expirationStatusPolicyId);
  }

  if (filters.expirationNotificationPolicyId) {
    query.set('expiration_notification_policy_id', filters.expirationNotificationPolicyId);
  }

  if (typeof filters.sentToProvider === 'boolean') {
    query.set('sent_to_provider', String(filters.sentToProvider));
  }

  sorts.forEach((sort, index) => {
    query.set(`sort[${index}][field]`, sort.field);
    query.set(`sort[${index}][direction]`, sort.direction);
  });

  try {
    const response = await jsonRequest<ApiListItem[], { pagination?: PaginationMeta }>(
      `/v1/internal-asset-maintenance-records?${query.toString()}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        token,
      }
    );

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
        : 'No fue posible obtener los registros de control de activos internos';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchInternalAssetMaintenanceRecordById = createAsyncThunk<
  { record: InternalAssetMaintenanceRecordDetail },
  { internalAssetMaintenanceRecordId: string },
  { state: RootState }
>('internalAssetControl/fetchById', async ({ internalAssetMaintenanceRecordId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiDetail>(
      `/v1/internal-asset-maintenance-records/${internalAssetMaintenanceRecordId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        token,
      }
    );

    return {
      record: mapDetail(response.data),
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible obtener el registro de control de activos internos';
    return thunkAPI.rejectWithValue(message);
  }
});

export const createInternalAssetMaintenanceRecord = createAsyncThunk<
  { record: InternalAssetMaintenanceRecordDetail; message: string | null },
  CreateInternalAssetMaintenanceRecordPayload,
  { state: RootState }
>('internalAssetControl/create', async (payload, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiDetail>('/v1/internal-asset-maintenance-records', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      token,
      body: buildMutationBody(payload),
    });

    return {
      record: mapDetail(response.data),
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible crear el registro de control de activos internos';
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateInternalAssetMaintenanceRecord = createAsyncThunk<
  { record: InternalAssetMaintenanceRecordDetail; message: string | null },
  UpdateInternalAssetMaintenanceRecordPayload,
  { state: RootState }
>(
  'internalAssetControl/update',
  async ({ internalAssetMaintenanceRecordId, ...payload }, thunkAPI) => {
    const token = getAuthToken(thunkAPI.getState());

    if (!token) {
      return thunkAPI.rejectWithValue('No hay token de autenticación');
    }

    try {
      const response = await jsonRequest<ApiDetail>(
        `/v1/internal-asset-maintenance-records/${internalAssetMaintenanceRecordId}`,
        {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          token,
          body: buildMutationBody(payload),
        }
      );

      return {
        record: mapDetail(response.data),
        message: response.successMessage ?? null,
      };
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'No fue posible actualizar el registro de control de activos internos';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteInternalAssetMaintenanceRecord = createAsyncThunk<
  { internalAssetMaintenanceRecordId: string; message: string | null },
  DeleteInternalAssetMaintenanceRecordPayload,
  { state: RootState }
>('internalAssetControl/delete', async ({ internalAssetMaintenanceRecordId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<null>(
      `/v1/internal-asset-maintenance-records/${internalAssetMaintenanceRecordId}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
        token,
      }
    );

    return {
      internalAssetMaintenanceRecordId,
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible eliminar el registro de control de activos internos';
    return thunkAPI.rejectWithValue(message);
  }
});

export const sendInternalAssetMaintenanceProviderFollowUp = createAsyncThunk<
  { record: InternalAssetMaintenanceRecordDetail; message: string | null },
  { internalAssetMaintenanceRecordId: string },
  { state: RootState }
>(
  'internalAssetControl/sendProviderFollowUp',
  async ({ internalAssetMaintenanceRecordId }, thunkAPI) => {
    const token = getAuthToken(thunkAPI.getState());

    if (!token) {
      return thunkAPI.rejectWithValue('No hay token de autenticación');
    }

    try {
      const response = await jsonRequest<ApiDetail>(
        `/v1/internal-asset-maintenance-records/${internalAssetMaintenanceRecordId}/provider-follow-up/send`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          token,
        }
      );

      return {
        record: mapDetail(response.data),
        message: response.successMessage ?? null,
      };
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'No fue posible enviar el seguimiento manual al proveedor';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
