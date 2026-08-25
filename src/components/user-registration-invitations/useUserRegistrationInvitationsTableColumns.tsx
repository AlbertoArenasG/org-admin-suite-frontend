'use client';

import { useMemo } from 'react';
import Chip from '@mui/material/Chip';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Clock3,
  Mail,
  MailCheck,
  MailWarning,
  MailX,
} from 'lucide-react';
import type { Column, ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';

import type { UserRegistrationInvitationsTableRow } from './types';

type Translate = TFunction<'userRegistrationInvitations', undefined>;

interface UseUserRegistrationInvitationsTableColumnsParams {
  t: Translate;
  dateFormatter: Intl.DateTimeFormat;
  dateTimeFormatter: Intl.DateTimeFormat;
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

function formatDate(value: string | null, formatter: Intl.DateTimeFormat) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : formatter.format(date);
}

function PendingMailIcon({ className }: { className?: string }) {
  return (
    <span className={`relative inline-flex size-4 shrink-0 ${className ?? ''}`} aria-hidden="true">
      <Mail className="size-4" />
      <Clock3 className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-background" />
    </span>
  );
}

function getLifecycleIcon(status: UserRegistrationInvitationsTableRow['status']) {
  switch (status) {
    case 'CONSUMED':
      return MailCheck;
    case 'REVOKED':
      return MailX;
    default:
      return PendingMailIcon;
  }
}

function getLifecycleColor(status: UserRegistrationInvitationsTableRow['status']) {
  switch (status) {
    case 'CONSUMED':
      return 'success' as const;
    case 'REVOKED':
      return 'default' as const;
    default:
      return 'warning' as const;
  }
}

export function useUserRegistrationInvitationsTableColumns({
  t,
  dateFormatter,
  dateTimeFormatter,
}: UseUserRegistrationInvitationsTableColumnsParams) {
  return useMemo<ColumnDef<UserRegistrationInvitationsTableRow>[]>(
    () => [
      {
        accessorKey: 'email',
        header: t('table.columns.email'),
        meta: { label: t('table.columns.email') },
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.original.email}</span>
        ),
      },
      {
        accessorKey: 'roleLabel',
        header: t('table.columns.role'),
        meta: { label: t('table.columns.role') },
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span>{row.original.roleLabel}</span>
            <span className="text-xs text-muted-foreground">{row.original.systemRoleLabel}</span>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <SortingHeader title={t('table.columns.status')} column={column} />,
        meta: { label: t('table.columns.status') },
        cell: ({ row }) => {
          const Icon = getLifecycleIcon(row.original.status);
          const statusDate = formatDate(row.original.statusDate, dateFormatter);

          return (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <Chip
                  size="small"
                  variant="outlined"
                  color={getLifecycleColor(row.original.status)}
                  label={row.original.statusLabel}
                />
              </div>
              {statusDate ? (
                <span className="text-xs text-muted-foreground">{statusDate}</span>
              ) : null}
            </div>
          );
        },
      },
      {
        accessorKey: 'lastAttemptAt',
        header: t('table.columns.lastDelivery'),
        meta: { label: t('table.columns.lastDelivery') },
        cell: ({ row }) => {
          const lastAttemptAt = formatDate(row.original.lastAttemptAt, dateTimeFormatter);

          if (!lastAttemptAt) {
            return <span className="text-muted-foreground">{t('delivery.notRecorded')}</span>;
          }

          if (row.original.lastAttemptStatus === 'FAILED') {
            return (
              <div className="flex flex-col gap-1 text-amber-700">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <MailWarning className="size-4 shrink-0" aria-hidden="true" />
                  {t('delivery.failed')}
                </span>
                <span className="text-xs text-muted-foreground">{lastAttemptAt}</span>
              </div>
            );
          }

          return (
            <div className="flex flex-col gap-1">
              <span className="font-medium text-emerald-700">{t('delivery.accepted')}</span>
              <span className="text-xs text-muted-foreground">{lastAttemptAt}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'resendCount',
        header: t('table.columns.resendCount'),
        meta: { label: t('table.columns.resendCount') },
        cell: ({ row }) => row.original.resendCount,
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <SortingHeader title={t('table.columns.createdAt')} column={column} />
        ),
        meta: { label: t('table.columns.createdAt') },
        cell: ({ row }) => formatDate(row.original.createdAt, dateFormatter) ?? '—',
      },
    ],
    [dateFormatter, dateTimeFormatter, t]
  );
}
