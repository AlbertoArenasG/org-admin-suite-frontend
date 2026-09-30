'use client';

import { create } from 'zustand';

import type { ServicePackagesRecordsListFilters } from '@/features/servicePackagesRecords';

type Updater<T> = T | ((current: T) => T);

type ServicePackagesRecordsTableState = {
  page: number;
  limit: number;
  search: string;
  appliedSearch: string;
  filters: ServicePackagesRecordsListFilters;
  visibleColumnIds: string[];
  initialized: boolean;
  setPage: (updater: Updater<number>) => void;
  setLimit: (updater: Updater<number>) => void;
  setSearch: (updater: Updater<string>) => void;
  setAppliedSearch: (value: string) => void;
  setFilters: (updater: Updater<ServicePackagesRecordsListFilters>) => void;
  setVisibleColumnIds: (value: string[]) => void;
  syncFromUrl: (value: {
    page: number;
    limit: number;
    search: string;
    filters: ServicePackagesRecordsListFilters;
  }) => void;
  reset: () => void;
};

const DEFAULT_VISIBLE_COLUMNS = [
  'serviceOrder',
  'serviceType',
  'company',
  'collectorName',
  'visitDate',
  'createdAt',
];

function initialState() {
  return {
    page: 1,
    limit: 10,
    search: '',
    appliedSearch: '',
    filters: { serviceType: null },
    visibleColumnIds: DEFAULT_VISIBLE_COLUMNS,
    initialized: false,
  };
}

function resolve<T>(updater: Updater<T>, current: T) {
  return typeof updater === 'function' ? (updater as (value: T) => T)(current) : updater;
}

function filtersEqual(
  left: ServicePackagesRecordsListFilters,
  right: ServicePackagesRecordsListFilters
) {
  return left.serviceType === right.serviceType;
}

export const useServicePackagesRecordsTableStore = create<ServicePackagesRecordsTableState>(
  (set) => ({
    ...initialState(),
    setPage: (updater) => set((state) => ({ page: resolve(updater, state.page) })),
    setLimit: (updater) => set((state) => ({ limit: resolve(updater, state.limit) })),
    setSearch: (updater) => set((state) => ({ search: resolve(updater, state.search) })),
    setAppliedSearch: (appliedSearch) => set({ appliedSearch }),
    setFilters: (updater) => set((state) => ({ filters: resolve(updater, state.filters) })),
    setVisibleColumnIds: (visibleColumnIds) => set({ visibleColumnIds }),
    syncFromUrl: ({ page, limit, search, filters }) =>
      set((state) => {
        const unchanged =
          state.page === page &&
          state.limit === limit &&
          state.search === search &&
          state.appliedSearch === search.trim() &&
          filtersEqual(state.filters, filters) &&
          state.initialized;

        return unchanged
          ? state
          : {
              ...state,
              page,
              limit,
              search,
              appliedSearch: search.trim(),
              filters,
              initialized: true,
            };
      }),
    reset: () => set(initialState()),
  })
);
