'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { UserEditForm, type UserEditValues } from '@/components/users/UserEditForm';
import { UserPasswordDialog } from '@/components/users/UserPasswordDialog';
import { Button } from '@/components/ui/button';
import {
  DashboardContentReveal,
  DashboardPageComposition,
  DashboardPageContentScroller,
  DashboardViewAccessBoundary,
  useDashboardViewAccess,
} from '@/components/dashboard-shell';
import {
  ResourceFormRoute,
  ResourceFormSkeleton,
  type ResourceFormMode,
} from '@/components/resource-form';
import { fetchCustomerOptions, type CustomerOption } from '@/features/customers';
import type { AuthSystemRole } from '@/features/auth/types';
import { canManageSystemRole } from '@/features/users/roles';
import { fetchAssignableUserRoles, fetchUserById, updateUser } from '@/features/users/usersThunks';
import type { User } from '@/features/users/usersSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

export default function UserDetailPage() {
  return (
    <DashboardViewAccessBoundary module="USERS" requiredOperation="READ">
      <UserDetailContent />
    </DashboardViewAccessBoundary>
  );
}

function UserDetailContent() {
  const params = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();
  const { can } = useDashboardViewAccess();
  const { t } = useTranslationHydrated('users');
  const [mode, setMode] = useState<ResourceFormMode>('read');
  const [passwordOpen, setPasswordOpen] = useState(false);
  const user = useAppSelector((state) =>
    state.users.entities.find((entity) => entity.id === params.userId)
  );
  const authUser = useAppSelector((state) => state.auth.user);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const detailState = useAppSelector((state) => state.users.detail);
  const rolesState = useAppSelector((state) => state.users.roles);
  const customerOptions = useAppSelector((state) => state.customers.options);
  const canUpdateUsers = can('UPDATE');
  const canUpdatePasswords = can('UPDATE_PASSWORD');

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

    await dispatch(
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
  };

  return (
    <DashboardPageComposition>
      <DashboardPageContentScroller padding="default">
        <div className="flex w-full min-w-0 flex-col gap-6">
          {isLoading ? (
            <ResourceFormSkeleton
              className="mx-auto max-w-4xl"
              contentSurface={{ base: 'bare', md: 'inset' }}
              density={{ base: 'compact', md: 'comfortable' }}
              dividers="hidden"
              groups={[
                { fields: 4, orientation: 'responsive' },
                { fields: 3, orientation: 'responsive' },
              ]}
              headerActions={2}
              surface={{ base: 'bare', md: 'card' }}
            />
          ) : null}
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
            <DashboardContentReveal>
              <ResourceFormRoute className="mx-auto w-full max-w-4xl">
                <UserEditForm
                  canUpdateUser={canEdit}
                  canUpdatePassword={canChangePassword}
                  customerOptions={resolvedCustomerOptions}
                  customerOptionsLoading={customerOptions.status === 'loading'}
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
            </DashboardContentReveal>
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
