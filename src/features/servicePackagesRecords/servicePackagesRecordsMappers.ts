import type {
  ServicePackageRecordAttachment,
  ServicePackageRecordDetail,
  ServicePackageRecordDetails,
  ServicePackageRecordEquipmentItem,
} from '@/features/servicePackagesRecords/types';

export type ApiServicePackageRecordDetail = {
  record_id: string;
  package_id: string;
  service_order: string | null;
  original_filename: string | null;
  s3_folder_key: string | null;
  details: unknown;
  company: string | null;
  collector_name: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  visit_date: string | null;
  service_type: string | null;
  purpose: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  files: ApiServicePackageRecordAttachment[];
};

type ApiServicePackageRecordAttachment = {
  file_id: string;
  relative_path: string | null;
  original_name: string;
  mime_type: string;
  size: number;
  download_url: string;
  preview_url: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function toNullableString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim();
  return normalized || null;
}

function toNullableNumber(value: unknown): number | null {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return null;
  }

  const normalized = typeof value === 'string' ? value.trim() : value;
  if (normalized === '') {
    return null;
  }

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'si', 'sí'].includes(value.trim().toLowerCase());
  }

  return false;
}

function mapEquipment(value: unknown): ServicePackageRecordEquipmentItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const equipment = asRecord(item);
    if (!equipment) {
      return [];
    }

    return [
      {
        number: toNullableNumber(equipment.number),
        equipment: toNullableString(equipment.equipment),
        brand: toNullableString(equipment.brand),
        model: toNullableString(equipment.model),
        identification: toNullableString(equipment.identification),
        serialNumber: toNullableString(equipment.serialNumber),
      },
    ];
  });
}

function mapDetails(value: unknown): ServicePackageRecordDetails {
  const details = asRecord(value);

  return {
    serviceTime: toNullableString(details?.serviceTime),
    equipment: mapEquipment(details?.equipment),
    observations: toNullableString(details?.observations),
    synced: toBoolean(details?.synced),
    hasCollectorSignature: toBoolean(details?.hasCollectorSignature),
    hasClientSignature: toBoolean(details?.hasClientSignature),
  };
}

function mapAttachment(value: ApiServicePackageRecordAttachment): ServicePackageRecordAttachment {
  return {
    fileId: value.file_id,
    relativePath: value.relative_path ?? '',
    originalName: value.original_name,
    mimeType: value.mime_type,
    size: value.size,
    downloadUrl: value.download_url,
    previewUrl: value.preview_url,
  };
}

export function mapServicePackageRecordDetail(
  value: ApiServicePackageRecordDetail
): ServicePackageRecordDetail {
  return {
    id: value.record_id,
    packageId: value.package_id,
    serviceOrder: value.service_order ?? '',
    originalFilename: value.original_filename,
    s3FolderKey: value.s3_folder_key ?? '',
    company: value.company,
    collectorName: value.collector_name,
    contactPerson: value.contact_person,
    email: value.email,
    phone: value.phone,
    address: value.address,
    visitDate: value.visit_date,
    serviceType: value.service_type,
    purpose: value.purpose,
    status: value.status ?? '',
    createdAt: value.created_at,
    updatedAt: value.updated_at,
    details: mapDetails(value.details),
    files: Array.isArray(value.files) ? value.files.map(mapAttachment) : [],
  };
}
