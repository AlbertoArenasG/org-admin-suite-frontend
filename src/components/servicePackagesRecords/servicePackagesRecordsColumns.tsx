import Link from 'next/link';
import { Building2, CalendarDays, FileText, UserRound } from 'lucide-react';

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

function getCellCompositionClasses(density: 'compact' | 'comfortable') {
  return {
    icon: density === 'compact' ? 'size-3.5' : 'size-4',
    gap: density === 'compact' ? 'gap-1.5' : 'gap-2',
  };
}

function TableCellContent({
  children,
  density,
  icon: Icon,
  title,
}: {
  children: React.ReactNode;
  density: 'compact' | 'comfortable';
  icon: typeof FileText;
  title?: string;
}) {
  const classes = getCellCompositionClasses(density);

  return (
    <span className={`flex min-w-0 items-center ${classes.gap}`} title={title}>
      <Icon aria-hidden="true" className={`${classes.icon} shrink-0 text-muted-foreground`} />
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

export function createServicePackagesRecordsColumns({
  labels,
  dateFormatter,
  density,
}: {
  labels: ServicePackagesRecordsColumnLabels;
  dateFormatter: Intl.DateTimeFormat;
  density: 'compact' | 'comfortable';
}): DataTableColumn<ServicePackageRecordListItem>[] {
  const cellClasses = getCellCompositionClasses(density);

  return [
    {
      id: 'serviceOrder',
      header: labels.serviceOrder,
      ariaLabel: labels.serviceOrder,
      accessor: (row) => row.serviceOrder,
      cell: (row, { highlight }) => (
        <Link
          href={`/dashboard/service-packages-records/${row.id}`}
          title={row.serviceOrder || labels.empty}
          className={`flex min-w-0 items-center ${cellClasses.gap} font-mono text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline`}
        >
          <FileText
            aria-hidden="true"
            className={`${cellClasses.icon} shrink-0 text-muted-foreground transition-colors`}
          />
          <span className="min-w-0 truncate">{highlight(row.serviceOrder || labels.empty)}</span>
        </Link>
      ),
      width: { initial: 320, min: 220, max: 560, resizable: true },
      visibility: { hideable: false },
      textBehavior: 'truncate',
    },
    {
      id: 'serviceType',
      header: labels.serviceType,
      ariaLabel: labels.serviceType,
      accessor: (row) => row.serviceType ?? '',
      cell: (row, { highlight }) => (
        <span className="block truncate" title={row.serviceType ?? labels.empty}>
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
        <TableCellContent density={density} icon={Building2} title={row.company ?? labels.empty}>
          {highlight(row.company ?? labels.empty)}
        </TableCellContent>
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
        <TableCellContent
          density={density}
          icon={UserRound}
          title={row.collectorName ?? labels.empty}
        >
          {highlight(row.collectorName ?? labels.empty)}
        </TableCellContent>
      ),
      width: { initial: 220, min: 160, max: 360, resizable: true },
      textBehavior: 'truncate',
    },
    {
      id: 'visitDate',
      header: labels.visitDate,
      ariaLabel: labels.visitDate,
      accessor: (row) => row.visitDate ?? '',
      cell: (row) => {
        const value = formatDate(row.visitDate, dateFormatter, labels.empty);
        return (
          <TableCellContent density={density} icon={CalendarDays} title={value}>
            {value}
          </TableCellContent>
        );
      },
      width: { initial: 152, min: 140, max: 208, resizable: true },
      textBehavior: 'nowrap',
    },
    {
      id: 'createdAt',
      header: labels.createdAt,
      ariaLabel: labels.createdAt,
      accessor: (row) => row.createdAt ?? '',
      cell: (row) => {
        const value = formatDate(row.createdAt, dateFormatter, labels.empty);
        return (
          <TableCellContent density={density} icon={CalendarDays} title={value}>
            {value}
          </TableCellContent>
        );
      },
      width: { initial: 152, min: 140, max: 208, resizable: true },
      textBehavior: 'nowrap',
    },
  ];
}
