'use client';

import { useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerForm } from '@/components/customers/CustomerForm';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchCustomerById } from '@/features/customers/customersThunks';
import { CustomerDetailSkeleton } from '@/components/customers/CustomerDetailSkeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CustomerEditPage() {
  const params = useParams<{ customerId: string }>();
  const customerId = params.customerId;
  const { t } = useTranslation(['customers', 'breadcrumbs']);
  const dispatch = useAppDispatch();

  const detailState = useAppSelector((state) => state.customers.detail);
  const customers = useAppSelector((state) => state.customers.items);

  const customer = useMemo(() => {
    if (detailState.entry && detailState.entry.id === customerId) {
      return detailState.entry;
    }
    return customers.find((item) => item.id === customerId) ?? null;
  }, [customerId, customers, detailState.entry]);

  useEffect(() => {
    if (!customerId) {
      return;
    }
    if (!customer || detailState.entry?.id !== customerId) {
      void dispatch(fetchCustomerById({ id: customerId }));
    }
  }, [customerId, customer, detailState.entry?.id, dispatch]);

  const isLoading = detailState.status === 'loading' && !customer;
  const hasError = detailState.status === 'failed' && !customer;

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
                label: t('breadcrumbs:customers'),
                href: '/dashboard/customers',
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
        <CustomerDetailSkeleton />
      ) : hasError ? (
        <Alert variant="destructive">
          <AlertDescription>{detailState.error ?? t('detail.notFound')}</AlertDescription>
        </Alert>
      ) : customer ? (
        <Card className="rounded-3xl border border-border/70 bg-card/90 shadow-md">
          <CardHeader>
            <CardTitle>{t('edit.formTitle')}</CardTitle>
            <CardDescription>{t('edit.formSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerForm
              mode="edit"
              customerId={customer.id}
              initialValues={{
                companyName: customer.companyName,
                clientCode: customer.clientCode,
              }}
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
