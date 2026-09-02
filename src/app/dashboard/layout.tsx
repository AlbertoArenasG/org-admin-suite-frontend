'use client';

import type { PropsWithChildren } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { DashboardShellMigrationBoundary } from '@/components/dashboard-shell/migration';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <AuthGuard>
      <DashboardShellMigrationBoundary>{children}</DashboardShellMigrationBoundary>
    </AuthGuard>
  );
}
