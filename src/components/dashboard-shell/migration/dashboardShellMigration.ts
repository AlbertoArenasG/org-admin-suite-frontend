import type { DashboardScrollMode } from '@/components/dashboard-shell/DashboardShellContext';
import type { BreadcrumbSegment } from '@/components/shared/PageBreadcrumbs';

export type DashboardShellVariant = 'legacy' | 'next';

export interface NextDashboardShellRouteConfig {
  breadcrumbs: BreadcrumbSegment[];
  scrollMode?: DashboardScrollMode;
}

interface DashboardShellMigrationEntry {
  matches: (pathname: string) => boolean;
  config: NextDashboardShellRouteConfig;
}

export type DashboardShellResolution =
  | { variant: 'legacy' }
  | { variant: 'next'; config: NextDashboardShellRouteConfig };

const nextDashboardShellRoutes: readonly DashboardShellMigrationEntry[] = [];

export function resolveDashboardShell(pathname: string | null): DashboardShellResolution {
  const normalizedPathname = pathname ?? '/dashboard';
  const route = nextDashboardShellRoutes.find((entry) => entry.matches(normalizedPathname));

  return route ? { variant: 'next', config: route.config } : { variant: 'legacy' };
}
