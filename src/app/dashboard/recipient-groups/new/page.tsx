'use client';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { RecipientGroupForm } from '@/components/recipient-groups/RecipientGroupForm';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { createContact, searchContacts } from '@/features/contacts/contactsThunks';
import { clearContactSearch } from '@/features/contacts/contactsSlice';
import {
  createRecipientGroup,
  fetchCommunicationChannels,
} from '@/features/recipient-groups/recipientGroupsThunks';
import { resetRecipientGroupMutations } from '@/features/recipient-groups/recipientGroupsSlice';
import { useAuthorization } from '@/features/auth';

export default function RecipientGroupCreatePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslationHydrated(['recipientGroups', 'breadcrumbs']);
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();
  const catalogsState = useAppSelector((state) => state.recipientGroups.catalogs);
  const mutationsState = useAppSelector((state) => state.recipientGroups.mutations);
  const contactsSearchState = useAppSelector((state) => state.contacts.search);

  const canCreate = hasPermission('RECIPIENT_GROUPS', 'CREATE');
  const canRead = hasPermission('RECIPIENT_GROUPS', 'READ');

  const contactOptions = useMemo(() => contactsSearchState.items, [contactsSearchState.items]);

  useEffect(() => {
    if (canRead && catalogsState.status === 'idle') {
      void dispatch(fetchCommunicationChannels());
    }
  }, [canRead, catalogsState.status, dispatch]);

  useEffect(
    () => () => {
      dispatch(clearContactSearch());
    },
    [dispatch]
  );

  useEffect(() => {
    if (mutationsState.createStatus === 'succeeded' && mutationsState.lastCreatedRecipientGroupId) {
      showSnackbar({
        message:
          mutationsState.message ??
          t('create.successFeedback', { defaultValue: 'Grupo creado correctamente.' }),
        severity: 'success',
      });
      const nextRecipientGroupId = mutationsState.lastCreatedRecipientGroupId;
      dispatch(resetRecipientGroupMutations());
      router.push(`/dashboard/recipient-groups/${nextRecipientGroupId}`);
      return;
    }

    if (mutationsState.createStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('create.errorFeedback', { defaultValue: 'No fue posible crear el grupo.' }),
        severity: 'error',
      });
      dispatch(resetRecipientGroupMutations());
    }
  }, [dispatch, mutationsState, router, showSnackbar, t]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <DashboardPageHeader
        segments={[
          { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
          {
            label: t('breadcrumbs:recipientGroups'),
            href: '/dashboard/recipient-groups',
            hideOnDesktop: true,
          },
          { label: t('form.title.create') },
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
          sx={{
            px: { xs: 2.5, md: 4 },
            py: 3,
            borderBottom: '1px solid var(--surface-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            {t('form.title.create')}
          </Typography>
          <Typography variant="body2" color="text.foreground">
            {t('form.description.create')}
          </Typography>
        </Box>

        <RecipientGroupForm
          mode="create"
          communicationChannels={catalogsState.communicationChannels}
          searchResults={contactsSearchState.items}
          contactOptions={contactOptions}
          searchStatus={contactsSearchState.status}
          searchError={contactsSearchState.error}
          isSubmitting={mutationsState.createStatus === 'loading'}
          disableActions={!canCreate}
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
                message: typeof error === 'string' ? error : t('form.dialogs.createContact.error'),
                severity: 'error',
              });
              return null;
            }
          }}
          onSubmit={(values) => {
            if (!canCreate) {
              return;
            }
            void dispatch(createRecipientGroup(values));
          }}
        />
      </Paper>
    </div>
  );
}
