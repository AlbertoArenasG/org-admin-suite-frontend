'use client';

import { useMemo } from 'react';
import Stack from '@mui/material/Stack';
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Column, ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import { Button } from '@/components/ui/button';
import { CustomerServiceRecordSemaphoreBadge } from '@/components/customer-service-records/CustomerServiceRecordSemaphoreBadge';
import type { CustomerServiceRecordListItem } from '@/features/customer-service-records';

type Translate = TFunction<'customerServiceRecords', undefined>;

interface UseCustomerServiceRecordsTableColumnsParams {
  t: Translate;
  dateFormatter: Intl.DateTimeFormat;
}

function formatDateOnly(value: string | null, formatter: Intl.DateTimeFormat, emptyLabel: string) {
  if (!value) return emptyLabel;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : formatter.format(date);
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

export function useCustomerServiceRecordsTableColumns({
  t,
  dateFormatter,
}: UseCustomerServiceRecordsTableColumnsParams) {
  return useMemo<ColumnDef<CustomerServiceRecordListItem>[]>(
    () => [
      {
        accessorKey: 'serviceNumber',
        header: ({ column }) => (
          <SortingHeader title={t('table.columns.serviceNumber')} column={column} />
        ),
        meta: { label: t('table.columns.serviceNumber') },
        cell: ({ row }) => (
          <Link
            href={`/dashboard/customer-service-records/${row.original.customerServiceRecordId}`}
            className="font-medium text-foreground hover:text-primary hover:underline"
          >
            {row.original.serviceNumber}
          </Link>
        ),
      },
      {
        accessorKey: 'serviceType.name',
        header: t('table.columns.serviceType'),
        meta: { label: t('table.columns.serviceType') },
        cell: ({ row }) => row.original.serviceType.name,
      },
      {
        accessorKey: 'customer.name',
        header: t('table.columns.customer'),
        meta: { label: t('table.columns.customer') },
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.original.customer.name}</span>
        ),
      },
      {
        id: 'asset',
        header: t('table.columns.asset'),
        meta: { label: t('table.columns.asset') },
        cell: ({ row }) => {
          const asset = row.original.assets[0];
          return asset ? (
            <span>
              {asset.name}
              <span className="block text-xs text-muted-foreground">{asset.identifier}</span>
            </span>
          ) : (
            '-'
          );
        },
      },
      {
        accessorKey: 'operationalStatus.name',
        id: 'operationalStatus',
        header: ({ column }) => <SortingHeader title={t('table.columns.status')} column={column} />,
        meta: { label: t('table.columns.status') },
        cell: ({ row }) => (
          <span className="inline-flex rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium">
            {row.original.operationalStatus.name}
          </span>
        ),
      },
      {
        accessorKey: 'customerDelivery.estimatedDeliveryAt',
        id: 'customerDeliveryAt',
        header: ({ column }) => (
          <SortingHeader title={t('table.columns.customerDelivery')} column={column} />
        ),
        meta: { label: t('table.columns.customerDelivery') },
        cell: ({ row }) => (
          <div className="grid gap-1.5">
            <span>
              {formatDateOnly(
                row.original.customerDelivery.estimatedDeliveryAt,
                dateFormatter,
                t('labels.noDate')
              )}
            </span>
            <CustomerServiceRecordSemaphoreBadge
              materialization={row.original.customerDelivery.statusMaterialization}
              neutralLabel={t('labels.neutral')}
            />
          </div>
        ),
      },
      {
        accessorKey: 'provider.estimatedReturnAt',
        id: 'providerReturnAt',
        header: ({ column }) => (
          <SortingHeader title={t('table.columns.providerReturn')} column={column} />
        ),
        meta: { label: t('table.columns.providerReturn') },
        cell: ({ row }) => (
          <div className="grid gap-1.5">
            <span>
              {formatDateOnly(
                row.original.provider?.estimatedReturnAt ?? null,
                dateFormatter,
                t('labels.noDate')
              )}
            </span>
            <CustomerServiceRecordSemaphoreBadge
              materialization={row.original.provider?.statusMaterialization ?? null}
              neutralLabel={t('labels.neutral')}
            />
          </div>
        ),
      },
      {
        accessorKey: 'requestedAt',
        header: ({ column }) => (
          <SortingHeader title={t('table.columns.requestedAt')} column={column} />
        ),
        meta: { label: t('table.columns.requestedAt') },
        cell: ({ row }) =>
          formatDateOnly(row.original.requestedAt, dateFormatter, t('labels.noDate')),
      },
      {
        accessorKey: 'updatedAt',
        header: t('table.columns.updatedAt'),
        meta: { label: t('table.columns.updatedAt') },
        cell: ({ row }) => formatDateOnly(row.original.updatedAt, dateFormatter, '-'),
      },
      {
        id: 'actions',
        enableHiding: false,
        header: () => <span className="sr-only">{t('actions.view')}</span>,
        cell: ({ row }) => (
          <Stack direction="row" justifyContent="flex-end">
            <Button variant="ghost" size="icon" asChild>
              <Link
                href={`/dashboard/customer-service-records/${row.original.customerServiceRecordId}`}
                aria-label={t('actions.view')}
              >
                <ExternalLink className="size-4" />
              </Link>
            </Button>
          </Stack>
        ),
      },
    ],
    [dateFormatter, t]
  );
}
