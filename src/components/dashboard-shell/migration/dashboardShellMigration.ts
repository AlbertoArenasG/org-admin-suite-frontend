export type DashboardShellVariant = 'legacy' | 'next';

interface DashboardShellMigrationEntry {
  matches: (pathname: string) => boolean;
}

const nextDashboardShellRoutes: readonly DashboardShellMigrationEntry[] = [];

export function resolveDashboardShell(pathname: string | null): DashboardShellVariant {
  const normalizedPathname = pathname ?? '/dashboard';

  return nextDashboardShellRoutes.some((route) => route.matches(normalizedPathname))
    ? 'next'
    : 'legacy';
}
