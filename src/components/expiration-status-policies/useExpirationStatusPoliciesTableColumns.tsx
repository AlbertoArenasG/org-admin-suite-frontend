'use client';

import { useMemo } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { Column, ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';

import { ExpirationStatusPoliciesTableRowActions } from '@/components/expiration-status-policies/ExpirationStatusPoliciesTableRowActions';
import type { ExpirationStatusPoliciesTableRow } from '@/components/expiration-status-policies/types';

type Translate = TFunction<'expirationStatusPolicies', undefined>;

interface UseExpirationStatusPoliciesTableColumnsParams {
  t: Translate;
  dateFormatter: Intl.DateTimeFormat;
  canUpdate: boolean;
  canDelete: boolean;
  onDelete: (policy: ExpirationStatusPoliciesTableRow) => void;
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
      className="flex items-center gap-1.5 text-left font-semibold"
    >
      {title}
      <Icon className="size-3 text-muted-foreground" />
    </button>
  );
}

export function useExpirationStatusPoliciesTableColumns({
  t,
  dateFormatter,
  canUpdate,
  canDelete,
  onDelete,
}: UseExpirationStatusPoliciesTableColumnsParams) {
  return useMemo<ColumnDef<ExpirationStatusPoliciesTableRow>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortingHeader title={t('table.columns.name')} column={column} />,
        meta: {
          label: t('table.columns.name'),
        },
        cell: ({ row }) => (
          <div className="space-y-1">
            <span className="block font-medium text-foreground">{row.original.name}</span>
            {row.original.description ? (
              <span className="block text-xs text-muted-foreground">
                {row.original.description}
              </span>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <SortingHeader title={t('table.columns.status')} column={column} />,
        meta: {
          label: t('table.columns.status'),
        },
        cell: ({ row }) => (
          <Chip
            size="small"
            color={row.original.statusId === 'ACTIVE' ? 'success' : 'default'}
            variant="outlined"
            label={row.original.statusLabel}
          />
        ),
      },
      {
        accessorKey: 'rulesCount',
        header: t('table.columns.rulesCount'),
        meta: {
          label: t('table.columns.rulesCount'),
        },
        cell: ({ row }) => row.original.rulesCount,
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <SortingHeader title={t('table.columns.createdAt')} column={column} />
        ),
        meta: {
          label: t('table.columns.createdAt'),
        },
        cell: ({ row }) => {
          if (!row.original.createdAt) {
            return '—';
          }

          const date = new Date(row.original.createdAt);
          if (Number.isNaN(date.getTime())) {
            return row.original.createdAt;
          }

          return dateFormatter.format(date);
        },
      },
      {
        accessorKey: 'updatedAt',
        header: t('table.columns.updatedAt'),
        meta: {
          label: t('table.columns.updatedAt'),
        },
        cell: ({ row }) => {
          if (!row.original.updatedAt) {
            return '—';
          }

          const date = new Date(row.original.updatedAt);
          if (Number.isNaN(date.getTime())) {
            return row.original.updatedAt;
          }

          return dateFormatter.format(date);
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        header: () => <span className="sr-only">{t('actions.openMenu')}</span>,
        cell: ({ row }) => (
          <Stack direction="row" justifyContent="flex-end">
            <ExpirationStatusPoliciesTableRowActions
              policy={row.original}
              canUpdate={canUpdate}
              canDelete={canDelete}
              onDelete={onDelete}
              labels={{
                menu: t('actions.openMenu'),
                view: t('actions.view'),
                edit: t('actions.edit'),
                delete: t('actions.delete'),
              }}
            />
          </Stack>
        ),
      },
    ],
    [canDelete, canUpdate, dateFormatter, onDelete, t]
  );
}
