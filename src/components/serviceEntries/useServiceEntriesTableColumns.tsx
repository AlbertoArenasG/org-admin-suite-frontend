'use client';

import { useMemo } from 'react';
import type { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, Clock, Download } from 'lucide-react';
import type { TFunction } from 'i18next';
import type { ServiceEntriesTableRow } from '@/components/serviceEntries/useServiceEntriesTableData';
import { ServiceEntriesRowActions } from '@/components/serviceEntries/ServiceEntriesRowActions';
import type { UserRole } from '@/features/users/roles';
import { cn } from '@/lib/utils';

type Translate = TFunction<'common', undefined>;

interface UseServiceEntriesTableColumnsParams {
  t: Translate;
  dateFormatter: Intl.DateTimeFormat;
  currentRole: UserRole | null;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
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

export function useServiceEntriesTableColumns({
  t,
  dateFormatter,
  currentRole,
  onView,
  onEdit,
  onDelete,
}: UseServiceEntriesTableColumnsParams) {
  const canManage = currentRole && currentRole !== 'CUSTOMER';

  return useMemo<ColumnDef<ServiceEntriesTableRow>[]>(
    () => [
      {
        accessorKey: 'companyName',
        header: ({ column }) => (
          <SortingHeader title={t('serviceEntries.table.columns.companyName')} column={column} />
        ),
        meta: {
          label: t('serviceEntries.table.columns.companyName'),
        },
      },
      {
        accessorKey: 'serviceOrderIdentifier',
        header: ({ column }) => (
          <SortingHeader title={t('serviceEntries.table.columns.serviceOrder')} column={column} />
        ),
        meta: {
          label: t('serviceEntries.table.columns.serviceOrder'),
        },
        cell: ({ getValue }) => <span className="font-mono text-sm">{getValue<string>()}</span>,
      },
      {
        accessorKey: 'contactName',
        header: ({ column }) => (
          <SortingHeader title={t('serviceEntries.table.columns.contactName')} column={column} />
        ),
        meta: {
          label: t('serviceEntries.table.columns.contactName'),
        },
      },
      {
        accessorKey: 'categoryName',
        header: ({ column }) => (
          <SortingHeader title={t('serviceEntries.table.columns.category')} column={column} />
        ),
        meta: {
          label: t('serviceEntries.table.columns.category'),
        },
      },
      {
        accessorKey: 'statusName',
        header: ({ column }) => (
          <SortingHeader title={t('serviceEntries.table.columns.status')} column={column} />
        ),
        meta: {
          label: t('serviceEntries.table.columns.status'),
        },
        cell: ({ getValue }) => (
          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <SortingHeader title={t('serviceEntries.table.columns.createdAt')} column={column} />
        ),
        meta: {
          label: t('serviceEntries.table.columns.createdAt'),
        },
        cell: ({ getValue }) => {
          const value = getValue<string>();
          const date = new Date(value);
          if (Number.isNaN(date.getTime())) {
            return value;
          }
          return dateFormatter.format(date);
        },
      },
      {
        id: 'surveyStatus',
        enableSorting: false,
        header: () => t('serviceEntries.table.columns.surveyStatus'),
        meta: {
          label: t('serviceEntries.table.columns.surveyStatus'),
        },
        cell: ({ row }) => {
          const survey = row.original.surveyStatus;
          if (!survey) {
            return (
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                {t('serviceEntries.table.survey.notStarted')}
              </span>
            );
          }
          if (survey.completed) {
            return (
              <span className="inline-flex items-center gap-2 text-xs font-medium text-primary">
                <CheckCircle2 className="size-3.5" />
                {survey.submitted_at
                  ? t('serviceEntries.table.survey.completedAt', {
                      date: dateFormatter.format(new Date(survey.submitted_at)),
                    })
                  : t('serviceEntries.table.survey.completed')}
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              {t('serviceEntries.table.survey.pending')}
            </span>
          );
        },
      },
      {
        id: 'downloadStatus',
        enableSorting: false,
        header: () => t('serviceEntries.table.columns.downloadStatus'),
        meta: {
          label: t('serviceEntries.table.columns.downloadStatus'),
        },
        cell: ({ row }) => {
          const download = row.original.downloadStatus;
          if (!download) {
            return (
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Download className="size-3.5" />
                {t('serviceEntries.table.download.unavailable')}
              </span>
            );
          }
          if (download.has_download) {
            return (
              <span className="inline-flex items-center gap-2 text-xs font-medium text-primary">
                <Download className="size-3.5" />
                {t('serviceEntries.table.download.count', {
                  count: download.download_count ?? 0,
                })}
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Download className="size-3.5" />
              {t('serviceEntries.table.download.never')}
            </span>
          );
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        header: () => <span className="sr-only">{t('serviceEntries.actions.openMenu')}</span>,
        cell: ({ row }) => (
          <ServiceEntriesRowActions
            entryId={row.original.id}
            canManage={Boolean(canManage)}
            onView={() => onView(row.original.id)}
            onEdit={() => onEdit(row.original.id)}
            onDelete={() => onDelete(row.original.id)}
            labels={{
              menu: t('serviceEntries.actions.openMenu'),
              view: t('serviceEntries.actions.view'),
              edit: t('serviceEntries.actions.edit'),
              delete: t('serviceEntries.actions.delete'),
            }}
          />
        ),
      },
    ],
    [canManage, dateFormatter, onDelete, onEdit, onView, t]
  );
}
