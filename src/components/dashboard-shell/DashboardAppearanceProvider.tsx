'use client';

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type PropsWithChildren,
} from 'react';

export const DASHBOARD_APPEARANCES = ['classic', 'ambient'] as const;

export type DashboardAppearance = (typeof DASHBOARD_APPEARANCES)[number];

type DashboardAppearanceContextValue = {
  appearance: DashboardAppearance;
  setAppearance: (appearance: DashboardAppearance) => void;
};

const DashboardAppearanceContext = createContext<DashboardAppearanceContextValue | null>(null);

export function DashboardAppearanceProvider({ children }: PropsWithChildren) {
  const [appearance, setAppearance] = useState<DashboardAppearance>('classic');

  useLayoutEffect(() => {
    document.documentElement.dataset.dashboardAppearance = appearance;
  }, [appearance]);

  return (
    <DashboardAppearanceContext.Provider value={{ appearance, setAppearance }}>
      {children}
    </DashboardAppearanceContext.Provider>
  );
}

export function useDashboardAppearance() {
  const context = useContext(DashboardAppearanceContext);

  if (!context) {
    throw new Error('useDashboardAppearance must be used within DashboardAppearanceProvider.');
  }

  return context;
}
