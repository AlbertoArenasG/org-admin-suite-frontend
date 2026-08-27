'use client';

import { useMemo } from 'react';
import Chip from '@mui/material/Chip';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { Column, ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';

import type { UsersTableUser } from '@/components/users2/types';
import { ClassificationBadges } from '@/components/classification/ClassificationBadges';
import type { AuthSystemRole } from '@/features/auth/types';
import { UsersTableRowActions } from '@/components/users2/UsersTableRowActions';

type Translate = TFunction<'users', undefined>;

interface UseUsersTableColumnsParams {
  t: Translate;
  dateFormatter: Intl.DateTimeFormat;
  currentRole: AuthSystemRole | null;
  currentUserId: string | null;
  canInviteUsers: boolean;
  canUpdateUsers: boolean;
  canDeleteUsers: boolean;
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
  canInviteUsers,
  canUpdateUsers,
  canDeleteUsers,
  onDelete,
}: UseUsersTableColumnsParams) {
  return useMemo<ColumnDef<UsersTableUser>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: ({ column }) => (
          <SortingHeader title={t('table.columns.fullName')} column={column} />
        ),
        meta: {
          label: t('table.columns.fullName'),
        },
        cell: ({ getValue }) => (
          <span className="font-medium text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: 'classification',
        enableHiding: false,
        header: () => <span className="sr-only">{t('classification.group')}</span>,
        cell: ({ row }) => (
          <ClassificationBadges
            isInternalStaff={row.original.isInternalStaff}
            systemRole={row.original.systemRole}
            labels={{
              group: t('classification.group'),
              internalStaff: t('classification.internalStaff'),
              administrator: t('classification.administrator'),
            }}
          />
        ),
      },
      {
        accessorKey: 'email',
        header: ({ column }) => <SortingHeader title={t('table.columns.email')} column={column} />,
        meta: {
          label: t('table.columns.email'),
        },
        cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
      },
      {
        accessorKey: 'roleName',
        header: ({ column }) => <SortingHeader title={t('table.columns.role')} column={column} />,
        meta: {
          label: t('table.columns.role'),
        },
      },
      {
        accessorKey: 'statusName',
        header: ({ column }) => <SortingHeader title={t('table.columns.status')} column={column} />,
        meta: {
          label: t('table.columns.status'),
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
          <SortingHeader title={t('table.columns.createdAt')} column={column} />
        ),
        meta: {
          label: t('table.columns.createdAt'),
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
        header: () => <span className="sr-only">{t('actions.openMenu')}</span>,
        cell: ({ row }) => (
          <UsersTableRowActions
            user={row.original}
            currentRole={currentRole}
            currentUserId={currentUserId}
            canInviteUsers={canInviteUsers}
            canUpdateUsers={canUpdateUsers}
            canDeleteUsers={canDeleteUsers}
            onDelete={onDelete}
            labels={{
              menu: t('actions.openMenu'),
              view: t('actions.view') ?? 'Ver',
              edit: t('actions.edit'),
              invite: t('actions.invite'),
              delete: t('actions.delete'),
            }}
          />
        ),
      },
    ],
    [
      canDeleteUsers,
      canInviteUsers,
      canUpdateUsers,
      currentRole,
      currentUserId,
      dateFormatter,
      onDelete,
      t,
    ]
  );
}
