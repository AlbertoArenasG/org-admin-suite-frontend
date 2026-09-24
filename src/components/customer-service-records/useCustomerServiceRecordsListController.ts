'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { fetchCustomerOptions } from '@/features/customers';
import {
  fetchCustomerServiceRecordOptions,
  fetchCustomerServiceRecords,
} from '@/features/customer-service-records';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
  buildCustomerServiceRecordsQuery,
  getCustomerServiceRecordsInitialPagination,
  mapCustomerServiceRecordsSortingToApi,
  parseCustomerServiceRecordsFiltersFromParams,
  parseCustomerServiceRecordsSorting,
} from '@/utils/customerServiceRecordsQuery';
import {
  clearCustomerServiceRecordsListFilters,
  getCustomerServiceRecordsAppliedFilterCount,
} from './customerServiceRecordsFilterAdapter';
import { useCustomerServiceRecordsTableStore } from './useCustomerServiceRecordsTableStore';

export function useCustomerServiceRecordsListController() {
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

  const refetch = useCallback(() => {
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
  }, [appliedSearch, dispatch, filters, limit, page, sortStrategy, sorting]);

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
    refetch();
  }, [initialized, refetch]);

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

  return {
    list,
    options,
    customerOptions,
    page,
    limit,
    search,
    appliedSearch,
    sorting,
    visibleColumnIds,
    expandedRowIds,
    filters,
    setPage,
    setLimit,
    setSearch,
    setAppliedSearch,
    setSorting,
    setVisibleColumnIds,
    setExpandedRowIds,
    setFilters,
    refetch,
    clearCriteria: () => {
      setSearch('');
      setAppliedSearch('');
      setFilters((current) => clearCustomerServiceRecordsListFilters(current));
      setPage(1);
    },
    hasActiveCriteria: Boolean(
      appliedSearch || getCustomerServiceRecordsAppliedFilterCount(filters)
    ),
  };
}

export type CustomerServiceRecordsListController = ReturnType<
  typeof useCustomerServiceRecordsListController
>;
