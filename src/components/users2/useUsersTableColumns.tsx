'use client';

import { useMemo } from 'react';
import Chip from '@mui/material/Chip';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { Column, ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';

import type { UsersTableUser } from '@/components/users2/types';
import type { UserRole } from '@/features/users/roles';
import { UsersTableRowActions } from '@/components/users2/UsersTableRowActions';

type Translate = TFunction<'common', undefined>;

interface UseUsersTableColumnsParams {
  t: Translate;
  dateFormatter: Intl.DateTimeFormat;
  currentRole: UserRole | null;
  currentUserId: string | null;
  onDelete: (user: UsersTableUser) => void;
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

export function useUsersTableColumns({
  t,
  dateFormatter,
  currentRole,
  currentUserId,
  onDelete,
}: UseUsersTableColumnsParams) {
  return useMemo<ColumnDef<UsersTableUser>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: ({ column }) => (
          <SortingHeader title={t('users.table.columns.fullName')} column={column} />
        ),
        meta: {
          label: t('users.table.columns.fullName'),
        },
        cell: ({ getValue }) => (
          <span className="font-medium text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'email',
        header: ({ column }) => (
          <SortingHeader title={t('users.table.columns.email')} column={column} />
        ),
        meta: {
          label: t('users.table.columns.email'),
        },
        cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
      },
      {
        accessorKey: 'roleName',
        header: ({ column }) => (
          <SortingHeader title={t('users.table.columns.role')} column={column} />
        ),
        meta: {
          label: t('users.table.columns.role'),
        },
      },
      {
        accessorKey: 'statusName',
        header: ({ column }) => (
          <SortingHeader title={t('users.table.columns.status')} column={column} />
        ),
        meta: {
          label: t('users.table.columns.status'),
        },
        cell: ({ row }) => {
          const normalized = (row.original.status ?? '').toLowerCase();
          const color =
            normalized === 'active' ? 'success' : normalized === 'inactive' ? 'default' : 'warning';
          return (
            <Chip color={color} variant="outlined" size="small" label={row.original.statusName} />
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <SortingHeader title={t('users.table.columns.createdAt')} column={column} />
        ),
        meta: {
          label: t('users.table.columns.createdAt'),
        },
        cell: ({ getValue }) => {
          const raw = getValue<string>();
          const date = new Date(raw);
          if (Number.isNaN(date.getTime())) {
            return raw;
          }
          return dateFormatter.format(date);
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        header: () => <span className="sr-only">{t('users.actions.openMenu')}</span>,
        cell: ({ row }) => (
          <UsersTableRowActions
            user={row.original}
            currentRole={currentRole}
            currentUserId={currentUserId}
            onDelete={onDelete}
            labels={{
              menu: t('users.actions.openMenu'),
              view: t('users.actions.view') ?? 'Ver',
              edit: t('users.actions.edit'),
              invite: t('users.actions.invite'),
              delete: t('users.actions.delete'),
            }}
          />
        ),
      },
    ],
    [currentRole, currentUserId, dateFormatter, onDelete, t]
  );
}
