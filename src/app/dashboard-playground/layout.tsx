'use client';

import type { PropsWithChildren } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppSidebar } from '@/components/sidebar/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardPlaygroundLayout({ children }: PropsWithChildren) {
  return (
    <AuthGuard>
      <SidebarProvider className="theme-sidebar min-h-svh bg-[color:var(--sidebar)] text-secondary-foreground/90 md:h-svh md:min-h-0 md:overflow-hidden">
        <AppSidebar />
        <SidebarInset className="min-h-svh bg-[color:var(--sidebar)] p-0 md:h-svh md:min-h-0 md:overflow-hidden">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
