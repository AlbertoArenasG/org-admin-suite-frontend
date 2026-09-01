'use client';

import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { useTranslation } from 'react-i18next';
import { CustomerForm } from '@/components/customers/CustomerForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuthorization } from '@/features/auth';

export default function CustomerCreatePage() {
  const { t } = useTranslation(['customers', 'breadcrumbs']);
  const { hasPermission } = useAuthorization();
  const canCreate = hasPermission('CUSTOMERS', 'CREATE');

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
            label: t('create.breadcrumb'),
          },
        ]}
      />

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
          {!canCreate ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {t('restricted', {
                defaultValue: 'No cuentas con permiso para consultar este módulo.',
              })}
            </div>
          ) : (
            <CustomerForm mode="create" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
