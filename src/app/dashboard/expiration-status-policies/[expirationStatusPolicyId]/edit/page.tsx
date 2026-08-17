'use client';

import { useEffect, useMemo } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useParams, useRouter } from 'next/navigation';

import { ExpirationStatusPolicyForm } from '@/components/expiration-status-policies/ExpirationStatusPolicyForm';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthorization } from '@/features/auth';
import {
  fetchExpirationStatusPolicyById,
  fetchExpirationStatusPolicyCatalog,
  updateExpirationStatusPolicy,
} from '@/features/expiration-status-policies/expirationStatusPoliciesThunks';
import { resetExpirationStatusPolicyMutations } from '@/features/expiration-status-policies/expirationStatusPoliciesSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

export default function ExpirationStatusPolicyEditPage() {
  const params = useParams<{ expirationStatusPolicyId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslationHydrated(['expirationStatusPolicies', 'breadcrumbs']);
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();
  const detailState = useAppSelector((state) => state.expirationStatusPolicies.detail);
  const catalogsState = useAppSelector((state) => state.expirationStatusPolicies.catalogs);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const mutationsState = useAppSelector((state) => state.expirationStatusPolicies.mutations);

  const policy = useMemo(() => {
    if (detailState.item?.expirationStatusPolicyId === params.expirationStatusPolicyId) {
      return detailState.item;
    }

    return null;
  }, [detailState.item, params.expirationStatusPolicyId]);

  const canEdit = hasPermission('EXPIRATION_STATUS_POLICIES', 'UPDATE');
  const canRead = hasPermission('EXPIRATION_STATUS_POLICIES', 'READ');

  useEffect(() => {
    if (!params.expirationStatusPolicyId || !authHydrated) {
      return;
    }

    void dispatch(
      fetchExpirationStatusPolicyById({
        expirationStatusPolicyId: params.expirationStatusPolicyId,
      })
    );
  }, [authHydrated, dispatch, params.expirationStatusPolicyId]);

  useEffect(() => {
    if (canRead && catalogsState.status === 'idle') {
      void dispatch(fetchExpirationStatusPolicyCatalog());
    }
  }, [canRead, catalogsState.status, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetExpirationStatusPolicyMutations());
    };
  }, [dispatch]);

  useEffect(() => {
    if (mutationsState.currentExpirationStatusPolicyId !== params.expirationStatusPolicyId) {
      return;
    }

    if (mutationsState.updateStatus === 'succeeded') {
      showSnackbar({
        message:
          mutationsState.message ??
          t('edit.successFeedback', {
            defaultValue: 'Política de estatus por vencimiento actualizada correctamente.',
          }),
        severity: 'success',
      });
      dispatch(resetExpirationStatusPolicyMutations());
      router.push(`/dashboard/expiration-status-policies/${params.expirationStatusPolicyId}`);
    } else if (mutationsState.updateStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('edit.errorFeedback', {
            defaultValue: 'No fue posible actualizar la política de estatus por vencimiento.',
          }),
        severity: 'error',
      });
      dispatch(resetExpirationStatusPolicyMutations());
    }
  }, [dispatch, mutationsState, params.expirationStatusPolicyId, router, showSnackbar, t]);

  const isLoading =
    (!authHydrated && Boolean(params.expirationStatusPolicyId)) ||
    (detailState.status === 'loading' &&
      detailState.currentExpirationStatusPolicyId === params.expirationStatusPolicyId);
  const loadError =
    authHydrated &&
    detailState.status === 'failed' &&
    detailState.currentExpirationStatusPolicyId === params.expirationStatusPolicyId
      ? detailState.error
      : null;

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
                label: t('breadcrumbs:expirationStatusPolicies'),
                href: '/dashboard/expiration-status-policies',
                hideOnDesktop: true,
              },
              {
                label: policy?.name ?? t('detail.missingTitle'),
                href: `/dashboard/expiration-status-policies/${params.expirationStatusPolicyId}`,
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
            <Skeleton className="h-56 w-full rounded-2xl" />
          </div>
        ) : loadError ? (
          <div className="m-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {loadError}
          </div>
        ) : catalogsState.status === 'failed' ? (
          <div className="m-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {catalogsState.error ??
              t('catalogErrors.statuses', {
                defaultValue: 'No fue posible obtener el catálogo de estados.',
              })}
          </div>
        ) : policy ? (
          <ExpirationStatusPolicyForm
            mode="edit"
            policy={policy}
            statuses={catalogsState.statuses}
            onCancel={() => router.back()}
            isSubmitting={mutationsState.updateStatus === 'loading'}
            disableActions={!canEdit}
            onSubmit={(values) => {
              if (!canEdit || mutationsState.updateStatus === 'loading') {
                return;
              }

              void dispatch(
                updateExpirationStatusPolicy({
                  expirationStatusPolicyId: params.expirationStatusPolicyId,
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
