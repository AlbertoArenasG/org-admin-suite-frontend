'use client';

import { create } from 'zustand';
import type {
  PaginationState,
  SortingState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';

type StringUpdater = string | ((prev: string) => string);

interface ServiceEntriesTableStoreState {
  pagination: PaginationState;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  globalFilter: string;
  debouncedFilter: string;
  deleteTargetId: string | null;
  initialized: boolean;
}

interface ServiceEntriesTableStoreActions {
  setPagination: (updater: Updater<PaginationState>) => void;
  setSorting: (updater: Updater<SortingState>) => void;
  setColumnVisibility: (updater: Updater<VisibilityState>) => void;
  setGlobalFilter: (updater: StringUpdater) => void;
  setDebouncedFilter: (value: string) => void;
  setDeleteTargetId: (id: string | null) => void;
  syncFromUrl: (state: {
    pagination: PaginationState;
    sorting: SortingState;
    globalFilter: string;
    debouncedFilter: string;
  }) => void;
  setInitialized: (value: boolean) => void;
  reset: () => void;
}

const initialState: ServiceEntriesTableStoreState = {
  pagination: { pageIndex: 0, pageSize: 10 },
  sorting: [],
  columnVisibility: {},
  globalFilter: '',
  debouncedFilter: '',
  deleteTargetId: null,
  initialized: false,
};

function applyUpdater<T>(updater: Updater<T>, current: T): T {
  return typeof updater === 'function' ? (updater as (value: T) => T)(current) : updater;
}

function applyStringUpdater(updater: StringUpdater, current: string) {
  return typeof updater === 'function' ? updater(current) : updater;
}

export const useServiceEntriesTableStore = create<
  ServiceEntriesTableStoreState & ServiceEntriesTableStoreActions
>((set) => ({
  ...initialState,
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
  syncFromUrl: (nextState) =>
    set((state) => {
      const updates: Partial<ServiceEntriesTableStoreState> = {};
      if (
        state.pagination.pageIndex !== nextState.pagination.pageIndex ||
        state.pagination.pageSize !== nextState.pagination.pageSize
      ) {
        updates.pagination = nextState.pagination;
      }
      if (state.globalFilter !== nextState.globalFilter) {
        updates.globalFilter = nextState.globalFilter;
      }
      if (state.debouncedFilter !== nextState.debouncedFilter) {
        updates.debouncedFilter = nextState.debouncedFilter;
      }
      const sortingEqual =
        state.sorting.length === nextState.sorting.length &&
        state.sorting.every(
          (sort, index) =>
            sort.id === nextState.sorting[index].id && sort.desc === nextState.sorting[index].desc
        );
      if (!sortingEqual) {
        updates.sorting = nextState.sorting;
      }
      if (Object.keys(updates).length === 0) {
        return state;
      }
      return updates;
    }),
  setInitialized: (value) =>
    set((state) => (state.initialized === value ? state : { initialized: value })),
  reset: () => set(() => initialState),
}));
