'use client';

import { useMemo } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { Column, ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';

import type { ContactsTableRow } from '@/components/contacts/types';
import { ClassificationBadges } from '@/components/classification/ClassificationBadges';
import { ContactsTableRowActions } from '@/components/contacts/ContactsTableRowActions';
import { CompanyNamesSummary } from '@/components/contacts/CompanyNamesSummary';

type Translate = TFunction<'contacts', undefined>;

interface UseContactsTableColumnsParams {
  t: Translate;
  dateFormatter: Intl.DateTimeFormat;
  canUpdate: boolean;
  canDelete: boolean;
  onDelete: (contact: ContactsTableRow) => void;
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

export function useContactsTableColumns({
  t,
  dateFormatter,
  canUpdate,
  canDelete,
  onDelete,
}: UseContactsTableColumnsParams) {
  return useMemo<ColumnDef<ContactsTableRow>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: ({ column }) => (
          <SortingHeader title={t('table.columns.fullName')} column={column} />
        ),
        meta: {
          label: t('table.columns.fullName'),
        },
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <span className="font-medium text-foreground">{row.original.fullName}</span>
            <CompanyNamesSummary companyNames={row.original.companyNames} />
          </div>
        ),
      },
      {
        id: 'classification',
        enableHiding: false,
        header: () => <span className="sr-only">{t('classification.group')}</span>,
        cell: ({ row }) => (
          <ClassificationBadges
            isInternalStaff={row.original.isInternalStaff}
            labels={{
              group: t('classification.group'),
              internalStaff: t('classification.internalStaff'),
              administrator: t('classification.administrator'),
            }}
          />
        ),
      },
      {
        accessorKey: 'primaryEmail',
        header: t('table.columns.primaryEmail'),
        meta: {
          label: t('table.columns.primaryEmail'),
        },
        cell: ({ row }) => row.original.primaryEmail ?? '—',
      },
      {
        accessorKey: 'primaryCellPhone',
        header: t('table.columns.primaryCellPhone'),
        meta: {
          label: t('table.columns.primaryCellPhone'),
        },
        cell: ({ row }) => row.original.primaryCellPhone ?? '—',
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
            <ContactsTableRowActions
              contact={row.original}
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
