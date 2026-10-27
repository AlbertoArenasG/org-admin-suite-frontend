import type {
  CustomerServiceRecordDerivedStatus,
  CustomerServiceRecordOperationalStatus,
} from './types';

export type TimelineRecord = {
  id: string;
  serviceNumber: string;
  serviceType: string;
  customer: { id: string; name: string };
  assets: Array<{ id: string; name: string; identifier: string }>;
  operationalStatus: { code: CustomerServiceRecordOperationalStatus; name: string };
  customerDelivery: {
    receivedAt: string | null;
    estimatedDeliveryAt: string | null;
    statusMaterialization: CustomerServiceRecordDerivedStatus | null;
  };
  provider: {
    name: string;
    deliveredAt: string | null;
    estimatedReturnAt: string | null;
    returnedAt: string | null;
    statusMaterialization: CustomerServiceRecordDerivedStatus | null;
  } | null;
};

type ApiMaterialization = {
  code: string;
  name: string;
  name_key: string | null;
  color_hex: string;
  source: { code: string; name: string; name_key: string };
  effective_start_date: string | null;
};

export type ApiTimelineRecord = {
  customer_service_record_id: string;
  service_number_display: string;
  service_type: { service_type_code: string; name: string };
  customer: { customer_id: string; name: string };
  assets: Array<{ asset_id: string; name: string; identifier: string }>;
  operational_status: { code: string; name: string };
  customer_delivery: {
    received_at: string | null;
    estimated_delivery_at: string | null;
    status_materialization: ApiMaterialization | null;
  };
  provider: {
    name: string;
    delivered_to_provider_at: string | null;
    estimated_return_at: string | null;
    returned_from_provider_at: string | null;
    status_materialization: ApiMaterialization | null;
  } | null;
};

function materialization(
  value: ApiMaterialization | null
): CustomerServiceRecordDerivedStatus | null {
  if (!value) return null;
  return {
    code: value.code,
    name: value.name,
    nameKey: value.name_key,
    colorHex: value.color_hex,
    source: { code: value.source.code, name: value.source.name, nameKey: value.source.name_key },
    effectiveStartDate: value.effective_start_date,
  };
}

export function mapTimelineRecord(value: ApiTimelineRecord): TimelineRecord {
  return {
    id: value.customer_service_record_id,
    serviceNumber: value.service_number_display,
    serviceType: value.service_type.name,
    customer: { id: value.customer.customer_id, name: value.customer.name },
    assets: value.assets.map((asset) => ({
      id: asset.asset_id,
      name: asset.name,
      identifier: asset.identifier,
    })),
    operationalStatus: {
      code: value.operational_status.code as CustomerServiceRecordOperationalStatus,
      name: value.operational_status.name,
    },
    customerDelivery: {
      receivedAt: value.customer_delivery.received_at,
      estimatedDeliveryAt: value.customer_delivery.estimated_delivery_at,
      statusMaterialization: materialization(value.customer_delivery.status_materialization),
    },
    provider: value.provider
      ? {
          name: value.provider.name,
          deliveredAt: value.provider.delivered_to_provider_at,
          estimatedReturnAt: value.provider.estimated_return_at,
          returnedAt: value.provider.returned_from_provider_at,
          statusMaterialization: materialization(value.provider.status_materialization),
        }
      : null,
  };
}
