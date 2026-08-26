'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { RelatedCustomersSection } from '@/components/user-customer-relationships/RelatedCustomersSection';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { fetchUserRegistrationInvitationById } from '@/features/user-registration-invitations';

export default function UserRegistrationInvitationDetailPage() {
  const params = useParams<{ invitationId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t, hydrated, i18n } = useTranslationHydrated([
    'userRegistrationInvitations',
    'breadcrumbs',
  ]);
  const detail = useAppSelector((state) => state.userRegistrationInvitations.detail);
  const invitation = detail.currentId === params.invitationId ? detail.entry : null;

  useEffect(() => {
    if (params.invitationId) {
      void dispatch(fetchUserRegistrationInvitationById({ invitationId: params.invitationId }));
    }
  }, [dispatch, params.invitationId]);

  const locale = hydrated ? i18n.language : 'es';
  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }),
    [locale]
  );
  const isLoading = detail.status === 'loading' && detail.currentId === params.invitationId;
  const loadError =
    detail.status === 'failed' && detail.currentId === params.invitationId ? detail.error : null;
  const rows = invitation
    ? [
        { label: t('table.columns.email'), value: invitation.email },
        { label: t('table.columns.role'), value: invitation.roleName ?? invitation.systemRoleName },
        {
          label: t('table.columns.status'),
          value: <Chip size="small" variant="outlined" label={invitation.statusName} />,
        },
        {
          label: t('table.columns.createdAt'),
          value: invitation.createdAt ? dateFormatter.format(new Date(invitation.createdAt)) : '—',
        },
      ]
    : [];

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
              {
                label: t('breadcrumbs:userRegistrationInvitations'),
                href: '/dashboard/users/invitations',
                hideOnDesktop: true,
              },
              { label: invitation?.email ?? t('detail.title') },
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
        }}
      >
        <Box sx={{ px: 4, py: 4, borderBottom: '1px solid var(--surface-border)' }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                {t('detail.title')}
              </Typography>
              <Typography variant="body2" color="text.foreground">
                {invitation?.email ?? t('detail.subtitle')}
              </Typography>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/users/invitations')}
            >
              {t('detail.back')}
            </Button>
          </div>
        </Box>
        <div className="flex flex-col gap-4 p-6">
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </>
          ) : loadError ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-12 text-center text-sm text-destructive">
              {loadError}
            </div>
          ) : invitation ? (
            <>
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-medium text-foreground">{row.value}</span>
                </div>
              ))}
              <RelatedCustomersSection customers={invitation.customers} />
            </>
          ) : (
            <div className="rounded-xl border border-border/60 bg-card/60 px-4 py-12 text-center text-sm text-muted-foreground">
              {t('detail.notFound')}
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
}
