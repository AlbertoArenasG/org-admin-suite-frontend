'use client';

export interface ServicePackageRecordFile {
  id: string;
  relativePath: string;
  originalName: string;
  url: string;
  size: number;
  contentType: string;
}

export interface ServicePackageRecordEquipment {
  number: number;
  equipment: string;
  brand: string;
  model: string;
  identification: string;
  serialNumber: string;
}

export interface ServicePackageRecordDetails {
  serviceNumber: string;
  serviceTime: string;
  company: string;
  collectorName: string;
  contactPerson: string;
  visitDate: string;
  serviceType: string;
  purpose: string;
  email: string;
  address: string;
  phone: string;
  equipment: ServicePackageRecordEquipment[];
  observations: string | null;
  createdAt: string;
  synced: boolean | number;
  hasCollectorSignature: boolean;
  hasClientSignature: boolean;
  raw?: Record<string, unknown>;
}

export interface ServicePackageRecord {
  id: string;
  packageId: string;
  serviceOrder: string;
  originalFilename: string;
  folderKey: string;
  company: string;
  collectorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  visitDate: string;
  serviceType: string;
  purpose: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  files: ServicePackageRecordFile[];
  details: ServicePackageRecordDetails | null;
}

export interface ServicePackagesRecordsPagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
