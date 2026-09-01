'use client';

import { useEffect, useMemo } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useParams, useRouter } from 'next/navigation';

import { ExpirationNotificationPolicyForm } from '@/components/expiration-notification-policies/ExpirationNotificationPolicyForm';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthorization } from '@/features/auth';
import {
  fetchExpirationNotificationPolicyById,
  fetchExpirationNotificationPolicyCatalog,
  updateExpirationNotificationPolicy,
} from '@/features/expiration-notification-policies/expirationNotificationPoliciesThunks';
import { resetExpirationNotificationPolicyMutations } from '@/features/expiration-notification-policies/expirationNotificationPoliciesSlice';
import { fetchRecipientGroups } from '@/features/recipient-groups/recipientGroupsThunks';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

export default function ExpirationNotificationPolicyEditPage() {
  const params = useParams<{ expirationNotificationPolicyId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslationHydrated(['expirationNotificationPolicies', 'breadcrumbs']);
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();
  const detailState = useAppSelector((state) => state.expirationNotificationPolicies.detail);
  const catalogsState = useAppSelector((state) => state.expirationNotificationPolicies.catalogs);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const mutationsState = useAppSelector((state) => state.expirationNotificationPolicies.mutations);
  const recipientGroupsListState = useAppSelector((state) => state.recipientGroups.list);

  const policy = useMemo(() => {
    if (
      detailState.item?.expirationNotificationPolicyId === params.expirationNotificationPolicyId
    ) {
      return detailState.item;
    }

    return null;
  }, [detailState.item, params.expirationNotificationPolicyId]);

  const canEdit = hasPermission('EXPIRATION_NOTIFICATION_POLICIES', 'UPDATE');
  const canRead = hasPermission('EXPIRATION_NOTIFICATION_POLICIES', 'READ');

  useEffect(() => {
    if (!params.expirationNotificationPolicyId || !authHydrated) {
      return;
    }

    void dispatch(
      fetchExpirationNotificationPolicyById({
        expirationNotificationPolicyId: params.expirationNotificationPolicyId,
      })
    );
  }, [authHydrated, dispatch, params.expirationNotificationPolicyId]);

  useEffect(() => {
    if (canRead && catalogsState.status === 'idle') {
      void dispatch(fetchExpirationNotificationPolicyCatalog());
    }
  }, [canRead, catalogsState.status, dispatch]);

  useEffect(() => {
    if (canRead && recipientGroupsListState.status === 'idle') {
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
  }, [canRead, dispatch, recipientGroupsListState.status]);

  useEffect(() => {
    return () => {
      dispatch(resetExpirationNotificationPolicyMutations());
    };
  }, [dispatch]);

  useEffect(() => {
    if (
      mutationsState.currentExpirationNotificationPolicyId !== params.expirationNotificationPolicyId
    ) {
      return;
    }

    if (mutationsState.updateStatus === 'succeeded') {
      showSnackbar({
        message:
          mutationsState.message ??
          t('edit.successFeedback', {
            defaultValue: 'Política de notificación por vencimiento actualizada correctamente.',
          }),
        severity: 'success',
      });
      dispatch(resetExpirationNotificationPolicyMutations());
      router.push(
        `/dashboard/expiration-notification-policies/${params.expirationNotificationPolicyId}`
      );
    } else if (mutationsState.updateStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('edit.errorFeedback', {
            defaultValue: 'No fue posible actualizar la política de notificación por vencimiento.',
          }),
        severity: 'error',
      });
      dispatch(resetExpirationNotificationPolicyMutations());
    }
  }, [dispatch, mutationsState, params.expirationNotificationPolicyId, router, showSnackbar, t]);

  const isLoading =
    (!authHydrated && Boolean(params.expirationNotificationPolicyId)) ||
    (detailState.status === 'loading' &&
      detailState.currentExpirationNotificationPolicyId === params.expirationNotificationPolicyId);
  const loadError =
    authHydrated &&
    detailState.status === 'failed' &&
    detailState.currentExpirationNotificationPolicyId === params.expirationNotificationPolicyId
      ? detailState.error
      : null;

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
          {
            label: policy?.name ?? t('detail.missingTitle'),
            href: `/dashboard/expiration-notification-policies/${params.expirationNotificationPolicyId}`,
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
          sx={{
            px: { xs: 2.5, md: 4 },
            py: 3,
            borderBottom: '1px solid var(--surface-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-56 rounded-md" />
              <Skeleton className="h-4 w-72 rounded-md" />
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                {t('form.title.edit')}
              </Typography>
              <Typography variant="body2" color="text.foreground">
                {t('form.description.edit')}
              </Typography>
            </>
          )}
        </Box>

        {!canEdit ? (
          <div className="m-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {t('edit.restricted')}
          </div>
        ) : isLoading ? (
          <div className="flex flex-1 flex-col gap-4 p-6">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-72 w-full rounded-2xl" />
          </div>
        ) : loadError ? (
          <div className="m-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {loadError}
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
        ) : policy ? (
          <ExpirationNotificationPolicyForm
            mode="edit"
            policy={policy}
            statuses={catalogsState.statuses}
            anchors={catalogsState.anchors}
            triggerModes={catalogsState.triggerModes}
            repeatUntilValues={catalogsState.repeatUntilValues}
            recipientGroups={recipientGroupsListState.items}
            onCancel={() => router.back()}
            isSubmitting={mutationsState.updateStatus === 'loading'}
            disableActions={!canEdit}
            onSubmit={(values) => {
              if (!canEdit || mutationsState.updateStatus === 'loading') {
                return;
              }

              void dispatch(
                updateExpirationNotificationPolicy({
                  expirationNotificationPolicyId: params.expirationNotificationPolicyId,
                  ...values,
                })
              );
            }}
          />
        ) : (
          <div className="m-6 rounded-xl border border-border/60 bg-card/60 p-4 text-sm text-muted-foreground">
            {t('detail.notFound')}
          </div>
        )}
      </Paper>
    </div>
  );
}
