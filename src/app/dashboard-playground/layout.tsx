'use client';

import type { PropsWithChildren } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppSidebar } from '@/components/sidebar/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardPlaygroundLayout({ children }: PropsWithChildren) {
  return (
    <AuthGuard>
      <SidebarProvider className="theme-sidebar dashboard-shell min-h-svh text-secondary-foreground/90 md:h-svh md:min-h-0 md:overscroll-y-none md:overflow-hidden">
        <AppSidebar />
        <SidebarInset className="min-h-svh bg-transparent p-0 md:h-svh md:min-h-0 md:overscroll-y-none md:overflow-hidden">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
