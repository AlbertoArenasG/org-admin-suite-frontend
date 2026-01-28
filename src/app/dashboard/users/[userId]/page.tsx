'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { parseUserRole, canManageRole } from '@/features/users/roles';
import { fetchUserById } from '@/features/users/usersThunks';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitialsFromText } from '@/lib/get-initials';

export default function UserDetailPage() {
  const params = useParams<{ userId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t, hydrated, i18n } = useTranslationHydrated(['users', 'breadcrumbs']);
  const user = useAppSelector((state) =>
    state.users.entities.find((entity) => entity.id === params.userId)
  );
  const authUser = useAppSelector((state) => state.auth.user);
  const detailState = useAppSelector((state) => state.users.detail);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);

  useEffect(() => {
    if (!params.userId || !authHydrated) {
      return;
    }

    void dispatch(fetchUserById({ id: params.userId }));
  }, [authHydrated, dispatch, params.userId]);

  const currentRole = authUser?.role ?? null;
  const targetRole = user ? parseUserRole(user.role) : null;
  const canEdit =
    user && currentRole
      ? canManageRole(currentRole, targetRole, { allowSameLevel: authUser?.id === user.id })
      : false;

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

  const displayName = user
    ? `${user.name ?? ''} ${user.lastname ?? ''}`.replace(/\s+/g, ' ').trim()
    : '';
  const userInitials = user
    ? getInitialsFromText(displayName || user.fullName || user.email, '?')
    : '?';

  const detailRows = user
    ? [
        { label: t('table.columns.fullName'), value: user.fullName || '—' },
        { label: t('table.columns.email'), value: user.email },
        { label: t('table.columns.role'), value: user.roleName },
        {
          label: t('table.columns.status'),
          value: (
            <Chip
              color={user.status?.toLowerCase() === 'active' ? 'success' : 'default'}
              variant="outlined"
              size="small"
              label={user.statusName}
            />
          ),
        },
        {
          label: t('table.columns.createdAt'),
          value:
            user.createdAt && !Number.isNaN(new Date(user.createdAt).getTime())
              ? dateFormatter.format(new Date(user.createdAt))
              : '—',
        },
      ]
    : [];

  const isLoading =
    (!authHydrated && Boolean(params.userId)) ||
    (detailState.status === 'loading' && detailState.currentId === params.userId);
  const loadError =
    authHydrated && detailState.status === 'failed' && detailState.currentId === params.userId
      ? detailState.error
      : null;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
              { label: t('breadcrumbs:users'), href: '/dashboard/users', hideOnDesktop: true },
              { label: user?.fullName ?? user?.email ?? '—' },
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
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="space-y-1">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-48 rounded-md" />
                  <Skeleton className="h-4 w-64 rounded-md" />
                </>
              ) : (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    {user
                      ? user.fullName || user.email
                      : t('detail.missingTitle', { defaultValue: 'User not found' })}
                  </Typography>
                  <Typography variant="body2" color="text.foreground">
                    {t('detail.subtitle', { defaultValue: 'User details and activity' })}
                  </Typography>
                </>
              )}
            </div>
          </div>
          {canEdit ? (
            <Button onClick={() => router.push(`/dashboard/users/${params.userId}/edit`)} size="sm">
              {t('actions.edit')}
            </Button>
          ) : null}
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
          ) : user ? (
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
              {t('detail.notFound', { defaultValue: 'We could not find this user yet.' })}
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
}
