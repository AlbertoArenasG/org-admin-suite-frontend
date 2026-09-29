'use client';

import { useMemo } from 'react';
import type { ServicePackageRecordListItem } from '@/features/servicePackagesRecords';

export interface ServicePackagesRecordsTableRow {
  id: string;
  serviceOrder: string;
  serviceType: string;
  company: string;
  collectorName: string;
  visitDate: string;
  createdAt: string;
}

export function useServicePackagesRecordsTableData(records: ServicePackageRecordListItem[]) {
  return useMemo<ServicePackagesRecordsTableRow[]>(() => {
    return records.map((record) => ({
      id: record.id,
      serviceOrder: record.serviceOrder,
      serviceType: record.serviceType,
      company: record.company,
      collectorName: record.collectorName,
      visitDate: record.visitDate,
      createdAt: record.createdAt,
    }));
  }, [records]);
}
