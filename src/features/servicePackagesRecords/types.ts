'use client';

export interface ServicePackageRecord {
  id: string;
  serviceOrder: string;
  company: string;
  collectorName: string;
  visitDate: string;
  serviceType: string;
  createdAt: string;
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
