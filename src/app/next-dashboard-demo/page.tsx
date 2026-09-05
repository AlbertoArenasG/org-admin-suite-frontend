'use client';

import {
  DashboardPageComposition,
  DashboardPageContentScroller,
} from '@/components/dashboard-shell';
import {
  NextDashboardShell,
  type NextDashboardShellRouteConfig,
} from '@/components/dashboard-shell/migration';
import { NavigationCompositionDemoContent } from '@/components/playground/NavigationCompositionDemoContent';
import { useAppSelector } from '@/hooks/useAppSelector';

const demoConfig = {
  breadcrumbs: [
    { label: 'Panel', href: '/dashboard', hideOnDesktop: true },
    { label: 'Demo Next Dashboard' },
  ],
  scrollMode: 'page-content',
} satisfies NextDashboardShellRouteConfig;

export default function NextDashboardDemoPage() {
  const user = useAppSelector((state) => state.auth.user);

  if (user?.systemRole !== 'MASTER_ADMIN') {
    return (
      <p className="p-6 text-sm text-muted-foreground">No tienes acceso a este experimento.</p>
    );
  }

  return (
    <NextDashboardShell config={demoConfig}>
      <DashboardPageComposition>
        <DashboardPageContentScroller>
          <NavigationCompositionDemoContent />
        </DashboardPageContentScroller>
      </DashboardPageComposition>
    </NextDashboardShell>
  );
}
