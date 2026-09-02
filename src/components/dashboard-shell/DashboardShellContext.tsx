'use client';

import { createContext, useContext } from 'react';

export type DashboardScrollMode = 'page-content' | 'workspace';

const DashboardShellScrollModeContext = createContext<DashboardScrollMode>('page-content');

export function useDashboardShellScrollMode() {
  return useContext(DashboardShellScrollModeContext);
}

export { DashboardShellScrollModeContext };
