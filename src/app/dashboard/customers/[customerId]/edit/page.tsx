'use client';

import { useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerForm } from '@/components/customers/CustomerForm';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchCustomerById } from '@/features/customers/customersThunks';
import { CustomerDetailSkeleton } from '@/components/customers/CustomerDetailSkeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthorization } from '@/features/auth';

export default function CustomerEditPage() {
  const params = useParams<{ customerId: string }>();
  const customerId = params.customerId;
  const { t } = useTranslation(['customers', 'breadcrumbs']);
  const dispatch = useAppDispatch();
  const { hasPermission } = useAuthorization();

  const detailState = useAppSelector((state) => state.customers.detail);
  const customers = useAppSelector((state) => state.customers.items);

  const customer = useMemo(() => {
    if (detailState.entry && detailState.entry.id === customerId) {
      return detailState.entry;
    }
    return customers.find((item) => item.id === customerId) ?? null;
  }, [customerId, customers, detailState.entry]);
  const canUpdate = hasPermission('CUSTOMERS', 'UPDATE');

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
      <DashboardPageHeader
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
            {!canUpdate ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {t('edit.restricted', {
                  defaultValue: 'No cuentas con permiso para editar este cliente.',
                })}
              </div>
            ) : (
              <CustomerForm
                mode="edit"
                customerId={customer.id}
                initialValues={{
                  companyName: customer.companyName,
                  clientCode: customer.clientCode,
                }}
              />
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
