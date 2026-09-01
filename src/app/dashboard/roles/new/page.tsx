'use client';

import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { Spinner } from '@/components/ui/spinner';
import { RoleForm, type RoleFormValues } from '@/components/roles/RoleForm';
import { useAuthorization } from '@/features/auth';
import { createRole, fetchRoleModules } from '@/features/roles/rolesThunks';
import { resetRoleMutations } from '@/features/roles';

export default function CreateRolePage() {
  const { t } = useTranslationHydrated(['roles', 'breadcrumbs']);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();

  const catalogsState = useAppSelector((state) => state.roles.catalogs);
  const mutationsState = useAppSelector((state) => state.roles.mutations);

  const canCreate = hasPermission('ROLES', 'CREATE');

  useEffect(() => {
    if (!catalogsState.modules.length) {
      void dispatch(fetchRoleModules());
    }
  }, [catalogsState.modules.length, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetRoleMutations());
    };
  }, [dispatch]);

  useEffect(() => {
    if (mutationsState.createStatus === 'succeeded' && mutationsState.lastCreatedRoleId) {
      showSnackbar({
        message:
          mutationsState.message ??
          t('form.success.create', { defaultValue: 'Rol creado correctamente.' }),
        severity: 'success',
      });
      const targetId = mutationsState.lastCreatedRoleId;
      dispatch(resetRoleMutations());
      router.push(`/dashboard/roles/${targetId}`);
      return;
    }

    if (mutationsState.createStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('form.error.create', { defaultValue: 'No fue posible crear el rol.' }),
        severity: 'error',
      });
      dispatch(resetRoleMutations());
    }
  }, [dispatch, mutationsState, router, showSnackbar, t]);

  const handleSubmit = (values: RoleFormValues) => {
    if (!canCreate || mutationsState.createStatus === 'loading') {
      return;
    }

    void dispatch(
      createRole({
        name: values.name,
        permissions: values.permissions,
      })
    );
  };

  const isLoadingCatalogs = catalogsState.status === 'loading' && !catalogsState.modules.length;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <DashboardPageHeader
        segments={[
          { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
          { label: t('breadcrumbs:roles'), href: '/dashboard/roles' },
          { label: t('actions.create') },
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
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
              {t('actions.create')}
            </Typography>
            <Typography variant="body2" color="text.foreground">
              {t('create.subtitle')}
            </Typography>
          </div>
        </Box>

        {!canCreate ? (
          <div className="m-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {t('restricted', {
              defaultValue: 'No cuentas con permiso para consultar este módulo.',
            })}
          </div>
        ) : null}

        {isLoadingCatalogs ? (
          <div className="flex flex-1 items-center justify-center py-10">
            <Spinner className="size-6 text-primary" />
          </div>
        ) : catalogsState.status === 'failed' ? (
          <div className="m-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {catalogsState.error ?? 'No fue posible obtener los catálogos de permisos.'}
          </div>
        ) : (
          <RoleForm
            mode="create"
            modules={catalogsState.modules}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            isSubmitting={mutationsState.createStatus === 'loading'}
            disableActions={!canCreate}
          />
        )}
      </Paper>
    </div>
  );
}
