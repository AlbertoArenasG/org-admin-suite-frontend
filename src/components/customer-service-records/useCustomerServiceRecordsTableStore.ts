'use client';

import { create } from 'zustand';
import type {
  CustomerServiceRecordsListFilters,
  CustomerServiceRecordSortDirection,
} from '@/features/customer-service-records';
import type { CustomerServiceRecordsTableSorting } from '@/utils/customerServiceRecordsQuery';

type Updater<T> = T | ((current: T) => T);

type CustomerServiceRecordsTableState = {
  page: number;
  limit: number;
  search: string;
  appliedSearch: string;
  sorting: CustomerServiceRecordsTableSorting | null;
  visibleColumnIds: string[];
  expandedRowIds: string[];
  filters: CustomerServiceRecordsListFilters;
  initialized: boolean;
  setPage: (updater: Updater<number>) => void;
  setLimit: (updater: Updater<number>) => void;
  setSearch: (updater: Updater<string>) => void;
  setAppliedSearch: (value: string) => void;
  setSorting: (
    value: {
      columnId: CustomerServiceRecordsTableSorting['columnId'];
      direction: CustomerServiceRecordSortDirection;
    } | null
  ) => void;
  setVisibleColumnIds: (value: string[]) => void;
  setExpandedRowIds: (value: string[]) => void;
  setFilters: (updater: Updater<CustomerServiceRecordsListFilters>) => void;
  syncFromUrl: (value: {
    page: number;
    limit: number;
    search: string;
    sorting: CustomerServiceRecordsTableSorting | null;
    filters: CustomerServiceRecordsListFilters;
  }) => void;
  reset: () => void;
};

const DEFAULT_VISIBLE_COLUMNS = [
  'serviceNumber',
  'serviceAndAssets',
  'operationalStatus',
  'customerCommitment',
  'receivedAt',
  'estimatedDeliveryAt',
  'equipmentDetails',
  'customer',
  'providerTracking',
  'providerReturn',
];

const EMPTY_FILTERS: CustomerServiceRecordsListFilters = {
  operationalStatus: null,
  serviceTypeCode: null,
  customerId: null,
  providerId: null,
  hasProvider: null,
  requestedAtFrom: null,
  requestedAtTo: null,
  receivedAtFrom: null,
  receivedAtTo: null,
  estimatedCustomerDeliveryAtFrom: null,
  estimatedCustomerDeliveryAtTo: null,
  providerEstimatedReturnAtFrom: null,
  providerEstimatedReturnAtTo: null,
};

function initialState() {
  return {
    page: 1,
    limit: 10,
    search: '',
    appliedSearch: '',
    sorting: null,
    visibleColumnIds: DEFAULT_VISIBLE_COLUMNS,
    expandedRowIds: [],
    filters: EMPTY_FILTERS,
    initialized: false,
  };
}

function resolve<T>(updater: Updater<T>, current: T) {
  return typeof updater === 'function' ? (updater as (value: T) => T)(current) : updater;
}

function equal(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export const useCustomerServiceRecordsTableStore = create<CustomerServiceRecordsTableState>(
  (set) => ({
    ...initialState(),
    setPage: (updater) => set((state) => ({ page: resolve(updater, state.page) })),
    setLimit: (updater) => set((state) => ({ limit: resolve(updater, state.limit) })),
    setSearch: (updater) => set((state) => ({ search: resolve(updater, state.search) })),
    setAppliedSearch: (appliedSearch) => set({ appliedSearch }),
    setSorting: (sorting) => set({ sorting }),
    setVisibleColumnIds: (visibleColumnIds) => set({ visibleColumnIds }),
    setExpandedRowIds: (expandedRowIds) => set({ expandedRowIds }),
    setFilters: (updater) => set((state) => ({ filters: resolve(updater, state.filters) })),
    syncFromUrl: ({ page, limit, search, sorting, filters }) =>
      set((state) => {
        const unchanged =
          state.page === page &&
          state.limit === limit &&
          state.search === search &&
          state.appliedSearch === search.trim() &&
          equal(state.sorting, sorting) &&
          equal(state.filters, filters) &&
          state.initialized;

        return unchanged
          ? state
          : {
              ...state,
              page,
              limit,
              search,
              appliedSearch: search.trim(),
              sorting,
              filters,
              initialized: true,
            };
      }),
    reset: () => set(initialState()),
  })
);
