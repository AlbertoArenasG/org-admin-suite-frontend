'use client';

import type { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import { resolveDashboardShell } from '@/components/dashboard-shell/migration/dashboardShellMigration';
import { LegacyDashboardShell } from '@/components/dashboard-shell/migration/LegacyDashboardShell';
import { NextDashboardShell } from '@/components/dashboard-shell/migration/NextDashboardShell';

/**
 * Central runtime boundary for the gradual dashboard shell migration.
 * The policy intentionally starts empty, so every current route stays legacy.
 */
export function DashboardShellMigrationBoundary({ children }: PropsWithChildren) {
  const resolution = resolveDashboardShell(usePathname());

  if (resolution.variant === 'next') {
    return <NextDashboardShell config={resolution.config}>{children}</NextDashboardShell>;
  }

  return <LegacyDashboardShell>{children}</LegacyDashboardShell>;
}
