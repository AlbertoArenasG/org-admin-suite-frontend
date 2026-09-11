'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { UserForm, type UserFormValues } from '@/components/users2/UserForm';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { DashboardPageHeader } from '@/components/shared/DashboardPageHeader';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { useAuthorization } from '@/features/auth';
import { fetchCustomerOptions } from '@/features/customers';
import { createUser, fetchAssignableUserRoles } from '@/features/users';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';

export default function CreateUserPage() {
  const { t } = useTranslation(['users', 'breadcrumbs']);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { hasPermission } = useAuthorization();
  const { showSnackbar } = useSnackbar();
  const rolesState = useAppSelector((state) => state.users.roles);
  const customerOptions = useAppSelector((state) => state.customers.options);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canCreateUsers = hasPermission('USERS', 'CREATE');

  useEffect(() => {
    if (canCreateUsers) void dispatch(fetchAssignableUserRoles());
  }, [canCreateUsers, dispatch]);

  const roleOptions = useMemo(
    () =>
      rolesState.items
        .filter((role) => role.systemRole === 'ADMIN' || role.systemRole === 'USER')
        .map((role) => ({
          value: role.roleId,
          label: role.roleName,
          systemRole: role.systemRole,
        })),
    [rolesState.items]
  );
  const defaultValues = useMemo<UserFormValues>(
    () => ({
      email: '',
      password: '',
      confirmPassword: '',
      roleId: roleOptions[0]?.value ?? '',
      name: '',
      lastname: '',
      cellPhone: { countryCode: '', number: '' },
      customerIds: [],
      isInternalStaff: null,
    }),
    [roleOptions]
  );

  const handleSubmit = (values: UserFormValues) => {
    if (!canCreateUsers || isSubmitting) return;
    if (values.customerIds.length > 1) {
      showSnackbar({ message: t('form.directCreateCustomerLimit'), severity: 'error' });
      return;
    }

    const selectedRole = rolesState.items.find((role) => role.roleId === values.roleId);
    if (
      !selectedRole ||
      (selectedRole.systemRole !== 'ADMIN' && selectedRole.systemRole !== 'USER')
    ) {
      return;
    }

    setIsSubmitting(true);
    const cellPhone =
      values.cellPhone.countryCode || values.cellPhone.number
        ? { countryCode: values.cellPhone.countryCode, number: values.cellPhone.number }
        : null;

    void dispatch(
      createUser({
        name: values.name,
        lastname: values.lastname,
        email: values.email,
        password: values.password,
        systemRole: selectedRole.systemRole,
        roleId: values.roleId,
        isInternalStaff: values.isInternalStaff ?? false,
        cellPhone,
        ...(values.customerIds[0] ? { customerId: values.customerIds[0] } : {}),
      })
    )
      .unwrap()
      .then(() => {
        showSnackbar({ message: t('form.directCreateSuccess'), severity: 'success' });
        router.push('/dashboard/users');
      })
      .catch((error: unknown) => {
        showSnackbar({
          message: typeof error === 'string' ? error : t('form.directCreateError'),
          severity: 'error',
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  const isLoadingRoles =
    canCreateUsers && (rolesState.status === 'idle' || rolesState.status === 'loading');
  const canRenderForm = canCreateUsers && roleOptions.length > 0;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <DashboardPageHeader
        segments={[
          { label: t('breadcrumbs:dashboard'), href: '/dashboard', hideOnDesktop: true },
          { label: t('breadcrumbs:users'), href: '/dashboard/users', hideOnDesktop: true },
          { label: t('breadcrumbs:usersCreate') },
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
          sx={{ px: { xs: 2.5, md: 4 }, py: 3, borderBottom: '1px solid var(--surface-border)' }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            {t('form.title.directCreate')}
          </Typography>
          <Typography variant="body2" color="text.foreground">
            {t('form.description.directCreate')}
          </Typography>
        </Box>
        {isLoadingRoles ? (
          <div className="flex flex-1 items-center justify-center py-10">
            <Spinner className="size-6 text-primary" />
          </div>
        ) : canRenderForm ? (
          <UserForm
            mode="direct-create"
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            roleOptions={roleOptions}
            customerOptions={customerOptions.items}
            customerOptionsStatus={customerOptions.status}
            customerOptionsError={customerOptions.error}
            onCustomerOptionsRequired={() => {
              if (customerOptions.status === 'idle') void dispatch(fetchCustomerOptions());
            }}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <Typography variant="body1" color="text.foreground">
              {rolesState.error ?? t('permissions.createRestricted')}
            </Typography>
            <Button variant="ghost" onClick={() => router.back()}>
              {t('form.cancel')}
            </Button>
          </div>
        )}
      </Paper>
    </div>
  );
}
