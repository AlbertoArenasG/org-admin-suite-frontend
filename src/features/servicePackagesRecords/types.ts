'use client';

export type ServicePackageRecordRequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ServicePackageRecordListItem {
  id: string;
  serviceOrder: string;
  company: string;
  collectorName: string;
  visitDate: string;
  serviceType: string;
  createdAt: string;
}

export interface ServicePackageRecordAttachment {
  fileId: string;
  relativePath: string;
  originalName: string;
  mimeType: string;
  size: number;
  downloadUrl: string;
  previewUrl: string;
}

export interface ServicePackageRecordEquipmentItem {
  number: number | null;
  equipment: string | null;
  brand: string | null;
  model: string | null;
  identification: string | null;
  serialNumber: string | null;
}

export interface ServicePackageRecordDetails {
  serviceTime: string | null;
  equipment: ServicePackageRecordEquipmentItem[];
  observations: string | null;
  synced: boolean;
  hasCollectorSignature: boolean;
  hasClientSignature: boolean;
}

export interface ServicePackageRecordDetail {
  id: string;
  packageId: string;
  serviceOrder: string;
  originalFilename: string | null;
  s3FolderKey: string;
  company: string | null;
  collectorName: string | null;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  visitDate: string | null;
  serviceType: string | null;
  purpose: string | null;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
  details: ServicePackageRecordDetails;
  files: ServicePackageRecordAttachment[];
}

export interface ServicePackageRecordDetailError {
  message: string;
  status: number;
}

export interface ServicePackagesRecordsPagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ServicePackageRecordServiceTypeOption {
  value: string;
  label: string;
}
