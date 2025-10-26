'use client';

import { Suspense, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Typography from '@mui/material/Typography';
import { ModeToggle } from '@/components/shared/ModeToggle';
import SelectLang from '@/components/shared/LangToggle';
import { usePublicServiceEntryStore } from '@/stores/usePublicServiceEntryStore';
import { PublicServiceEntryInfoCard } from '@/components/publicServiceEntry/InfoCard';
import { PublicServiceEntrySurveyForm } from '@/components/publicServiceEntry/SurveyForm';
import { PublicServiceEntryFilesSection } from '@/components/publicServiceEntry/FilesSection';
import { PublicServiceEntrySkeleton } from '@/components/publicServiceEntry/Skeleton';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { FullScreenLoader } from '@/components/ui/full-screen-loader';

export default function PublicServiceEntryPage() {
  return (
    <Suspense fallback={<PublicServiceEntrySkeleton />}>
      <PublicServiceEntryContent />
    </Suspense>
  );
}

function PublicServiceEntryContent() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const { t } = useTranslation('common');
  const { showSnackbar } = useSnackbar();

  const fetchEntry = usePublicServiceEntryStore((state) => state.fetchEntry);
  const reset = usePublicServiceEntryStore((state) => state.reset);
  const status = usePublicServiceEntryStore((state) => state.status);
  const error = usePublicServiceEntryStore((state) => state.error);
  const entry = usePublicServiceEntryStore((state) => state.entry);
  const downloadsEnabled = usePublicServiceEntryStore((state) => state.downloadsEnabled);
  const surveySubmitting = usePublicServiceEntryStore((state) => state.surveySubmitting);

  useEffect(() => {
    if (!token) {
      return;
    }
    void fetchEntry(token);
    return () => reset();
  }, [fetchEntry, reset, token]);

  useEffect(() => {
    if (status === 'error' && error) {
      showSnackbar({
        message: error,
        severity: 'error',
      });
    }
  }, [error, showSnackbar, status]);

  const surveyAlreadyCompleted = Boolean(entry?.surveyStatus?.completed);

  return (
    <div className="min-h-screen bg-[color:var(--public-bg,#f5f5fb)] dark:bg-background">
      <header className="flex items-center justify-between gap-3 bg-transparent px-6 py-4">
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          {t('publicServiceEntry.header')}
        </Typography>
        <div className="flex items-center gap-2">
          <ModeToggle
            buttonVariant="outline"
            buttonSize="icon"
            buttonClassName="size-10 rounded-xl border-border/70"
          />
          <SelectLang
            buttonVariant="outline"
            buttonSize="icon"
            buttonClassName="size-10 rounded-xl border-border/70"
          />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-16">
        {status === 'loading' || !entry ? (
          <PublicServiceEntrySkeleton />
        ) : status === 'error' ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border/70 bg-card/70 p-8 text-center">
            <Typography variant="h6" color="error">
              {t('publicServiceEntry.error.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error}
            </Typography>
            <Button type="button" onClick={() => token && fetchEntry(token)}>
              {t('publicServiceEntry.error.retry')}
            </Button>
          </div>
        ) : (
          <>
            <PublicServiceEntryInfoCard entry={entry} />
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-4">
                {surveyAlreadyCompleted ? (
                  <div className="rounded-2xl border border-emerald-300 bg-emerald-200/20 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200">
                    {t('publicServiceEntry.survey.alreadyCompleted')}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                    {t('publicServiceEntry.survey.instructions')}
                  </div>
                )}
                <PublicServiceEntrySurveyForm token={token} disabled={surveyAlreadyCompleted} />
              </div>
              <PublicServiceEntryFilesSection
                certificate={entry.calibrationCertificateFile}
                attachments={entry.attachmentFiles}
                downloadsEnabled={downloadsEnabled}
              />
            </div>
          </>
        )}
      </main>
      {surveySubmitting ? (
        <FullScreenLoader text={t('publicServiceEntry.survey.actions.submitting')} />
      ) : null}
    </div>
  );
}
