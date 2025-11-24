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

type Translate = TFunction<'common', undefined>;

interface UseServicePackagesRecordsTableColumnsParams {
  t: Translate;
  dateFormatter: Intl.DateTimeFormat;
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

const STATUS_COLOR_MAP: Record<string, string> = {
  ACTIVE: 'text-success-700 bg-success-50',
  DELETED: 'text-error-700 bg-error-50',
};

export function useServicePackagesRecordsTableColumns({
  t,
  dateFormatter,
  onView,
  onDelete,
}: UseServicePackagesRecordsTableColumnsParams) {
  return useMemo<ColumnDef<ServicePackagesRecordsTableRow>[]>(
    () => [
      {
        accessorKey: 'serviceOrder',
        header: ({ column }) => (
          <SortingHeader
            title={t('servicePackagesRecords.table.columns.serviceOrder')}
            column={column}
          />
        ),
        meta: {
          label: t('servicePackagesRecords.table.columns.serviceOrder'),
        },
        cell: ({ getValue }) => (
          <span className="inline-flex items-center gap-2 font-mono text-sm">
            <FileText className="size-4 text-muted-foreground" />
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'company',
        header: ({ column }) => (
          <SortingHeader
            title={t('servicePackagesRecords.table.columns.company')}
            column={column}
          />
        ),
        meta: {
          label: t('servicePackagesRecords.table.columns.company'),
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
          <SortingHeader
            title={t('servicePackagesRecords.table.columns.collector')}
            column={column}
          />
        ),
        meta: {
          label: t('servicePackagesRecords.table.columns.collector'),
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
          <SortingHeader
            title={t('servicePackagesRecords.table.columns.visitDate')}
            column={column}
          />
        ),
        meta: {
          label: t('servicePackagesRecords.table.columns.visitDate'),
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
        accessorKey: 'status',
        enableSorting: false,
        header: () => t('servicePackagesRecords.table.columns.status'),
        meta: {
          label: t('servicePackagesRecords.table.columns.status'),
        },
        cell: ({ getValue }) => {
          const status = getValue<string>();
          const normalized = status?.toUpperCase?.() ?? '';
          return (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
                STATUS_COLOR_MAP[normalized] ?? 'bg-primary/10 text-primary'
              )}
            >
              {status || '—'}
            </span>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <SortingHeader
            title={t('servicePackagesRecords.table.columns.createdAt')}
            column={column}
          />
        ),
        meta: {
          label: t('servicePackagesRecords.table.columns.createdAt'),
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
        header: () => (
          <span className="sr-only">{t('servicePackagesRecords.table.columns.actions')}</span>
        ),
        cell: ({ row }) => (
          <RecordsRowActions
            onView={() => onView(row.original.id)}
            onDelete={() => onDelete(row.original.id)}
            labels={{
              menu: t('servicePackagesRecords.actions.openMenu'),
              view: t('servicePackagesRecords.actions.view'),
              delete: t('servicePackagesRecords.actions.delete'),
            }}
          />
        ),
      },
    ],
    [dateFormatter, onDelete, onView, t]
  );
}
