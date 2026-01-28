'use client';

import { Suspense, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import Image from 'next/image';
import { ModeToggle } from '@/components/shared/ModeToggle';
import SelectLang from '@/components/shared/LangToggle';
import { usePublicProviderProfileStore } from '@/stores/usePublicProviderProfileStore';
import {
  PublicProviderProfileForm,
  PublicProviderProfileSkeleton,
  PublicProviderProfileSummary,
} from '@/components/publicProviderProfile';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { FullScreenLoader } from '@/components/ui/full-screen-loader';

export default function PublicProviderProfilePage() {
  return (
    <Suspense fallback={<PublicProviderProfileSkeleton />}>
      <PublicProviderProfileContent />
    </Suspense>
  );
}

function PublicProviderProfileContent() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const { t, i18n } = useTranslation('publicProviderProfile');
  const { showSnackbar } = useSnackbar();

  const fetchProfile = usePublicProviderProfileStore((state) => state.fetchProfile);
  const reset = usePublicProviderProfileStore((state) => state.reset);
  const status = usePublicProviderProfileStore((state) => state.status);
  const error = usePublicProviderProfileStore((state) => state.error);
  const profile = usePublicProviderProfileStore((state) => state.profile);
  const submitting = usePublicProviderProfileStore((state) => state.submitting);

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
      return t('summary.notAvailable');
    }
    try {
      return dateFormatter.format(new Date(value));
    } catch {
      return t('summary.notAvailable');
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
      <header className="flex flex-col items-center gap-4 px-6 py-6">
        <Image
          src="/logo.jpeg"
          alt={t('logoAlt') ?? 'ICSACV'}
          width={120}
          height={120}
          className="h-24 w-24 rounded-2xl object-contain shadow-md"
          priority
        />
        <div className="text-center">
          <p className="text-base font-semibold tracking-widest text-muted-foreground uppercase">
            {t('header')}
          </p>
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
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
          <PublicProviderProfileSkeleton />
        ) : status === 'error' ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-border/60 bg-card/70 p-8 text-center">
            <p className="text-lg font-semibold text-destructive">{t('error.title')}</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button type="button" onClick={handleRetry} className="gap-2">
              <RefreshCw className="size-4" aria-hidden />
              {t('error.retry')}
            </Button>
          </div>
        ) : profile && token ? (
          <>
            <PublicProviderProfileSummary
              profile={profile}
              formatDate={formatDate}
              labels={{
                status: t('summary.status'),
                providerCode: t('summary.providerCode'),
                fiscalStatus: t('summary.fiscalStatus'),
                bankingStatus: t('summary.bankingStatus'),
                lastUpdated: t('summary.lastUpdated'),
              }}
            />
            <PublicProviderProfileForm profile={profile} token={token} formatDate={formatDate} />
          </>
        ) : (
          <PublicProviderProfileSkeleton />
        )}
      </main>
      {submitting ? <FullScreenLoader text={t('form.actions.submitting')} /> : null}
    </div>
  );
}
