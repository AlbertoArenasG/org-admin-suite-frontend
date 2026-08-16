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
import { fetchRecipientGroupById } from '@/features/recipient-groups/recipientGroupsThunks';
import { useAuthorization } from '@/features/auth';

export default function RecipientGroupDetailPage() {
  const params = useParams<{ recipientGroupId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t, hydrated, i18n } = useTranslationHydrated(['recipientGroups', 'breadcrumbs']);
  const { hasPermission } = useAuthorization();
  const detailState = useAppSelector((state) => state.recipientGroups.detail);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);

  const recipientGroup = useMemo(() => {
    if (detailState.item?.recipientGroupId === params.recipientGroupId) {
      return detailState.item;
    }
    return null;
  }, [detailState.item, params.recipientGroupId]);

  useEffect(() => {
    if (!params.recipientGroupId || !authHydrated) {
      return;
    }

    void dispatch(fetchRecipientGroupById({ recipientGroupId: params.recipientGroupId }));
  }, [authHydrated, dispatch, params.recipientGroupId]);

  const canUpdate = hasPermission('RECIPIENT_GROUPS', 'UPDATE');

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

  const isLoading =
    (!authHydrated && Boolean(params.recipientGroupId)) ||
    (detailState.status === 'loading' &&
      detailState.currentRecipientGroupId === params.recipientGroupId);
  const loadError =
    authHydrated &&
    detailState.status === 'failed' &&
    detailState.currentRecipientGroupId === params.recipientGroupId
      ? detailState.error
      : null;

  const detailRows = recipientGroup
    ? [
        { label: t('detail.fields.name'), value: recipientGroup.name || '—' },
        { label: t('detail.fields.description'), value: recipientGroup.description || '—' },
        {
          label: t('detail.fields.status'),
          value: (
            <Chip
              color={recipientGroup.statusId === 'ACTIVE' ? 'success' : 'default'}
              variant="outlined"
              size="small"
              label={recipientGroup.statusName}
            />
          ),
        },
        {
          label: t('detail.fields.createdAt'),
          value:
            recipientGroup.createdAt && !Number.isNaN(new Date(recipientGroup.createdAt).getTime())
              ? dateFormatter.format(new Date(recipientGroup.createdAt))
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
              { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
              {
                label: t('breadcrumbs:recipientGroups'),
                href: '/dashboard/recipient-groups',
                hideOnDesktop: true,
              },
              { label: recipientGroup?.name ?? '—' },
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
          <div className="space-y-1">
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-48 rounded-md" />
                <Skeleton className="h-4 w-64 rounded-md" />
              </>
            ) : (
              <>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  {recipientGroup?.name ?? t('detail.missingTitle')}
                </Typography>
                <Typography variant="body2" color="text.foreground">
                  {t('detail.subtitle')}
                </Typography>
              </>
            )}
          </div>
          {canUpdate ? (
            <Button
              onClick={() =>
                router.push(`/dashboard/recipient-groups/${params.recipientGroupId}/edit`)
              }
              size="sm"
            >
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
          ) : recipientGroup ? (
            <>
              {detailRows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-medium text-foreground">{row.value}</span>
                </div>
              ))}

              <div className="rounded-xl border border-border/60 bg-card/60 px-4 py-3">
                <p className="mb-2 text-sm text-muted-foreground">{t('detail.fields.channels')}</p>
                <div className="flex flex-wrap gap-2">
                  {recipientGroup.enabledChannels.length ? (
                    recipientGroup.enabledChannels.map((channel) => (
                      <Chip
                        key={channel.code}
                        size="small"
                        variant="outlined"
                        label={channel.name}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">—</p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/60 px-4 py-3">
                <p className="mb-3 text-sm text-muted-foreground">{t('detail.fields.contacts')}</p>
                {recipientGroup.contacts.length ? (
                  <div className="space-y-3">
                    {recipientGroup.contacts.map((contact) => (
                      <div
                        key={contact.contactId}
                        className="rounded-xl border border-border/60 bg-background/80 px-3 py-3"
                      >
                        <p className="text-sm font-medium text-foreground">{contact.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                          {[contact.companyName, contact.primaryEmail, contact.primaryCellPhone]
                            .filter(Boolean)
                            .join(' · ') || '—'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </div>
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
