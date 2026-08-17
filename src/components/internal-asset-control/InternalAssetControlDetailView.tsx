'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Button } from '@/components/ui/button';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import {
  fetchInternalAssetMaintenanceRecordById,
  setInternalAssetControlDetail,
} from '@/features/internal-asset-control';
import { Skeleton } from '@/components/ui/skeleton';

interface InternalAssetControlDetailViewProps {
  recordId: string;
  canUpdate: boolean;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '24px',
        border: '1px solid var(--surface-border)',
        bgcolor: 'var(--surface-bg)',
        color: 'var(--foreground)',
        boxShadow: 'var(--surface-shadow)',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid var(--surface-border)' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </Box>
      <div className="grid gap-4 p-4 md:grid-cols-2">{children}</div>
    </Paper>
  );
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm text-foreground">{value}</div>
    </div>
  );
}

function formatInterval(
  interval: { years: number; months: number; weeks: number; days: number } | null
) {
  if (!interval) {
    return null;
  }

  const parts = [
    interval.years ? `${interval.years}a` : null,
    interval.months ? `${interval.months}m` : null,
    interval.weeks ? `${interval.weeks}sem` : null,
    interval.days ? `${interval.days}d` : null,
  ].filter(Boolean);

  return parts.length ? parts.join(' · ') : '0d';
}

export function InternalAssetControlDetailView({
  recordId,
  canUpdate,
}: InternalAssetControlDetailViewProps) {
  const router = useRouter();
  const { t, hydrated, i18n } = useTranslationHydrated('internalAssetControl');
  const dispatch = useAppDispatch();
  const detail = useAppSelector((state) => state.internalAssetControl.detail);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (!recordId) {
      return;
    }
    void dispatch(
      fetchInternalAssetMaintenanceRecordById({ internalAssetMaintenanceRecordId: recordId })
    );
  }, [dispatch, recordId]);

  useEffect(
    () => () => {
      dispatch(setInternalAssetControlDetail(null));
    },
    [dispatch]
  );

  useEffect(() => {
    if (detail.status === 'failed' && detail.error) {
      showSnackbar({ message: detail.error, severity: 'error' });
    }
  }, [detail.error, detail.status, showSnackbar]);

  const dateFormatter = useMemo(() => {
    const fallback = i18n.options.fallbackLng;
    const fallbackLang = Array.isArray(fallback)
      ? fallback[0]
      : typeof fallback === 'string'
        ? fallback
        : 'es';
    const locale = hydrated ? i18n.language : fallbackLang;
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  }, [hydrated, i18n.language, i18n.options.fallbackLng]);

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
      <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
        {detail.error ?? t('detail.notFound')}
      </div>
    );
  }

  const record = detail.item;
  const lastMaintenanceDate = new Date(record.lastMaintenanceAt);
  const expirationDate = new Date(record.expirationDate);
  const sentToProviderAt = record.provider?.sentToProviderAt
    ? new Date(record.provider.sentToProviderAt)
    : null;
  const followUpLastSentAt = record.providerFollowUp?.lastSentAt
    ? new Date(record.providerFollowUp.lastSentAt)
    : null;

  return (
    <div className="grid gap-6">
      <Paper
        elevation={0}
        sx={{
          borderRadius: '24px',
          border: '1px solid var(--surface-border)',
          bgcolor: 'var(--surface-bg)',
          color: 'var(--foreground)',
          boxShadow: 'var(--surface-shadow)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{ px: 4, py: 4, borderBottom: '1px solid var(--surface-border)' }}
          className="flex flex-wrap items-start justify-between gap-4"
        >
          <div>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
              {record.assetName}
            </Typography>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip size="small" variant="outlined" label={record.assetIdentifier} />
              <Chip size="small" variant="outlined" label={record.statusName} />
              <Chip
                size="small"
                variant="filled"
                label={record.derivedStatus.name}
                sx={{
                  bgcolor: record.derivedStatus.colorHex,
                  color: '#fff',
                  fontWeight: 700,
                }}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {canUpdate ? (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(
                    `/dashboard/internal-asset-control/${record.internalAssetMaintenanceRecordId}/edit`
                  )
                }
              >
                {t('detail.edit')}
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push('/dashboard/internal-asset-control')}
            >
              {t('detail.back')}
            </Button>
          </div>
        </Box>
      </Paper>

      <SectionCard title={t('detail.sections.summary')}>
        <DetailField label={t('detail.fields.assetName')} value={record.assetName} />
        <DetailField label={t('detail.fields.assetIdentifier')} value={record.assetIdentifier} />
        <DetailField
          label={t('detail.fields.assetMaintenanceType')}
          value={record.assetMaintenanceType.name}
        />
        <DetailField label={t('detail.fields.status')} value={record.statusName} />
        <DetailField
          label={t('detail.fields.derivedStatus')}
          value={
            <Chip
              size="small"
              variant="filled"
              label={record.derivedStatus.name}
              sx={{ bgcolor: record.derivedStatus.colorHex, color: '#fff', fontWeight: 700 }}
            />
          }
        />
        <DetailField
          label={t('detail.fields.expirationDate')}
          value={dateFormatter.format(expirationDate)}
        />
      </SectionCard>

      <SectionCard title={t('detail.sections.record')}>
        <DetailField
          label={t('detail.fields.lastMaintenanceAt')}
          value={dateFormatter.format(lastMaintenanceDate)}
        />
        <DetailField
          label={t('detail.fields.observations')}
          value={record.observations || t('labels.notConfigured')}
        />
        <DetailField
          label={t('detail.fields.createdBy')}
          value={record.createdBy?.name || record.createdBy?.email || t('labels.notConfigured')}
        />
        <DetailField
          label={t('detail.fields.updatedBy')}
          value={record.updatedBy?.name || record.updatedBy?.email || t('labels.notConfigured')}
        />
      </SectionCard>

      <SectionCard title={t('detail.sections.policies')}>
        <DetailField
          label={t('detail.fields.expirationStatusPolicy')}
          value={record.expirationStatusPolicy?.name || t('labels.notConfigured')}
        />
        <DetailField
          label={t('detail.fields.expirationNotificationPolicy')}
          value={record.expirationNotificationPolicy?.name || t('labels.notConfigured')}
        />
      </SectionCard>

      <SectionCard title={t('detail.sections.provider')}>
        <DetailField
          label={t('detail.fields.sentToProvider')}
          value={record.sentToProvider ? t('labels.yes') : t('labels.no')}
        />
        <DetailField
          label={t('detail.fields.providerName')}
          value={record.providerName || t('labels.notConfigured')}
        />
        <DetailField
          label={t('detail.fields.sentToProviderAt')}
          value={
            sentToProviderAt ? dateFormatter.format(sentToProviderAt) : t('labels.notConfigured')
          }
        />
        <DetailField
          label={t('detail.fields.providerLeadTime')}
          value={formatInterval(record.providerLeadTime) || t('labels.notConfigured')}
        />
        <DetailField
          label={t('detail.fields.providerNotes')}
          value={record.provider?.providerNotes || t('labels.notConfigured')}
        />
        <DetailField
          label={t('detail.fields.providerFollowUpEnabled')}
          value={record.providerFollowUpEnabled ? t('labels.yes') : t('labels.no')}
        />
      </SectionCard>

      <SectionCard title={t('detail.sections.followUp')}>
        <DetailField
          label={t('detail.fields.providerFollowUpRulesCount')}
          value={String(record.providerFollowUpRulesCount)}
        />
        <DetailField
          label={t('detail.fields.providerFollowUpLastSentAt')}
          value={
            followUpLastSentAt
              ? dateFormatter.format(followUpLastSentAt)
              : t('labels.notConfigured')
          }
        />
      </SectionCard>
    </div>
  );
}
