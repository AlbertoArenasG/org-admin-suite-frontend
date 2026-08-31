'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { CustomerServiceRecordsDataTable } from '@/components/customer-service-records/CustomerServiceRecordsDataTable';
import { useCustomerServiceRecordsTableStore } from '@/components/customer-service-records/useCustomerServiceRecordsTableStore';
import { useCustomerServiceRecordsTableColumns } from '@/components/customer-service-records/useCustomerServiceRecordsTableColumns';
import { useAuthorization } from '@/features/auth';
import { fetchCustomerOptions } from '@/features/customers';
import {
  fetchCustomerServiceRecordOptions,
  fetchCustomerServiceRecords,
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

  const columns = useCustomerServiceRecordsTableColumns({ t, dateFormatter });

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
    <CustomerServiceRecordsDataTable
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
      isLoading={list.status === 'loading'}
      error={list.error}
      onRetry={list.error ? retry : undefined}
      onSearchChange={(value) => {
        setGlobalFilter(value);
        setPagination((current) => ({ ...current, pageIndex: 0 }));
      }}
      onFiltersChange={(updater) => {
        setFilters(updater);
        setPagination((current) => ({ ...current, pageIndex: 0 }));
      }}
      canCreate={canCreate}
      title={t('list.title')}
      summary={t('list.summary', { total: list.total })}
      createLabel={t('actions.create')}
      createHref="/dashboard/customer-service-records/new"
      labels={{
        errorTitle: t('errors.title'),
        retry: t('actions.retry'),
        loading: t('list.loading'),
        empty: t('list.empty'),
        previous: t('actions.previous'),
        next: t('actions.next'),
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
  );
}
