'use client';

import { Suspense, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { ModeToggle } from '@/components/shared/ModeToggle';
import SelectLang from '@/components/shared/LangToggle';
import { usePublicCustomerProfileStore } from '@/stores/usePublicCustomerProfileStore';
import {
  PublicCustomerProfileForm,
  PublicCustomerProfileSkeleton,
  PublicCustomerProfileSummary,
} from '@/components/publicCustomerProfile';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { FullScreenLoader } from '@/components/ui/full-screen-loader';

export default function PublicCustomerProfilePage() {
  return (
    <Suspense fallback={<PublicCustomerProfileSkeleton />}>
      <PublicCustomerProfileContent />
    </Suspense>
  );
}

function PublicCustomerProfileContent() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const { t, i18n } = useTranslation('common');
  const { showSnackbar } = useSnackbar();

  const fetchProfile = usePublicCustomerProfileStore((state) => state.fetchProfile);
  const reset = usePublicCustomerProfileStore((state) => state.reset);
  const status = usePublicCustomerProfileStore((state) => state.status);
  const error = usePublicCustomerProfileStore((state) => state.error);
  const profile = usePublicCustomerProfileStore((state) => state.profile);
  const submitting = usePublicCustomerProfileStore((state) => state.submitting);

  useEffect(() => {
    if (!token) {
      return;
    }
    void fetchProfile(token);
    return () => reset();
  }, [fetchProfile, reset, token]);

  useEffect(() => {
    if (status === 'error' && error) {
      showSnackbar({ message: error, severity: 'error' });
    }
  }, [error, showSnackbar, status]);

  const dateFormatter = useMemo(() => {
    const locale = i18n.language || 'es';
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }, [i18n.language]);

  const formatDate = (value: string | null) => {
    if (!value) {
      return t('publicCustomerProfile.summary.notAvailable');
    }
    try {
      return dateFormatter.format(new Date(value));
    } catch {
      return t('publicCustomerProfile.summary.notAvailable');
    }
  };

  const handleRetry = () => {
    if (!token) {
      return;
    }
    void fetchProfile(token);
  };

  return (
    <div className="min-h-screen bg-[color:var(--public-bg,#f5f5fb)] dark:bg-background">
      <header className="flex items-center justify-between gap-3 px-6 py-4">
        <div>
          <p className="text-sm font-semibold tracking-tight text-muted-foreground">
            {t('publicCustomerProfile.header')}
          </p>
          <h1 className="text-xl font-bold">{t('publicCustomerProfile.title')}</h1>
        </div>
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
        {status === 'loading' ? (
          <PublicCustomerProfileSkeleton />
        ) : status === 'error' ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border/60 bg-card/70 p-8 text-center">
            <p className="text-lg font-semibold text-destructive">
              {t('publicCustomerProfile.error.title')}
            </p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button type="button" onClick={handleRetry} className="gap-2">
              <RefreshCw className="size-4" aria-hidden />
              {t('publicCustomerProfile.error.retry')}
            </Button>
          </div>
        ) : profile && token ? (
          <>
            <PublicCustomerProfileSummary
              profile={profile}
              formatDate={formatDate}
              labels={{
                status: t('publicCustomerProfile.summary.status'),
                clientCode: t('publicCustomerProfile.summary.clientCode'),
                lastUpdated: t('publicCustomerProfile.summary.lastUpdated'),
              }}
            />
            <PublicCustomerProfileForm profile={profile} token={token} formatDate={formatDate} />
          </>
        ) : (
          <PublicCustomerProfileSkeleton />
        )}
      </main>
      {submitting ? (
        <FullScreenLoader text={t('publicCustomerProfile.form.actions.submitting')} />
      ) : null}
    </div>
  );
}
