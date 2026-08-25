'use client';

import { create } from 'zustand';
import type {
  PaginationState,
  SortingState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';

import type { UserRegistrationInvitationsFilters } from '@/features/user-registration-invitations';

type StringUpdater = string | ((prev: string) => string);
type FiltersUpdater =
  | UserRegistrationInvitationsFilters
  | ((prev: UserRegistrationInvitationsFilters) => UserRegistrationInvitationsFilters);

interface UserRegistrationInvitationsTableStoreState {
  pagination: PaginationState;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  globalFilter: string;
  debouncedFilter: string;
  filters: UserRegistrationInvitationsFilters;
  initialized: boolean;
}

interface UserRegistrationInvitationsTableStoreActions {
  setPagination: (updater: Updater<PaginationState>) => void;
  setSorting: (updater: Updater<SortingState>) => void;
  setColumnVisibility: (updater: Updater<VisibilityState>) => void;
  setGlobalFilter: (updater: StringUpdater) => void;
  setDebouncedFilter: (value: string) => void;
  setFilters: (updater: FiltersUpdater) => void;
  syncFromUrl: (state: {
    pagination: PaginationState;
    sorting: SortingState;
    globalFilter: string;
    debouncedFilter: string;
    filters: UserRegistrationInvitationsFilters;
  }) => boolean;
  reset: () => void;
}

export type UserRegistrationInvitationsTableStore = UserRegistrationInvitationsTableStoreState &
  UserRegistrationInvitationsTableStoreActions;

function applyUpdater<T>(updater: Updater<T>, current: T): T {
  return typeof updater === 'function' ? (updater as (prev: T) => T)(current) : updater;
}

function applyStringUpdater(updater: StringUpdater, current: string): string {
  return typeof updater === 'function' ? updater(current) : updater;
}

function applyFiltersUpdater(
  updater: FiltersUpdater,
  current: UserRegistrationInvitationsFilters
): UserRegistrationInvitationsFilters {
  return typeof updater === 'function' ? updater(current) : updater;
}

function createInitialState(): UserRegistrationInvitationsTableStoreState {
  return {
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [{ id: 'createdAt', desc: true }],
    columnVisibility: {},
    globalFilter: '',
    debouncedFilter: '',
    filters: {
      status: null,
    },
    initialized: false,
  };
}

function arePaginationEqual(a: PaginationState, b: PaginationState) {
  return a.pageIndex === b.pageIndex && a.pageSize === b.pageSize;
}

function areFiltersEqual(
  a: UserRegistrationInvitationsFilters,
  b: UserRegistrationInvitationsFilters
) {
  return a.status === b.status;
}

function areSortingEqual(a: SortingState, b: SortingState) {
  return (
    a.length === b.length &&
    a.every((sort, index) => sort.id === b[index]?.id && sort.desc === b[index]?.desc)
  );
}

export const useUserRegistrationInvitationsTableStore =
  create<UserRegistrationInvitationsTableStore>((set) => ({
    ...createInitialState(),
    setPagination: (updater) =>
      set((state) => {
        const next = applyUpdater(updater, state.pagination);
        return arePaginationEqual(state.pagination, next) ? state : { pagination: next };
      }),
    setSorting: (updater) =>
      set((state) => {
        const next = applyUpdater(updater, state.sorting);
        return areSortingEqual(state.sorting, next) ? state : { sorting: next };
      }),
    setColumnVisibility: (updater) =>
      set((state) => {
        const next = applyUpdater(updater, state.columnVisibility);
        return state.columnVisibility === next ? state : { columnVisibility: next };
      }),
    setGlobalFilter: (updater) =>
      set((state) => {
        const next = applyStringUpdater(updater, state.globalFilter);
        return state.globalFilter === next ? state : { globalFilter: next };
      }),
    setDebouncedFilter: (value) =>
      set((state) => (state.debouncedFilter === value ? state : { debouncedFilter: value })),
    setFilters: (updater) =>
      set((state) => {
        const next = applyFiltersUpdater(updater, state.filters);
        return areFiltersEqual(state.filters, next) ? state : { filters: next };
      }),
    syncFromUrl: (nextState) => {
      let hasChanges = false;

      set((state) => {
        const updates: Partial<UserRegistrationInvitationsTableStoreState> = {};

        if (!arePaginationEqual(state.pagination, nextState.pagination)) {
          updates.pagination = nextState.pagination;
          hasChanges = true;
        }
        if (!areSortingEqual(state.sorting, nextState.sorting)) {
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
          updates.initialized = true;
          hasChanges = true;
        }

        return Object.keys(updates).length ? updates : state;
      });

      return hasChanges;
    },
    reset: () => set(() => createInitialState()),
  }));
