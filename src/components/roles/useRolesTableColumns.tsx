'use client';

import { useMemo } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { Column, ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';

import type { RolesTableRow } from '@/components/roles/types';
import { RolesTableRowActions } from '@/components/roles/RolesTableRowActions';

type Translate = TFunction<'roles', undefined>;

interface UseRolesTableColumnsParams {
  t: Translate;
  dateFormatter: Intl.DateTimeFormat;
  canUpdate: boolean;
  canDelete: boolean;
  onDelete: (role: RolesTableRow) => void;
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

export function useRolesTableColumns({
  t,
  dateFormatter,
  canUpdate,
  canDelete,
  onDelete,
}: UseRolesTableColumnsParams) {
  return useMemo<ColumnDef<RolesTableRow>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortingHeader title={t('table.columns.name')} column={column} />,
        meta: {
          label: t('table.columns.name'),
        },
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <span className="font-medium text-foreground">{row.original.name}</span>
            <div className="flex flex-wrap gap-1">
              {row.original.isSystem ? (
                <Chip size="small" variant="outlined" label={t('badges.system')} />
              ) : null}
              {row.original.isDefault ? (
                <Chip size="small" variant="outlined" label={t('badges.default')} />
              ) : null}
              <Chip
                size="small"
                color={row.original.isImmutable ? 'warning' : 'success'}
                variant="outlined"
                label={t(row.original.isImmutable ? 'badges.immutable' : 'badges.mutable')}
              />
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'code',
        header: ({ column }) => <SortingHeader title={t('table.columns.code')} column={column} />,
        meta: {
          label: t('table.columns.code'),
        },
        cell: ({ getValue }) => <span className="font-mono text-xs">{getValue<string>()}</span>,
      },
      {
        accessorKey: 'scope',
        header: ({ column }) => <SortingHeader title={t('table.columns.scope')} column={column} />,
        meta: {
          label: t('table.columns.scope'),
        },
        cell: ({ row }) => (
          <Chip
            size="small"
            variant="outlined"
            label={t(`scopes.${row.original.scope}`, { defaultValue: row.original.scope })}
          />
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <SortingHeader title={t('table.columns.status')} column={column} />,
        meta: {
          label: t('table.columns.status'),
        },
        cell: ({ row }) => {
          const color =
            row.original.statusId === 'ACTIVE'
              ? 'success'
              : row.original.statusId === 'INACTIVE'
                ? 'default'
                : 'warning';

          return (
            <Chip size="small" color={color} variant="outlined" label={row.original.statusLabel} />
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
        id: 'actions',
        enableHiding: false,
        header: () => <span className="sr-only">{t('actions.openMenu')}</span>,
        cell: ({ row }) => (
          <Stack direction="row" justifyContent="flex-end">
            <RolesTableRowActions
              role={row.original}
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
