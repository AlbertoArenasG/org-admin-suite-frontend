'use client';

import { create } from 'zustand';
import type { BillingCustomerServiceRecordStatus } from '@/features/billing-customer-service-records/types';
import type { BillingCustomerServiceRecordsQuery } from '@/utils/billingCustomerServiceRecordsQuery';

type Updater<T> = T | ((current: T) => T);

type BillingCustomerServiceRecordsTableState = BillingCustomerServiceRecordsQuery & {
  appliedSearch: string;
  visibleColumnIds: string[];
  initialized: boolean;
  setPage: (value: Updater<number>) => void;
  setLimit: (value: Updater<number>) => void;
  setSearch: (value: Updater<string>) => void;
  setAppliedSearch: (value: string) => void;
  setBillingStatus: (value: BillingCustomerServiceRecordStatus | null) => void;
  setVisibleColumnIds: (value: string[]) => void;
  syncFromUrl: (value: BillingCustomerServiceRecordsQuery) => void;
  reset: () => void;
};

const DEFAULT_VISIBLE_COLUMNS = ['serviceNumber', 'serviceAndAssets', 'billingStatus', 'customer'];

function initialState() {
  return {
    page: 1,
    limit: 10,
    search: '',
    appliedSearch: '',
    billingStatus: null,
    visibleColumnIds: DEFAULT_VISIBLE_COLUMNS,
    initialized: false,
  };
}

function resolve<T>(value: Updater<T>, current: T): T {
  return typeof value === 'function' ? (value as (current: T) => T)(current) : value;
}

export const useBillingCustomerServiceRecordsTableStore =
  create<BillingCustomerServiceRecordsTableState>((set) => ({
    ...initialState(),
    setPage: (value) => set((state) => ({ page: resolve(value, state.page) })),
    setLimit: (value) => set((state) => ({ limit: resolve(value, state.limit) })),
    setSearch: (value) => set((state) => ({ search: resolve(value, state.search) })),
    setAppliedSearch: (appliedSearch) => set({ appliedSearch }),
    setBillingStatus: (billingStatus) => set({ billingStatus }),
    setVisibleColumnIds: (visibleColumnIds) => set({ visibleColumnIds }),
    syncFromUrl: ({ page, limit, search, billingStatus }) =>
      set((state) => {
        if (
          state.initialized &&
          state.page === page &&
          state.limit === limit &&
          state.search === search &&
          state.appliedSearch === search.trim() &&
          state.billingStatus === billingStatus
        )
          return state;
        return {
          ...state,
          page,
          limit,
          search,
          appliedSearch: search.trim(),
          billingStatus,
          initialized: true,
        };
      }),
    reset: () => set(initialState()),
  }));
