'use client';

import { useMemo } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { ArrowDown, ArrowUp, ArrowUpDown, Check, ClockFading, FileX, Hammer } from 'lucide-react';
import type { Column, ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import type { InternalAssetControlTableRow } from '@/components/internal-asset-control/types';
import { InternalAssetControlTableRowActions } from '@/components/internal-asset-control/InternalAssetControlTableRowActions';

type Translate = TFunction<'internalAssetControl', undefined>;

interface UseInternalAssetControlTableColumnsParams {
  t: Translate;
  dateFormatter: Intl.DateTimeFormat;
  canUpdate: boolean;
  canDelete: boolean;
  onDelete: (record: InternalAssetControlTableRow) => void;
}

function getStatusContentProps(statusId: InternalAssetControlTableRow['statusId']) {
  switch (statusId) {
    case 'IN_PROGRESS':
      return {
        className: 'text-sky-700',
        icon: Hammer,
      };
    case 'COMPLETED':
      return {
        className: 'text-emerald-700',
        icon: Check,
      };
    case 'CANCELLED':
      return {
        className: 'text-slate-500',
        icon: FileX,
      };
    default:
      return {
        className: 'text-zinc-700',
        icon: ClockFading,
      };
  }
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

function renderStatusContent(row: InternalAssetControlTableRow) {
  const { className, icon: Icon } = getStatusContentProps(row.statusId);

  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium ${className}`}>
      {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
      <span>{row.statusLabel}</span>
    </span>
  );
}

function renderDerivedStatusIndicator(row: InternalAssetControlTableRow) {
  if (row.statusId === 'COMPLETED' || row.statusId === 'CANCELLED') {
    return (
      <span
        className="inline-flex min-w-4 items-center justify-center text-sm font-medium text-muted-foreground"
        aria-label={row.derivedStatusLabel}
        title={row.derivedStatusLabel}
      >
        -
      </span>
    );
  }

  return (
    <Chip
      size="small"
      variant="filled"
      label={row.derivedStatusLabel}
      sx={{
        background: `linear-gradient(135deg, color-mix(in srgb, ${row.derivedStatusColorHex} 82%, white) 0%, ${row.derivedStatusColorHex} 58%, color-mix(in srgb, ${row.derivedStatusColorHex} 90%, white) 100%)`,
        color: '#fff',
        fontWeight: 600,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.24), inset 0 -1px 0 color-mix(in srgb, ${row.derivedStatusColorHex} 72%, white)`,
        '& .MuiChip-label': {
          paddingInline: '10px',
        },
      }}
    />
  );
}

export function useInternalAssetControlTableColumns({
  t,
  dateFormatter,
  canUpdate,
  canDelete,
  onDelete,
}: UseInternalAssetControlTableColumnsParams) {
  return useMemo<ColumnDef<InternalAssetControlTableRow>[]>(
    () => [
      {
        accessorKey: 'assetName',
        header: ({ column }) => (
          <SortingHeader title={t('table.columns.assetName')} column={column} />
        ),
        meta: { label: t('table.columns.assetName') },
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.original.assetName}</span>
        ),
      },
      {
        accessorKey: 'assetIdentifier',
        header: ({ column }) => (
          <SortingHeader title={t('table.columns.assetIdentifier')} column={column} />
        ),
        meta: { label: t('table.columns.assetIdentifier') },
      },
      {
        accessorKey: 'assetMaintenanceTypeLabel',
        header: t('table.columns.assetMaintenanceType'),
        meta: { label: t('table.columns.assetMaintenanceType') },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <SortingHeader title={t('table.columns.status')} column={column} />,
        meta: { label: t('table.columns.status') },
        cell: ({ row }) => renderStatusContent(row.original),
      },
      {
        accessorKey: 'derivedStatusLabel',
        header: t('table.columns.derivedStatus'),
        meta: { label: t('table.columns.derivedStatus') },
        cell: ({ row }) => renderDerivedStatusIndicator(row.original),
      },
      {
        accessorKey: 'expirationDate',
        header: ({ column }) => (
          <SortingHeader title={t('table.columns.expirationDate')} column={column} />
        ),
        meta: { label: t('table.columns.expirationDate') },
        cell: ({ row }) => {
          const date = new Date(row.original.expirationDate);
          if (Number.isNaN(date.getTime())) {
            return row.original.expirationDate;
          }
          return dateFormatter.format(date);
        },
      },
      {
        accessorKey: 'providerLabel',
        header: t('table.columns.provider'),
        meta: { label: t('table.columns.provider') },
      },
      {
        accessorKey: 'updatedAt',
        header: t('table.columns.updatedAt'),
        meta: { label: t('table.columns.updatedAt') },
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
            <InternalAssetControlTableRowActions
              record={row.original}
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
