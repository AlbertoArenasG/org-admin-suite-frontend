'use client';

import { useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProviderForm } from '@/components/providers/ProviderForm';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchProviderById } from '@/features/providers/providersThunks';
import { ProviderDetailSkeleton } from '@/components/providers/ProviderDetailSkeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProviderEditPage() {
  const params = useParams<{ providerId: string }>();
  const providerId = params.providerId;
  const { t } = useTranslation(['providers', 'breadcrumbs']);
  const dispatch = useAppDispatch();

  const detailState = useAppSelector((state) => state.providers.detail);
  const providers = useAppSelector((state) => state.providers.items);

  const provider = useMemo(() => {
    if (detailState.entry && detailState.entry.id === providerId) {
      return detailState.entry;
    }
    return providers.find((item) => item.id === providerId) ?? null;
  }, [detailState.entry, providerId, providers]);

  useEffect(() => {
    if (!providerId) {
      return;
    }
    if (!provider || detailState.entry?.id !== providerId) {
      void dispatch(fetchProviderById({ id: providerId }));
    }
  }, [dispatch, provider, providerId, detailState.entry?.id]);

  const isLoading = detailState.status === 'loading' && !provider;
  const hasError = detailState.status === 'failed' && !provider;

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
                label: t('edit.breadcrumb'),
              },
            ]}
          />
        </div>
      </header>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('edit.title')}</h1>
        <p className="text-muted-foreground">{t('edit.subtitle')}</p>
      </div>

      {isLoading ? (
        <ProviderDetailSkeleton />
      ) : hasError ? (
        <Alert variant="destructive">
          <AlertDescription>{detailState.error ?? t('detail.notFound')}</AlertDescription>
        </Alert>
      ) : provider ? (
        <Card className="rounded-3xl border border-border/70 bg-card/90 shadow-md">
          <CardHeader>
            <CardTitle>{t('edit.formTitle')}</CardTitle>
            <CardDescription>{t('edit.formSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ProviderForm
              mode="edit"
              providerId={provider.id}
              initialValues={{
                companyName: provider.companyName,
                providerCode: provider.providerCode,
              }}
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
