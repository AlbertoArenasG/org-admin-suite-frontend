'use client';

import { useMemo } from 'react';
import type { ServiceEntry } from '@/features/serviceEntries/serviceEntriesSlice';

export interface ServiceEntriesTableRow {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  categoryName: string;
  statusName: string;
  createdAt: string;
  updatedAt: string | null;
  serviceOrderIdentifier: string;
}

export function useServiceEntriesTableData(entries: ServiceEntry[]): ServiceEntriesTableRow[] {
  return useMemo(
    () =>
      entries.map((entry) => ({
        id: entry.id,
        companyName: entry.companyName,
        contactName: entry.contactName,
        contactEmail: entry.contactEmail,
        categoryName: entry.categoryName,
        statusName: entry.statusName,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
        serviceOrderIdentifier: entry.serviceOrderIdentifier,
      })),
    [entries]
  );
}
