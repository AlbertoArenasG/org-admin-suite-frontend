import type { TimelineRecord } from '@/features/customer-service-records/customerServiceRecordTimelineMapper';
import type { CustomerServiceRecordOperationalStatus } from '@/features/customer-service-records/types';

export type ApiClientAccessTimelineRecord = {
  customer_service_record_id: string;
  service_number_display: string;
  service_type: { service_type_code: string; name: string };
  customer: { customer_id: string; name: string };
  assets: Array<{ asset_id: string; name: string; identifier: string }>;
  operational_status: { code: string; name: string };
  customer_delivery: {
    received_at: string | null;
    estimated_delivery_at: string | null;
    status_materialization: {
      code: string;
      name: string;
      name_key: string | null;
      color_hex: string;
      source: { code: string; name: string; name_key: string };
      effective_start_date: string | null;
    } | null;
  };
};

export function mapClientAccessTimelineRecord(
  value: ApiClientAccessTimelineRecord
): TimelineRecord {
  const status = value.customer_delivery.status_materialization;
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
      statusMaterialization: status
        ? {
            code: status.code,
            name: status.name,
            nameKey: status.name_key,
            colorHex: status.color_hex,
            source: {
              code: status.source.code,
              name: status.source.name,
              nameKey: status.source.name_key,
            },
            effectiveStartDate: status.effective_start_date,
          }
        : null,
    },
    provider: null,
  };
}
