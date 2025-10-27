'use client';

import { create } from 'zustand';

type TabKey = 'stats' | 'list';

export interface ServiceEntrySurveyFilters {
  from: string;
  to: string;
  templateId: string | null;
  templateVersion: number | null;
  search: string;
  allDates: boolean;
}

interface ServiceEntrySurveysStoreState {
  filters: ServiceEntrySurveyFilters;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  activeTab: TabKey;
  setFilters: (updater: (current: ServiceEntrySurveyFilters) => ServiceEntrySurveyFilters) => void;
  setPagination: (
    updater: (current: { pageIndex: number; pageSize: number }) => {
      pageIndex: number;
      pageSize: number;
    }
  ) => void;
  setActiveTab: (tab: TabKey) => void;
  resetPagination: () => void;
}

const currentYear = new Date().getFullYear();
const startOfYear = `${currentYear}-01-01`;
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const formattedTomorrow = tomorrow.toISOString().split('T')[0];

const defaultFilters: ServiceEntrySurveyFilters = {
  from: startOfYear,
  to: formattedTomorrow,
  templateId: 'service-entry-calibration-survey-v5',
  templateVersion: 5,
  search: '',
  allDates: false,
};

export const useServiceEntrySurveysStore = create<ServiceEntrySurveysStoreState>((set) => ({
  filters: defaultFilters,
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  activeTab: 'stats',
  setFilters: (updater) =>
    set((state) => ({
      filters: updater(state.filters),
      pagination: {
        pageIndex: 0,
        pageSize: state.pagination.pageSize,
      },
    })),
  setPagination: (updater) =>
    set((state) => ({
      pagination: updater(state.pagination),
    })),
  setActiveTab: (tab) => set(() => ({ activeTab: tab })),
  resetPagination: () =>
    set((state) => ({
      pagination: {
        pageIndex: 0,
        pageSize: state.pagination.pageSize,
      },
    })),
}));
