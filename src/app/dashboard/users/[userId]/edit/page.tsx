'use client';

import { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { UserForm, type UserFormValues } from '@/components/users/UserForm';
import { USER_ROLE_LIST, canManageRole, parseUserRole } from '@/features/users/roles';
import Chip from '@mui/material/Chip';
import { fetchUserById, fetchUserRoles, updateUser } from '@/features/users/usersThunks';
import { resetUserUpdateState } from '@/features/users/usersSlice';
import type { UserRoleInfo } from '@/features/users/usersSlice';

export default function UserEditPage() {
  const params = useParams<{ userId: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslationHydrated('common');
  const { showSnackbar } = useSnackbar();

  const user = useAppSelector((state) =>
    state.users.entities.find((entity) => entity.id === params.userId)
  );
  const authUser = useAppSelector((state) => state.auth.user);
  const rolesState = useAppSelector((state) => state.users.roles);
  const detailState = useAppSelector((state) => state.users.detail);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const updateState = useAppSelector((state) => state.users.update);

  const currentRole = authUser?.role ?? null;
  const targetRole = user ? parseUserRole(user.role) : null;
  const isSelf = user && authUser?.id === user.id;

  useEffect(() => {
    if (!params.userId || !authHydrated) {
      return;
    }
    void dispatch(fetchUserById({ id: params.userId }));
  }, [authHydrated, dispatch, params.userId]);

  useEffect(() => {
    if (rolesState.status === 'idle') {
      void dispatch(fetchUserRoles());
    }
  }, [dispatch, rolesState.status]);

  const fallbackRoles: UserRoleInfo[] = USER_ROLE_LIST.map((role) => ({
    id: role,
    rawId: role,
    name: t(`users.roles.${role}`),
    description: null,
    rank: null,
  }));

  const availableRoles = rolesState.items.length ? rolesState.items : fallbackRoles;

  const manageableRoles = availableRoles.filter((role) =>
    currentRole ? canManageRole(currentRole, role.id, { allowSameLevel: isSelf }) : false
  );

  if (targetRole && !manageableRoles.some((role) => role.id === targetRole)) {
    const existing = availableRoles.find((role) => role.id === targetRole);
    manageableRoles.push(
      existing ?? {
        id: targetRole,
        rawId: targetRole,
        name: t(`users.roles.${targetRole}`),
        description: null,
        rank: null,
      }
    );
  }

  const roleOptionsWithLabels = manageableRoles.map((role) => ({
    value: role.id,
    label: role.name ?? t(`users.roles.${role.id}`),
  }));

  const canEdit =
    user && currentRole
      ? canManageRole(currentRole, targetRole, { allowSameLevel: isSelf })
      : false;

  const defaultValues: UserFormValues | undefined = user
    ? {
        email: user.email,
        roleId: targetRole ?? 'STAFF',
        name: user.name ?? '',
        lastname: user.lastname ?? '',
        cellPhone: {
          countryCode: user.cellPhone?.countryCode ?? '',
          number: user.cellPhone?.number ?? '',
        },
      }
    : undefined;

  const isLoading =
    (!authHydrated && Boolean(params.userId)) ||
    (detailState.status === 'loading' && detailState.currentId === params.userId);
  const loadError =
    authHydrated && detailState.status === 'failed' && detailState.currentId === params.userId
      ? detailState.error
      : null;
  const isUpdating = updateState.status === 'loading' && updateState.currentId === params.userId;

  useEffect(() => {
    if (updateState.currentId !== params.userId) {
      return;
    }

    if (updateState.status === 'succeeded') {
      showSnackbar({
        message:
          updateState.message ??
          t('users.edit.successFeedback', {
            defaultValue: 'Usuario actualizado correctamente.',
          }),
        severity: 'success',
      });
      dispatch(resetUserUpdateState());
    } else if (updateState.status === 'failed') {
      showSnackbar({
        message:
          updateState.error ??
          t('users.edit.errorFeedback', { defaultValue: 'No fue posible actualizar el usuario.' }),
        severity: 'error',
      });
      dispatch(resetUserUpdateState());
    }
  }, [dispatch, params.userId, showSnackbar, t, updateState]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              { label: t('breadcrumbs.dashboard'), href: '/dashboard', hideOnDesktop: true },
              { label: t('breadcrumbs.users'), href: '/dashboard/users', hideOnDesktop: true },
              {
                label: user?.fullName ?? user?.email ?? '—',
                href: `/dashboard/users/${params.userId}`,
              },
              { label: t('users.actions.edit') },
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
          sx={{ px: 4, py: 4, borderBottom: '1px solid var(--surface-border)' }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                {t('users.actions.edit')} · {user?.fullName ?? user?.email ?? '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('users.edit.subtitle', { defaultValue: 'Update roles and contact details.' })}
              </Typography>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              {t('common:done')}
            </Button>
          </div>
          {user ? (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{user.email}</span>
              <Chip size="small" variant="outlined" label={user.roleName} />
            </div>
          ) : null}
          {!canEdit ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {t('users.edit.restricted', {
                defaultValue: 'You do not have permissions to edit this user.',
              })}
            </div>
          ) : null}
        </Box>
        <div className="flex flex-1 flex-col">
          {isLoading ? (
            <div className="flex flex-1 flex-col gap-4 p-6">
              <Skeleton className="h-8 w-1/3 rounded-md" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          ) : loadError ? (
            <div className="flex flex-1 items-center justify-center text-sm text-destructive">
              {loadError}
            </div>
          ) : user && defaultValues ? (
            <UserForm
              mode="edit"
              defaultValues={defaultValues}
              onSubmit={(values) => {
                if (!canEdit) {
                  return;
                }
                const normalizedCellPhone =
                  values.cellPhone.countryCode || values.cellPhone.number
                    ? {
                        countryCode: values.cellPhone.countryCode,
                        number: values.cellPhone.number,
                      }
                    : null;
                void dispatch(
                  updateUser({
                    id: user.id,
                    data: {
                      name: values.name,
                      lastname: values.lastname,
                      email: values.email,
                      roleId: values.roleId,
                      statusId: user.status,
                      cellPhone: normalizedCellPhone,
                    },
                  })
                );
              }}
              onCancel={() => router.back()}
              roleOptions={roleOptionsWithLabels}
              isSubmitting={!canEdit || isUpdating}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              {t('users.detail.notFound', { defaultValue: 'We could not find this user yet.' })}
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
}
