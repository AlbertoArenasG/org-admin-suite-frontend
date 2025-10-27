'use client';

import { create } from 'zustand';
import type {
  PaginationState,
  SortingState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';
import type { UsersTableUser } from '@/components/users2/types';

type StringUpdater = string | ((prev: string) => string);

interface UsersTableStoreState {
  pagination: PaginationState;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  globalFilter: string;
  debouncedFilter: string;
  deleteTarget: UsersTableUser | null;
  initialized: boolean;
}

interface UsersTableStoreActions {
  setPagination: (updater: Updater<PaginationState>) => void;
  setSorting: (updater: Updater<SortingState>) => void;
  setColumnVisibility: (updater: Updater<VisibilityState>) => void;
  setGlobalFilter: (updater: StringUpdater) => void;
  setDebouncedFilter: (value: string) => void;
  setDeleteTarget: (user: UsersTableUser | null) => void;
  syncFromUrl: (state: {
    pagination: PaginationState;
    sorting: SortingState;
    globalFilter: string;
    debouncedFilter: string;
  }) => boolean;
  reset: () => void;
}

export type UsersTableStore = UsersTableStoreState & UsersTableStoreActions;

function applyUpdater<T>(updater: Updater<T>, current: T): T {
  return typeof updater === 'function' ? (updater as (prev: T) => T)(current) : updater;
}

function applyStringUpdater(updater: StringUpdater, current: string): string {
  return typeof updater === 'function' ? updater(current) : updater;
}

function createInitialState(): UsersTableStoreState {
  return {
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [],
    columnVisibility: {},
    globalFilter: '',
    debouncedFilter: '',
    deleteTarget: null,
    initialized: false,
  };
}

function arePaginationEqual(a: PaginationState, b: PaginationState) {
  return a.pageIndex === b.pageIndex && a.pageSize === b.pageSize;
}

export const useUsersTableStore = create<UsersTableStore>((set) => ({
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
      // Reference equality is enough here; TanStack table reuses arrays when possible.
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
  setDeleteTarget: (user) =>
    set((state) => {
      if (state.deleteTarget === user) {
        return state;
      }
      return { deleteTarget: user };
    }),
  syncFromUrl: (nextState) => {
    let hasChanges = false;
    set((state) => {
      const updates: Partial<UsersTableStoreState> = {};

      if (!arePaginationEqual(state.pagination, nextState.pagination)) {
        updates.pagination = nextState.pagination;
        hasChanges = true;
      }

      const sortingEqual =
        state.sorting.length === nextState.sorting.length &&
        state.sorting.every(
          (sort, index) =>
            sort.id === nextState.sorting[index].id && sort.desc === nextState.sorting[index].desc
        );
      if (!sortingEqual) {
        updates.sorting = nextState.sorting;
        hasChanges = true;
      }

      if (state.globalFilter !== nextState.globalFilter) {
        updates.globalFilter = nextState.globalFilter;
        hasChanges = true;
      }

      if (state.debouncedFilter !== nextState.debouncedFilter) {
        updates.debouncedFilter = nextState.debouncedFilter;
        hasChanges = true;
      }

      if (!state.initialized) {
        hasChanges = true;
      }

      updates.initialized = true;

      if (Object.keys(updates).length === 1 && updates.initialized && state.initialized) {
        return state;
      }

      return updates;
    });
    return hasChanges;
  },
  reset: () => set(() => createInitialState()),
}));
