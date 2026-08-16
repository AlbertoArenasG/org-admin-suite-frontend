'use client';

import { create } from 'zustand';
import type {
  PaginationState,
  SortingState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';
import type { RecipientGroupListFilters } from '@/features/recipient-groups/types';
import type { RecipientGroupsTableRow } from '@/components/recipient-groups/types';

type StringUpdater = string | ((prev: string) => string);
type FiltersUpdater =
  | RecipientGroupListFilters
  | ((prev: RecipientGroupListFilters) => RecipientGroupListFilters);

interface RecipientGroupsTableStoreState {
  pagination: PaginationState;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  globalFilter: string;
  debouncedFilter: string;
  filters: RecipientGroupListFilters;
  deleteTarget: RecipientGroupsTableRow | null;
  initialized: boolean;
}

interface RecipientGroupsTableStoreActions {
  setPagination: (updater: Updater<PaginationState>) => void;
  setSorting: (updater: Updater<SortingState>) => void;
  setColumnVisibility: (updater: Updater<VisibilityState>) => void;
  setGlobalFilter: (updater: StringUpdater) => void;
  setDebouncedFilter: (value: string) => void;
  setFilters: (updater: FiltersUpdater) => void;
  setDeleteTarget: (recipientGroup: RecipientGroupsTableRow | null) => void;
  syncFromUrl: (state: {
    pagination: PaginationState;
    sorting: SortingState;
    globalFilter: string;
    debouncedFilter: string;
    filters: RecipientGroupListFilters;
  }) => boolean;
  reset: () => void;
}

export type RecipientGroupsTableStore = RecipientGroupsTableStoreState &
  RecipientGroupsTableStoreActions;

function applyUpdater<T>(updater: Updater<T>, current: T): T {
  return typeof updater === 'function' ? (updater as (prev: T) => T)(current) : updater;
}

function applyStringUpdater(updater: StringUpdater, current: string): string {
  return typeof updater === 'function' ? updater(current) : updater;
}

function applyFiltersUpdater(
  updater: FiltersUpdater,
  current: RecipientGroupListFilters
): RecipientGroupListFilters {
  return typeof updater === 'function' ? updater(current) : updater;
}

function createInitialState(): RecipientGroupsTableStoreState {
  return {
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [{ id: 'createdAt', desc: true }],
    columnVisibility: {},
    globalFilter: '',
    debouncedFilter: '',
    filters: {
      status: null,
    },
    deleteTarget: null,
    initialized: false,
  };
}

function arePaginationEqual(a: PaginationState, b: PaginationState) {
  return a.pageIndex === b.pageIndex && a.pageSize === b.pageSize;
}

function areFiltersEqual(a: RecipientGroupListFilters, b: RecipientGroupListFilters) {
  return a.status === b.status;
}

export const useRecipientGroupsTableStore = create<RecipientGroupsTableStore>((set) => ({
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
  setFilters: (updater) =>
    set((state) => {
      const next = applyFiltersUpdater(updater, state.filters);
      if (areFiltersEqual(state.filters, next)) {
        return state;
      }
      return { filters: next };
    }),
  setDeleteTarget: (recipientGroup) =>
    set((state) => {
      if (state.deleteTarget === recipientGroup) {
        return state;
      }
      return { deleteTarget: recipientGroup };
    }),
  syncFromUrl: (nextState) => {
    let hasChanges = false;
    set((state) => {
      const updates: Partial<RecipientGroupsTableStoreState> = {};

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

      if (!areFiltersEqual(state.filters, nextState.filters)) {
        updates.filters = nextState.filters;
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
