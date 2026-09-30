import Link from 'next/link';

import type { DataTableColumn } from '@/components/data-table';
import type { ServicePackageRecordListItem } from '@/features/servicePackagesRecords';

type ServicePackagesRecordsColumnLabels = {
  serviceOrder: string;
  serviceType: string;
  company: string;
  collector: string;
  visitDate: string;
  createdAt: string;
  empty: string;
};

function formatDate(value: string | null, formatter: Intl.DateTimeFormat, empty: string) {
  if (!value) return empty;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : formatter.format(date);
}

export function createServicePackagesRecordsColumns({
  labels,
  dateFormatter,
}: {
  labels: ServicePackagesRecordsColumnLabels;
  dateFormatter: Intl.DateTimeFormat;
}): DataTableColumn<ServicePackageRecordListItem>[] {
  return [
    {
      id: 'serviceOrder',
      header: labels.serviceOrder,
      ariaLabel: labels.serviceOrder,
      accessor: (row) => row.serviceOrder,
      cell: (row, { highlight }) => (
        <Link
          href={`/dashboard/service-packages-records/${row.id}`}
          className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline"
        >
          {highlight(row.serviceOrder || labels.empty)}
        </Link>
      ),
      width: { initial: 168, min: 132, max: 260, resizable: true },
      visibility: { hideable: false },
      textBehavior: 'truncate',
    },
    {
      id: 'serviceType',
      header: labels.serviceType,
      ariaLabel: labels.serviceType,
      accessor: (row) => row.serviceType ?? '',
      cell: (row, { highlight }) => (
        <span className="block truncate" title={row.serviceType ?? undefined}>
          {highlight(row.serviceType ?? labels.empty)}
        </span>
      ),
      width: { initial: 224, min: 160, max: 360, resizable: true },
      textBehavior: 'truncate',
    },
    {
      id: 'company',
      header: labels.company,
      ariaLabel: labels.company,
      accessor: (row) => row.company ?? '',
      cell: (row, { highlight }) => (
        <span className="block truncate" title={row.company ?? undefined}>
          {highlight(row.company ?? labels.empty)}
        </span>
      ),
      width: { initial: 260, min: 180, max: 440, resizable: true },
      textBehavior: 'truncate',
    },
    {
      id: 'collectorName',
      header: labels.collector,
      ariaLabel: labels.collector,
      accessor: (row) => row.collectorName ?? '',
      cell: (row, { highlight }) => (
        <span className="block truncate" title={row.collectorName ?? undefined}>
          {highlight(row.collectorName ?? labels.empty)}
        </span>
      ),
      width: { initial: 220, min: 160, max: 360, resizable: true },
      textBehavior: 'truncate',
    },
    {
      id: 'visitDate',
      header: labels.visitDate,
      ariaLabel: labels.visitDate,
      accessor: (row) => row.visitDate ?? '',
      cell: (row) => formatDate(row.visitDate, dateFormatter, labels.empty),
      width: { initial: 152, min: 140, max: 208, resizable: true },
      textBehavior: 'nowrap',
    },
    {
      id: 'createdAt',
      header: labels.createdAt,
      ariaLabel: labels.createdAt,
      accessor: (row) => row.createdAt ?? '',
      cell: (row) => formatDate(row.createdAt, dateFormatter, labels.empty),
      width: { initial: 152, min: 140, max: 208, resizable: true },
      textBehavior: 'nowrap',
    },
  ];
}
