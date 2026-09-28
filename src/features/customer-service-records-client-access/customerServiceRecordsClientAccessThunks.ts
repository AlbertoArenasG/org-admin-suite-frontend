import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type {
  ClientAccessAttachment,
  ClientAccessCustomerDelivery,
  ClientAccessCustomerServiceRecord,
  ClientAccessCustomerServiceRecordDetail,
  FetchClientAccessCustomerServiceRecordsParams,
  FetchClientAccessCustomerServiceRecordDetailParams,
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

interface ApiAttachment {
  file_id: string;
  original_name: string;
  mime_type: string;
  size: number;
  download_url: string;
  preview_url: string;
}

interface ApiStatusMaterialization {
  source: ApiLocalizedValue;
  code: string;
  name: string;
  name_key: string | null;
  color_hex: string;
  effective_start_date: string | null;
}

interface ApiCustomerDelivery {
  received_at: string | null;
  estimated_delivery_interval: { years: number; months: number; weeks: number; days: number };
  estimated_delivery_at: string | null;
  delivered_to_customer_at: string | null;
  status_policy_id: string | null;
  notification_policy_id: string | null;
  status_materialization: ApiStatusMaterialization | null;
  notification_materialization: unknown | null;
}

interface ApiClientAccessRecord {
  customer_service_record_id: string;
  service_number: number;
  service_number_display: string;
  service_type: { service_type_code: string; name: string };
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
  observations: string | null;
  operational_status: ApiLocalizedValue;
  customer_delivery: ApiCustomerDelivery;
}

interface ApiClientAccessRecordDetail extends Omit<ApiClientAccessRecord, 'assets' | 'customer'> {
  customer: ApiClientAccessRecord['customer'] & {
    users: Array<{ user_id: string; name: string; email: string }>;
  };
  assets: Array<
    ApiClientAccessRecord['assets'][number] & {
      intake_condition_files: ApiAttachment[];
      delivery_condition_files: ApiAttachment[];
      reports: ApiAttachment[];
    }
  >;
  quotation: { reference_number: string | null; files: ApiAttachment[] };
  purchase_order: { reference_number: string | null; files: ApiAttachment[] };
  invoice: { reference_number: string | null; files: ApiAttachment[] };
  other_files: ApiAttachment[];
  created_at: string | null;
}

function mapRecord(value: ApiClientAccessRecord): ClientAccessCustomerServiceRecord {
  return {
    id: value.customer_service_record_id,
    serviceNumber: value.service_number,
    serviceNumberDisplay: value.service_number_display,
    serviceType: { code: value.service_type.service_type_code, name: value.service_type.name },
    customer: { id: value.customer.customer_id, name: value.customer.name },
    assets: (value.assets ?? []).map((asset) => ({
      id: asset.asset_id,
      name: asset.name,
      identifier: asset.identifier,
      brand: asset.brand,
      model: asset.model,
      serialNumber: asset.serial_number,
      observations: asset.observations ?? null,
    })),
    observations: value.observations ?? null,
    operationalStatus: {
      code: value.operational_status.code,
      name: value.operational_status.name,
      nameKey: value.operational_status.name_key,
    },
    customerDelivery: mapCustomerDelivery(value.customer_delivery),
  };
}

function mapCustomerDelivery(value: ApiCustomerDelivery): ClientAccessCustomerDelivery {
  return {
    receivedAt: value.received_at ?? null,
    estimatedDeliveryInterval: value.estimated_delivery_interval,
    estimatedDeliveryAt: value.estimated_delivery_at ?? null,
    deliveredToCustomerAt: value.delivered_to_customer_at ?? null,
    statusPolicyId: value.status_policy_id ?? null,
    notificationPolicyId: value.notification_policy_id ?? null,
    statusMaterialization: value.status_materialization
      ? {
          source: {
            code: value.status_materialization.source.code,
            name: value.status_materialization.source.name,
            nameKey: value.status_materialization.source.name_key,
          },
          code: value.status_materialization.code,
          name: value.status_materialization.name,
          nameKey: value.status_materialization.name_key,
          colorHex: value.status_materialization.color_hex,
          effectiveStartDate: value.status_materialization.effective_start_date ?? null,
        }
      : null,
    notificationMaterialization: value.notification_materialization ?? null,
  };
}

function mapAttachment(value: ApiAttachment): ClientAccessAttachment {
  return {
    fileId: value.file_id,
    originalName: value.original_name,
    mimeType: value.mime_type,
    size: value.size,
    downloadUrl: value.download_url,
    previewUrl: value.preview_url,
  };
}

function mapDetail(value: ApiClientAccessRecordDetail): ClientAccessCustomerServiceRecordDetail {
  const record = mapRecord(value);

  return {
    ...record,
    customer: {
      id: value.customer.customer_id,
      name: value.customer.name,
      users: (value.customer.users ?? []).map((user) => ({
        id: user.user_id,
        name: user.name,
        email: user.email,
      })),
    },
    assets: (value.assets ?? []).map((asset) => ({
      id: asset.asset_id,
      name: asset.name,
      identifier: asset.identifier,
      brand: asset.brand,
      model: asset.model,
      serialNumber: asset.serial_number,
      observations: asset.observations ?? null,
      intakeConditionFiles: (asset.intake_condition_files ?? []).map(mapAttachment),
      deliveryConditionFiles: (asset.delivery_condition_files ?? []).map(mapAttachment),
      reports: (asset.reports ?? []).map(mapAttachment),
    })),
    quotation: {
      referenceNumber: value.quotation.reference_number ?? null,
      files: (value.quotation.files ?? []).map(mapAttachment),
    },
    purchaseOrder: {
      referenceNumber: value.purchase_order.reference_number ?? null,
      files: (value.purchase_order.files ?? []).map(mapAttachment),
    },
    invoice: {
      referenceNumber: value.invoice.reference_number ?? null,
      files: (value.invoice.files ?? []).map(mapAttachment),
    },
    otherFiles: (value.other_files ?? []).map(mapAttachment),
    createdAt: value.created_at ?? null,
  };
}

export const fetchClientAccessCustomerServiceRecords = createAsyncThunk<
  {
    items: ClientAccessCustomerServiceRecord[];
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  },
  FetchClientAccessCustomerServiceRecordsParams | undefined,
  { state: RootState; rejectValue: string }
>('customerServiceRecordsClientAccess/fetchList', async (params = {}, thunkAPI) => {
  const token = thunkAPI.getState().auth.token;
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticacion');

  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (params.search?.trim()) query.set('search', params.search.trim());
  if (params.sort) {
    query.set('sort[0][field]', params.sort.field);
    query.set('sort[0][direction]', params.sort.direction);
  }
  if (!params.sort && params.sortStrategy) query.set('sort_strategy', params.sortStrategy);

  try {
    const response = await jsonRequest<ApiClientAccessRecord[], { pagination?: PaginationMeta }>(
      `/v1/customer-service-records-client-access?${query.toString()}`,
      { method: 'GET', headers: { Accept: 'application/json' }, token }
    );
    const items = Array.isArray(response.data) ? response.data.map(mapRecord) : [];
    const pagination = response.meta?.pagination;
    return {
      items,
      page: pagination?.page ?? page,
      perPage: pagination?.per_page ?? limit,
      total: pagination?.total ?? items.length,
      totalPages: pagination?.total_pages ?? (items.length ? 1 : 0),
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible obtener los servicios'
    );
  }
});

export const fetchClientAccessCustomerServiceRecordDetail = createAsyncThunk<
  ClientAccessCustomerServiceRecordDetail,
  FetchClientAccessCustomerServiceRecordDetailParams,
  { state: RootState; rejectValue: string }
>('customerServiceRecordsClientAccess/fetchDetail', async ({ recordId }, thunkAPI) => {
  const token = thunkAPI.getState().auth.token;
  if (!token) return thunkAPI.rejectWithValue('No hay token de autenticacion');

  try {
    const response = await jsonRequest<ApiClientAccessRecordDetail>(
      `/v1/customer-service-records-client-access/${recordId}`,
      { method: 'GET', headers: { Accept: 'application/json' }, token }
    );
    return mapDetail(response.data);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible obtener el servicio'
    );
  }
});
