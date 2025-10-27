'use client';

import { create } from 'zustand';

type TabKey = 'stats' | 'list';

export interface ServiceEntrySurveyFilters {
  from: string;
  to: string;
  templateId: string | null;
  templateVersion: number | null;
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

const defaultFilters: ServiceEntrySurveyFilters = {
  from: '2025-01-01',
  to: new Date().toISOString().split('T')[0],
  templateId: 'service-entry-calibration-survey-v5',
  templateVersion: 5,
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
