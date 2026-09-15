'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { UserEditForm, type UserEditValues } from '@/components/users/UserEditForm';
import { UserPasswordDialog } from '@/components/users/UserPasswordDialog';
import { Button } from '@/components/ui/button';
import {
  DashboardPageComposition,
  DashboardPageContentScroller,
} from '@/components/dashboard-shell';
import { Skeleton } from '@/components/ui/skeleton';
import { ResourceFormRoute, type ResourceFormMode } from '@/components/resource-form';
import { fetchCustomerOptions, type CustomerOption } from '@/features/customers';
import { useAuthorization } from '@/features/auth';
import type { AuthSystemRole } from '@/features/auth/types';
import { canManageSystemRole } from '@/features/users/roles';
import { fetchAssignableUserRoles, fetchUserById, updateUser } from '@/features/users/usersThunks';
import type { User } from '@/features/users/usersSlice';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

export default function UserDetailPage() {
  const params = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();
  const { hasPermission } = useAuthorization();
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslationHydrated('users');
  const [mode, setMode] = useState<ResourceFormMode>('read');
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAppSelector((state) =>
    state.users.entities.find((entity) => entity.id === params.userId)
  );
  const authUser = useAppSelector((state) => state.auth.user);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const detailState = useAppSelector((state) => state.users.detail);
  const rolesState = useAppSelector((state) => state.users.roles);
  const customerOptions = useAppSelector((state) => state.customers.options);
  const canUpdateUsers = hasPermission('USERS', 'UPDATE');
  const canUpdatePasswords = hasPermission('USERS', 'UPDATE_PASSWORD');

  useEffect(() => {
    if (params.userId && authHydrated) {
      void dispatch(fetchUserById({ id: params.userId }));
    }
  }, [authHydrated, dispatch, params.userId]);

  const canManageTarget =
    user && authUser?.systemRole
      ? canManageSystemRole(authUser.systemRole, user.systemRole, {
          allowSelf: authUser.id === user.id,
          allowUserPeer: true,
        })
      : false;
  const canEdit = Boolean(canUpdateUsers && canManageTarget);
  const canChangePassword = Boolean(canUpdatePasswords && canManageTarget);
  const resolvedCustomerOptions = mergeCustomerOptions(customerOptions.items, user?.customers);

  useEffect(() => {
    if (canEdit && rolesState.status === 'idle') {
      void dispatch(fetchAssignableUserRoles());
    }
  }, [canEdit, dispatch, rolesState.status]);

  useEffect(() => {
    if (!canEdit && mode === 'edit') {
      setMode('read');
    }
  }, [canEdit, mode]);

  const isLoading =
    (!authHydrated && Boolean(params.userId)) ||
    (detailState.status === 'loading' && detailState.currentId === params.userId);
  const loadError =
    authHydrated && detailState.status === 'failed' && detailState.currentId === params.userId
      ? detailState.error
      : null;

  const handleSubmit = async (values: UserEditValues, systemRole: AuthSystemRole) => {
    if (!user || !canEdit) return;

    setIsSubmitting(true);
    try {
      const result = await dispatch(
        updateUser({
          id: user.id,
          data: {
            name: values.name.trim(),
            lastname: values.lastname.trim(),
            email: values.email.trim(),
            systemRole,
            roleId: values.roleId,
            statusId: user.status,
            cellPhone: values.cellPhone.number ? values.cellPhone : null,
            isInternalStaff: systemRole === 'USER' ? values.isInternalStaff : true,
            customerIds: systemRole === 'USER' ? values.customerIds : [],
          },
        })
      ).unwrap();
      showSnackbar({ message: result.message ?? t('edit.successFeedback'), severity: 'success' });
      setMode('read');
    } catch (error) {
      showSnackbar({
        message: typeof error === 'string' ? error : t('edit.errorFeedback'),
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardPageComposition>
      <DashboardPageContentScroller padding="default">
        <div className="flex w-full min-w-0 flex-col gap-6">
          {isLoading ? <DetailSkeleton /> : null}
          {loadError ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
              <p>{loadError}</p>
              <Button
                className="mt-4"
                onClick={() => void dispatch(fetchUserById({ id: params.userId }))}
                size="sm"
                type="button"
                variant="outline"
              >
                {t('edit.retry')}
              </Button>
            </div>
          ) : null}
          {!isLoading && !loadError && user ? (
            <ResourceFormRoute className="mx-auto w-full max-w-4xl">
              <UserEditForm
                canUpdateUser={canEdit}
                canUpdatePassword={canChangePassword}
                customerOptions={resolvedCustomerOptions}
                customerOptionsLoading={customerOptions.status === 'loading'}
                isSubmitting={isSubmitting}
                mode={mode}
                onCustomerOptionsRequired={() => {
                  if (customerOptions.status === 'idle') {
                    void dispatch(fetchCustomerOptions());
                  }
                }}
                onModeChange={setMode}
                onOpenPassword={() => setPasswordOpen(true)}
                onSubmit={handleSubmit}
                roleOptions={rolesState.items}
                user={user}
              />
              {canChangePassword ? (
                <UserPasswordDialog
                  onOpenChange={setPasswordOpen}
                  open={passwordOpen}
                  userId={user.id}
                />
              ) : null}
            </ResourceFormRoute>
          ) : null}
          {!isLoading && !loadError && !user ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
              {t('detail.notFound')}
            </div>
          ) : null}
        </div>
      </DashboardPageContentScroller>
    </DashboardPageComposition>
  );
}

function mergeCustomerOptions(
  options: readonly CustomerOption[],
  relatedCustomers: User['customers']
): CustomerOption[] {
  const optionIds = new Set(options.map((option) => option.id));
  const retainedRelatedCustomers = (relatedCustomers ?? [])
    .filter((customer) => !optionIds.has(customer.id))
    .map(({ companyName, id }) => ({ companyName, id }));

  return [...options, ...retainedRelatedCustomers];
}

function DetailSkeleton() {
  return (
    <div className="grid gap-6 rounded-xl border bg-card p-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
