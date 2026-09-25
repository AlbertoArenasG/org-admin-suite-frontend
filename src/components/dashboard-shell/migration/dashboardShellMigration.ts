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
  {
    matches: (pathname) => pathname === '/dashboard/customer-service-records',
    config: {
      breadcrumbs: [
        { label: 'Panel', labelKey: 'dashboard', href: '/dashboard', hideOnDesktop: true },
        { label: 'Servicios a clientes', labelKey: 'customerServiceRecords' },
      ],
      scrollMode: 'table-workspace',
    },
  },
  {
    matches: (pathname) => /^\/dashboard\/customer-service-records\/[^/]+$/.test(pathname),
    config: {
      breadcrumbs: [
        { label: 'Panel', labelKey: 'dashboard', href: '/dashboard', hideOnDesktop: true },
        {
          label: 'Servicios a clientes',
          labelKey: 'customerServiceRecords',
          href: '/dashboard/customer-service-records',
        },
        { label: 'Registro de servicio', labelKey: 'customerServiceRecordDetail' },
      ],
      scrollMode: 'page-content',
    },
  },
  {
    matches: (pathname) => {
      const match = /^\/dashboard\/users\/([^/]+)$/.exec(pathname);
      const staticRoutes = ['create', 'invite', 'invitations'];

      return Boolean(match && !staticRoutes.includes(match[1]));
    },
    config: {
      breadcrumbs: [
        { label: 'Panel', labelKey: 'dashboard', href: '/dashboard', hideOnDesktop: true },
        { label: 'Usuarios', labelKey: 'users', href: '/dashboard/users' },
        { label: 'Detalle de usuario', labelKey: 'userDetail' },
      ],
      scrollMode: 'page-content',
    },
  },
];

export function resolveDashboardShell(pathname: string | null): DashboardShellResolution {
  const normalizedPathname = pathname ?? '/dashboard';
  const route = nextDashboardShellRoutes.find((entry) => entry.matches(normalizedPathname));

  return route ? { variant: 'next', config: route.config } : { variant: 'legacy' };
}
