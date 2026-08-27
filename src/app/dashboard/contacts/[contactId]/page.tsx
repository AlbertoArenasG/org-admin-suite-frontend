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
import { fetchContactById } from '@/features/contacts/contactsThunks';
import { useAuthorization } from '@/features/auth';
import { isContactLinkedToUser } from '@/components/contacts/types';

export default function ContactDetailPage() {
  const params = useParams<{ contactId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t, hydrated, i18n } = useTranslationHydrated(['contacts', 'breadcrumbs']);
  const { hasPermission } = useAuthorization();
  const detailState = useAppSelector((state) => state.contacts.detail);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);

  const contact = useMemo(() => {
    if (detailState.item?.contactId === params.contactId) {
      return detailState.item;
    }
    return null;
  }, [detailState.item, params.contactId]);

  useEffect(() => {
    if (!params.contactId || !authHydrated) {
      return;
    }

    void dispatch(fetchContactById({ contactId: params.contactId }));
  }, [authHydrated, dispatch, params.contactId]);

  const canUpdate = hasPermission('CONTACTS', 'UPDATE') && !isContactLinkedToUser(contact);

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
    (!authHydrated && Boolean(params.contactId)) ||
    (detailState.status === 'loading' && detailState.currentContactId === params.contactId);
  const loadError =
    authHydrated &&
    detailState.status === 'failed' &&
    detailState.currentContactId === params.contactId
      ? detailState.error
      : null;

  const detailRows = contact
    ? [
        { label: t('detail.fields.fullName'), value: contact.fullName || '—' },
        { label: t('detail.fields.companyName'), value: contact.companyName || '—' },
        {
          label: t('detail.fields.status'),
          value: (
            <Chip
              color={contact.statusId === 'ACTIVE' ? 'success' : 'default'}
              variant="outlined"
              size="small"
              label={contact.statusName}
            />
          ),
        },
        {
          label: t('detail.fields.createdAt'),
          value:
            contact.createdAt && !Number.isNaN(new Date(contact.createdAt).getTime())
              ? dateFormatter.format(new Date(contact.createdAt))
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
                label: t('breadcrumbs:contacts'),
                href: '/dashboard/contacts',
                hideOnDesktop: true,
              },
              { label: contact?.fullName ?? '—' },
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
                  {contact?.fullName ?? t('detail.missingTitle')}
                </Typography>
                <Typography variant="body2" color="text.foreground">
                  {t('detail.subtitle')}
                </Typography>
              </>
            )}
          </div>
          {canUpdate ? (
            <Button
              onClick={() => router.push(`/dashboard/contacts/${params.contactId}/edit`)}
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
          ) : contact ? (
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

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-border/60 bg-card/60 px-4 py-3">
                  <p className="mb-2 text-sm text-muted-foreground">{t('detail.fields.emails')}</p>
                  <div className="space-y-2">
                    {contact.emails.length ? (
                      contact.emails.map((email) => (
                        <p key={email.value} className="text-sm font-medium text-foreground">
                          {email.value}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">—</p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-card/60 px-4 py-3">
                  <p className="mb-2 text-sm text-muted-foreground">{t('detail.fields.phones')}</p>
                  <div className="space-y-2">
                    {contact.phones.length ? (
                      contact.phones.map((phone) => (
                        <p key={phone.value} className="text-sm font-medium text-foreground">
                          {phone.value}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">—</p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-card/60 px-4 py-3">
                  <p className="mb-2 text-sm text-muted-foreground">
                    {t('detail.fields.cellPhones')}
                  </p>
                  <div className="space-y-2">
                    {contact.cellPhones.length ? (
                      contact.cellPhones.map((phone) => (
                        <p key={phone.value} className="text-sm font-medium text-foreground">
                          {phone.value}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">—</p>
                    )}
                  </div>
                </div>
              </div>

              {contact.userId ? (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
                  {t('detail.linkedToUserHint')}
                </div>
              ) : null}
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
