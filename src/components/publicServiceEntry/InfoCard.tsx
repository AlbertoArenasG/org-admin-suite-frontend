'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import type { PublicServiceEntryDetail } from '@/features/publicServiceEntry/types';

interface InfoCardProps {
  entry: PublicServiceEntryDetail;
}

export function PublicServiceEntryInfoCard({ entry }: InfoCardProps) {
  const { t } = useTranslation('publicServiceEntry');

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  });

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
        display: 'flex',
        flexDirection: 'column',
      }}
      className="relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-primary/50 to-secondary" />
      <div className="px-6 py-6">
        <div className="flex flex-col gap-2">
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.2rem' }}>
            {entry.companyName}
          </Typography>
          <Typography variant="body2" color="text.foreground">
            {t('info.serviceOrder', {
              id: entry.serviceOrderIdentifier,
            })}
          </Typography>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <InfoItem label={t('info.contactName')} value={entry.contactName} />
          <InfoItem label={t('info.contactEmail')} value={entry.contactEmail} />
          <InfoItem label={t('info.category')} value={entry.categoryName} />
          <InfoItem label={t('info.status')} value={entry.statusName} />
          <InfoItem
            label={t('info.createdAt')}
            value={dateFormatter.format(new Date(entry.createdAt))}
          />
          <InfoItem
            label={t('info.updatedAt')}
            value={
              entry.updatedAt
                ? dateFormatter.format(new Date(entry.updatedAt))
                : t('info.notAvailable')
            }
          />
        </div>
      </div>
    </Paper>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value || '—'}</p>
    </div>
  );
}
