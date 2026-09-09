'use client';

import { create } from 'zustand';
import type { ClientAccessTableSorting } from '@/utils/customerServiceRecordsClientAccessQuery';

type Updater<T> = T | ((current: T) => T);

type ClientAccessServicesTableState = {
  page: number;
  limit: number;
  search: string;
  appliedSearch: string;
  sorting: ClientAccessTableSorting | null;
  visibleColumnIds: string[];
  expandedRowIds: string[];
  initialized: boolean;
  setPage: (updater: Updater<number>) => void;
  setLimit: (updater: Updater<number>) => void;
  setSearch: (updater: Updater<string>) => void;
  setAppliedSearch: (value: string) => void;
  setSorting: (value: ClientAccessTableSorting | null) => void;
  setVisibleColumnIds: (value: string[]) => void;
  setExpandedRowIds: (value: string[]) => void;
  syncFromUrl: (
    value: {
      page: number;
      limit: number;
      search: string;
      sorting: ClientAccessTableSorting | null;
    },
    options?: { ignoreIfInitialized?: boolean }
  ) => void;
  reset: () => void;
};

const DEFAULT_VISIBLE_COLUMNS = [
  'serviceNumber',
  'serviceAndAssets',
  'operationalStatus',
  'customerCommitment',
  'receivedAt',
  'deliveryAt',
  'equipmentDetails',
  'customer',
];

function initialState() {
  return {
    page: 1,
    limit: 10,
    search: '',
    appliedSearch: '',
    sorting: null,
    visibleColumnIds: DEFAULT_VISIBLE_COLUMNS,
    expandedRowIds: [],
    initialized: false,
  };
}

function resolve<T>(updater: Updater<T>, current: T) {
  return typeof updater === 'function' ? (updater as (value: T) => T)(current) : updater;
}

export const useClientAccessServicesTableStore = create<ClientAccessServicesTableState>((set) => ({
  ...initialState(),
  setPage: (updater) => set((state) => ({ page: resolve(updater, state.page) })),
  setLimit: (updater) => set((state) => ({ limit: resolve(updater, state.limit) })),
  setSearch: (updater) => set((state) => ({ search: resolve(updater, state.search) })),
  setAppliedSearch: (appliedSearch) => set({ appliedSearch }),
  setSorting: (sorting) => set({ sorting }),
  setVisibleColumnIds: (visibleColumnIds) => set({ visibleColumnIds }),
  setExpandedRowIds: (expandedRowIds) => set({ expandedRowIds }),
  syncFromUrl: ({ page, limit, search, sorting }, options) =>
    set((state) => {
      if (options?.ignoreIfInitialized && state.initialized) return state;

      const unchanged =
        state.page === page &&
        state.limit === limit &&
        state.search === search &&
        state.appliedSearch === search.trim() &&
        JSON.stringify(state.sorting) === JSON.stringify(sorting) &&
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
            initialized: true,
          };
    }),
  reset: () => set(initialState()),
}));
