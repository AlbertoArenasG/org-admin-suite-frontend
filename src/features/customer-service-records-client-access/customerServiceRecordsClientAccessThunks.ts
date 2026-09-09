import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type {
  ClientAccessCustomerServiceRecord,
  FetchClientAccessCustomerServiceRecordsParams,
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
  customer_delivery: {
    received_at: string | null;
    estimated_delivery_at: string | null;
    delivered_to_customer_at: string | null;
    status_materialization: {
      code: string;
      name: string;
      name_key: string | null;
      color_hex: string;
    } | null;
  };
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
    customerDelivery: {
      receivedAt: value.customer_delivery.received_at ?? null,
      estimatedDeliveryAt: value.customer_delivery.estimated_delivery_at ?? null,
      deliveredToCustomerAt: value.customer_delivery.delivered_to_customer_at ?? null,
      statusMaterialization: value.customer_delivery.status_materialization
        ? {
            code: value.customer_delivery.status_materialization.code,
            name: value.customer_delivery.status_materialization.name,
            nameKey: value.customer_delivery.status_materialization.name_key,
            colorHex: value.customer_delivery.status_materialization.color_hex,
          }
        : null,
    },
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
