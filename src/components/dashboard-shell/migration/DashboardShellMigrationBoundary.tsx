'use client';

import type { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import {
  resolveDashboardShell,
  type DashboardShellVariant,
} from '@/components/dashboard-shell/migration/dashboardShellMigration';
import { LegacyDashboardShell } from '@/components/dashboard-shell/migration/LegacyDashboardShell';

function assertSupportedDashboardShell(
  variant: DashboardShellVariant
): asserts variant is 'legacy' {
  if (variant !== 'legacy') {
    throw new Error(
      'The next dashboard shell cannot be activated until NextDashboardShell is implemented.'
    );
  }
}

/**
 * Central runtime boundary for the gradual dashboard shell migration.
 * The policy intentionally starts empty, so every current route stays legacy.
 */
export function DashboardShellMigrationBoundary({ children }: PropsWithChildren) {
  const shellVariant = resolveDashboardShell(usePathname());

  assertSupportedDashboardShell(shellVariant);

  return <LegacyDashboardShell>{children}</LegacyDashboardShell>;
}
