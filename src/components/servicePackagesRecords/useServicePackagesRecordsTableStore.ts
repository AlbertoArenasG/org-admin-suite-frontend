'use client';

import { create } from 'zustand';
import type {
  PaginationState,
  SortingState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';

type StringUpdater = string | ((prev: string) => string);

interface ServicePackagesRecordsTableStoreState {
  pagination: PaginationState;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  globalFilter: string;
  debouncedFilter: string;
  deleteTargetId: string | null;
  initialized: boolean;
}

interface ServicePackagesRecordsTableStoreActions {
  setPagination: (updater: Updater<PaginationState>) => void;
  setSorting: (updater: Updater<SortingState>) => void;
  setColumnVisibility: (updater: Updater<VisibilityState>) => void;
  setGlobalFilter: (updater: StringUpdater) => void;
  setDebouncedFilter: (value: string) => void;
  setDeleteTargetId: (id: string | null) => void;
  setInitialized: (value: boolean) => void;
  syncFromUrl: (state: {
    pagination: PaginationState;
    sorting: SortingState;
    globalFilter: string;
    debouncedFilter: string;
  }) => void;
  reset: () => void;
}

export type ServicePackagesRecordsTableStore = ServicePackagesRecordsTableStoreState &
  ServicePackagesRecordsTableStoreActions;

function applyUpdater<T>(updater: Updater<T>, current: T): T {
  return typeof updater === 'function' ? (updater as (prev: T) => T)(current) : updater;
}

function applyStringUpdater(updater: StringUpdater, current: string): string {
  return typeof updater === 'function' ? updater(current) : updater;
}

const createInitialState = (): ServicePackagesRecordsTableStoreState => ({
  pagination: { pageIndex: 0, pageSize: 10 },
  sorting: [],
  columnVisibility: {},
  globalFilter: '',
  debouncedFilter: '',
  deleteTargetId: null,
  initialized: false,
});

export const useServicePackagesRecordsTableStore = create<ServicePackagesRecordsTableStore>(
  (set) => ({
    ...createInitialState(),
    setPagination: (updater) =>
      set((state) => {
        const next = applyUpdater(updater, state.pagination);
        if (
          state.pagination.pageIndex === next.pageIndex &&
          state.pagination.pageSize === next.pageSize
        ) {
          return state;
        }
        return { pagination: next };
      }),
    setSorting: (updater) =>
      set((state) => {
        const next = applyUpdater(updater, state.sorting);
        if (state.sorting === next) {
          return state;
        }
        return { sorting: next };
      }),
    setColumnVisibility: (updater) =>
      set((state) => {
        const next = applyUpdater(updater, state.columnVisibility);
        if (state.columnVisibility === next) {
          return state;
        }
        return { columnVisibility: next };
      }),
    setGlobalFilter: (updater) =>
      set((state) => {
        const next = applyStringUpdater(updater, state.globalFilter);
        if (state.globalFilter === next) {
          return state;
        }
        return { globalFilter: next };
      }),
    setDebouncedFilter: (value) =>
      set((state) => {
        if (state.debouncedFilter === value) {
          return state;
        }
        return { debouncedFilter: value };
      }),
    setDeleteTargetId: (id) =>
      set((state) => {
        if (state.deleteTargetId === id) {
          return state;
        }
        return { deleteTargetId: id };
      }),
    setInitialized: (value) =>
      set((state) => {
        if (state.initialized === value) {
          return state;
        }
        return { initialized: value };
      }),
    syncFromUrl: (nextState) =>
      set((state) => {
        const updates: Partial<ServicePackagesRecordsTableStoreState> = {};

        if (
          state.pagination.pageIndex !== nextState.pagination.pageIndex ||
          state.pagination.pageSize !== nextState.pagination.pageSize
        ) {
          updates.pagination = nextState.pagination;
        }

        if (
          state.sorting.length !== nextState.sorting.length ||
          state.sorting.some(
            (sort, index) =>
              sort.id !== nextState.sorting[index]?.id ||
              sort.desc !== nextState.sorting[index]?.desc
          )
        ) {
          updates.sorting = nextState.sorting;
        }

        if (state.globalFilter !== nextState.globalFilter) {
          updates.globalFilter = nextState.globalFilter;
        }

        if (state.debouncedFilter !== nextState.debouncedFilter) {
          updates.debouncedFilter = nextState.debouncedFilter;
        }

        if (!state.initialized) {
          updates.initialized = true;
        }

        return Object.keys(updates).length ? updates : state;
      }),
    reset: () => set(() => createInitialState()),
  })
);
