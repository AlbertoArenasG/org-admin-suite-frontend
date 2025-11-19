'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { CustomersListContainer } from '@/components/customers/CustomersListContainer';

export default function CustomersPage() {
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
                label: t('breadcrumbs.dashboard'),
                href: '/dashboard',
                hideOnDesktop: true,
              },
              {
                label: t('breadcrumbs.customers'),
              },
            ]}
          />
        </div>
      </header>

      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('customers.title')}</h1>
        <p className="text-muted-foreground">{t('customers.subtitle')}</p>
      </section>

      <CustomersListContainer />
    </div>
  );
}
