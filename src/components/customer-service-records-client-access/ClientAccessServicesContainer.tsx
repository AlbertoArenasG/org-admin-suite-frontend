'use client';

import { useEffect, useMemo, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/data-table';
import { DashboardContentReveal } from '@/components/dashboard-shell';
import { Skeleton } from '@/components/ui/skeleton';
import {
  fetchClientAccessCustomerServiceRecords,
  type ClientAccessCustomerServiceRecord,
} from '@/features/customer-service-records-client-access';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import {
  buildClientAccessQuery,
  getClientAccessInitialPagination,
  mapClientAccessSortingToApi,
  parseClientAccessSorting,
} from '@/utils/customerServiceRecordsClientAccessQuery';
import { createClientAccessServicesColumns } from './clientAccessServicesColumns';
import {
  ClientAccessObservationsDetail,
  hasClientAccessObservations,
} from './ClientAccessObservationsDetail';
import { useClientAccessServicesTableStore } from './useClientAccessServicesTableStore';

function loadingCell(columnId: string) {
  const width =
    columnId === 'serviceAndAssets'
      ? 'w-4/5'
      : columnId === 'customerCommitment' || columnId === 'operationalStatus'
        ? 'w-3/5'
        : 'w-2/3';
  return <Skeleton className={`h-5 ${width}`} />;
}

export function ClientAccessServicesContainer() {
  const { t, hydrated, i18n } = useTranslationHydrated('clientAccessServices');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const pendingLocalQueriesRef = useRef(new Set<string>());
  const list = useAppSelector((state) => state.customerServiceRecordsClientAccess.list);

  const page = useClientAccessServicesTableStore((state) => state.page);
  const limit = useClientAccessServicesTableStore((state) => state.limit);
  const search = useClientAccessServicesTableStore((state) => state.search);
  const appliedSearch = useClientAccessServicesTableStore((state) => state.appliedSearch);
  const sorting = useClientAccessServicesTableStore((state) => state.sorting);
  const visibleColumnIds = useClientAccessServicesTableStore((state) => state.visibleColumnIds);
  const expandedRowIds = useClientAccessServicesTableStore((state) => state.expandedRowIds);
  const initialized = useClientAccessServicesTableStore((state) => state.initialized);
  const setPage = useClientAccessServicesTableStore((state) => state.setPage);
  const setLimit = useClientAccessServicesTableStore((state) => state.setLimit);
  const setSearch = useClientAccessServicesTableStore((state) => state.setSearch);
  const setAppliedSearch = useClientAccessServicesTableStore((state) => state.setAppliedSearch);
  const setSorting = useClientAccessServicesTableStore((state) => state.setSorting);
  const setVisibleColumnIds = useClientAccessServicesTableStore(
    (state) => state.setVisibleColumnIds
  );
  const setExpandedRowIds = useClientAccessServicesTableStore((state) => state.setExpandedRowIds);
  const syncFromUrl = useClientAccessServicesTableStore((state) => state.syncFromUrl);
  const reset = useClientAccessServicesTableStore((state) => state.reset);

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
    const pagination = getClientAccessInitialPagination(params);
    const isLocalQueryUpdate = pendingLocalQueriesRef.current.delete(searchParamsString);
    syncFromUrl(
      {
        ...pagination,
        search: params.get('search') ?? '',
        sorting: parseClientAccessSorting(params),
      },
      { ignoreIfInitialized: isLocalQueryUpdate }
    );
  }, [searchParamsString, syncFromUrl]);

  useEffect(() => {
    const timer = window.setTimeout(() => setAppliedSearch(search.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [search, setAppliedSearch]);

  useEffect(() => {
    if (!initialized) return;
    void dispatch(
      fetchClientAccessCustomerServiceRecords({
        page,
        limit,
        search: appliedSearch,
        sort: mapClientAccessSortingToApi(sorting),
        sortStrategy,
      })
    );
  }, [appliedSearch, dispatch, initialized, limit, page, sortStrategy, sorting]);

  useEffect(() => {
    if (!initialized) return;
    const next = buildClientAccessQuery({ page, limit, search: appliedSearch, sorting }).toString();
    if (next !== searchParamsString) {
      pendingLocalQueriesRef.current.add(next);
      router.replace(`${pathname}?${next}`, { scroll: false });
    }
  }, [appliedSearch, initialized, limit, page, pathname, router, searchParamsString, sorting]);

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
      createClientAccessServicesColumns({
        dateFormatter,
        labels: {
          serviceNumber: t('columns.serviceNumber'),
          serviceAndAssets: t('columns.serviceAndAssets'),
          equipmentDetails: t('columns.equipmentDetails'),
          customer: t('columns.customer'),
          operationalStatus: t('columns.operationalStatus'),
          customerCommitment: t('columns.customerCommitment'),
          receivedAt: t('columns.receivedAt'),
          deliveryAt: t('columns.deliveryAt'),
          noDate: t('values.noDate'),
          noStatus: t('values.noStatus'),
          estimated: t('values.estimated'),
          delivered: t('values.delivered'),
        },
      }),
    [dateFormatter, t]
  );
  const retry = () => {
    void dispatch(
      fetchClientAccessCustomerServiceRecords({
        page,
        limit,
        search: appliedSearch,
        sort: mapClientAccessSortingToApi(sorting),
        sortStrategy,
      })
    );
  };

  return (
    <DashboardContentReveal>
      <DataTable<ClientAccessCustomerServiceRecord>
        rows={list.items}
        columns={columns}
        getRowId={(row) => row.id}
        loading={list.status === 'loading'}
        renderLoading={(columnId) => loadingCell(columnId)}
        error={
          list.status === 'failed' && list.error
            ? { message: list.error, onRetry: retry }
            : undefined
        }
        hasActiveCriteria={Boolean(search.trim())}
        onClearCriteria={() => {
          setSearch('');
          setAppliedSearch('');
          setPage(1);
        }}
        renderEmpty={({ filtered, onClearCriteria }) => (
          <div className="mx-auto max-w-sm space-y-2">
            <p className="font-medium text-foreground">
              {filtered ? t('empty.filteredTitle') : t('empty.title')}
            </p>
            <p>{filtered ? t('empty.filteredDescription') : t('empty.description')}</p>
            {filtered && onClearCriteria ? (
              <button
                type="button"
                className="font-medium text-primary underline"
                onClick={onClearCriteria}
              >
                {t('empty.clearSearch')}
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
            placeholder: t('search.placeholder'),
            ariaLabel: t('search.ariaLabel'),
          },
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
            const columnId = next.columnId;
            if (
              columnId !== 'serviceNumber' &&
              columnId !== 'receivedAt' &&
              columnId !== 'estimatedDeliveryAt'
            ) {
              return;
            }
            setSorting({ columnId, direction: next.direction });
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
          isRowExpandable: hasClientAccessObservations,
          trigger: 'feedback',
          ariaLabel: t('expansion.ariaLabel'),
        }}
        renderDetail={(row) => (
          <ClientAccessObservationsDetail
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
          loading: t('table.loading'),
          loadingResults: t('table.loadingResults'),
          settings: t('table.settings'),
          displayColumns: t('table.displayColumns'),
          resizeColumn: (column) => t('table.resizeColumn', { column }),
          additionalDetails: t('expansion.ariaLabel'),
          noResults: t('empty.title'),
          noResultsForCriteria: t('empty.filteredTitle'),
          clearCriteria: t('empty.clearSearch'),
          pagination: t('table.pagination'),
          rowsPerPage: t('table.rowsPerPage'),
          paginationSummary: ({ from, to, total }) =>
            t('table.paginationSummary', { from, to, total }),
          previousPage: t('table.previousPage'),
          nextPage: t('table.nextPage'),
          clearSearch: t('empty.clearSearch'),
        }}
      />
    </DashboardContentReveal>
  );
}
