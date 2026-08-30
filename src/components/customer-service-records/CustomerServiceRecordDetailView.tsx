'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomerServiceRecordSemaphoreBadge } from '@/components/customer-service-records/CustomerServiceRecordSemaphoreBadge';
import { CustomerServiceRecordDeleteDialog } from '@/components/customer-service-records/CustomerServiceRecordDeleteDialog';
import {
  deleteCustomerServiceRecord,
  fetchCustomerServiceRecordById,
  type CustomerServiceRecordInterval,
} from '@/features/customer-service-records';

interface CustomerServiceRecordDetailViewProps {
  recordId: string;
  canUpdate: boolean;
  canDelete: boolean;
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}

function DetailSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="gap-0 rounded-3xl border-border/60 py-0">
      <CardHeader className="border-b px-6 py-5">
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="grid gap-4 px-6 py-5 md:grid-cols-2">{children}</CardContent>
    </Card>
  );
}

function formatInterval(interval: CustomerServiceRecordInterval) {
  const parts = [
    interval.years ? `${interval.years}a` : null,
    interval.months ? `${interval.months}m` : null,
    interval.weeks ? `${interval.weeks}sem` : null,
    interval.days ? `${interval.days}d` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(' · ') : '0d';
}

export function CustomerServiceRecordDetailView({
  recordId,
  canUpdate,
  canDelete,
}: CustomerServiceRecordDetailViewProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const { t, hydrated, i18n } = useTranslationHydrated('customerServiceRecords');
  const detail = useAppSelector((state) => state.customerServiceRecords.detail);
  const mutations = useAppSelector((state) => state.customerServiceRecords.mutations);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    void dispatch(fetchCustomerServiceRecordById({ recordId }));
  }, [dispatch, recordId]);

  useEffect(() => {
    if (detail.status === 'failed' && detail.error) {
      showSnackbar({ message: detail.error, severity: 'error' });
    }
  }, [detail.error, detail.status, showSnackbar]);

  useEffect(() => {
    if (mutations.currentRecordId !== recordId) return;

    if (mutations.deleteStatus === 'succeeded') {
      showSnackbar({ message: mutations.message ?? t('delete.success'), severity: 'success' });
      setDeleteOpen(false);
      router.push('/dashboard/customer-service-records');
    }

    if (mutations.deleteStatus === 'failed') {
      showSnackbar({ message: mutations.error ?? t('delete.error'), severity: 'error' });
    }
  }, [mutations, recordId, router, showSnackbar, t]);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(hydrated ? i18n.language : 'es-MX', {
        dateStyle: 'medium',
      }),
    [hydrated, i18n.language]
  );
  const formatDate = (value: string | null) =>
    value ? dateFormatter.format(new Date(`${value}T12:00:00`)) : t('labels.notConfigured');

  if (detail.status === 'idle' || detail.status === 'loading') {
    return (
      <div className="grid gap-6">
        <Skeleton className="h-40 rounded-3xl" />
        <Skeleton className="h-56 rounded-3xl" />
        <Skeleton className="h-56 rounded-3xl" />
      </div>
    );
  }

  if (detail.status === 'failed' || !detail.item) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
        <span>{detail.error ?? t('detail.notFound')}</span>
        <Button
          type="button"
          variant="outline"
          onClick={() => void dispatch(fetchCustomerServiceRecordById({ recordId }))}
        >
          {t('actions.retry')}
        </Button>
      </div>
    );
  }

  const record = detail.item;
  const asset = record.assets[0];
  const provider = record.provider;

  return (
    <div className="grid gap-6">
      <Card className="rounded-3xl border-border/60 py-0">
        <CardHeader className="border-b px-6 py-5 sm:px-8 sm:py-6">
          <div>
            <CardTitle className="text-xl">{record.serviceNumber}</CardTitle>
            <CardDescription className="mt-1">{record.serviceType.name}</CardDescription>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {canUpdate ? (
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/customer-service-records/${recordId}/edit`)}
              >
                {t('actions.edit')}
              </Button>
            ) : null}
            {canDelete ? (
              <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                {t('actions.delete')}
              </Button>
            ) : null}
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard/customer-service-records')}
            >
              {t('actions.back')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 px-6 py-5 sm:px-8">
          <span className="rounded-full border border-border px-2.5 py-1 text-xs font-semibold">
            {record.operationalStatus.name}
          </span>
          <CustomerServiceRecordSemaphoreBadge
            materialization={record.customerDelivery.statusMaterialization}
            neutralLabel={t('labels.neutral')}
          />
          {provider ? (
            <CustomerServiceRecordSemaphoreBadge
              materialization={provider.statusMaterialization}
              neutralLabel={t('labels.neutral')}
            />
          ) : null}
        </CardContent>
      </Card>

      <DetailSection title={t('detail.sections.general')}>
        <DetailField label={t('detail.fields.serviceType')} value={record.serviceType.name} />
        <DetailField
          label={t('detail.fields.operationalStatus')}
          value={record.operationalStatus.name}
        />
        <DetailField
          label={t('detail.fields.requestedAt')}
          value={formatDate(record.requestedAt)}
        />
        <DetailField
          label={t('detail.fields.observations')}
          value={record.observations || t('labels.notConfigured')}
        />
      </DetailSection>

      <DetailSection title={t('detail.sections.customer')}>
        <DetailField label={t('detail.fields.customer')} value={record.customer.name} />
        <DetailField
          label={t('detail.fields.customerUsers')}
          value={
            record.customer.users.length
              ? record.customer.users
                  .map((user) => user.name || user.email)
                  .filter(Boolean)
                  .join(', ')
              : t('labels.notConfigured')
          }
        />
      </DetailSection>

      {asset ? (
        <DetailSection title={t('detail.sections.asset')}>
          <DetailField label={t('detail.fields.assetName')} value={asset.name} />
          <DetailField label={t('detail.fields.identifier')} value={asset.identifier} />
          <DetailField label={t('detail.fields.brand')} value={asset.brand} />
          <DetailField label={t('detail.fields.model')} value={asset.model} />
          <DetailField label={t('detail.fields.serialNumber')} value={asset.serialNumber} />
          <DetailField
            label={t('detail.fields.assetObservations')}
            value={asset.observations || t('labels.notConfigured')}
          />
        </DetailSection>
      ) : null}

      <DetailSection title={t('detail.sections.customerCommitment')}>
        <DetailField
          label={t('detail.fields.receivedAt')}
          value={formatDate(record.customerDelivery.receivedAt)}
        />
        <DetailField
          label={t('detail.fields.estimatedDeliveryAt')}
          value={formatDate(record.customerDelivery.estimatedDeliveryAt)}
        />
        <DetailField
          label={t('detail.fields.deliveryInterval')}
          value={formatInterval(record.customerDelivery.estimatedDeliveryInterval)}
        />
        <DetailField
          label={t('detail.fields.deliveredToCustomerAt')}
          value={formatDate(record.customerDelivery.deliveredToCustomerAt)}
        />
        <DetailField
          label={t('detail.fields.customerSemaphore')}
          value={
            <CustomerServiceRecordSemaphoreBadge
              materialization={record.customerDelivery.statusMaterialization}
              neutralLabel={t('labels.neutral')}
            />
          }
        />
      </DetailSection>

      {provider ? (
        <DetailSection title={t('detail.sections.provider')}>
          <DetailField label={t('detail.fields.provider')} value={provider.name} />
          <DetailField
            label={t('detail.fields.deliveredToProviderAt')}
            value={formatDate(provider.deliveredToProviderAt)}
          />
          <DetailField
            label={t('detail.fields.estimatedReturnAt')}
            value={formatDate(provider.estimatedReturnAt)}
          />
          <DetailField
            label={t('detail.fields.returnInterval')}
            value={formatInterval(provider.estimatedReturnInterval)}
          />
          <DetailField
            label={t('detail.fields.returnedFromProviderAt')}
            value={formatDate(provider.returnedFromProviderAt)}
          />
          <DetailField
            label={t('detail.fields.providerSemaphore')}
            value={
              <CustomerServiceRecordSemaphoreBadge
                materialization={provider.statusMaterialization}
                neutralLabel={t('labels.neutral')}
              />
            }
          />
        </DetailSection>
      ) : null}

      {provider?.followUp.enabled ? (
        <DetailSection title={t('detail.sections.followUp')}>
          <DetailField label={t('detail.fields.followUp')} value={t('labels.yes')} />
          <DetailField
            label={t('detail.fields.followUpRules')}
            value={String(provider.followUp.rules.length)}
          />
          {provider.followUp.rules.map((rule, index) => (
            <div
              key={`follow-up-${index}`}
              className="rounded-2xl border border-border/60 p-4 md:col-span-2"
            >
              <p className="mb-3 text-sm font-semibold">{t('detail.rule', { index: index + 1 })}</p>
              <div className="grid gap-4 md:grid-cols-3">
                <DetailField
                  label={t('detail.fields.followUpInterval')}
                  value={formatInterval(rule.interval)}
                />
                <DetailField
                  label={t('detail.fields.recipients')}
                  value={rule.recipientGroupIds.join(', ') || t('labels.notConfigured')}
                />
                <DetailField
                  label={t('detail.fields.copyRecipients')}
                  value={rule.ccRecipientGroupIds.join(', ') || t('labels.notConfigured')}
                />
              </div>
            </div>
          ))}
        </DetailSection>
      ) : null}

      <CustomerServiceRecordDeleteDialog
        open={deleteOpen}
        serviceNumber={record.serviceNumber}
        onOpenChange={setDeleteOpen}
        onConfirm={() => void dispatch(deleteCustomerServiceRecord({ recordId }))}
        isLoading={mutations.deleteStatus === 'loading' && mutations.currentRecordId === recordId}
        labels={{
          title: t('delete.title'),
          description: t('delete.description'),
          warning: t('delete.warning'),
          cancel: t('delete.cancel'),
          confirm: t('delete.confirm'),
        }}
      />
    </div>
  );
}
