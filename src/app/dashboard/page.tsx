'use client';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTranslation } from 'react-i18next';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              {
                label: t('breadcrumbs.home'),
                href: '/dashboard',
                hideOnDesktop: true,
              },
              {
                label: t('dashboard.title'),
              },
            ]}
          />
        </div>
      </header>

      <section className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">{t('dashboard.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-2xl border border-border/50 bg-muted/40" />
          <div className="aspect-video rounded-2xl border border-border/50 bg-muted/40" />
          <div className="aspect-video rounded-2xl border border-border/50 bg-muted/40" />
        </div>
        <div className="mt-4 min-h-[40vh] rounded-2xl border border-border/50 bg-muted/40" />
      </section>
    </div>
  );
}
