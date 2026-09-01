'use client';

import { useEffect, useMemo } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useParams, useRouter } from 'next/navigation';

import { InternalAssetControlForm } from '@/components/internal-asset-control/InternalAssetControlForm';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthorization } from '@/features/auth';
import { fetchExpirationNotificationPolicyOptions } from '@/features/expiration-notification-policies/expirationNotificationPoliciesThunks';
import { fetchExpirationStatusPolicyOptions } from '@/features/expiration-status-policies/expirationStatusPoliciesThunks';
import {
  fetchInternalAssetMaintenanceCatalog,
  fetchInternalAssetMaintenanceRecordById,
  resetInternalAssetControlMutations,
  updateInternalAssetMaintenanceRecord,
} from '@/features/internal-asset-control';
import { fetchRecipientGroups } from '@/features/recipient-groups/recipientGroupsThunks';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

export default function InternalAssetControlEditPage() {
  const params = useParams<{ recordId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslationHydrated(['internalAssetControl', 'breadcrumbs']);
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();

  const canEdit = hasPermission('INTERNAL_ASSET_MAINTENANCE_RECORDS', 'UPDATE');
  const canRead = hasPermission('INTERNAL_ASSET_MAINTENANCE_RECORDS', 'READ');
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const detailState = useAppSelector((state) => state.internalAssetControl.detail);
  const catalogsState = useAppSelector((state) => state.internalAssetControl.catalogs);
  const mutationsState = useAppSelector((state) => state.internalAssetControl.mutations);
  const expirationStatusPoliciesState = useAppSelector(
    (state) => state.expirationStatusPolicies.catalogs
  );
  const expirationNotificationPoliciesState = useAppSelector(
    (state) => state.expirationNotificationPolicies.catalogs
  );
  const recipientGroupsListState = useAppSelector((state) => state.recipientGroups.list);

  const loadDependencies = () => {
    if (!canRead) {
      return;
    }

    void dispatch(fetchInternalAssetMaintenanceCatalog());
    void dispatch(fetchExpirationStatusPolicyOptions({ status: 'ACTIVE' }));
    void dispatch(fetchExpirationNotificationPolicyOptions({ status: 'ACTIVE' }));
    void dispatch(
      fetchRecipientGroups({
        page: 1,
        limit: 100,
        itemsPerPage: 100,
        filters: { status: 'ACTIVE' },
        sorts: [{ field: 'name', direction: 'asc' }],
      })
    );
    if (params.recordId) {
      void dispatch(
        fetchInternalAssetMaintenanceRecordById({
          internalAssetMaintenanceRecordId: params.recordId,
        })
      );
    }
  };

  const record = useMemo(() => {
    if (detailState.item?.internalAssetMaintenanceRecordId === params.recordId) {
      return detailState.item;
    }

    return null;
  }, [detailState.item, params.recordId]);

  useEffect(() => {
    if (!params.recordId || !authHydrated) {
      return;
    }

    void dispatch(
      fetchInternalAssetMaintenanceRecordById({
        internalAssetMaintenanceRecordId: params.recordId,
      })
    );
  }, [authHydrated, dispatch, params.recordId]);

  useEffect(() => {
    if (!canRead) {
      return;
    }

    if (catalogsState.status === 'idle') {
      void dispatch(fetchInternalAssetMaintenanceCatalog());
    }

    if (expirationStatusPoliciesState.status === 'idle') {
      void dispatch(fetchExpirationStatusPolicyOptions({ status: 'ACTIVE' }));
    }

    if (expirationNotificationPoliciesState.status === 'idle') {
      void dispatch(fetchExpirationNotificationPolicyOptions({ status: 'ACTIVE' }));
    }

    if (recipientGroupsListState.status === 'idle') {
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
  }, [
    canRead,
    catalogsState.status,
    dispatch,
    expirationNotificationPoliciesState.status,
    expirationStatusPoliciesState.status,
    recipientGroupsListState.status,
  ]);

  useEffect(() => {
    return () => {
      dispatch(resetInternalAssetControlMutations());
    };
  }, [dispatch]);

  useEffect(() => {
    if (mutationsState.currentRecordId !== params.recordId) {
      return;
    }

    if (mutationsState.updateStatus === 'succeeded') {
      showSnackbar({
        message:
          mutationsState.message ??
          t('edit.successFeedback', {
            defaultValue: 'Registro actualizado correctamente.',
          }),
        severity: 'success',
      });
      dispatch(resetInternalAssetControlMutations());
      router.push(`/dashboard/internal-asset-control/${params.recordId}`);
      return;
    }

    if (mutationsState.updateStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('edit.errorFeedback', {
            defaultValue: 'No fue posible actualizar el registro.',
          }),
        severity: 'error',
      });
      dispatch(resetInternalAssetControlMutations());
    }
  }, [dispatch, mutationsState, params.recordId, router, showSnackbar, t]);

  const isLoading =
    (!authHydrated && Boolean(params.recordId)) ||
    (detailState.status === 'loading' && detailState.currentRecordId === params.recordId);

  const loadError =
    authHydrated &&
    detailState.status === 'failed' &&
    detailState.currentRecordId === params.recordId
      ? detailState.error
      : null;

  const catalogError =
    catalogsState.error ||
    expirationStatusPoliciesState.error ||
    expirationNotificationPoliciesState.error ||
    recipientGroupsListState.error;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <DashboardPageHeader
        segments={[
          { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
          {
            label: t('breadcrumbs:internalAssetControl'),
            href: '/dashboard/internal-asset-control',
            hideOnDesktop: true,
          },
          {
            label: record?.assetName ?? t('detail.notFound'),
            href: `/dashboard/internal-asset-control/${params.recordId}`,
          },
          { label: t('edit.title') },
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
                {t('edit.title')}
              </Typography>
              <Typography variant="body2" color="text.foreground">
                {t('edit.description')}
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
            <div>{loadError}</div>
            <div className="mt-3">
              <Button type="button" variant="outline" size="sm" onClick={loadDependencies}>
                {t('actions.retry')}
              </Button>
            </div>
          </div>
        ) : catalogError ? (
          <div className="m-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <div>{catalogError}</div>
            <div className="mt-3">
              <Button type="button" variant="outline" size="sm" onClick={loadDependencies}>
                {t('actions.retry')}
              </Button>
            </div>
          </div>
        ) : record ? (
          <InternalAssetControlForm
            mode="edit"
            record={record}
            assetMaintenanceTypes={catalogsState.item?.assetMaintenanceTypes ?? []}
            statuses={catalogsState.item?.statuses ?? []}
            expirationStatusPolicyOptions={expirationStatusPoliciesState.options}
            expirationNotificationPolicyOptions={expirationNotificationPoliciesState.options}
            recipientGroups={recipientGroupsListState.items}
            isSubmitting={mutationsState.updateStatus === 'loading'}
            disableActions={!canEdit}
            onCancel={() => router.back()}
            onSubmit={(values) => {
              if (!canEdit || mutationsState.updateStatus === 'loading') {
                return;
              }

              void dispatch(
                updateInternalAssetMaintenanceRecord({
                  internalAssetMaintenanceRecordId: params.recordId,
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
