'use client';

import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchServiceEntryById } from '@/features/serviceEntries/serviceEntriesThunks';
import {
  resetServiceEntryDetail,
  type ServiceEntryFileMetadata,
} from '@/features/serviceEntries/serviceEntriesSlice';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { Skeleton } from '@/components/ui/skeleton';
export default function ServiceEntryDetailPage() {
  const params = useParams<{ serviceEntryId: string }>();
  const router = useRouter();
  const { t, hydrated, i18n } = useTranslationHydrated('common');
  const dispatch = useAppDispatch();
  const detail = useAppSelector((state) => state.serviceEntries.detail);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (!params.serviceEntryId) {
      return;
    }
    void dispatch(fetchServiceEntryById({ id: params.serviceEntryId }));
  }, [dispatch, params.serviceEntryId]);

  useEffect(
    () => () => {
      dispatch(resetServiceEntryDetail());
    },
    [dispatch]
  );

  useEffect(() => {
    if (detail.status === 'failed' && detail.error) {
      showSnackbar({
        message: detail.error,
        severity: 'error',
      });
    }
  }, [detail.error, detail.status, showSnackbar]);

  const dateFormatter = new Intl.DateTimeFormat(hydrated ? i18n.language : 'es', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  if (detail.status === 'idle' || detail.status === 'loading') {
    return <ServiceEntryDetailSkeleton />;
  }

  const entry = detail.entry;

  if (detail.status === 'failed' || !entry) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        {detail.error ??
          t('serviceEntries.detail.notFound', { defaultValue: 'Servicio no encontrado.' })}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              { label: t('breadcrumbs.dashboard'), href: '/dashboard', hideOnDesktop: true },
              { label: t('serviceEntries.breadcrumb'), href: '/dashboard/service-entries' },
              { label: entry?.companyName ?? '—' },
            ]}
          />
        </div>
      </header>

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
          minHeight: '50vh',
        }}
      >
        <Box
          sx={{ px: 4, py: 4, borderBottom: '1px solid var(--surface-border)' }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
              {entry?.companyName ?? t('serviceEntries.detail.placeholder')}
            </Typography>
            <Typography variant="body2" color="text.foreground">
              {entry?.serviceOrderIdentifier ? `#${entry.serviceOrderIdentifier}` : '—'}
            </Typography>
          </div>
          <Chip label={entry?.statusName ?? '—'} color="primary" variant="outlined" />
        </Box>
        <div className="grid gap-4 p-6 md:grid-cols-2">
          <DetailItem
            label={t('serviceEntries.detail.contactName')}
            value={entry?.contactName ?? '—'}
          />
          <DetailItem
            label={t('serviceEntries.detail.contactEmail')}
            value={entry?.contactEmail ?? '—'}
          />
          <DetailItem
            label={t('serviceEntries.detail.category')}
            value={entry?.categoryName ?? '—'}
          />
          <DetailItem
            label={t('serviceEntries.detail.createdAt')}
            value={entry?.createdAt ? dateFormatter.format(new Date(entry.createdAt)) : '—'}
          />
          <DetailItem
            label={t('serviceEntries.detail.updatedAt')}
            value={
              entry?.updatedAt
                ? dateFormatter.format(new Date(entry.updatedAt))
                : t('common:notAvailable', { defaultValue: 'N/A' })
            }
          />
          <DetailItem
            label={t('serviceEntries.detail.surveyStatus')}
            value={getSurveyStatusLabel(entry?.surveyStatus, {
              completed: (submittedAt) =>
                submittedAt
                  ? t('serviceEntries.detail.surveyCompletedWithDate', {
                      date: dateFormatter.format(new Date(submittedAt)),
                    })
                  : t('serviceEntries.detail.surveyCompleted'),
              pending: t('serviceEntries.detail.surveyPending'),
              notStarted: t('serviceEntries.detail.surveyNotStarted'),
            })}
          />
          <DetailItem
            label={t('serviceEntries.detail.downloadStatus')}
            value={getDownloadStatusLabel(entry?.downloadStatus, {
              available: (count, lastAt) =>
                t('serviceEntries.detail.downloadAvailable', {
                  count,
                  last: lastAt
                    ? dateFormatter.format(new Date(lastAt))
                    : t('serviceEntries.detail.notDownloaded'),
                }),
              never: t('serviceEntries.detail.downloadNever'),
              inactive: t('serviceEntries.detail.downloadUnavailable'),
            })}
          />
        </div>
        <div className="px-6 pb-6">
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {t('serviceEntries.detail.files')}
          </Typography>
          <div className="mt-3 grid gap-3">
            <FileList
              title={t('serviceEntries.detail.calibrationCertificate')}
              files={
                entry?.filesMetadata?.calibration_certificate
                  ? [entry.filesMetadata.calibration_certificate]
                  : []
              }
            />
            <FileList
              title={t('serviceEntries.detail.attachments')}
              files={entry?.filesMetadata?.attachments ?? []}
            />
          </div>
        </div>
        <div className="flex gap-2 border-t border-border/60 px-6 py-4">
          <Button variant="outline" onClick={() => router.back()}>
            {t('serviceEntries.detail.actions.back')}
          </Button>
          <Button
            onClick={() => router.push(`/dashboard/service-entries/${params.serviceEntryId}/edit`)}
          >
            {t('serviceEntries.detail.actions.edit')}
          </Button>
        </div>
      </Paper>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 px-4 py-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function FileList({ title, files }: { title: string; files: ServiceEntryFileMetadata[] }) {
  if (!files.length) {
    return (
      <div>
        <Typography variant="subtitle2" color="text.foreground">
          {title}
        </Typography>
        <Typography variant="body2" color="text.foreground">
          —
        </Typography>
      </div>
    );
  }
  return (
    <div>
      <Typography variant="subtitle2" color="text.foreground">
        {title}
      </Typography>
      <ul className="mt-1 space-y-2">
        {files.map((file) => (
          <li key={file.file_id}>
            <a
              href={file.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline"
            >
              {file.original_name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ServiceEntryDetailSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <Skeleton className="h-16 rounded-3xl" />
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
          minHeight: '50vh',
        }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-border/60 px-6 py-5">
          <div className="space-y-2">
            <Skeleton className="h-5 w-52 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-xl" />
          ))}
        </div>
        <div className="px-6 pb-6">
          <Skeleton className="h-5 w-48 rounded-lg" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
        <div className="flex gap-2 border-t border-border/60 px-6 py-4">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </Paper>
    </div>
  );
}

function getSurveyStatusLabel(
  survey:
    | {
        completed: boolean;
        submitted_at: string | null;
      }
    | null
    | undefined,
  labels: {
    completed: (submittedAt: string | null) => string;
    pending: string;
    notStarted: string;
  }
) {
  if (!survey) {
    return labels.notStarted;
  }
  if (survey.completed) {
    return labels.completed(survey.submitted_at);
  }
  return labels.pending;
}

function getDownloadStatusLabel(
  download:
    | {
        has_download: boolean;
        last_downloaded_at: string | null;
        download_count: number;
      }
    | null
    | undefined,
  labels: {
    available: (count: number, lastAt: string | null) => string;
    never: string;
    inactive: string;
  }
) {
  if (!download) {
    return labels.inactive;
  }
  if (download.has_download) {
    return labels.available(download.download_count ?? 0, download.last_downloaded_at ?? null);
  }
  return labels.never;
}
