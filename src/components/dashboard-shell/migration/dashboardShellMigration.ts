import type { DashboardScrollMode } from '@/components/dashboard-shell/DashboardShellContext';
import type { BreadcrumbSegment } from '@/components/shared/PageBreadcrumbs';

export type DashboardShellVariant = 'legacy' | 'next';

export interface NextDashboardShellRouteConfig {
  breadcrumbs: Array<BreadcrumbSegment & { labelKey?: string }>;
  scrollMode?: DashboardScrollMode;
}

interface DashboardShellMigrationEntry {
  matches: (pathname: string) => boolean;
  config: NextDashboardShellRouteConfig;
}

export type DashboardShellResolution =
  | { variant: 'legacy' }
  | { variant: 'next'; config: NextDashboardShellRouteConfig };

const nextDashboardShellRoutes: readonly DashboardShellMigrationEntry[] = [
  {
    matches: (pathname) => pathname === '/dashboard/portal/services',
    config: {
      breadcrumbs: [
        { label: 'Portal', labelKey: 'portal', href: '/dashboard' },
        { label: 'Seguimiento de servicios', labelKey: 'portalServices' },
      ],
      scrollMode: 'table-workspace',
    },
  },
];

export function resolveDashboardShell(pathname: string | null): DashboardShellResolution {
  const normalizedPathname = pathname ?? '/dashboard';
  const route = nextDashboardShellRoutes.find((entry) => entry.matches(normalizedPathname));

  return route ? { variant: 'next', config: route.config } : { variant: 'legacy' };
}
