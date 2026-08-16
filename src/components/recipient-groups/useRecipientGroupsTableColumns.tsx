'use client';

import { useMemo } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { Column, ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';

import type { RecipientGroupsTableRow } from '@/components/recipient-groups/types';
import { RecipientGroupsTableRowActions } from '@/components/recipient-groups/RecipientGroupsTableRowActions';

type Translate = TFunction<'recipientGroups', undefined>;

interface UseRecipientGroupsTableColumnsParams {
  t: Translate;
  dateFormatter: Intl.DateTimeFormat;
  canUpdate: boolean;
  canDelete: boolean;
  onDelete: (recipientGroup: RecipientGroupsTableRow) => void;
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

export function useRecipientGroupsTableColumns({
  t,
  dateFormatter,
  canUpdate,
  canDelete,
  onDelete,
}: UseRecipientGroupsTableColumnsParams) {
  return useMemo<ColumnDef<RecipientGroupsTableRow>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortingHeader title={t('table.columns.name')} column={column} />,
        meta: {
          label: t('table.columns.name'),
        },
        cell: ({ row }) => <span className="font-medium text-foreground">{row.original.name}</span>,
      },
      {
        accessorKey: 'channelsLabel',
        header: t('table.columns.channels'),
        meta: {
          label: t('table.columns.channels'),
        },
        cell: ({ row }) =>
          row.original.enabledChannels.length ? (
            <div className="flex flex-wrap gap-1">
              {row.original.enabledChannels.map((channel) => (
                <Chip key={channel.code} size="small" variant="outlined" label={channel.name} />
              ))}
            </div>
          ) : (
            '—'
          ),
      },
      {
        accessorKey: 'contactsCount',
        header: t('table.columns.contactsCount'),
        meta: {
          label: t('table.columns.contactsCount'),
        },
        cell: ({ row }) => row.original.contactsCount,
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
            <RecipientGroupsTableRowActions
              recipientGroup={row.original}
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
