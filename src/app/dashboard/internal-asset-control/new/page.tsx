'use client';

import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';

import { InternalAssetControlForm } from '@/components/internal-asset-control/InternalAssetControlForm';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthorization } from '@/features/auth';
import { fetchExpirationNotificationPolicyOptions } from '@/features/expiration-notification-policies/expirationNotificationPoliciesThunks';
import { fetchExpirationStatusPolicyOptions } from '@/features/expiration-status-policies/expirationStatusPoliciesThunks';
import {
  createInternalAssetMaintenanceRecord,
  fetchInternalAssetMaintenanceCatalog,
  resetInternalAssetControlMutations,
} from '@/features/internal-asset-control';
import { fetchRecipientGroups } from '@/features/recipient-groups/recipientGroupsThunks';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

export default function InternalAssetControlCreatePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslationHydrated(['internalAssetControl', 'breadcrumbs']);
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();

  const canCreate = hasPermission('INTERNAL_ASSET_MAINTENANCE_RECORDS', 'CREATE');
  const catalogsState = useAppSelector((state) => state.internalAssetControl.catalogs);
  const mutationsState = useAppSelector((state) => state.internalAssetControl.mutations);
  const expirationStatusPoliciesState = useAppSelector(
    (state) => state.expirationStatusPolicies.catalogs
  );
  const expirationNotificationPoliciesState = useAppSelector(
    (state) => state.expirationNotificationPolicies.catalogs
  );
  const recipientGroupsListState = useAppSelector((state) => state.recipientGroups.list);

  useEffect(() => {
    if (!canCreate) {
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
    canCreate,
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
    if (mutationsState.createStatus === 'succeeded' && mutationsState.lastCreatedRecordId) {
      showSnackbar({
        message:
          mutationsState.message ??
          t('create.successFeedback', {
            defaultValue: 'Registro creado correctamente.',
          }),
        severity: 'success',
      });
      const targetId = mutationsState.lastCreatedRecordId;
      dispatch(resetInternalAssetControlMutations());
      router.push(`/dashboard/internal-asset-control/${targetId}`);
      return;
    }

    if (mutationsState.createStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('create.errorFeedback', {
            defaultValue: 'No fue posible crear el registro.',
          }),
        severity: 'error',
      });
      dispatch(resetInternalAssetControlMutations());
    }
  }, [dispatch, mutationsState, router, showSnackbar, t]);

  const loadError =
    catalogsState.error ||
    expirationStatusPoliciesState.error ||
    expirationNotificationPoliciesState.error ||
    recipientGroupsListState.error;

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
                label: t('breadcrumbs:internalAssetControl'),
                href: '/dashboard/internal-asset-control',
                hideOnDesktop: true,
              },
              { label: t('create.title') },
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
            {t('create.title')}
          </Typography>
          <Typography variant="body2" color="text.foreground">
            {t('create.description')}
          </Typography>
        </Box>

        {!canCreate ? (
          <div className="m-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {t('create.restricted')}
          </div>
        ) : loadError ? (
          <div className="m-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {loadError}
          </div>
        ) : (
          <InternalAssetControlForm
            mode="create"
            assetMaintenanceTypes={catalogsState.item?.assetMaintenanceTypes ?? []}
            statuses={catalogsState.item?.statuses ?? []}
            expirationStatusPolicyOptions={expirationStatusPoliciesState.options}
            expirationNotificationPolicyOptions={expirationNotificationPoliciesState.options}
            recipientGroups={recipientGroupsListState.items}
            isSubmitting={mutationsState.createStatus === 'loading'}
            disableActions={!canCreate}
            onCancel={() => router.back()}
            onSubmit={(values) => {
              if (!canCreate || mutationsState.createStatus === 'loading') {
                return;
              }

              void dispatch(createInternalAssetMaintenanceRecord(values));
            }}
          />
        )}
      </Paper>
    </div>
  );
}
