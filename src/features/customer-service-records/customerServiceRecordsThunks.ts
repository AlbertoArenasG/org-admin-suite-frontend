import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import {
  mapCustomerServiceRecordDetail,
  type ApiCustomerServiceRecordDetail,
} from './customerServiceRecordMappers';
import type {
  CustomerServiceRecordDerivedStatus,
  CustomerServiceRecordListItem,
  CreateCustomerServiceRecordPayload,
  CustomerServiceRecordOption,
  CustomerServiceRecordDetail,
  UpdateCustomerServiceRecordDetailsPayload,
  UpdateCustomerServiceRecordCustomerDeliveryPayload,
  UpdateCustomerServiceRecordAssetPayload,
  UpdateCustomerServiceRecordProviderPayload,
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
  service_number: number;
  service_number_display: string;
  observations: string | null;
  service_type: { service_type_code: string; name: string };
  requested_at: string;
  customer: { customer_id: string; name: string };
  assets: Array<{
    asset_id: string;
    name: string;
    identifier: string;
    brand: string;
    model: string;
    serial_number: string;
    observations: string | null;
  }>;
  operational_status: ApiLocalizedValue;
  customer_delivery: {
    received_at: string | null;
    estimated_delivery_at: string | null;
    delivered_to_customer_at: string | null;
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

interface ApiCustomerOption {
  customer_id: string;
  company_name: string;
}

interface ApiCustomerRelatedUserOption {
  id: string;
  name: string;
  lastname: string;
  full_name?: string;
  email: string;
}

interface ApiExpirationStatusPolicyOption {
  expiration_status_policy_id: string;
  name: string;
}

interface ApiExpirationNotificationPolicyOption {
  expiration_notification_policy_id: string;
  name: string;
}

interface ApiRecipientGroupOption {
  recipient_group_id: string;
  name: string;
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
    serviceNumber: value.service_number_display,
    observations: value.observations ?? null,
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
      brand: asset.brand,
      model: asset.model,
      serialNumber: asset.serial_number,
      observations: asset.observations ?? null,
    })),
    operationalStatus: {
      code: value.operational_status
        .code as CustomerServiceRecordListItem['operationalStatus']['code'],
      name: value.operational_status.name,
      nameKey: value.operational_status.name_key ?? '',
    },
    customerDelivery: {
      receivedAt: value.customer_delivery.received_at,
      estimatedDeliveryAt: value.customer_delivery.estimated_delivery_at,
      deliveredToCustomerAt: value.customer_delivery.delivered_to_customer_at,
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

function buildCreateCustomerServiceRecordBody(payload: CreateCustomerServiceRecordPayload) {
  return {
    service_type_code: payload.serviceTypeCode,
    requested_at: payload.requestedAt,
    observations: null,
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
      observations: null,
    })),
  };
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

  const {
    page = 1,
    limit = 10,
    itemsPerPage,
    search,
    filters = {},
    sorts = [],
    sortStrategy,
  } = params;
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
  if (!sorts.length && sortStrategy) query.set('sort_strategy', sortStrategy);

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

export const fetchCustomerServiceRecordDetail = createAsyncThunk<
  CustomerServiceRecordDetail,
  { recordId: string },
  { state: RootState; rejectValue: string }
>('customerServiceRecords/fetchDetail', async ({ recordId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  try {
    const response = await jsonRequest<ApiCustomerServiceRecordDetail>(
      `/v1/customer-service-records/${recordId}`,
      { method: 'GET', headers: { Accept: 'application/json' }, token }
    );
    return mapCustomerServiceRecordDetail(response.data);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible obtener el registro de servicio'
    );
  }
});

export const fetchCustomerServiceRecordDetailOptions = createAsyncThunk<
  { serviceTypes: CustomerServiceRecordOption[] },
  void,
  { state: RootState; rejectValue: string }
>('customerServiceRecords/fetchDetailOptions', async (_, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  try {
    const response = await jsonRequest<Array<{ code: string; name: string }>>(
      '/v1/customer-service-record-service-types/options',
      { method: 'GET', headers: { Accept: 'application/json' }, token }
    );
    return {
      serviceTypes: Array.isArray(response.data)
        ? response.data.map((item) => ({ value: item.code, label: item.name }))
        : [],
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible obtener las opciones de detalles'
    );
  }
});

export const updateCustomerServiceRecordDetails = createAsyncThunk<
  { record: CustomerServiceRecordDetail; message: string | null },
  { recordId: string; payload: UpdateCustomerServiceRecordDetailsPayload },
  { state: RootState; rejectValue: string }
>('customerServiceRecords/updateDetails', async ({ payload, recordId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  try {
    const response = await jsonRequest<ApiCustomerServiceRecordDetail>(
      `/v1/customer-service-records/${recordId}/details`,
      {
        method: 'PUT',
        headers: { Accept: 'application/json' },
        body: {
          service_type_code: payload.serviceTypeCode,
          requested_at: payload.requestedAt,
          observations: payload.observations,
          operational_status: payload.operationalStatus,
        },
        token,
      }
    );
    return {
      record: mapCustomerServiceRecordDetail(response.data),
      message: response.successMessage,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible actualizar el registro de servicio'
    );
  }
});

export const fetchCustomerServiceRecordCustomerDeliveryOptions = createAsyncThunk<
  {
    customers: CustomerServiceRecordOption[];
    statusPolicies: CustomerServiceRecordOption[];
    notificationPolicies: CustomerServiceRecordOption[];
  },
  void,
  { state: RootState; rejectValue: string }
>('customerServiceRecords/fetchCustomerDeliveryOptions', async (_, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  try {
    const [customersResponse, statusPoliciesResponse, notificationPoliciesResponse] =
      await Promise.all([
        jsonRequest<ApiCustomerOption[]>('/v1/customers/options', {
          method: 'GET',
          headers: { Accept: 'application/json' },
          token,
        }),
        jsonRequest<ApiExpirationStatusPolicyOption[]>('/v1/expiration-status-policies/options', {
          method: 'GET',
          headers: { Accept: 'application/json' },
          token,
        }),
        jsonRequest<ApiExpirationNotificationPolicyOption[]>(
          '/v1/expiration-notification-policies/options',
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
            token,
          }
        ),
      ]);

    return {
      customers: Array.isArray(customersResponse.data)
        ? customersResponse.data.map((item) => ({
            value: item.customer_id,
            label: item.company_name,
          }))
        : [],
      statusPolicies: Array.isArray(statusPoliciesResponse.data)
        ? statusPoliciesResponse.data.map((item) => ({
            value: item.expiration_status_policy_id,
            label: item.name,
          }))
        : [],
      notificationPolicies: Array.isArray(notificationPoliciesResponse.data)
        ? notificationPoliciesResponse.data.map((item) => ({
            value: item.expiration_notification_policy_id,
            label: item.name,
          }))
        : [],
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error
        ? error.message
        : 'No fue posible obtener las opciones de cliente y entrega'
    );
  }
});

export const fetchCustomerServiceRecordCustomerUsers = createAsyncThunk<
  { customerId: string; users: CustomerServiceRecordOption[] },
  { customerId: string },
  { state: RootState; rejectValue: string }
>('customerServiceRecords/fetchCustomerUsers', async ({ customerId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  try {
    const response = await jsonRequest<ApiCustomerRelatedUserOption[]>(
      `/v1/customers/${customerId}/users/options`,
      { method: 'GET', headers: { Accept: 'application/json' }, token }
    );
    return {
      customerId,
      users: Array.isArray(response.data)
        ? response.data.map((user) => ({
            value: user.id,
            label: user.full_name ?? [user.name, user.lastname].filter(Boolean).join(' '),
          }))
        : [],
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible obtener los usuarios relacionados'
    );
  }
});

export const updateCustomerServiceRecordCustomerDelivery = createAsyncThunk<
  { record: CustomerServiceRecordDetail; message: string | null },
  { recordId: string; payload: UpdateCustomerServiceRecordCustomerDeliveryPayload },
  { state: RootState; rejectValue: string }
>('customerServiceRecords/updateCustomerDelivery', async ({ payload, recordId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  try {
    const response = await jsonRequest<ApiCustomerServiceRecordDetail>(
      `/v1/customer-service-records/${recordId}/customer`,
      {
        method: 'PUT',
        headers: { Accept: 'application/json' },
        body: {
          customer: {
            customer_id: payload.customer.customerId,
            customer_user_ids: payload.customer.customerUserIds,
          },
          customer_delivery: {
            received_at: payload.customerDelivery.receivedAt,
            estimated_delivery_interval: payload.customerDelivery.estimatedDeliveryInterval,
            estimated_delivery_at: payload.customerDelivery.estimatedDeliveryAt,
            delivered_to_customer_at: payload.customerDelivery.deliveredToCustomerAt,
            status_policy_id: payload.customerDelivery.statusPolicyId,
            notification_policy_id: payload.customerDelivery.notificationPolicyId,
          },
        },
        token,
      }
    );
    return {
      record: mapCustomerServiceRecordDetail(response.data),
      message: response.successMessage,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible actualizar cliente y entrega'
    );
  }
});

export const updateCustomerServiceRecordAsset = createAsyncThunk<
  { record: CustomerServiceRecordDetail; message: string | null },
  { recordId: string; payload: UpdateCustomerServiceRecordAssetPayload },
  { state: RootState; rejectValue: string }
>('customerServiceRecords/updateAsset', async ({ payload, recordId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  try {
    const response = await jsonRequest<ApiCustomerServiceRecordDetail>(
      `/v1/customer-service-records/${recordId}/assets/${payload.assetId}`,
      {
        method: 'PUT',
        headers: { Accept: 'application/json' },
        body: {
          name: payload.name,
          identifier: payload.identifier,
          brand: payload.brand,
          model: payload.model,
          serial_number: payload.serialNumber,
          observations: payload.observations,
          intake_condition_file_ids: payload.intakeConditionFileIds,
          delivery_condition_file_ids: payload.deliveryConditionFileIds,
          report_file_ids: payload.reportFileIds,
        },
        token,
      }
    );
    return {
      record: mapCustomerServiceRecordDetail(response.data),
      message: response.successMessage,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible actualizar el equipo'
    );
  }
});

export const fetchCustomerServiceRecordProviderOptions = createAsyncThunk<
  {
    providers: CustomerServiceRecordOption[];
    statusPolicies: CustomerServiceRecordOption[];
    notificationPolicies: CustomerServiceRecordOption[];
    recipientGroups: CustomerServiceRecordOption[];
  },
  void,
  { state: RootState; rejectValue: string }
>('customerServiceRecords/fetchProviderOptions', async (_, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  try {
    const [
      providersResponse,
      statusPoliciesResponse,
      notificationPoliciesResponse,
      groupsResponse,
    ] = await Promise.all([
      jsonRequest<ApiProviderOption[]>('/v1/providers/options', {
        method: 'GET',
        headers: { Accept: 'application/json' },
        token,
      }),
      jsonRequest<ApiExpirationStatusPolicyOption[]>('/v1/expiration-status-policies/options', {
        method: 'GET',
        headers: { Accept: 'application/json' },
        token,
      }),
      jsonRequest<ApiExpirationNotificationPolicyOption[]>(
        '/v1/expiration-notification-policies/options',
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
          token,
        }
      ),
      jsonRequest<ApiRecipientGroupOption[]>('/v1/recipient-groups/options', {
        method: 'GET',
        headers: { Accept: 'application/json' },
        token,
      }),
    ]);

    return {
      providers: Array.isArray(providersResponse.data)
        ? providersResponse.data.map((item) => ({ value: item.provider_id, label: item.name }))
        : [],
      statusPolicies: Array.isArray(statusPoliciesResponse.data)
        ? statusPoliciesResponse.data.map((item) => ({
            value: item.expiration_status_policy_id,
            label: item.name,
          }))
        : [],
      notificationPolicies: Array.isArray(notificationPoliciesResponse.data)
        ? notificationPoliciesResponse.data.map((item) => ({
            value: item.expiration_notification_policy_id,
            label: item.name,
          }))
        : [],
      recipientGroups: Array.isArray(groupsResponse.data)
        ? groupsResponse.data.map((item) => ({ value: item.recipient_group_id, label: item.name }))
        : [],
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible obtener las opciones de proveedor'
    );
  }
});

export const updateCustomerServiceRecordProvider = createAsyncThunk<
  { record: CustomerServiceRecordDetail; message: string | null },
  { recordId: string; payload: UpdateCustomerServiceRecordProviderPayload },
  { state: RootState; rejectValue: string }
>('customerServiceRecords/updateProvider', async ({ payload, recordId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  try {
    const provider = payload.provider;
    const response = await jsonRequest<ApiCustomerServiceRecordDetail>(
      `/v1/customer-service-records/${recordId}/provider`,
      {
        method: 'PUT',
        headers: { Accept: 'application/json' },
        body: {
          provider: provider
            ? {
                provider_id: provider.providerId,
                work_order_reference: provider.workOrderReference,
                delivered_to_provider_at: provider.deliveredToProviderAt,
                estimated_return_interval: provider.estimatedReturnInterval,
                estimated_return_at: provider.estimatedReturnAt,
                returned_from_provider_at: provider.returnedFromProviderAt,
                status_policy_id: provider.statusPolicyId,
                notification_policy_id: provider.notificationPolicyId,
                follow_up: {
                  enabled: provider.followUp.enabled,
                  rules: provider.followUp.rules.map((rule) => ({
                    interval: rule.interval,
                    recipient_group_ids: rule.recipientGroupIds,
                    cc_recipient_group_ids: rule.ccRecipientGroupIds,
                  })),
                },
              }
            : null,
        },
        token,
      }
    );
    return {
      record: mapCustomerServiceRecordDetail(response.data),
      message: response.successMessage,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible actualizar proveedor y seguimiento'
    );
  }
});

export const createCustomerServiceRecord = createAsyncThunk<
  { record: { customerServiceRecordId: string }; message: string | null },
  CreateCustomerServiceRecordPayload,
  { state: RootState; rejectValue: string }
>('customerServiceRecords/create', async (payload, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticación');

  try {
    const response = await jsonRequest<{ customer_service_record_id: string }>(
      '/v1/customer-service-records',
      {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: buildCreateCustomerServiceRecordBody(payload),
        token,
      }
    );
    return {
      record: { customerServiceRecordId: response.data.customer_service_record_id },
      message: response.successMessage,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible crear el registro de servicio'
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
