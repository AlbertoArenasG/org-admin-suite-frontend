'use client';

import { useEffect, useMemo, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/data-table';
import { DashboardContentReveal } from '@/components/dashboard-shell';
import { Skeleton } from '@/components/ui/skeleton';
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
  type CustomerServiceRecordsTableSorting,
  getCustomerServiceRecordsInitialPagination,
  mapCustomerServiceRecordsSortingToApi,
  parseCustomerServiceRecordsFiltersFromParams,
  parseCustomerServiceRecordsSorting,
} from '@/utils/customerServiceRecordsQuery';
import { CustomerServiceRecordsFilterDialog } from './CustomerServiceRecordsFilterDialog';
import {
  CustomerServiceRecordsObservationsDetail,
  hasCustomerServiceRecordObservations,
} from './CustomerServiceRecordsObservationsDetail';
import {
  clearCustomerServiceRecordsListFilters,
  getCustomerServiceRecordsAppliedFilterCount,
} from './customerServiceRecordsFilterAdapter';
import { createCustomerServiceRecordsColumns } from './customerServiceRecordsColumns';
import { useCustomerServiceRecordsTableStore } from './useCustomerServiceRecordsTableStore';

const SORTABLE_COLUMN_IDS = [
  'serviceNumber',
  'receivedAt',
  'estimatedDeliveryAt',
  'providerReturn',
] as const;

function isSortableColumnId(
  columnId: string
): columnId is CustomerServiceRecordsTableSorting['columnId'] {
  return (SORTABLE_COLUMN_IDS as readonly string[]).includes(columnId);
}

function loadingCell(columnId: string) {
  const width =
    columnId === 'serviceAndAssets'
      ? 'w-4/5'
      : columnId === 'customerCommitment' || columnId === 'operationalStatus'
        ? 'w-3/5'
        : 'w-2/3';
  return <Skeleton className={`h-5 ${width}`} />;
}

export function CustomerServiceRecordsContainer() {
  const { t, hydrated, i18n } = useTranslationHydrated('customerServiceRecords');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const pendingLocalQueriesRef = useRef(new Set<string>());
  const list = useAppSelector((state) => state.customerServiceRecords.list);
  const options = useAppSelector((state) => state.customerServiceRecords.options);
  const customerOptions = useAppSelector((state) => state.customers.options);

  const page = useCustomerServiceRecordsTableStore((state) => state.page);
  const limit = useCustomerServiceRecordsTableStore((state) => state.limit);
  const search = useCustomerServiceRecordsTableStore((state) => state.search);
  const appliedSearch = useCustomerServiceRecordsTableStore((state) => state.appliedSearch);
  const sorting = useCustomerServiceRecordsTableStore((state) => state.sorting);
  const visibleColumnIds = useCustomerServiceRecordsTableStore((state) => state.visibleColumnIds);
  const expandedRowIds = useCustomerServiceRecordsTableStore((state) => state.expandedRowIds);
  const filters = useCustomerServiceRecordsTableStore((state) => state.filters);
  const initialized = useCustomerServiceRecordsTableStore((state) => state.initialized);
  const setPage = useCustomerServiceRecordsTableStore((state) => state.setPage);
  const setLimit = useCustomerServiceRecordsTableStore((state) => state.setLimit);
  const setSearch = useCustomerServiceRecordsTableStore((state) => state.setSearch);
  const setAppliedSearch = useCustomerServiceRecordsTableStore((state) => state.setAppliedSearch);
  const setSorting = useCustomerServiceRecordsTableStore((state) => state.setSorting);
  const setVisibleColumnIds = useCustomerServiceRecordsTableStore(
    (state) => state.setVisibleColumnIds
  );
  const setExpandedRowIds = useCustomerServiceRecordsTableStore((state) => state.setExpandedRowIds);
  const setFilters = useCustomerServiceRecordsTableStore((state) => state.setFilters);
  const syncFromUrl = useCustomerServiceRecordsTableStore((state) => state.syncFromUrl);
  const reset = useCustomerServiceRecordsTableStore((state) => state.reset);

  const sortStrategy = sorting ? null : 'work_priority';

  useEffect(
    () => () => {
      pendingLocalQueriesRef.current.clear();
      reset();
    },
    [reset]
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const isLocalQueryUpdate = pendingLocalQueriesRef.current.delete(searchParamsString);
    if (isLocalQueryUpdate && initialized) return;

    syncFromUrl({
      ...getCustomerServiceRecordsInitialPagination(params),
      search: params.get('search') ?? '',
      sorting: parseCustomerServiceRecordsSorting(params),
      filters: parseCustomerServiceRecordsFiltersFromParams(params),
    });
  }, [initialized, searchParamsString, syncFromUrl]);

  useEffect(() => {
    const timer = window.setTimeout(() => setAppliedSearch(search.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [search, setAppliedSearch]);

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
        page,
        limit,
        itemsPerPage: limit,
        search: appliedSearch,
        filters,
        sorts: mapCustomerServiceRecordsSortingToApi(sorting),
        sortStrategy,
      })
    );
  }, [appliedSearch, dispatch, filters, initialized, limit, page, sortStrategy, sorting]);

  useEffect(() => {
    if (!initialized) return;
    const next = buildCustomerServiceRecordsQuery({
      page,
      limit,
      search: appliedSearch,
      sorting,
      filters,
    }).toString();
    if (next !== searchParamsString) {
      pendingLocalQueriesRef.current.add(next);
      router.replace(`${pathname}?${next}`, { scroll: false });
    }
  }, [
    appliedSearch,
    filters,
    initialized,
    limit,
    page,
    pathname,
    router,
    searchParamsString,
    sorting,
  ]);

  useEffect(() => {
    if (!initialized || list.status !== 'succeeded') return;
    const lastPage = Math.max(1, list.totalPages);
    if (page > lastPage) setPage(lastPage);
  }, [initialized, list.status, list.totalPages, page, setPage]);

  const dateFormatter = useMemo(() => {
    const fallback = i18n.options.fallbackLng;
    const language = hydrated
      ? i18n.language
      : Array.isArray(fallback)
        ? fallback[0]
        : fallback || 'es';
    return new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeZone: 'UTC' });
  }, [hydrated, i18n.language, i18n.options.fallbackLng]);

  const columns = useMemo(
    () =>
      createCustomerServiceRecordsColumns({
        dateFormatter,
        labels: {
          serviceNumber: t('table.columns.serviceNumber'),
          serviceAndAssets: t('table.columns.serviceAndAssets'),
          equipmentDetails: t('table.columns.equipmentDetails'),
          operationalStatus: t('table.columns.status'),
          customerCommitment: t('table.columns.customerDelivery'),
          receivedAt: t('table.columns.receivedAt'),
          deliveryAt: t('table.columns.deliveryAt'),
          customer: t('table.columns.customer'),
          providerTracking: t('table.columns.providerTracking'),
          providerReturn: t('table.columns.providerReturn'),
          noDate: t('labels.noDate'),
          noStatus: t('labels.neutral'),
          noProvider: t('filters.providerStateNo'),
          estimated: t('table.values.estimated'),
          delivered: t('table.values.delivered'),
        },
      }),
    [dateFormatter, t]
  );

  const retry = () => {
    void dispatch(
      fetchCustomerServiceRecords({
        page,
        limit,
        itemsPerPage: limit,
        search: appliedSearch,
        filters,
        sorts: mapCustomerServiceRecordsSortingToApi(sorting),
        sortStrategy,
      })
    );
  };
  const hasActiveCriteria = Boolean(
    appliedSearch || getCustomerServiceRecordsAppliedFilterCount(filters)
  );

  return (
    <DashboardContentReveal>
      <DataTable
        rows={list.items}
        columns={columns}
        getRowId={(row) => row.customerServiceRecordId}
        loading={list.status === 'loading'}
        renderLoading={(columnId) => loadingCell(columnId)}
        error={
          list.status === 'failed' && list.error
            ? { message: list.error, onRetry: retry }
            : undefined
        }
        hasActiveCriteria={hasActiveCriteria}
        onClearCriteria={() => {
          setSearch('');
          setAppliedSearch('');
          setFilters((current) => clearCustomerServiceRecordsListFilters(current));
          setPage(1);
        }}
        renderEmpty={({ filtered, onClearCriteria }) => (
          <div className="mx-auto max-w-sm space-y-2">
            <p className="font-medium text-foreground">
              {filtered ? t('list.emptyFilteredTitle') : t('list.emptyTitle')}
            </p>
            <p>{filtered ? t('list.emptyFilteredDescription') : t('list.emptyDescription')}</p>
            {filtered && onClearCriteria ? (
              <button
                type="button"
                className="font-medium text-primary underline"
                onClick={onClearCriteria}
              >
                {t('list.clearCriteria')}
              </button>
            ) : null}
          </div>
        )}
        toolbar={{
          compact: true,
          search: {
            value: search,
            onChange: (value) => {
              setSearch(value);
              if (!value) setAppliedSearch('');
              setPage(1);
            },
            placeholder: t('filters.searchPlaceholder'),
            ariaLabel: t('filters.searchPlaceholder'),
          },
          trailing: (
            <CustomerServiceRecordsFilterDialog
              filters={filters}
              serviceTypes={options.serviceTypes}
              customers={customerOptions.items.map((item) => ({
                value: item.id,
                label: item.companyName,
              }))}
              providers={options.providers}
              loadingOptions={options.status === 'loading' || customerOptions.status === 'loading'}
              onFiltersChange={(nextFilters) => {
                setFilters(nextFilters);
                setPage(1);
              }}
            />
          ),
        }}
        settings={{
          columnVisibility: { visibleColumnIds, onChange: setVisibleColumnIds },
        }}
        settingsPlacement="toolbar"
        scrollRegion={{ maxHeight: 'available', desktopOnly: true, overscrollBehavior: 'none' }}
        stickyHeader={{ desktopOnly: true }}
        rowLayout="multiline"
        sorting={{
          columnId: sorting?.columnId,
          direction: sorting?.direction,
          onChange: (next) => {
            if (!next) {
              setSorting(null);
              setPage(1);
              return;
            }
            if (!isSortableColumnId(next.columnId)) return;
            setSorting({ columnId: next.columnId, direction: next.direction });
            setPage(1);
          },
        }}
        pagination={{
          page,
          perPage: limit,
          total: list.total,
          totalPages: list.totalPages,
          onChange: setPage,
          onPerPageChange: (nextLimit) => {
            setLimit(nextLimit);
            setPage(1);
          },
          pageSizes: [10, 25, 50],
        }}
        expansion={{
          expandedRowIds,
          onChange: setExpandedRowIds,
          isRowExpandable: hasCustomerServiceRecordObservations,
          trigger: 'feedback',
          ariaLabel: t('expansion.ariaLabel'),
        }}
        renderDetail={(row) => (
          <CustomerServiceRecordsObservationsDetail
            row={row}
            labels={{
              general: t('expansion.generalObservations'),
              assets: t('expansion.assetObservations'),
            }}
          />
        )}
        getRowVisual={(row) => {
          const color = row.customerDelivery.statusMaterialization?.colorHex;
          return color ? { indicatorColor: color } : undefined;
        }}
        searchHighlight={{
          query: appliedSearch,
          columnIds: ['serviceNumber', 'serviceAndAssets', 'equipmentDetails'],
        }}
        labels={{
          loading: t('list.loading'),
          loadingResults: t('table.loadingResults'),
          settings: t('table.settings'),
          displayColumns: t('table.displayColumns'),
          resizeColumn: (column) => t('table.resizeColumn', { column }),
          additionalDetails: t('expansion.ariaLabel'),
          noResults: t('list.emptyTitle'),
          noResultsForCriteria: t('list.emptyFilteredTitle'),
          clearCriteria: t('list.clearCriteria'),
          pagination: t('table.pagination'),
          rowsPerPage: t('table.rowsPerPage'),
          paginationSummary: ({ from, to, total }) =>
            t('table.paginationSummary', { from, to, total }),
          previousPage: t('table.previousPage'),
          nextPage: t('table.nextPage'),
          clearSearch: t('list.clearSearch'),
        }}
      />
    </DashboardContentReveal>
  );
}
