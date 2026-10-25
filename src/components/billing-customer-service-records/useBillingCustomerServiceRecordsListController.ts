'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  fetchBillingCustomerServiceRecords,
  fetchBillingCustomerServiceRecordStatusOptions,
} from '@/features/billing-customer-service-records';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useDataTablePreferencesStore } from '@/stores/useDataTablePreferencesStore';
import {
  buildBillingCustomerServiceRecordsQuery,
  parseBillingCustomerServiceRecordsQuery,
} from '@/utils/billingCustomerServiceRecordsQuery';
import { useBillingCustomerServiceRecordsTableStore } from './useBillingCustomerServiceRecordsTableStore';

export function useBillingCustomerServiceRecordsListController() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsString = useSearchParams().toString();
  const pendingLocalQueriesRef = useRef(new Set<string>());
  const list = useAppSelector((state) => state.billingCustomerServiceRecords.list);
  const options = useAppSelector((state) => state.billingCustomerServiceRecords.options);
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);
  const preferencesHydrated = useDataTablePreferencesStore((state) => state.hasHydrated);
  const preferredLimit = useDataTablePreferencesStore((state) =>
    userId ? (state.pageSizeByUser[userId] ?? 10) : 10
  );
  const setPreferredPageSize = useDataTablePreferencesStore((state) => state.setPageSize);
  const preferredLimitRef = useRef(preferredLimit);
  preferredLimitRef.current = preferredLimit;

  const page = useBillingCustomerServiceRecordsTableStore((state) => state.page);
  const limit = useBillingCustomerServiceRecordsTableStore((state) => state.limit);
  const search = useBillingCustomerServiceRecordsTableStore((state) => state.search);
  const appliedSearch = useBillingCustomerServiceRecordsTableStore((state) => state.appliedSearch);
  const billingStatus = useBillingCustomerServiceRecordsTableStore((state) => state.billingStatus);
  const visibleColumnIds = useBillingCustomerServiceRecordsTableStore(
    (state) => state.visibleColumnIds
  );
  const initialized = useBillingCustomerServiceRecordsTableStore((state) => state.initialized);
  const setPage = useBillingCustomerServiceRecordsTableStore((state) => state.setPage);
  const setLimit = useBillingCustomerServiceRecordsTableStore((state) => state.setLimit);
  const setSearch = useBillingCustomerServiceRecordsTableStore((state) => state.setSearch);
  const setAppliedSearch = useBillingCustomerServiceRecordsTableStore(
    (state) => state.setAppliedSearch
  );
  const setBillingStatus = useBillingCustomerServiceRecordsTableStore(
    (state) => state.setBillingStatus
  );
  const setVisibleColumnIds = useBillingCustomerServiceRecordsTableStore(
    (state) => state.setVisibleColumnIds
  );
  const syncFromUrl = useBillingCustomerServiceRecordsTableStore((state) => state.syncFromUrl);
  const reset = useBillingCustomerServiceRecordsTableStore((state) => state.reset);

  const refetch = useCallback(() => {
    void dispatch(
      fetchBillingCustomerServiceRecords({
        page,
        limit,
        search: appliedSearch,
        billingStatus,
      })
    );
  }, [appliedSearch, billingStatus, dispatch, limit, page]);

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
    syncFromUrl(
      parseBillingCustomerServiceRecordsQuery(
        new URLSearchParams(searchParamsString),
        preferredLimitRef.current
      )
    );
  }, [initialized, preferencesHydrated, searchParamsString, syncFromUrl, userId]);

  useEffect(() => {
    if (options.status === 'idle') void dispatch(fetchBillingCustomerServiceRecordStatusOptions());
  }, [dispatch, options.status]);

  useEffect(() => {
    const timer = window.setTimeout(() => setAppliedSearch(search.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [search, setAppliedSearch]);

  useEffect(() => {
    if (initialized) refetch();
  }, [initialized, refetch]);

  useEffect(() => {
    if (!initialized) return;
    const next = buildBillingCustomerServiceRecordsQuery({
      page,
      limit,
      search: appliedSearch,
      billingStatus,
    }).toString();
    if (next === searchParamsString) return;
    pendingLocalQueriesRef.current.add(next);
    router.replace(`${pathname}?${next}`, { scroll: false });
  }, [
    appliedSearch,
    billingStatus,
    initialized,
    limit,
    page,
    pathname,
    router,
    searchParamsString,
  ]);

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
    billingStatus,
    visibleColumnIds,
    setPage,
    setLimit: setPreferredLimit,
    setSearch,
    setAppliedSearch,
    setBillingStatus,
    setVisibleColumnIds,
    refetch,
    refetchOptions: () => void dispatch(fetchBillingCustomerServiceRecordStatusOptions()),
    clearCriteria: () => {
      setSearch('');
      setAppliedSearch('');
      setBillingStatus(null);
      setPage(1);
    },
    hasActiveCriteria: Boolean(appliedSearch || billingStatus),
  };
}

export type BillingCustomerServiceRecordsListController = ReturnType<
  typeof useBillingCustomerServiceRecordsListController
>;
