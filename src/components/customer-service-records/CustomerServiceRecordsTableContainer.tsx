'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CustomerServiceRecordSemaphoreBadge } from '@/components/customer-service-records/CustomerServiceRecordSemaphoreBadge';
import { CustomerServiceRecordsTableToolbar } from '@/components/customer-service-records/CustomerServiceRecordsTableToolbar';
import { useCustomerServiceRecordsTableStore } from '@/components/customer-service-records/useCustomerServiceRecordsTableStore';
import { useAuthorization } from '@/features/auth';
import { fetchCustomerOptions } from '@/features/customers';
import {
  fetchCustomerServiceRecordOptions,
  fetchCustomerServiceRecords,
  type CustomerServiceRecordListItem,
} from '@/features/customer-service-records';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import {
  buildCustomerServiceRecordsQuery,
  mapCustomerServiceRecordsSortingToApi,
  parseCustomerServiceRecordsFiltersFromParams,
  parseCustomerServiceRecordsSortingFromParams,
} from '@/utils/customerServiceRecordsQuery';

function getInitialPagination(params: URLSearchParams) {
  const page = Number(params.get('page'));
  const limit = Number(params.get('limit'));
  return {
    pageIndex: Number.isFinite(page) && page > 0 ? page - 1 : 0,
    pageSize: Number.isFinite(limit) && limit > 0 ? limit : 10,
  };
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

export function CustomerServiceRecordsTableContainer() {
  const { t, hydrated, i18n } = useTranslationHydrated('customerServiceRecords');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const { hasPermission } = useAuthorization();
  const list = useAppSelector((state) => state.customerServiceRecords.list);
  const options = useAppSelector((state) => state.customerServiceRecords.options);
  const customerOptions = useAppSelector((state) => state.customers.options);

  const pagination = useCustomerServiceRecordsTableStore((state) => state.pagination);
  const sorting = useCustomerServiceRecordsTableStore((state) => state.sorting);
  const columnVisibility = useCustomerServiceRecordsTableStore((state) => state.columnVisibility);
  const globalFilter = useCustomerServiceRecordsTableStore((state) => state.globalFilter);
  const debouncedFilter = useCustomerServiceRecordsTableStore((state) => state.debouncedFilter);
  const filters = useCustomerServiceRecordsTableStore((state) => state.filters);
  const initialized = useCustomerServiceRecordsTableStore((state) => state.initialized);
  const setPagination = useCustomerServiceRecordsTableStore((state) => state.setPagination);
  const setSorting = useCustomerServiceRecordsTableStore((state) => state.setSorting);
  const setColumnVisibility = useCustomerServiceRecordsTableStore(
    (state) => state.setColumnVisibility
  );
  const setGlobalFilter = useCustomerServiceRecordsTableStore((state) => state.setGlobalFilter);
  const setDebouncedFilter = useCustomerServiceRecordsTableStore(
    (state) => state.setDebouncedFilter
  );
  const setFilters = useCustomerServiceRecordsTableStore((state) => state.setFilters);
  const syncFromUrl = useCustomerServiceRecordsTableStore((state) => state.syncFromUrl);
  const reset = useCustomerServiceRecordsTableStore((state) => state.reset);

  const canCreate = hasPermission('CUSTOMER_SERVICE_RECORDS', 'CREATE');

  useEffect(() => () => reset(), [reset]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    syncFromUrl({
      pagination: getInitialPagination(params),
      sorting: parseCustomerServiceRecordsSortingFromParams(params),
      globalFilter: params.get('search') ?? '',
      debouncedFilter: (params.get('search') ?? '').trim(),
      filters: parseCustomerServiceRecordsFiltersFromParams(params),
    });
  }, [searchParamsString, syncFromUrl]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedFilter(globalFilter.trim()), 350);
    return () => window.clearTimeout(timeout);
  }, [globalFilter, setDebouncedFilter]);

  useEffect(() => {
    if (options.status === 'idle') void dispatch(fetchCustomerServiceRecordOptions());
  }, [dispatch, options.status]);

  useEffect(() => {
    if (customerOptions.status === 'idle') void dispatch(fetchCustomerOptions());
  }, [customerOptions.status, dispatch]);

  useEffect(() => {
    if (!initialized) return;
    void dispatch(
      fetchCustomerServiceRecords({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        itemsPerPage: pagination.pageSize,
        search: debouncedFilter,
        filters,
        sorts: mapCustomerServiceRecordsSortingToApi(sorting),
      })
    );
  }, [debouncedFilter, dispatch, filters, initialized, pagination, sorting]);

  useEffect(() => {
    if (!initialized) return;
    const next = buildCustomerServiceRecordsQuery({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      search: globalFilter,
      sorting,
      filters,
      baseParams: new URLSearchParams(searchParamsString),
    }).toString();
    if (next !== searchParamsString) router.replace(`${pathname}?${next}`, { scroll: false });
  }, [
    filters,
    globalFilter,
    initialized,
    pagination,
    pathname,
    router,
    searchParamsString,
    sorting,
  ]);

  useEffect(() => {
    if (!initialized) return;
    const maxPageIndex = Math.max(0, list.totalPages - 1);
    setPagination((current) => ({
      pageIndex: Math.min(current.pageIndex, maxPageIndex),
      pageSize: list.perPage || current.pageSize,
    }));
  }, [initialized, list.perPage, list.totalPages, setPagination]);

  const dateFormatter = useMemo(() => {
    const fallback = i18n.options.fallbackLng;
    const fallbackLanguage = Array.isArray(fallback) ? fallback[0] : fallback || 'es';
    return new Intl.DateTimeFormat(hydrated ? i18n.language : fallbackLanguage, {
      dateStyle: 'medium',
    });
  }, [hydrated, i18n.language, i18n.options.fallbackLng]);

  const columns = useMemo<ColumnDef<CustomerServiceRecordListItem>[]>(
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
            className="font-semibold text-primary hover:underline"
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
        cell: ({ row }) => <span className="font-medium">{row.original.customer.name}</span>,
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
            '—'
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
        cell: ({ row }) => formatDateOnly(row.original.updatedAt, dateFormatter, '—'),
      },
      {
        id: 'actions',
        enableHiding: false,
        header: () => <span className="sr-only">{t('actions.view')}</span>,
        cell: ({ row }) => (
          <Button variant="ghost" size="icon" asChild>
            <Link
              href={`/dashboard/customer-service-records/${row.original.customerServiceRecordId}`}
              aria-label={t('actions.view')}
            >
              <ExternalLink className="size-4" />
            </Link>
          </Button>
        ),
      },
    ],
    [dateFormatter, t]
  );

  const table = useReactTable({
    data: list.items,
    columns,
    state: { pagination, sorting, columnVisibility },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.max(list.totalPages, 1),
  });

  const retry = () => {
    void dispatch(
      fetchCustomerServiceRecords({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        itemsPerPage: pagination.pageSize,
        search: debouncedFilter,
        filters,
        sorts: mapCustomerServiceRecordsSortingToApi(sorting),
      })
    );
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border/60 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t('list.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('list.summary', { total: list.total })}
          </p>
        </div>
        {canCreate ? (
          <Button asChild className="gap-2">
            <Link href="/dashboard/customer-service-records/new">
              <Plus className="size-4" />
              {t('actions.create')}
            </Link>
          </Button>
        ) : null}
      </div>

      <CustomerServiceRecordsTableToolbar
        table={table}
        filters={filters}
        search={globalFilter}
        serviceTypes={options.serviceTypes}
        customers={customerOptions.items.map((item) => ({
          value: item.id,
          label: item.companyName,
        }))}
        providers={options.providers}
        loadingOptions={options.status === 'loading' || customerOptions.status === 'loading'}
        onSearchChange={(value) => {
          setGlobalFilter(value);
          setPagination((current) => ({ ...current, pageIndex: 0 }));
        }}
        onFiltersChange={(updater) => {
          setFilters(updater);
          setPagination((current) => ({ ...current, pageIndex: 0 }));
        }}
        labels={{
          searchPlaceholder: t('filters.searchPlaceholder'),
          serviceTypePlaceholder: t('filters.serviceTypePlaceholder'),
          customerPlaceholder: t('filters.customerPlaceholder'),
          providerPlaceholder: t('filters.providerPlaceholder'),
          statusPlaceholder: t('filters.statusPlaceholder'),
          providerStatePlaceholder: t('filters.providerStatePlaceholder'),
          providerStateYes: t('filters.providerStateYes'),
          providerStateNo: t('filters.providerStateNo'),
          dateFilters: t('filters.dateFilters'),
          requestedAt: t('filters.requestedAt'),
          receivedAt: t('filters.receivedAt'),
          customerDeliveryAt: t('filters.customerDeliveryAt'),
          providerReturnAt: t('filters.providerReturnAt'),
          from: t('filters.from'),
          to: t('filters.to'),
          manageColumns: t('actions.manageColumns'),
          allStatuses: t('filters.statusPlaceholder'),
          pending: t('statuses.pending'),
          inProgress: t('statuses.inProgress'),
          completed: t('statuses.completed'),
          cancelled: t('statuses.cancelled'),
        }}
      />

      {list.error ? (
        <div className="px-5 pt-5">
          <Alert variant="destructive">
            <AlertTitle>{t('errors.title')}</AlertTitle>
            <AlertDescription className="mt-2 flex flex-wrap items-center gap-3">
              <span>{list.error}</span>
              <Button type="button" variant="outline" size="sm" onClick={retry}>
                {t('actions.retry')}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-x-auto">
        <table className="w-full min-w-[1240px] border-collapse text-sm">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id} className="border-b border-border/60">
                {group.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {list.status === 'loading' ? (
              <tr>
                <td
                  colSpan={table.getVisibleLeafColumns().length}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {t('list.loading')}
                </td>
              </tr>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border/60 transition-colors hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={table.getVisibleLeafColumns().length}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {t('list.empty')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border/60 px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {t('actions.previous')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {t('actions.next')}
        </Button>
      </div>
    </section>
  );
}
