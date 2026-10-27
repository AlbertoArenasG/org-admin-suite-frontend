'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RoadmapView = 'gantt' | 'calendar' | 'list' | 'kanban' | 'table';
export type RoadmapScale = 'week' | 'month';

type State = {
  view: RoadmapView;
  scale: RoadmapScale;
  anchor: Date;
  setView: (view: RoadmapView) => void;
  setScale: (scale: RoadmapScale) => void;
  move: (direction: -1 | 1) => void;
  today: () => void;
};

export const useCustomerServiceRecordRoadmapStore = create<State>()(
  persist(
    (set) => ({
      view: 'table',
      scale: 'month',
      anchor: new Date(),
      setView: (view) => set({ view }),
      setScale: (scale) => set({ scale }),
      move: (direction) =>
        set(({ anchor, scale }) => ({
          anchor:
            scale === 'week'
              ? new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + direction * 7)
              : new Date(anchor.getFullYear(), anchor.getMonth() + direction, 1),
        })),
      today: () => set({ anchor: new Date() }),
    }),
    {
      name: 'icsa-customer-service-records-roadmap-scale',
      partialize: (state) => ({ scale: state.scale }),
      skipHydration: true,
    }
  )
);
