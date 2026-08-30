'use client';

import { create } from 'zustand';
import type {
  PaginationState,
  SortingState,
  Updater,
  VisibilityState,
} from '@tanstack/react-table';
import type { CustomerServiceRecordsListFilters } from '@/features/customer-service-records';

type StringUpdater = string | ((current: string) => string);
type FiltersUpdater =
  | CustomerServiceRecordsListFilters
  | ((current: CustomerServiceRecordsListFilters) => CustomerServiceRecordsListFilters);

interface CustomerServiceRecordsTableStore {
  pagination: PaginationState;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  globalFilter: string;
  debouncedFilter: string;
  filters: CustomerServiceRecordsListFilters;
  initialized: boolean;
  setPagination: (updater: Updater<PaginationState>) => void;
  setSorting: (updater: Updater<SortingState>) => void;
  setColumnVisibility: (updater: Updater<VisibilityState>) => void;
  setGlobalFilter: (updater: StringUpdater) => void;
  setDebouncedFilter: (value: string) => void;
  setFilters: (updater: FiltersUpdater) => void;
  syncFromUrl: (value: {
    pagination: PaginationState;
    sorting: SortingState;
    globalFilter: string;
    debouncedFilter: string;
    filters: CustomerServiceRecordsListFilters;
  }) => void;
  reset: () => void;
}

const initialFilters: CustomerServiceRecordsListFilters = {
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

function createInitialState() {
  return {
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [{ id: 'createdAt', desc: true }] as SortingState,
    columnVisibility: {},
    globalFilter: '',
    debouncedFilter: '',
    filters: initialFilters,
    initialized: false,
  };
}

function valuesEqual(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export const useCustomerServiceRecordsTableStore = create<CustomerServiceRecordsTableStore>(
  (set) => ({
    ...createInitialState(),
    setPagination: (updater) =>
      set((state) => ({
        pagination: typeof updater === 'function' ? updater(state.pagination) : updater,
      })),
    setSorting: (updater) =>
      set((state) => ({
        sorting: typeof updater === 'function' ? updater(state.sorting) : updater,
      })),
    setColumnVisibility: (updater) =>
      set((state) => ({
        columnVisibility: typeof updater === 'function' ? updater(state.columnVisibility) : updater,
      })),
    setGlobalFilter: (updater) =>
      set((state) => ({
        globalFilter: typeof updater === 'function' ? updater(state.globalFilter) : updater,
      })),
    setDebouncedFilter: (value) => set({ debouncedFilter: value }),
    setFilters: (updater) =>
      set((state) => ({
        filters: typeof updater === 'function' ? updater(state.filters) : updater,
      })),
    syncFromUrl: (value) =>
      set((state) => {
        if (
          valuesEqual(state.pagination, value.pagination) &&
          valuesEqual(state.sorting, value.sorting) &&
          state.globalFilter === value.globalFilter &&
          state.debouncedFilter === value.debouncedFilter &&
          valuesEqual(state.filters, value.filters) &&
          state.initialized
        ) {
          return state;
        }
        return { ...value, initialized: true };
      }),
    reset: () => set(createInitialState()),
  })
);
