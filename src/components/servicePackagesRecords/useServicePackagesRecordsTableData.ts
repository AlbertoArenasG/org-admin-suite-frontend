'use client';

import { useMemo } from 'react';
import type { ServicePackageRecord } from '@/features/servicePackagesRecords';

export interface ServicePackagesRecordsTableRow {
  id: string;
  serviceOrder: string;
  company: string;
  collectorName: string;
  visitDate: string;
  status: string;
  createdAt: string;
}

export function useServicePackagesRecordsTableData(records: ServicePackageRecord[]) {
  return useMemo<ServicePackagesRecordsTableRow[]>(() => {
    return records.map((record) => ({
      id: record.id,
      serviceOrder: record.serviceOrder,
      company: record.company,
      collectorName: record.collectorName,
      visitDate: record.visitDate,
      status: record.status,
      createdAt: record.createdAt,
    }));
  }, [records]);
}
