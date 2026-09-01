'use client';

import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { ContactForm } from '@/components/contacts/ContactForm';
import { fetchContactById, updateContact } from '@/features/contacts/contactsThunks';
import { resetContactsMutations } from '@/features/contacts/contactsSlice';
import { useAuthorization } from '@/features/auth';
import { isContactLinkedToUser } from '@/components/contacts/types';

export default function ContactEditPage() {
  const params = useParams<{ contactId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslationHydrated(['contacts', 'breadcrumbs']);
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();

  const detailState = useAppSelector((state) => state.contacts.detail);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const mutationsState = useAppSelector((state) => state.contacts.mutations);

  const contact = detailState.item?.contactId === params.contactId ? detailState.item : null;

  useEffect(() => {
    if (!params.contactId || !authHydrated) {
      return;
    }
    void dispatch(fetchContactById({ contactId: params.contactId }));
  }, [authHydrated, dispatch, params.contactId]);

  const canEdit = hasPermission('CONTACTS', 'UPDATE') && !isContactLinkedToUser(contact);

  const isLoading =
    (!authHydrated && Boolean(params.contactId)) ||
    (detailState.status === 'loading' && detailState.currentContactId === params.contactId);
  const loadError =
    authHydrated &&
    detailState.status === 'failed' &&
    detailState.currentContactId === params.contactId
      ? detailState.error
      : null;

  useEffect(() => {
    if (mutationsState.currentContactId !== params.contactId) {
      return;
    }

    if (mutationsState.updateStatus === 'succeeded') {
      showSnackbar({
        message:
          mutationsState.message ??
          t('edit.successFeedback', { defaultValue: 'Contacto actualizado correctamente.' }),
        severity: 'success',
      });
      dispatch(resetContactsMutations());
      router.push(`/dashboard/contacts/${params.contactId}`);
    } else if (mutationsState.updateStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('edit.errorFeedback', { defaultValue: 'No fue posible actualizar el contacto.' }),
        severity: 'error',
      });
      dispatch(resetContactsMutations());
    }
  }, [dispatch, mutationsState, params.contactId, router, showSnackbar, t]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <DashboardPageHeader
        segments={[
          { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
          {
            label: t('breadcrumbs:contacts'),
            href: '/dashboard/contacts',
            hideOnDesktop: true,
          },
          {
            label: contact?.fullName ?? '—',
            href: `/dashboard/contacts/${params.contactId}`,
          },
          { label: t('actions.edit') },
        ]}
      />

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
          minHeight: '60vh',
        }}
      >
        <Box
          sx={{ px: 4, py: 4, borderBottom: '1px solid var(--surface-border)' }}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-48 rounded-md" />
                  <Skeleton className="h-4 w-64 rounded-md" />
                </>
              ) : (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    {t('actions.edit')} · {contact?.fullName ?? '—'}
                  </Typography>
                  <Typography variant="body2" color="text.foreground">
                    {t('edit.subtitle')}
                  </Typography>
                </>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              {t('common:done')}
            </Button>
          </div>
          {!canEdit ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {t('edit.restricted')}
            </div>
          ) : null}
        </Box>
        <div className="flex flex-1 flex-col">
          {isLoading ? (
            <div className="flex flex-1 flex-col gap-4 p-6">
              <Skeleton className="h-8 w-1/3 rounded-md" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ) : loadError ? (
            <div className="flex flex-1 items-center justify-center text-sm text-destructive">
              {loadError}
            </div>
          ) : contact ? (
            <ContactForm
              mode="edit"
              contact={contact}
              disableActions={!canEdit}
              isSubmitting={mutationsState.updateStatus === 'loading'}
              onCancel={() => router.back()}
              onSubmit={(values) => {
                if (!canEdit) {
                  return;
                }
                void dispatch(updateContact({ contactId: params.contactId, ...values }));
              }}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              {t('detail.notFound')}
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
}
