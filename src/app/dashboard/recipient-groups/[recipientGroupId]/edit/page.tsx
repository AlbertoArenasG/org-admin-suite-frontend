'use client';

import { useEffect, useMemo } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { RecipientGroupForm } from '@/components/recipient-groups/RecipientGroupForm';
import { clearContactSearch } from '@/features/contacts/contactsSlice';
import { createContact, searchContacts } from '@/features/contacts/contactsThunks';
import {
  fetchCommunicationChannels,
  fetchRecipientGroupById,
  updateRecipientGroup,
} from '@/features/recipient-groups/recipientGroupsThunks';
import { resetRecipientGroupMutations } from '@/features/recipient-groups/recipientGroupsSlice';
import { useAuthorization } from '@/features/auth';

export default function RecipientGroupEditPage() {
  const params = useParams<{ recipientGroupId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslationHydrated(['recipientGroups', 'breadcrumbs']);
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();

  const detailState = useAppSelector((state) => state.recipientGroups.detail);
  const catalogsState = useAppSelector((state) => state.recipientGroups.catalogs);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const mutationsState = useAppSelector((state) => state.recipientGroups.mutations);
  const contactsSearchState = useAppSelector((state) => state.contacts.search);

  const recipientGroup =
    detailState.item?.recipientGroupId === params.recipientGroupId ? detailState.item : null;

  useEffect(() => {
    if (!params.recipientGroupId || !authHydrated) {
      return;
    }
    void dispatch(fetchRecipientGroupById({ recipientGroupId: params.recipientGroupId }));
  }, [authHydrated, dispatch, params.recipientGroupId]);

  useEffect(() => {
    if (hasPermission('RECIPIENT_GROUPS', 'READ') && catalogsState.status === 'idle') {
      void dispatch(fetchCommunicationChannels());
    }
  }, [catalogsState.status, dispatch, hasPermission]);

  useEffect(
    () => () => {
      dispatch(clearContactSearch());
    },
    [dispatch]
  );

  const canEdit = hasPermission('RECIPIENT_GROUPS', 'UPDATE');

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
  const searchedContacts = contactsSearchState.items;

  const contactOptions = useMemo(() => {
    const map = new Map<string, (typeof searchedContacts)[number]>();

    recipientGroup?.contacts.forEach((contact) => {
      map.set(contact.contactId, {
        contactId: contact.contactId,
        isInternalStaff: contact.isInternalStaff,
        userId: contact.userId,
        fullName: contact.fullName,
        companyNames: contact.companyNames,
        primaryEmail: contact.primaryEmail,
        primaryCellPhone: contact.primaryCellPhone,
      });
    });

    searchedContacts.forEach((contact) => {
      map.set(contact.contactId, contact);
    });

    return Array.from(map.values());
  }, [recipientGroup?.contacts, searchedContacts]);

  useEffect(() => {
    if (mutationsState.currentRecipientGroupId !== params.recipientGroupId) {
      return;
    }

    if (mutationsState.updateStatus === 'succeeded') {
      showSnackbar({
        message:
          mutationsState.message ??
          t('edit.successFeedback', { defaultValue: 'Grupo actualizado correctamente.' }),
        severity: 'success',
      });
      dispatch(resetRecipientGroupMutations());
      router.push(`/dashboard/recipient-groups/${params.recipientGroupId}`);
    } else if (mutationsState.updateStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('edit.errorFeedback', { defaultValue: 'No fue posible actualizar el grupo.' }),
        severity: 'error',
      });
      dispatch(resetRecipientGroupMutations());
    }
  }, [dispatch, mutationsState, params.recipientGroupId, router, showSnackbar, t]);

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
              {
                label: recipientGroup?.name ?? '—',
                href: `/dashboard/recipient-groups/${params.recipientGroupId}`,
              },
              { label: t('actions.edit') },
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
                    {t('actions.edit')} · {recipientGroup?.name ?? '—'}
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
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
          ) : loadError ? (
            <div className="flex flex-1 items-center justify-center text-sm text-destructive">
              {loadError}
            </div>
          ) : recipientGroup ? (
            <RecipientGroupForm
              mode="edit"
              recipientGroup={recipientGroup}
              communicationChannels={catalogsState.communicationChannels}
              searchResults={contactsSearchState.items}
              contactOptions={contactOptions}
              searchStatus={contactsSearchState.status}
              searchError={contactsSearchState.error}
              isSubmitting={mutationsState.updateStatus === 'loading'}
              disableActions={!canEdit}
              onCancel={() => router.back()}
              onSearchContacts={(query) => {
                void dispatch(searchContacts({ q: query, limit: 10 }));
              }}
              onCreateContactInContext={async (values) => {
                try {
                  const result = await dispatch(createContact(values)).unwrap();
                  showSnackbar({
                    message: t('form.dialogs.createContact.success'),
                    severity: 'success',
                  });
                  void dispatch(searchContacts({ q: result.contact.fullName, limit: 10 }));
                  return {
                    ...result.contact,
                  };
                } catch (error) {
                  showSnackbar({
                    message:
                      typeof error === 'string' ? error : t('form.dialogs.createContact.error'),
                    severity: 'error',
                  });
                  return null;
                }
              }}
              onSubmit={(values) => {
                if (!canEdit) {
                  return;
                }
                void dispatch(
                  updateRecipientGroup({
                    recipientGroupId: params.recipientGroupId,
                    ...values,
                  })
                );
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
