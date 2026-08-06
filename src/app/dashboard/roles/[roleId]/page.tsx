'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Chip from '@mui/material/Chip';
import { ArrowLeft, Copy, RefreshCw, ShieldBan, Trash2 } from 'lucide-react';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuthorization } from '@/features/auth';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import {
  changeRoleStatus,
  deleteRole,
  fetchRoleById,
  fetchRoleModules,
} from '@/features/roles/rolesThunks';
import { resetRoleDetail, resetRoleMutations } from '@/features/roles';
import { groupRolePermissions } from '@/components/roles/roleDetailUtils';

function formatBoolean(value: boolean) {
  return value ? 'Sí' : 'No';
}

export default function RoleDetailPage() {
  const params = useParams<{ roleId?: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t, hydrated, i18n } = useTranslationHydrated(['roles', 'breadcrumbs']);
  const { hasPermission } = useAuthorization();
  const { showSnackbar } = useSnackbar();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const roleId = typeof params?.roleId === 'string' ? params.roleId : undefined;
  const detailState = useAppSelector((state) => state.roles.detail);
  const catalogsState = useAppSelector((state) => state.roles.catalogs);
  const mutationsState = useAppSelector((state) => state.roles.mutations);
  const role = detailState.currentRoleId === roleId ? detailState.item : null;

  const canRead = hasPermission('ROLES', 'READ');
  const canUpdate = hasPermission('ROLES', 'UPDATE');
  const canDelete = hasPermission('ROLES', 'DELETE');
  const isProtectedRole = Boolean(role?.isImmutable || role?.isDefault || role?.isSystem);
  const canMutate = Boolean(role && !isProtectedRole);

  const dateFormatter = useMemo(() => {
    const fallback = i18n.options.fallbackLng;
    const fallbackLang = Array.isArray(fallback)
      ? fallback[0]
      : typeof fallback === 'string'
        ? fallback
        : 'es';
    const locale = hydrated ? i18n.language : fallbackLang;
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' });
  }, [hydrated, i18n.language, i18n.options.fallbackLng]);

  const formatDate = useCallback(
    (value: string | null) => {
      if (!value) {
        return '—';
      }
      try {
        return dateFormatter.format(new Date(value));
      } catch {
        return '—';
      }
    },
    [dateFormatter]
  );

  useEffect(() => {
    if (!roleId || !canRead) {
      return;
    }

    void dispatch(fetchRoleById({ roleId }));

    if (!catalogsState.modules.length) {
      void dispatch(fetchRoleModules());
    }

    return () => {
      dispatch(resetRoleDetail());
      dispatch(resetRoleMutations());
    };
  }, [canRead, catalogsState.modules.length, dispatch, roleId]);

  useEffect(() => {
    if (mutationsState.deleteStatus === 'succeeded' && mutationsState.currentRoleId === roleId) {
      showSnackbar({
        message:
          mutationsState.message ??
          t('delete.success', { defaultValue: 'Rol eliminado correctamente.' }),
        severity: 'success',
      });
      setDeleteDialogOpen(false);
      dispatch(resetRoleMutations());
      router.replace('/dashboard/roles');
      return;
    }

    if (mutationsState.deleteStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('delete.error', { defaultValue: 'No fue posible eliminar el rol.' }),
        severity: 'error',
      });
      setDeleteDialogOpen(false);
      dispatch(resetRoleMutations());
      return;
    }

    if (
      mutationsState.changeStatusStatus === 'succeeded' &&
      mutationsState.currentRoleId === roleId
    ) {
      showSnackbar({
        message:
          mutationsState.message ??
          t('statusChange.success', {
            defaultValue: 'Estado del rol actualizado correctamente.',
          }),
        severity: 'success',
      });
      setStatusDialogOpen(false);
      dispatch(resetRoleMutations());
      if (roleId) {
        void dispatch(fetchRoleById({ roleId }));
      }
      return;
    }

    if (mutationsState.changeStatusStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('statusChange.error', { defaultValue: 'No fue posible actualizar el estado del rol.' }),
        severity: 'error',
      });
      setStatusDialogOpen(false);
      dispatch(resetRoleMutations());
    }
  }, [dispatch, mutationsState, roleId, router, showSnackbar, t]);

  const handleRetry = useCallback(() => {
    if (!roleId) {
      return;
    }
    void dispatch(fetchRoleById({ roleId }));
  }, [dispatch, roleId]);

  const handleCopyRoleId = useCallback(() => {
    if (!role?.roleId) {
      return;
    }

    const copyValue = async () => {
      if (typeof navigator !== 'undefined' && window.isSecureContext && navigator.clipboard) {
        await navigator.clipboard.writeText(role.roleId);
        return true;
      }

      try {
        const textarea = document.createElement('textarea');
        textarea.value = role.roleId;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
      } catch {
        return false;
      }
    };

    void copyValue()
      .then((success) => {
        showSnackbar({
          message: success ? t('detail.copySuccess') : t('detail.copyError'),
          severity: success ? 'success' : 'error',
        });
      })
      .catch(() => {
        showSnackbar({
          message: t('detail.copyError'),
          severity: 'error',
        });
      });
  }, [role?.roleId, showSnackbar, t]);

  const groupedPermissions = role
    ? groupRolePermissions({
        permissions: role.permissions,
        modules: catalogsState.modules,
      })
    : [];

  const detailRows = role
    ? [
        { label: t('detail.fields.roleId'), value: role.roleId },
        { label: t('detail.fields.code'), value: role.code },
        {
          label: t('detail.fields.scope'),
          value: t(`scopes.${role.scope}`, { defaultValue: role.scope }),
        },
        {
          label: t('detail.fields.status'),
          value: (
            <Chip
              size="small"
              color={
                role.statusId === 'ACTIVE'
                  ? 'success'
                  : role.statusId === 'INACTIVE'
                    ? 'default'
                    : 'warning'
              }
              variant="outlined"
              label={t(`status.${role.statusId}`, { defaultValue: role.statusId })}
            />
          ),
        },
        { label: t('detail.fields.createdAt'), value: formatDate(role.createdAt) },
        { label: t('detail.fields.updatedAt'), value: formatDate(role.updatedAt) },
        { label: t('detail.fields.isSystem'), value: formatBoolean(role.isSystem) },
        { label: t('detail.fields.isDefault'), value: formatBoolean(role.isDefault) },
        { label: t('detail.fields.isImmutable'), value: formatBoolean(role.isImmutable) },
      ]
    : [];

  const isLoading =
    detailState.status === 'loading' ||
    (catalogsState.status === 'loading' && !catalogsState.modules.length);
  const hasError = detailState.status === 'failed' && Boolean(detailState.error);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
              { label: t('breadcrumbs:roles'), href: '/dashboard/roles' },
              { label: role?.name ?? t('detail.title') },
            ]}
          />
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {role?.name ?? t('detail.title')}
          </h1>
          <p className="text-muted-foreground">{t('detail.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyRoleId} disabled={!role}>
            <Copy className="size-4" />
            {t('detail.copyId')}
          </Button>
          {role && canUpdate ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/roles/${role.roleId}/edit`)}
              disabled={!canMutate}
            >
              {t('actions.edit')}
            </Button>
          ) : null}
          {role && canUpdate ? (
            <Button size="sm" onClick={() => setStatusDialogOpen(true)} disabled={!canMutate}>
              {role.statusId === 'ACTIVE' ? t('actions.deactivate') : t('actions.activate')}
            </Button>
          ) : null}
          {role && canDelete ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={!canMutate}
            >
              <Trash2 className="size-4" />
              {t('actions.delete')}
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/roles')}>
            <ArrowLeft className="size-4" />
            {t('detail.back')}
          </Button>
        </div>
      </div>

      {!canRead ? (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {t('restricted')}
        </div>
      ) : null}

      {role && isProtectedRole ? (
        <Alert className="rounded-3xl border border-amber-500/40 bg-amber-500/5 text-amber-900 dark:text-amber-100">
          <ShieldBan className="h-4 w-4" />
          <AlertTitle>{t('edit.immutable')}</AlertTitle>
          <AlertDescription>
            {t('protectedHint', {
              defaultValue: 'Este rol está protegido por su metadata y solo puede consultarse.',
            })}
          </AlertDescription>
        </Alert>
      ) : null}

      {hasError ? (
        <Alert
          variant="destructive"
          className="rounded-3xl border border-destructive/50 bg-destructive/5"
        >
          <AlertTitle>{t('detail.errorTitle')}</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-3 text-sm text-destructive">
            {detailState.error}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <RefreshCw className="size-4" />
                {t('detail.retry')}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">{t('detail.title')}</h2>
            {role ? (
              <Chip
                size="small"
                variant="outlined"
                label={t(`status.${role.statusId}`, { defaultValue: role.statusId })}
              />
            ) : null}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ) : role ? (
            <div className="space-y-3">
              {detailRows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/60 px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-medium text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          ) : !hasError ? (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-4 py-12 text-center text-sm text-muted-foreground">
              {t('detail.notFound')}
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">{t('detail.permissionsTitle')}</h2>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </div>
          ) : groupedPermissions.length ? (
            <div className="space-y-4">
              {groupedPermissions.map((group) => (
                <div
                  key={group.moduleCode}
                  className="rounded-2xl border border-border/60 bg-card/40 p-4"
                >
                  <div className="mb-3">
                    <h3 className="font-medium text-foreground">{group.moduleName}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.operations.map((operation) => (
                      <Chip
                        key={`${group.moduleCode}-${operation.operationCode}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        label={operation.operationName}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-4 py-12 text-center text-sm text-muted-foreground">
              {t('detail.permissionsEmpty')}
            </div>
          )}
        </section>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('delete.title')}</DialogTitle>
            <DialogDescription>
              {t('delete.description', { name: role?.name ?? role?.code ?? '—' })}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{t('delete.warning')}</p>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={mutationsState.deleteStatus === 'loading'}
            >
              {t('delete.cancel')}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (!roleId) {
                  return;
                }
                void dispatch(deleteRole({ roleId }));
              }}
              disabled={mutationsState.deleteStatus === 'loading'}
            >
              {t('delete.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {role?.statusId === 'ACTIVE'
                ? t('statusChange.deactivateTitle')
                : t('statusChange.activateTitle')}
            </DialogTitle>
            <DialogDescription>
              {role?.statusId === 'ACTIVE'
                ? t('statusChange.deactivateDescription', { name: role?.name ?? '—' })
                : t('statusChange.activateDescription', { name: role?.name ?? '—' })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStatusDialogOpen(false)}
              disabled={mutationsState.changeStatusStatus === 'loading'}
            >
              {t('statusChange.cancel')}
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!roleId || !role) {
                  return;
                }
                void dispatch(
                  changeRoleStatus({
                    roleId,
                    statusId: role.statusId === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                  })
                );
              }}
              disabled={mutationsState.changeStatusStatus === 'loading'}
            >
              {role?.statusId === 'ACTIVE' ? t('actions.deactivate') : t('actions.activate')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
