'use client';

import { useEffect, useMemo } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { fetchMyProfile } from '@/features/myProfile/myProfileThunks';
import { useRouter } from 'next/navigation';
import { getInitialsFromText } from '@/lib/get-initials';

export default function MyProfilePage() {
  const { t, hydrated, i18n } = useTranslationHydrated('common');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const profileState = useAppSelector((state) => state.myProfile.profile);

  useEffect(() => {
    if (!authHydrated) {
      return;
    }
    if (profileState.status === 'idle') {
      void dispatch(fetchMyProfile());
    }
  }, [authHydrated, dispatch, profileState.status]);

  const profile = profileState.data;
  const displayName = profile
    ? `${profile.name ?? ''} ${profile.lastname ?? ''}`.replace(/\s+/g, ' ').trim()
    : '';
  const profileInitials = profile ? getInitialsFromText(displayName || profile.email, '?') : '?';

  const dateFormatter = useMemo(() => {
    const fallback = i18n.options.fallbackLng;
    const fallbackLang = Array.isArray(fallback)
      ? fallback[0]
      : typeof fallback === 'string'
        ? fallback
        : 'es';
    const locale = hydrated ? i18n.language : fallbackLang;
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' });
  }, [hydrated, i18n.language, i18n.options.fallbackLng]);

  const statusChip = profile ? (
    <Chip
      color={profile.status.toLowerCase() === 'active' ? 'success' : 'default'}
      variant="outlined"
      size="small"
      label={profile.statusName}
    />
  ) : null;

  const detailRows = profile
    ? [
        { label: t('myProfile.detail.email'), value: profile.email },
        { label: t('myProfile.detail.role'), value: profile.roleName },
        { label: t('myProfile.detail.status'), value: statusChip },
        {
          label: t('myProfile.detail.phone'),
          value: profile.cellPhone
            ? `${profile.cellPhone.countryCode} ${profile.cellPhone.number}`
            : '—',
        },
        {
          label: t('myProfile.detail.joined'),
          value:
            profile.createdAt && !Number.isNaN(new Date(profile.createdAt).getTime())
              ? dateFormatter.format(new Date(profile.createdAt))
              : '—',
        },
      ]
    : [];

  const isLoading = !authHydrated || profileState.status === 'loading';
  const loadError = profileState.status === 'failed' ? profileState.error : null;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              { label: t('breadcrumbs.dashboard'), href: '/dashboard', hideOnDesktop: true },
              { label: t('myProfile.breadcrumb') },
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
          <div className="flex items-center gap-4">
            {isLoading ? (
              <Skeleton className="h-16 w-16 rounded-2xl" />
            ) : (
              <Avatar className="h-16 w-16 rounded-2xl border border-border/60 bg-muted/60">
                <AvatarFallback className="rounded-2xl text-lg font-semibold text-foreground">
                  {profileInitials}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="space-y-1">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-40 rounded-md" />
                  <Skeleton className="h-4 w-56 rounded-md" />
                </>
              ) : (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    {displayName || profile?.email || t('myProfile.detail.titlePlaceholder')}
                  </Typography>
                  <Typography variant="body2" color="text.foreground">
                    {t('myProfile.detail.subtitle')}
                  </Typography>
                </>
              )}
            </div>
          </div>
          <Button size="sm" onClick={() => router.push('/dashboard/me/edit')} disabled={isLoading}>
            {t('myProfile.actions.edit')}
          </Button>
        </Box>
        <div className="flex flex-col gap-4 p-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ) : loadError ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-12 text-center text-sm text-destructive">
              {loadError}
            </div>
          ) : profile ? (
            detailRows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 px-4 py-3 md:flex-row md:items-center md:justify-between"
              >
                <span className="text-sm text-muted-foreground">{row.label}</span>
                <span className="text-sm font-medium text-foreground">{row.value}</span>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-border/60 bg-card/60 px-4 py-12 text-center text-sm text-muted-foreground">
              {t('myProfile.detail.empty')}
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
}
