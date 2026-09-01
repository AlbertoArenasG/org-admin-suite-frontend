'use client';

import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';

import { ExpirationNotificationPolicyForm } from '@/components/expiration-notification-policies/ExpirationNotificationPolicyForm';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { useAuthorization } from '@/features/auth';
import {
  createExpirationNotificationPolicy,
  fetchExpirationNotificationPolicyCatalog,
} from '@/features/expiration-notification-policies/expirationNotificationPoliciesThunks';
import { resetExpirationNotificationPolicyMutations } from '@/features/expiration-notification-policies/expirationNotificationPoliciesSlice';
import { fetchRecipientGroups } from '@/features/recipient-groups/recipientGroupsThunks';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

export default function ExpirationNotificationPoliciesCreatePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslationHydrated(['expirationNotificationPolicies', 'breadcrumbs']);
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();
  const catalogsState = useAppSelector((state) => state.expirationNotificationPolicies.catalogs);
  const mutationsState = useAppSelector((state) => state.expirationNotificationPolicies.mutations);
  const recipientGroupsListState = useAppSelector((state) => state.recipientGroups.list);

  const canCreate = hasPermission('EXPIRATION_NOTIFICATION_POLICIES', 'CREATE');

  useEffect(() => {
    if (canCreate && catalogsState.status === 'idle') {
      void dispatch(fetchExpirationNotificationPolicyCatalog());
    }
  }, [canCreate, catalogsState.status, dispatch]);

  useEffect(() => {
    if (canCreate && recipientGroupsListState.status === 'idle') {
      void dispatch(
        fetchRecipientGroups({
          page: 1,
          limit: 100,
          itemsPerPage: 100,
          filters: { status: 'ACTIVE' },
          sorts: [{ field: 'name', direction: 'asc' }],
        })
      );
    }
  }, [canCreate, dispatch, recipientGroupsListState.status]);

  useEffect(() => {
    return () => {
      dispatch(resetExpirationNotificationPolicyMutations());
    };
  }, [dispatch]);

  useEffect(() => {
    if (
      mutationsState.createStatus === 'succeeded' &&
      mutationsState.lastCreatedExpirationNotificationPolicyId
    ) {
      showSnackbar({
        message:
          mutationsState.message ??
          t('create.successFeedback', {
            defaultValue: 'Política de notificación por vencimiento creada correctamente.',
          }),
        severity: 'success',
      });
      const targetId = mutationsState.lastCreatedExpirationNotificationPolicyId;
      dispatch(resetExpirationNotificationPolicyMutations());
      router.push(`/dashboard/expiration-notification-policies/${targetId}`);
      return;
    }

    if (mutationsState.createStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('create.errorFeedback', {
            defaultValue: 'No fue posible crear la política de notificación por vencimiento.',
          }),
        severity: 'error',
      });
      dispatch(resetExpirationNotificationPolicyMutations());
    }
  }, [dispatch, mutationsState, router, showSnackbar, t]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <DashboardPageHeader
        segments={[
          {
            label: t('breadcrumbs:dashboard'),
            href: '/dashboard',
            hideOnDesktop: true,
          },
          {
            label: t('breadcrumbs:expirationNotificationPolicies'),
            href: '/dashboard/expiration-notification-policies',
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

        {!canCreate ? (
          <div className="m-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {t('create.restricted')}
          </div>
        ) : catalogsState.status === 'failed' ? (
          <div className="m-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {catalogsState.error ??
              t('catalogErrors.notificationCatalog', {
                defaultValue: 'No fue posible obtener los catálogos de políticas de notificación.',
              })}
          </div>
        ) : recipientGroupsListState.status === 'failed' ? (
          <div className="m-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {recipientGroupsListState.error ??
              t('catalogErrors.recipientGroups', {
                defaultValue: 'No fue posible obtener los grupos de destinatarios.',
              })}
          </div>
        ) : (
          <ExpirationNotificationPolicyForm
            mode="create"
            statuses={catalogsState.statuses}
            anchors={catalogsState.anchors}
            triggerModes={catalogsState.triggerModes}
            repeatUntilValues={catalogsState.repeatUntilValues}
            recipientGroups={recipientGroupsListState.items}
            onCancel={() => router.back()}
            isSubmitting={mutationsState.createStatus === 'loading'}
            disableActions={!canCreate}
            onSubmit={(values) => {
              if (!canCreate || mutationsState.createStatus === 'loading') {
                return;
              }

              void dispatch(createExpirationNotificationPolicy(values));
            }}
          />
        )}
      </Paper>
    </div>
  );
}
