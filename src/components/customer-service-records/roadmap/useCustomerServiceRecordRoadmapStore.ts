'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RoadmapView = 'gantt' | 'calendar' | 'list' | 'kanban' | 'table';
export type RoadmapScale = 'week' | 'month';

type State = {
  view: RoadmapView;
  scale: RoadmapScale;
  anchor: Date;
  navigationToken: number;
  setView: (view: RoadmapView) => void;
  setScale: (scale: RoadmapScale) => void;
  move: (direction: -1 | 1) => void;
  navigateFrom: (date: Date, direction: -1 | 1) => void;
  today: () => void;
};

export const useCustomerServiceRecordRoadmapStore = create<State>()(
  persist(
    (set) => ({
      view: 'table',
      scale: 'month',
      anchor: new Date(),
      navigationToken: 0,
      setView: (view) => set({ view }),
      setScale: (scale) => set({ scale }),
      move: (direction) =>
        set(({ anchor, scale }) => ({
          anchor:
            scale === 'week'
              ? new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + direction * 7)
              : new Date(anchor.getFullYear(), anchor.getMonth() + direction, 1),
        })),
      navigateFrom: (date, direction) =>
        set(({ scale, navigationToken }) => ({
          anchor:
            scale === 'week'
              ? new Date(date.getFullYear(), date.getMonth(), date.getDate() + direction * 7)
              : new Date(date.getFullYear(), date.getMonth() + direction, 1),
          navigationToken: navigationToken + 1,
        })),
      today: () =>
        set(({ navigationToken }) => ({
          anchor: new Date(),
          navigationToken: navigationToken + 1,
        })),
    }),
    {
      name: 'icsa-customer-service-records-roadmap-scale',
      partialize: (state) => ({ scale: state.scale }),
      skipHydration: true,
    }
  )
);
