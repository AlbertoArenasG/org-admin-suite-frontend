'use client';

import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';

import { ExpirationStatusPolicyForm } from '@/components/expiration-status-policies/ExpirationStatusPolicyForm';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthorization } from '@/features/auth';
import {
  createExpirationStatusPolicy,
  fetchExpirationStatusPolicyCatalog,
} from '@/features/expiration-status-policies/expirationStatusPoliciesThunks';
import { resetExpirationStatusPolicyMutations } from '@/features/expiration-status-policies/expirationStatusPoliciesSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

export default function ExpirationStatusPolicyCreatePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslationHydrated(['expirationStatusPolicies', 'breadcrumbs']);
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();
  const catalogsState = useAppSelector((state) => state.expirationStatusPolicies.catalogs);
  const mutationsState = useAppSelector((state) => state.expirationStatusPolicies.mutations);

  const canCreate = hasPermission('EXPIRATION_STATUS_POLICIES', 'CREATE');
  const canRead = hasPermission('EXPIRATION_STATUS_POLICIES', 'READ');

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
    if (
      mutationsState.createStatus === 'succeeded' &&
      mutationsState.lastCreatedExpirationStatusPolicyId
    ) {
      showSnackbar({
        message:
          mutationsState.message ??
          t('create.successFeedback', {
            defaultValue: 'Política de estatus por vencimiento creada correctamente.',
          }),
        severity: 'success',
      });
      const targetId = mutationsState.lastCreatedExpirationStatusPolicyId;
      dispatch(resetExpirationStatusPolicyMutations());
      router.push(`/dashboard/expiration-status-policies/${targetId}`);
      return;
    }

    if (mutationsState.createStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('create.errorFeedback', {
            defaultValue: 'No fue posible crear la política de estatus por vencimiento.',
          }),
        severity: 'error',
      });
      dispatch(resetExpirationStatusPolicyMutations());
    }
  }, [dispatch, mutationsState, router, showSnackbar, t]);

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
              { label: t('form.title.create') },
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
            {t('form.title.create')}
          </Typography>
          <Typography variant="body2" color="text.foreground">
            {t('form.description.create')}
          </Typography>
        </Box>

        {!canCreate ? (
          <div className="m-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {t('permissions.readRestricted')}
          </div>
        ) : catalogsState.status === 'failed' ? (
          <div className="m-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {catalogsState.error ??
              t('catalogErrors.statuses', {
                defaultValue: 'No fue posible obtener el catálogo de estados.',
              })}
          </div>
        ) : (
          <ExpirationStatusPolicyForm
            mode="create"
            statuses={catalogsState.statuses}
            onCancel={() => router.back()}
            isSubmitting={mutationsState.createStatus === 'loading'}
            disableActions={!canCreate}
            onSubmit={(values) => {
              if (!canCreate || mutationsState.createStatus === 'loading') {
                return;
              }

              void dispatch(createExpirationStatusPolicy(values));
            }}
          />
        )}
      </Paper>
    </div>
  );
}
