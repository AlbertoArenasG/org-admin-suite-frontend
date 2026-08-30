import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type {
  CustomerServiceRecordDerivedStatus,
  CustomerServiceRecordDetail,
  CustomerServiceRecordListItem,
  CustomerServiceRecordMutationPayload,
  CustomerServiceRecordOption,
  FetchCustomerServiceRecordsParams,
} from './types';

interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface ApiLocalizedValue {
  code: string;
  name: string;
  name_key: string | null;
}

interface ApiMaterialization {
  code: string;
  name: string;
  name_key: string | null;
  color_hex: string;
  source: ApiLocalizedValue;
  effective_start_date: string | null;
}

interface ApiCustomerServiceRecordListItem {
  customer_service_record_id: string;
  service_number: string;
  service_type: { service_type_code: string; name: string };
  requested_at: string;
  customer: { customer_id: string; name: string };
  assets: Array<{ asset_id: string; name: string; identifier: string }>;
  operational_status: ApiLocalizedValue;
  customer_delivery: {
    estimated_delivery_at: string | null;
    status_materialization: ApiMaterialization | null;
  };
  provider: {
    estimated_return_at: string | null;
    status_materialization: ApiMaterialization | null;
  } | null;
  updated_at: string | null;
}

interface ApiProviderOption {
  provider_id: string;
  name: string;
}

interface ApiDetailCustomerUser {
  user_id: string;
  name: string | null;
  email: string | null;
}

interface ApiDetailAsset {
  asset_id: string;
  name: string;
  identifier: string;
  brand: string;
  model: string;
  serial_number: string;
  observations: string | null;
}

interface ApiFollowUpRule {
  interval: CustomerServiceRecordDetail['customerDelivery']['estimatedDeliveryInterval'];
  recipient_group_ids: string[];
  cc_recipient_group_ids: string[];
}

interface ApiCustomerServiceRecordDetail
  extends Omit<
    ApiCustomerServiceRecordListItem,
    'customer' | 'assets' | 'customer_delivery' | 'provider'
  > {
  observations: string | null;
  customer: ApiCustomerServiceRecordListItem['customer'] & { users: ApiDetailCustomerUser[] };
  assets: ApiDetailAsset[];
  customer_delivery: ApiCustomerServiceRecordListItem['customer_delivery'] & {
    received_at: string | null;
    estimated_delivery_interval: CustomerServiceRecordDetail['customerDelivery']['estimatedDeliveryInterval'];
    delivered_to_customer_at: string | null;
    status_policy_id: string | null;
    notification_policy_id: string | null;
  };
  provider:
    | (NonNullable<ApiCustomerServiceRecordListItem['provider']> & {
        provider_id: string;
        name: string;
        delivered_to_provider_at: string | null;
        estimated_return_interval: CustomerServiceRecordDetail['customerDelivery']['estimatedDeliveryInterval'];
        returned_from_provider_at: string | null;
        status_policy_id: string | null;
        notification_policy_id: string | null;
        follow_up: { enabled: boolean; rules: ApiFollowUpRule[] };
      })
    | null;
}

function getAuthToken(state: RootState) {
  return state.auth.token;
}

function mapMaterialization(
  value: ApiMaterialization | null
): CustomerServiceRecordDerivedStatus | null {
  if (!value) {
    return null;
  }

  return {
    code: value.code,
    name: value.name,
    nameKey: value.name_key,
    colorHex: value.color_hex,
    source: {
      code: value.source.code,
      name: value.source.name,
      nameKey: value.source.name_key ?? '',
    },
    effectiveStartDate: value.effective_start_date,
  };
}

function mapListItem(value: ApiCustomerServiceRecordListItem): CustomerServiceRecordListItem {
  return {
    customerServiceRecordId: value.customer_service_record_id,
    serviceNumber: value.service_number,
    serviceType: {
      serviceTypeCode: value.service_type.service_type_code,
      name: value.service_type.name,
    },
    requestedAt: value.requested_at,
    customer: { customerId: value.customer.customer_id, name: value.customer.name },
    assets: value.assets.map((asset) => ({
      assetId: asset.asset_id,
      name: asset.name,
      identifier: asset.identifier,
    })),
    operationalStatus: {
      code: value.operational_status
        .code as CustomerServiceRecordListItem['operationalStatus']['code'],
      name: value.operational_status.name,
      nameKey: value.operational_status.name_key ?? '',
    },
    customerDelivery: {
      estimatedDeliveryAt: value.customer_delivery.estimated_delivery_at,
      statusMaterialization: mapMaterialization(value.customer_delivery.status_materialization),
    },
    provider: value.provider
      ? {
          estimatedReturnAt: value.provider.estimated_return_at,
          statusMaterialization: mapMaterialization(value.provider.status_materialization),
        }
      : null,
    updatedAt: value.updated_at,
  };
}

function mapDetail(value: ApiCustomerServiceRecordDetail): CustomerServiceRecordDetail {
  const base = mapListItem(value);
  return {
    ...base,
    observations: value.observations ?? null,
    customer: {
      ...base.customer,
      users: (value.customer.users ?? []).map((user) => ({
        userId: user.user_id,
        name: user.name ?? null,
        email: user.email ?? null,
      })),
    },
    assets: value.assets.map((asset) => ({
      assetId: asset.asset_id,
      name: asset.name,
      identifier: asset.identifier,
      brand: asset.brand,
      model: asset.model,
      serialNumber: asset.serial_number,
      observations: asset.observations ?? null,
    })),
    customerDelivery: {
      ...base.customerDelivery,
      receivedAt: value.customer_delivery.received_at ?? null,
      estimatedDeliveryInterval: value.customer_delivery.estimated_delivery_interval,
      deliveredToCustomerAt: value.customer_delivery.delivered_to_customer_at ?? null,
      statusPolicyId: value.customer_delivery.status_policy_id ?? null,
      notificationPolicyId: value.customer_delivery.notification_policy_id ?? null,
    },
    provider: value.provider
      ? {
          ...base.provider!,
          providerId: value.provider.provider_id,
          name: value.provider.name,
          deliveredToProviderAt: value.provider.delivered_to_provider_at ?? null,
          estimatedReturnInterval: value.provider.estimated_return_interval,
          returnedFromProviderAt: value.provider.returned_from_provider_at ?? null,
          statusPolicyId: value.provider.status_policy_id ?? null,
          notificationPolicyId: value.provider.notification_policy_id ?? null,
          followUp: {
            enabled: value.provider.follow_up?.enabled ?? false,
            rules: (value.provider.follow_up?.rules ?? []).map((rule) => ({
              interval: rule.interval,
              recipientGroupIds: rule.recipient_group_ids ?? [],
              ccRecipientGroupIds: rule.cc_recipient_group_ids ?? [],
            })),
          },
        }
      : null,
  };
}

function buildMutationBody(payload: CustomerServiceRecordMutationPayload) {
  return {
    service_type_code: payload.serviceTypeCode,
    requested_at: payload.requestedAt,
    observations: payload.observations,
    customer: {
      customer_id: payload.customer.customerId,
      customer_user_ids: payload.customer.customerUserIds,
    },
    assets: payload.assets.map((asset) => ({
      name: asset.name,
      identifier: asset.identifier,
      brand: asset.brand,
      model: asset.model,
      serial_number: asset.serialNumber,
      observations: asset.observations,
    })),
    customer_delivery: {
      received_at: payload.customerDelivery.receivedAt,
      estimated_delivery_interval: payload.customerDelivery.estimatedDeliveryInterval,
      estimated_delivery_at: payload.customerDelivery.estimatedDeliveryAt,
      delivered_to_customer_at: payload.customerDelivery.deliveredToCustomerAt,
      status_policy_id: payload.customerDelivery.statusPolicyId,
      notification_policy_id: payload.customerDelivery.notificationPolicyId,
    },
    provider: payload.provider
      ? {
          provider_id: payload.provider.providerId,
          delivered_to_provider_at: payload.provider.deliveredToProviderAt,
          estimated_return_interval: payload.provider.estimatedReturnInterval,
          estimated_return_at: payload.provider.estimatedReturnAt,
          returned_from_provider_at: payload.provider.returnedFromProviderAt,
          status_policy_id: payload.provider.statusPolicyId,
          notification_policy_id: payload.provider.notificationPolicyId,
          follow_up: {
            enabled: payload.provider.followUp.enabled,
            rules: payload.provider.followUp.rules.map((rule) => ({
              interval: rule.interval,
              recipient_group_ids: rule.recipientGroupIds,
              cc_recipient_group_ids: rule.ccRecipientGroupIds,
            })),
          },
        }
      : null,
    operational_status: payload.operationalStatus,
  };
}

function buildUpdateBody(payload: Partial<CustomerServiceRecordMutationPayload>) {
  const body: Record<string, unknown> = {};
  if (payload.serviceTypeCode !== undefined) body.service_type_code = payload.serviceTypeCode;
  if (payload.requestedAt !== undefined) body.requested_at = payload.requestedAt;
  if (payload.observations !== undefined) body.observations = payload.observations;
  if (payload.customer !== undefined) {
    body.customer = {
      customer_id: payload.customer.customerId,
      customer_user_ids: payload.customer.customerUserIds,
    };
  }
  if (payload.assets !== undefined) {
    body.assets = payload.assets.map((asset) => ({
      name: asset.name,
      identifier: asset.identifier,
      brand: asset.brand,
      model: asset.model,
      serial_number: asset.serialNumber,
      observations: asset.observations,
    }));
  }
  if (payload.customerDelivery !== undefined) {
    body.customer_delivery = {
      received_at: payload.customerDelivery.receivedAt,
      estimated_delivery_interval: payload.customerDelivery.estimatedDeliveryInterval,
      estimated_delivery_at: payload.customerDelivery.estimatedDeliveryAt,
      delivered_to_customer_at: payload.customerDelivery.deliveredToCustomerAt,
      status_policy_id: payload.customerDelivery.statusPolicyId,
      notification_policy_id: payload.customerDelivery.notificationPolicyId,
    };
  }
  if (payload.provider !== undefined) {
    body.provider = payload.provider
      ? buildMutationBody({
          ...payload,
          provider: payload.provider,
        } as CustomerServiceRecordMutationPayload).provider
      : null;
  }
  if (payload.operationalStatus !== undefined) body.operational_status = payload.operationalStatus;
  return body;
}

export const fetchCustomerServiceRecords = createAsyncThunk<
  {
    items: CustomerServiceRecordListItem[];
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  },
  FetchCustomerServiceRecordsParams | undefined,
  { state: RootState; rejectValue: string }
>('customerServiceRecords/fetchAll', async (params = {}, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  const { page = 1, limit = 10, itemsPerPage, search, filters = {}, sorts = [] } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    items_per_page: String(itemsPerPage ?? limit),
  });

  if (search?.trim()) query.set('search', search.trim());
  if (filters.operationalStatus) query.set('operational_status', filters.operationalStatus);
  if (filters.serviceTypeCode) query.set('service_type_code', filters.serviceTypeCode);
  if (filters.customerId) query.set('customer_id', filters.customerId);
  if (filters.providerId) query.set('provider_id', filters.providerId);
  if (typeof filters.hasProvider === 'boolean')
    query.set('has_provider', String(filters.hasProvider));

  const dateFilters: Array<[keyof typeof filters, string]> = [
    ['requestedAtFrom', 'requested_at_from'],
    ['requestedAtTo', 'requested_at_to'],
    ['receivedAtFrom', 'received_at_from'],
    ['receivedAtTo', 'received_at_to'],
    ['estimatedCustomerDeliveryAtFrom', 'estimated_customer_delivery_at_from'],
    ['estimatedCustomerDeliveryAtTo', 'estimated_customer_delivery_at_to'],
    ['providerEstimatedReturnAtFrom', 'provider_estimated_return_at_from'],
    ['providerEstimatedReturnAtTo', 'provider_estimated_return_at_to'],
  ];
  dateFilters.forEach(([key, parameter]) => {
    const value = filters[key];
    if (typeof value === 'string' && value) query.set(parameter, value);
  });
  sorts.forEach((sort, index) => {
    query.set(`sort[${index}][field]`, sort.field);
    query.set(`sort[${index}][direction]`, sort.direction);
  });

  try {
    const response = await jsonRequest<
      ApiCustomerServiceRecordListItem[],
      { pagination?: PaginationMeta }
    >(`/v1/customer-service-records?${query.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      token,
    });
    const items = Array.isArray(response.data) ? response.data.map(mapListItem) : [];
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
      error instanceof Error ? error.message : 'No fue posible obtener los registros de servicio'
    );
  }
});

export const fetchCustomerServiceRecordOptions = createAsyncThunk<
  { serviceTypes: CustomerServiceRecordOption[]; providers: CustomerServiceRecordOption[] },
  void,
  { state: RootState; rejectValue: string }
>('customerServiceRecords/fetchOptions', async (_, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const [serviceTypesResponse, providersResponse] = await Promise.all([
      jsonRequest<Array<{ code: string; name: string }>>(
        '/v1/customer-service-record-service-types/options',
        { method: 'GET', headers: { Accept: 'application/json' }, token }
      ),
      jsonRequest<ApiProviderOption[]>('/v1/providers/options', {
        method: 'GET',
        headers: { Accept: 'application/json' },
        token,
      }),
    ]);

    return {
      serviceTypes: Array.isArray(serviceTypesResponse.data)
        ? serviceTypesResponse.data.map((item) => ({ value: item.code, label: item.name }))
        : [],
      providers: Array.isArray(providersResponse.data)
        ? providersResponse.data.map((item) => ({
            value: item.provider_id,
            label: item.name,
          }))
        : [],
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible obtener las opciones del listado'
    );
  }
});

export const fetchCustomerServiceRecordById = createAsyncThunk<
  { record: CustomerServiceRecordDetail },
  { recordId: string },
  { state: RootState; rejectValue: string }
>('customerServiceRecords/fetchById', async ({ recordId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  try {
    const response = await jsonRequest<ApiCustomerServiceRecordDetail>(
      `/v1/customer-service-records/${recordId}`,
      { method: 'GET', headers: { Accept: 'application/json' }, token }
    );
    return { record: mapDetail(response.data) };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible obtener el registro de servicio'
    );
  }
});

export const createCustomerServiceRecord = createAsyncThunk<
  { record: CustomerServiceRecordDetail; message: string | null },
  CustomerServiceRecordMutationPayload,
  { state: RootState; rejectValue: string }
>('customerServiceRecords/create', async (payload, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  try {
    const response = await jsonRequest<ApiCustomerServiceRecordDetail>(
      '/v1/customer-service-records',
      {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: buildMutationBody(payload),
        token,
      }
    );
    return { record: mapDetail(response.data), message: response.successMessage };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible crear el registro de servicio'
    );
  }
});

export const updateCustomerServiceRecord = createAsyncThunk<
  { record: CustomerServiceRecordDetail; message: string | null },
  { recordId: string; payload: Partial<CustomerServiceRecordMutationPayload> },
  { state: RootState; rejectValue: string }
>('customerServiceRecords/update', async ({ recordId, payload }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  try {
    const response = await jsonRequest<ApiCustomerServiceRecordDetail>(
      `/v1/customer-service-records/${recordId}`,
      {
        method: 'PATCH',
        headers: { Accept: 'application/json' },
        body: buildUpdateBody(payload),
        token,
      }
    );
    return { record: mapDetail(response.data), message: response.successMessage };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible actualizar el registro de servicio'
    );
  }
});

export const deleteCustomerServiceRecord = createAsyncThunk<
  { recordId: string; message: string | null },
  { recordId: string },
  { state: RootState; rejectValue: string }
>('customerServiceRecords/delete', async ({ recordId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  try {
    const response = await jsonRequest<null>(`/v1/customer-service-records/${recordId}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
      token,
    });
    return { recordId, message: response.successMessage };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible eliminar el registro de servicio'
    );
  }
});
