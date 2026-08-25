'use client';

import { LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { SidebarTrigger } from '@/components/ui/sidebar';

export default function DashboardPage() {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <SidebarTrigger className="fixed top-4 left-4 z-20 rounded-lg border border-border/60 bg-card/90 shadow-sm backdrop-blur" />
      <section className="w-full max-w-md rounded-2xl border border-surface-border bg-surface-bg p-8 text-center shadow-[var(--surface-shadow)]">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-secondary-100 text-secondary-700">
          <LayoutDashboard className="size-6" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-xl font-semibold text-foreground">
          {t('dashboardComingSoonTitle')}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {t('dashboardComingSoonDescription')}
        </p>
      </section>
    </div>
  );
}
