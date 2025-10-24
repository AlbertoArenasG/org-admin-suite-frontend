'use client';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { parseUserRole, canManageRole } from '@/features/users/roles';

export default function UserDetailPage() {
  const params = useParams<{ userId: string }>();
  const router = useRouter();
  const { t, hydrated, i18n } = useTranslationHydrated('common');
  const user = useAppSelector((state) =>
    state.users.entities.find((entity) => entity.id === params.userId)
  );
  const authUser = useAppSelector((state) => state.auth.user);

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

  const detailRows = user
    ? [
        { label: t('users.table.columns.fullName'), value: user.fullName || '—' },
        { label: t('users.table.columns.email'), value: user.email },
        { label: t('users.table.columns.role'), value: user.roleName },
        {
          label: t('users.table.columns.status'),
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
          label: t('users.table.columns.createdAt'),
          value:
            user.createdAt && !Number.isNaN(new Date(user.createdAt).getTime())
              ? dateFormatter.format(new Date(user.createdAt))
              : '—',
        },
      ]
    : [];

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              { label: t('breadcrumbs.dashboard'), href: '/dashboard', hideOnDesktop: true },
              { label: t('breadcrumbs.users'), href: '/dashboard/users', hideOnDesktop: true },
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
          className="flex items-start justify-between gap-4"
        >
          <div>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
              {user
                ? user.fullName || user.email
                : t('users.detail.missingTitle', { defaultValue: 'User not found' })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('users.detail.subtitle', { defaultValue: 'User details and activity' })}
            </Typography>
          </div>
          {canEdit ? (
            <Button onClick={() => router.push(`/dashboard/users/${params.userId}/edit`)} size="sm">
              {t('users.actions.edit')}
            </Button>
          ) : null}
        </Box>
        <div className="flex flex-col gap-4 p-6">
          {user ? (
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
              {t('users.detail.notFound', { defaultValue: 'We could not find this user yet.' })}
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
}
