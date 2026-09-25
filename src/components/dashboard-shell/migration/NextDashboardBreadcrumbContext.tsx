'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { PageBreadcrumbs, type BreadcrumbSegment } from '@/components/shared/PageBreadcrumbs';

type NextDashboardBreadcrumbContextValue = {
  segments: BreadcrumbSegment[];
  setSegments: (segments: BreadcrumbSegment[]) => void;
  resetSegments: () => void;
};

const NextDashboardBreadcrumbContext = createContext<NextDashboardBreadcrumbContextValue | null>(
  null
);

export function NextDashboardBreadcrumbProvider({
  children,
  initialSegments,
}: {
  children: ReactNode;
  initialSegments: BreadcrumbSegment[];
}) {
  const [segments, setSegments] = useState(initialSegments);

  const resetSegments = useCallback(() => {
    setSegments(initialSegments);
  }, [initialSegments]);

  const value = useMemo(
    () => ({ segments, setSegments, resetSegments }),
    [resetSegments, segments]
  );

  useEffect(() => {
    setSegments(initialSegments);
  }, [initialSegments]);

  return (
    <NextDashboardBreadcrumbContext.Provider value={value}>
      {children}
    </NextDashboardBreadcrumbContext.Provider>
  );
}

export function useNextDashboardBreadcrumbs() {
  const context = useContext(NextDashboardBreadcrumbContext);

  if (!context) {
    throw new Error(
      'useNextDashboardBreadcrumbs must be used within NextDashboardBreadcrumbProvider'
    );
  }

  return context;
}

export function NextDashboardBreadcrumbs() {
  const context = useContext(NextDashboardBreadcrumbContext);

  if (!context) {
    throw new Error('NextDashboardBreadcrumbs must be used within NextDashboardBreadcrumbProvider');
  }

  return <PageBreadcrumbs segments={context.segments} tone="workspace" />;
}
