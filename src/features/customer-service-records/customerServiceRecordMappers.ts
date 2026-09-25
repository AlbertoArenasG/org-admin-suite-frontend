import type {
  CustomerServiceRecordAttachment,
  CustomerServiceRecordDerivedStatus,
  CustomerServiceRecordDetail,
  CustomerServiceRecordLocalizedValue,
  CustomerServiceRecordOperationalStatus,
} from './types';

type ApiLocalizedValue = {
  code: string;
  name: string;
  name_key: string | null;
};

type ApiMaterialization = {
  code: string;
  name: string;
  name_key: string | null;
  color_hex: string;
  source: ApiLocalizedValue;
  effective_start_date: string | null;
};

type ApiAttachment = {
  file_id: string;
  original_name: string;
  mime_type: string;
  size: number;
  download_url: string;
  preview_url: string;
};

export type ApiCustomerServiceRecordDetail = {
  customer_service_record_id: string;
  service_number_display: string;
  service_type: { service_type_code: string; name: string };
  requested_at: string;
  observations: string | null;
  operational_status: ApiLocalizedValue;
  customer: {
    customer_id: string;
    name: string;
    users: Array<{ user_id: string; name: string; email: string }>;
  };
  assets: Array<{
    asset_id: string;
    name: string;
    identifier: string;
    brand: string;
    model: string;
    serial_number: string;
    observations: string | null;
    intake_condition_files?: ApiAttachment[];
    delivery_condition_files?: ApiAttachment[];
    reports?: ApiAttachment[];
  }>;
  customer_delivery: {
    received_at: string | null;
    estimated_delivery_interval: string | null;
    estimated_delivery_at: string | null;
    delivered_to_customer_at: string | null;
    status_policy_id: string | null;
    notification_policy_id: string | null;
    status_materialization: ApiMaterialization | null;
    notification_materialization: unknown | null;
  };
  provider: {
    provider_id: string;
    name: string;
    work_order_reference: string | null;
    delivered_to_provider_at: string | null;
    estimated_return_interval: string | null;
    estimated_return_at: string | null;
    returned_from_provider_at: string | null;
    status_policy_id: string | null;
    notification_policy_id: string | null;
    follow_up: boolean;
    status_materialization: ApiMaterialization | null;
    notification_materialization: unknown | null;
    follow_up_materialization: unknown[];
  } | null;
  attachments_count: number;
  quotation: { reference_number: string | null; files: ApiAttachment[] };
  purchase_order: { reference_number: string | null; files: ApiAttachment[] };
  invoice: { reference_number: string | null; files: ApiAttachment[] };
  other_files: ApiAttachment[];
  created_at: string | null;
  updated_at: string | null;
};

function mapLocalizedValue(value: ApiLocalizedValue): CustomerServiceRecordLocalizedValue {
  return { code: value.code, name: value.name, nameKey: value.name_key };
}

function mapMaterialization(
  value: ApiMaterialization | null
): CustomerServiceRecordDerivedStatus | null {
  if (!value) return null;

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

function mapAttachment(value: ApiAttachment): CustomerServiceRecordAttachment {
  return {
    fileId: value.file_id,
    originalName: value.original_name,
    mimeType: value.mime_type,
    size: value.size,
    downloadUrl: value.download_url,
    previewUrl: value.preview_url,
  };
}

export function mapCustomerServiceRecordDetail(
  value: ApiCustomerServiceRecordDetail
): CustomerServiceRecordDetail {
  return {
    customerServiceRecordId: value.customer_service_record_id,
    serviceNumber: value.service_number_display,
    serviceType: {
      serviceTypeCode: value.service_type.service_type_code,
      name: value.service_type.name,
    },
    requestedAt: value.requested_at,
    observations: value.observations,
    operationalStatus: {
      ...mapLocalizedValue(value.operational_status),
      code: value.operational_status.code as CustomerServiceRecordOperationalStatus,
    },
    customer: {
      customerId: value.customer.customer_id,
      name: value.customer.name,
      users: value.customer.users.map((user) => ({
        userId: user.user_id,
        name: user.name,
        email: user.email,
      })),
    },
    assets: value.assets.map((asset) => ({
      assetId: asset.asset_id,
      name: asset.name,
      identifier: asset.identifier,
      brand: asset.brand,
      model: asset.model,
      serialNumber: asset.serial_number,
      observations: asset.observations,
      intakeConditionFiles: (asset.intake_condition_files ?? []).map(mapAttachment),
      deliveryConditionFiles: (asset.delivery_condition_files ?? []).map(mapAttachment),
      reports: (asset.reports ?? []).map(mapAttachment),
    })),
    customerDelivery: {
      receivedAt: value.customer_delivery.received_at,
      estimatedDeliveryInterval: value.customer_delivery.estimated_delivery_interval,
      estimatedDeliveryAt: value.customer_delivery.estimated_delivery_at,
      deliveredToCustomerAt: value.customer_delivery.delivered_to_customer_at,
      statusPolicyId: value.customer_delivery.status_policy_id,
      notificationPolicyId: value.customer_delivery.notification_policy_id,
      statusMaterialization: mapMaterialization(value.customer_delivery.status_materialization),
      notificationMaterialization: value.customer_delivery.notification_materialization,
    },
    provider: value.provider
      ? {
          providerId: value.provider.provider_id,
          name: value.provider.name,
          workOrderReference: value.provider.work_order_reference,
          deliveredToProviderAt: value.provider.delivered_to_provider_at,
          estimatedReturnInterval: value.provider.estimated_return_interval,
          estimatedReturnAt: value.provider.estimated_return_at,
          returnedFromProviderAt: value.provider.returned_from_provider_at,
          statusPolicyId: value.provider.status_policy_id,
          notificationPolicyId: value.provider.notification_policy_id,
          followUp: value.provider.follow_up,
          statusMaterialization: mapMaterialization(value.provider.status_materialization),
          notificationMaterialization: value.provider.notification_materialization,
          followUpMaterialization: value.provider.follow_up_materialization,
        }
      : null,
    attachmentsCount: value.attachments_count,
    quotation: {
      referenceNumber: value.quotation.reference_number,
      files: value.quotation.files.map(mapAttachment),
    },
    purchaseOrder: {
      referenceNumber: value.purchase_order.reference_number,
      files: value.purchase_order.files.map(mapAttachment),
    },
    invoice: {
      referenceNumber: value.invoice.reference_number,
      files: value.invoice.files.map(mapAttachment),
    },
    otherFiles: value.other_files.map(mapAttachment),
    createdAt: value.created_at,
    updatedAt: value.updated_at,
  };
}
