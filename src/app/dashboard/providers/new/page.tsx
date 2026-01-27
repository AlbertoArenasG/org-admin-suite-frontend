'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { useTranslation } from 'react-i18next';
import { ProviderForm } from '@/components/providers/ProviderForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ProviderCreatePage() {
  const { t } = useTranslation(['providers', 'breadcrumbs']);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              {
                label: t('breadcrumbs:dashboard'),
                href: '/dashboard',
                hideOnDesktop: true,
              },
              {
                label: t('breadcrumbs:providers'),
                href: '/dashboard/providers',
              },
              {
                label: t('create.breadcrumb'),
              },
            ]}
          />
        </div>
      </header>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('create.title')}</h1>
        <p className="text-muted-foreground">{t('create.subtitle')}</p>
      </div>

      <Card className="rounded-3xl border border-border/70 bg-card/90 shadow-md">
        <CardHeader>
          <CardTitle>{t('create.formTitle')}</CardTitle>
          <CardDescription>{t('create.formSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProviderForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
