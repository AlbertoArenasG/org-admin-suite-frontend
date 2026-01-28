'use client';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTranslation } from 'react-i18next';
import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { UserForm, type UserFormValues } from '@/components/users2/UserForm';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchUserRoles, inviteUser } from '@/features/users/usersThunks';
import { USER_ROLE_LIST, canInviteRole } from '@/features/users/roles';
import type { UserRoleInfo } from '@/features/users/usersSlice';
import { Button } from '@/components/ui/button';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { useSnackbar } from '@/components/providers/useSnackbarStore';

export default function InviteUserPage() {
  const { t } = useTranslation(['users', 'breadcrumbs']);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const currentRole = authUser?.role ?? null;
  const rolesState = useAppSelector((state) => state.users.roles);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (rolesState.status === 'idle') {
      void dispatch(fetchUserRoles());
    }
  }, [dispatch, rolesState.status]);

  const roleOptions = useMemo<Array<{ value: string; label: string }>>(() => {
    const fallback: UserRoleInfo[] = USER_ROLE_LIST.map((role, index) => ({
      id: role,
      normalizedId: role,
      name: t(`roles.${role}`),
      description: null,
      rank: index,
    }));

    const source = rolesState.items.length ? rolesState.items : fallback;

    return source
      .filter((role) => canInviteRole(currentRole, role.normalizedId))
      .map((role) => {
        const identifier = role.id ?? role.normalizedId;
        return {
          value: identifier,
          label: role.name ?? t(`roles.${identifier}`),
        };
      });
  }, [currentRole, rolesState.items, t]);

  const hasInvitePermission = roleOptions.length > 0;

  const safeRoleOptions = useMemo<Array<{ value: string; label: string; disabled?: boolean }>>(
    () =>
      hasInvitePermission
        ? roleOptions
        : [
            {
              value: 'STAFF',
              label: t('roles.STAFF'),
              disabled: true,
            },
          ],
    [hasInvitePermission, roleOptions, t]
  );

  const defaultValues = useMemo<UserFormValues>(() => {
    const defaultRole: string = safeRoleOptions[0]?.value ?? 'STAFF';
    return {
      email: '',
      roleId: defaultRole,
      name: '',
      lastname: '',
      cellPhone: {
        countryCode: '',
        number: '',
      },
    };
  }, [safeRoleOptions]);

  const handleSubmit = (values: UserFormValues) => {
    if (!hasInvitePermission || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const normalizedCellPhone =
      values.cellPhone.countryCode || values.cellPhone.number
        ? {
            countryCode: values.cellPhone.countryCode,
            number: values.cellPhone.number,
          }
        : null;

    dispatch(
      inviteUser({
        email: values.email,
        roleId: values.roleId,
        name: values.name,
        lastname: values.lastname,
        cellPhone: normalizedCellPhone,
      })
    )
      .unwrap()
      .then(() => {
        showSnackbar({
          message: t('form.inviteSuccess', {
            defaultValue: 'La invitación se envió correctamente.',
          }),
          severity: 'success',
        });
        router.push('/dashboard/users');
      })
      .catch((error: unknown) => {
        const message =
          typeof error === 'string'
            ? error
            : t('form.inviteError', {
                defaultValue: 'No fue posible enviar la invitación.',
              });
        showSnackbar({ message, severity: 'error' });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              {
                label: t('breadcrumbs:dashboard'),
                href: '/dashboard',
                hideOnDesktop: true,
              },
              {
                label: t('breadcrumbs:users'),
                href: '/dashboard/users',
                hideOnDesktop: true,
              },
              {
                label: t('form.title.create'),
              },
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

        <div className="flex flex-1 flex-col">
          {hasInvitePermission ? (
            <UserForm
              mode="create"
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              roleOptions={safeRoleOptions}
              isSubmitting={isSubmitting}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
              <Typography variant="body1" color="text.foreground">
                {t('permissions.inviteRestricted')}
              </Typography>
              <Typography variant="body2" color="text.foreground">
                {t('permissions.inviteRestrictedAction')}
              </Typography>
              <Button variant="ghost" onClick={handleCancel}>
                {t('form.cancel')}
              </Button>
            </div>
          )}
        </div>
      </Paper>
    </div>
  );
}
