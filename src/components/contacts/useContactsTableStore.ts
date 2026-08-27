'use client';

import { create } from 'zustand';
import type {
  PaginationState,
  SortingState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';
import type { ContactListFilters } from '@/features/contacts/types';
import type { ContactsTableRow } from '@/components/contacts/types';

type StringUpdater = string | ((prev: string) => string);
type FiltersUpdater = ContactListFilters | ((prev: ContactListFilters) => ContactListFilters);

interface ContactsTableStoreState {
  pagination: PaginationState;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  globalFilter: string;
  debouncedFilter: string;
  filters: ContactListFilters;
  deleteTarget: ContactsTableRow | null;
  initialized: boolean;
}

interface ContactsTableStoreActions {
  setPagination: (updater: Updater<PaginationState>) => void;
  setSorting: (updater: Updater<SortingState>) => void;
  setColumnVisibility: (updater: Updater<VisibilityState>) => void;
  setGlobalFilter: (updater: StringUpdater) => void;
  setDebouncedFilter: (value: string) => void;
  setFilters: (updater: FiltersUpdater) => void;
  setDeleteTarget: (contact: ContactsTableRow | null) => void;
  syncFromUrl: (state: {
    pagination: PaginationState;
    sorting: SortingState;
    globalFilter: string;
    debouncedFilter: string;
    filters: ContactListFilters;
  }) => boolean;
  reset: () => void;
}

export type ContactsTableStore = ContactsTableStoreState & ContactsTableStoreActions;

function applyUpdater<T>(updater: Updater<T>, current: T): T {
  return typeof updater === 'function' ? (updater as (prev: T) => T)(current) : updater;
}

function applyStringUpdater(updater: StringUpdater, current: string): string {
  return typeof updater === 'function' ? updater(current) : updater;
}

function applyFiltersUpdater(
  updater: FiltersUpdater,
  current: ContactListFilters
): ContactListFilters {
  return typeof updater === 'function' ? updater(current) : updater;
}

function createInitialState(): ContactsTableStoreState {
  return {
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [{ id: 'createdAt', desc: true }],
    columnVisibility: {},
    globalFilter: '',
    debouncedFilter: '',
    filters: {
      status: null,
      isInternalStaff: null,
    },
    deleteTarget: null,
    initialized: false,
  };
}

function arePaginationEqual(a: PaginationState, b: PaginationState) {
  return a.pageIndex === b.pageIndex && a.pageSize === b.pageSize;
}

function areFiltersEqual(a: ContactListFilters, b: ContactListFilters) {
  return a.status === b.status && a.isInternalStaff === b.isInternalStaff;
}

export const useContactsTableStore = create<ContactsTableStore>((set) => ({
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
  setDeleteTarget: (contact) =>
    set((state) => {
      if (state.deleteTarget === contact) {
        return state;
      }
      return { deleteTarget: contact };
    }),
  syncFromUrl: (nextState) => {
    let hasChanges = false;
    set((state) => {
      const updates: Partial<ContactsTableStoreState> = {};

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
