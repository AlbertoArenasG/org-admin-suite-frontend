'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  fetchServicePackageRecordServiceTypeOptions,
  fetchServicePackagesRecords,
} from '@/features/servicePackagesRecords';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useDataTablePreferencesStore } from '@/stores/useDataTablePreferencesStore';
import {
  buildServicePackagesRecordsQuery,
  getServicePackagesRecordsInitialPagination,
  parseServicePackagesRecordsFilters,
} from '@/utils/servicePackagesRecordsQuery';
import { useServicePackagesRecordsTableStore } from './useServicePackagesRecordsTableStore';

export function useServicePackagesRecordsListController() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const pendingLocalQueriesRef = useRef(new Set<string>());
  const list = useAppSelector((state) => state.servicePackagesRecords.list);
  const options = useAppSelector((state) => state.servicePackagesRecords.options);
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);
  const preferencesHydrated = useDataTablePreferencesStore((state) => state.hasHydrated);
  const preferredLimit = useDataTablePreferencesStore((state) =>
    userId ? (state.pageSizeByUser[userId] ?? 10) : 10
  );
  const setPreferredPageSize = useDataTablePreferencesStore((state) => state.setPageSize);
  const preferredLimitRef = useRef(preferredLimit);
  preferredLimitRef.current = preferredLimit;

  const page = useServicePackagesRecordsTableStore((state) => state.page);
  const limit = useServicePackagesRecordsTableStore((state) => state.limit);
  const search = useServicePackagesRecordsTableStore((state) => state.search);
  const appliedSearch = useServicePackagesRecordsTableStore((state) => state.appliedSearch);
  const filters = useServicePackagesRecordsTableStore((state) => state.filters);
  const visibleColumnIds = useServicePackagesRecordsTableStore((state) => state.visibleColumnIds);
  const initialized = useServicePackagesRecordsTableStore((state) => state.initialized);
  const setPage = useServicePackagesRecordsTableStore((state) => state.setPage);
  const setLimit = useServicePackagesRecordsTableStore((state) => state.setLimit);
  const setSearch = useServicePackagesRecordsTableStore((state) => state.setSearch);
  const setAppliedSearch = useServicePackagesRecordsTableStore((state) => state.setAppliedSearch);
  const setFilters = useServicePackagesRecordsTableStore((state) => state.setFilters);
  const setVisibleColumnIds = useServicePackagesRecordsTableStore(
    (state) => state.setVisibleColumnIds
  );
  const syncFromUrl = useServicePackagesRecordsTableStore((state) => state.syncFromUrl);
  const reset = useServicePackagesRecordsTableStore((state) => state.reset);

  const refetch = useCallback(() => {
    void dispatch(fetchServicePackagesRecords({ page, limit, search: appliedSearch, filters }));
  }, [appliedSearch, dispatch, filters, limit, page]);

  useEffect(
    () => () => {
      pendingLocalQueriesRef.current.clear();
      reset();
    },
    [reset]
  );

  useEffect(() => {
    if (!preferencesHydrated) return;

    const isLocalQueryUpdate = pendingLocalQueriesRef.current.delete(searchParamsString);
    if (isLocalQueryUpdate && initialized) return;

    const params = new URLSearchParams(searchParamsString);
    syncFromUrl({
      ...getServicePackagesRecordsInitialPagination(params, preferredLimitRef.current),
      search: params.get('search') ?? '',
      filters: parseServicePackagesRecordsFilters(params),
    });
  }, [initialized, preferencesHydrated, searchParamsString, syncFromUrl, userId]);

  useEffect(() => {
    if (options.status === 'idle') {
      void dispatch(fetchServicePackageRecordServiceTypeOptions());
    }
  }, [dispatch, options.status]);

  useEffect(() => {
    const timer = window.setTimeout(() => setAppliedSearch(search.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [search, setAppliedSearch]);

  useEffect(() => {
    if (!initialized) return;
    refetch();
  }, [initialized, refetch]);

  useEffect(() => {
    if (!initialized) return;

    const next = buildServicePackagesRecordsQuery({
      page,
      limit,
      search: appliedSearch,
      filters,
    }).toString();
    if (next === searchParamsString) return;

    pendingLocalQueriesRef.current.add(next);
    router.replace(`${pathname}?${next}`, { scroll: false });
  }, [appliedSearch, filters, initialized, limit, page, pathname, router, searchParamsString]);

  useEffect(() => {
    if (!initialized || list.status !== 'succeeded') return;

    const lastPage = Math.max(1, list.totalPages);
    if (page > lastPage) setPage(lastPage);
  }, [initialized, list.status, list.totalPages, page, setPage]);

  const setPreferredLimit = useCallback(
    (nextLimit: number) => {
      setLimit(nextLimit);
      if (userId) setPreferredPageSize(userId, nextLimit);
    },
    [setLimit, setPreferredPageSize, userId]
  );

  return {
    list,
    options,
    page,
    limit,
    search,
    appliedSearch,
    filters,
    visibleColumnIds,
    setPage,
    setLimit: setPreferredLimit,
    setSearch,
    setAppliedSearch,
    setFilters,
    setVisibleColumnIds,
    refetch,
    clearCriteria: () => {
      setSearch('');
      setAppliedSearch('');
      setFilters({ serviceType: null });
      setPage(1);
    },
    hasActiveCriteria: Boolean(appliedSearch || filters.serviceType),
  };
}

export type ServicePackagesRecordsListController = ReturnType<
  typeof useServicePackagesRecordsListController
>;
