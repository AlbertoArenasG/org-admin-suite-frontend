'use client';

import { useMemo } from 'react';
import type { Column, ColumnDef } from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarClock,
  FileText,
  User,
  Building2,
} from 'lucide-react';
import type { TFunction } from 'i18next';
import type { ServicePackagesRecordsTableRow } from '@/components/servicePackagesRecords/useServicePackagesRecordsTableData';
import { RecordsRowActions } from '@/components/servicePackagesRecords/RecordsRowActions';
import { cn } from '@/lib/utils';

type Translate = TFunction<'servicePackagesRecords', undefined>;

interface UseServicePackagesRecordsTableColumnsParams {
  t: Translate;
  dateFormatter: Intl.DateTimeFormat;
  canDelete: boolean;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

function SortingHeader<TData>({
  title,
  column,
}: {
  title: string;
  column: Column<TData, unknown>;
}) {
  const sorted = column.getIsSorted();
  const Icon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown;

  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className={cn('flex items-center gap-1.5 text-left font-semibold')}
    >
      {title}
      <Icon className="size-3 text-muted-foreground" />
    </button>
  );
}

export function useServicePackagesRecordsTableColumns({
  t,
  dateFormatter,
  canDelete,
  onView,
  onDelete,
}: UseServicePackagesRecordsTableColumnsParams) {
  return useMemo<ColumnDef<ServicePackagesRecordsTableRow>[]>(
    () => [
      {
        accessorKey: 'serviceOrder',
        header: ({ column }) => (
          <SortingHeader title={t('table.columns.serviceOrder')} column={column} />
        ),
        meta: {
          label: t('table.columns.serviceOrder'),
        },
        cell: ({ getValue }) => (
          <span className="inline-flex items-center gap-2 font-mono text-sm">
            <FileText className="size-4 text-muted-foreground" />
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'serviceType',
        header: ({ column }) => (
          <SortingHeader title={t('table.columns.serviceType')} column={column} />
        ),
        meta: {
          label: t('table.columns.serviceType'),
        },
        cell: ({ getValue }) => getValue<string>() || '—',
      },
      {
        accessorKey: 'company',
        header: ({ column }) => (
          <SortingHeader title={t('table.columns.company')} column={column} />
        ),
        meta: {
          label: t('table.columns.company'),
        },
        cell: ({ getValue }) => (
          <span className="inline-flex items-center gap-2">
            <Building2 className="size-4 text-muted-foreground" />
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'collectorName',
        header: ({ column }) => (
          <SortingHeader title={t('table.columns.collector')} column={column} />
        ),
        meta: {
          label: t('table.columns.collector'),
        },
        cell: ({ getValue }) => (
          <span className="inline-flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'visitDate',
        header: ({ column }) => (
          <SortingHeader title={t('table.columns.visitDate')} column={column} />
        ),
        meta: {
          label: t('table.columns.visitDate'),
        },
        cell: ({ getValue }) => {
          const raw = getValue<string>();
          const date = raw ? new Date(raw) : null;
          return (
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarClock className="size-4" />
              {date && !Number.isNaN(date.getTime()) ? dateFormatter.format(date) : raw || '—'}
            </span>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <SortingHeader title={t('table.columns.createdAt')} column={column} />
        ),
        meta: {
          label: t('table.columns.createdAt'),
        },
        cell: ({ getValue }) => {
          const raw = getValue<string>();
          const date = raw ? new Date(raw) : null;
          return date && !Number.isNaN(date.getTime()) ? dateFormatter.format(date) : raw || '—';
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        header: () => <span className="sr-only">{t('table.columns.actions')}</span>,
        cell: ({ row }) => (
          <RecordsRowActions
            canDelete={canDelete}
            onView={() => onView(row.original.id)}
            onDelete={() => onDelete(row.original.id)}
            labels={{
              menu: t('actions.openMenu'),
              view: t('actions.view'),
              delete: t('actions.delete'),
            }}
          />
        ),
      },
    ],
    [canDelete, dateFormatter, onDelete, onView, t]
  );
}
