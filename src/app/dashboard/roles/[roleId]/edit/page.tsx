'use client';

import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useParams, useRouter } from 'next/navigation';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { Spinner } from '@/components/ui/spinner';
import { RoleForm, type RoleFormValues } from '@/components/roles/RoleForm';
import { useAuthorization } from '@/features/auth';
import { fetchRoleById, fetchRoleModules, updateRole } from '@/features/roles/rolesThunks';
import { resetRoleMutations } from '@/features/roles';

export default function EditRolePage() {
  const params = useParams<{ roleId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslationHydrated(['roles', 'breadcrumbs']);
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();

  const detailState = useAppSelector((state) => state.roles.detail);
  const catalogsState = useAppSelector((state) => state.roles.catalogs);
  const mutationsState = useAppSelector((state) => state.roles.mutations);

  const role = detailState.currentRoleId === params.roleId ? detailState.item : null;

  const canUpdate = hasPermission('ROLES', 'UPDATE');
  const isProtectedRole = Boolean(role?.isImmutable || role?.isDefault || role?.isSystem);
  const canEdit = canUpdate && !isProtectedRole;

  useEffect(() => {
    if (params.roleId) {
      void dispatch(fetchRoleById({ roleId: params.roleId }));
    }

    if (!catalogsState.modules.length) {
      void dispatch(fetchRoleModules());
    }
  }, [catalogsState.modules.length, dispatch, params.roleId]);

  useEffect(() => {
    return () => {
      dispatch(resetRoleMutations());
    };
  }, [dispatch]);

  useEffect(() => {
    if (
      mutationsState.updateStatus === 'succeeded' &&
      mutationsState.currentRoleId === params.roleId
    ) {
      showSnackbar({
        message:
          mutationsState.message ??
          t('form.success.edit', { defaultValue: 'Rol actualizado correctamente.' }),
        severity: 'success',
      });
      dispatch(resetRoleMutations());
      router.push(`/dashboard/roles/${params.roleId}`);
      return;
    }

    if (
      mutationsState.updateStatus === 'failed' &&
      mutationsState.currentRoleId === params.roleId
    ) {
      showSnackbar({
        message:
          mutationsState.error ??
          t('form.error.edit', { defaultValue: 'No fue posible actualizar el rol.' }),
        severity: 'error',
      });
      dispatch(resetRoleMutations());
    }
  }, [dispatch, mutationsState, params.roleId, router, showSnackbar, t]);

  const handleSubmit = (values: RoleFormValues) => {
    if (!canEdit || !params.roleId || mutationsState.updateStatus === 'loading') {
      return;
    }

    void dispatch(
      updateRole({
        roleId: params.roleId,
        permissions: values.permissions,
      })
    );
  };

  const isLoading =
    detailState.status === 'loading' ||
    (catalogsState.status === 'loading' && !catalogsState.modules.length);
  const loadError =
    detailState.status === 'failed'
      ? detailState.error
      : catalogsState.status === 'failed'
        ? catalogsState.error
        : null;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <DashboardPageHeader
        segments={[
          { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
          { label: t('breadcrumbs:roles'), href: '/dashboard/roles', hideOnDesktop: true },
          { label: role?.name ?? '—', href: `/dashboard/roles/${params.roleId}` },
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
          sx={{ px: 4, py: 4, borderBottom: '1px solid var(--surface-border)' }}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                {t('actions.edit')} · {role?.name ?? '—'}
              </Typography>
              <Typography variant="body2" color="text.foreground">
                {t('edit.subtitle')}
              </Typography>
            </div>
          </div>

          {role ? (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">{role.code}</span>
              <Chip
                size="small"
                variant="outlined"
                label={t(`scopes.${role.scope}`, { defaultValue: role.scope })}
              />
              <Chip
                size="small"
                variant="outlined"
                label={t(`status.${role.statusId}`, { defaultValue: role.statusId })}
              />
            </div>
          ) : null}

          {!canUpdate ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {t('edit.restricted')}
            </div>
          ) : null}

          {canUpdate && isProtectedRole ? (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
              {t('edit.immutable')}
            </div>
          ) : null}
        </Box>

        <div className="flex flex-1 flex-col">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center py-10">
              <Spinner className="size-6 text-primary" />
            </div>
          ) : loadError ? (
            <div className="flex flex-1 items-center justify-center px-6 text-sm text-destructive">
              {loadError}
            </div>
          ) : role ? (
            <RoleForm
              mode="edit"
              role={role}
              modules={catalogsState.modules}
              onSubmit={handleSubmit}
              onCancel={() => router.back()}
              isSubmitting={mutationsState.updateStatus === 'loading'}
              disableActions={!canEdit}
            />
          ) : null}
        </div>
      </Paper>
    </div>
  );
}
