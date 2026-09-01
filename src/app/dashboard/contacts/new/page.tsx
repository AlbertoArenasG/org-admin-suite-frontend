'use client';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { ContactForm } from '@/components/contacts/ContactForm';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { createContact } from '@/features/contacts/contactsThunks';
import { resetContactsMutations } from '@/features/contacts/contactsSlice';
import { useAuthorization } from '@/features/auth';

export default function ContactCreatePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslationHydrated(['contacts', 'breadcrumbs']);
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();
  const mutationsState = useAppSelector((state) => state.contacts.mutations);

  const canCreate = hasPermission('CONTACTS', 'CREATE');

  useEffect(() => {
    if (mutationsState.createStatus === 'succeeded' && mutationsState.lastCreatedContactId) {
      showSnackbar({
        message:
          mutationsState.message ??
          t('create.successFeedback', { defaultValue: 'Contacto creado correctamente.' }),
        severity: 'success',
      });
      const nextContactId = mutationsState.lastCreatedContactId;
      dispatch(resetContactsMutations());
      router.push(`/dashboard/contacts/${nextContactId}`);
      return;
    }

    if (mutationsState.createStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('create.errorFeedback', { defaultValue: 'No fue posible crear el contacto.' }),
        severity: 'error',
      });
      dispatch(resetContactsMutations());
    }
  }, [dispatch, mutationsState, router, showSnackbar, t]);

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

        <ContactForm
          mode="create"
          isSubmitting={mutationsState.createStatus === 'loading'}
          disableActions={!canCreate}
          onCancel={() => router.back()}
          onSubmit={(values) => {
            if (!canCreate) {
              return;
            }
            void dispatch(createContact(values));
          }}
        />
      </Paper>
    </div>
  );
}
