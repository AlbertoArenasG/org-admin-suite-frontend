'use client';

import { useEffect, useState } from 'react';
import { UserPlus, UserRoundX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CustomerRelatedUser } from '@/features/user-customer-relationships';
import {
  addCustomerUser,
  fetchCustomerAvailableUsers,
  fetchCustomerRelatedUsers,
  removeCustomerUser,
  resetUserCustomerRelationships,
} from '@/features/user-customer-relationships';
import { CustomerUserLookupDialog } from './CustomerUserLookupDialog';
import { RemoveCustomerUserDialog } from './RemoveCustomerUserDialog';

interface CustomerUsersSectionProps {
  customerId: string;
  customerStatus: string;
  canRead: boolean;
  canUpdate: boolean;
}

export function CustomerUsersSection({
  customerId,
  customerStatus,
  canRead,
  canUpdate,
}: CustomerUsersSectionProps) {
  const { t } = useTranslation('customers');
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const related = useAppSelector((state) => state.userCustomerRelationships.related);
  const available = useAppSelector((state) => state.userCustomerRelationships.available);
  const mutation = useAppSelector((state) => state.userCustomerRelationships.mutation);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState<'lastname:asc' | 'created_at:desc'>('lastname:asc');
  const [lookupOpen, setLookupOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<CustomerRelatedUser | null>(null);
  const isActive = customerStatus === 'ACTIVE';
  const canMutate = canUpdate && isActive;

  useEffect(
    () => () => {
      dispatch(resetUserCustomerRelationships());
    },
    [dispatch]
  );
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [search]);
  const sorts =
    sort === 'created_at:desc'
      ? [{ field: 'created_at', direction: 'desc' as const }]
      : [
          { field: 'lastname', direction: 'asc' as const },
          { field: 'name', direction: 'asc' as const },
        ];
  const loadRelated = () => {
    if (canRead)
      void dispatch(
        fetchCustomerRelatedUsers({ customerId, page, limit: 10, search: debouncedSearch, sorts })
      );
  };
  useEffect(() => {
    loadRelated();
  }, [canRead, customerId, page, debouncedSearch, sort]);
  useEffect(() => {
    if (lookupOpen && canMutate) void dispatch(fetchCustomerAvailableUsers({ customerId }));
  }, [canMutate, customerId, dispatch, lookupOpen]);

  const refreshAfterMutation = () => {
    loadRelated();
    if (lookupOpen) void dispatch(fetchCustomerAvailableUsers({ customerId }));
  };
  const handleAdd = async (userId: string) => {
    try {
      const result = await dispatch(addCustomerUser({ customerId, userId })).unwrap();
      showSnackbar({
        message: result.message ?? t('detail.relatedUsers.feedback.addSuccess'),
        severity: 'success',
      });
      setLookupOpen(false);
      refreshAfterMutation();
    } catch (error) {
      const detail =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string; status?: number | null })
          : null;
      showSnackbar({
        message: detail?.message ?? t('detail.relatedUsers.feedback.addError'),
        severity: 'error',
      });
      if (detail?.status === 409) refreshAfterMutation();
    }
  };
  const handleRemove = async () => {
    if (!removeTarget) return;
    try {
      const result = await dispatch(
        removeCustomerUser({ customerId, userId: removeTarget.id })
      ).unwrap();
      showSnackbar({
        message: result.message ?? t('detail.relatedUsers.feedback.removeSuccess'),
        severity: 'success',
      });
      setRemoveTarget(null);
      refreshAfterMutation();
    } catch (error) {
      const detail =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string; status?: number | null })
          : null;
      showSnackbar({
        message: detail?.message ?? t('detail.relatedUsers.feedback.removeError'),
        severity: 'error',
      });
      if (detail?.status === 409) refreshAfterMutation();
    }
  };
  if (!canRead) return null;
  const users = related.customerId === customerId ? related.users : [];
  const pagination = related.customerId === customerId ? related.pagination : null;

  return (
    <section className="rounded-3xl border border-border/70 bg-card/90 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold">{t('detail.relatedUsers.title')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('detail.relatedUsers.subtitle')}</p>
        </div>
        {canMutate ? (
          <Button size="sm" onClick={() => setLookupOpen(true)}>
            <UserPlus className="size-4" />
            {t('detail.relatedUsers.actions.add')}
          </Button>
        ) : null}
      </div>
      {!isActive ? (
        <p className="border-b border-border/60 bg-muted/30 px-6 py-3 text-sm text-muted-foreground">
          {t('detail.relatedUsers.inactiveNotice')}
        </p>
      ) : null}
      <div className="p-6">
        <div className="mb-4 flex flex-wrap gap-3">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('detail.relatedUsers.searchPlaceholder')}
            className="max-w-sm"
          />
          <select
            value={sort}
            onChange={(event) => {
              setPage(1);
              setSort(event.target.value as typeof sort);
            }}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="lastname:asc">{t('detail.relatedUsers.sort.name')}</option>
            <option value="created_at:desc">{t('detail.relatedUsers.sort.createdAt')}</option>
          </select>
        </div>
        {related.status === 'failed' && related.customerId === customerId ? (
          <p className="text-sm text-destructive">{related.error}</p>
        ) : users.length === 0 && related.status !== 'loading' ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t('detail.relatedUsers.empty')}
          </p>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/60 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{user.fullName || user.email}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                {canMutate ? (
                  <Button variant="ghost" size="sm" onClick={() => setRemoveTarget(user)}>
                    <UserRoundX className="size-4" />
                    {t('detail.relatedUsers.actions.remove')}
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        )}
        {pagination && pagination.totalPages > 1 ? (
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              {t('detail.relatedUsers.actions.previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage(page + 1)}
            >
              {t('detail.relatedUsers.actions.next')}
            </Button>
          </div>
        ) : null}
      </div>
      <CustomerUserLookupDialog
        open={lookupOpen}
        users={available.customerId === customerId ? available.users : []}
        loading={available.status === 'loading'}
        error={available.customerId === customerId ? available.error : null}
        submitting={mutation.status === 'loading'}
        onOpenChange={setLookupOpen}
        onSubmit={handleAdd}
      />
      <RemoveCustomerUserDialog
        open={Boolean(removeTarget)}
        user={removeTarget}
        loading={mutation.status === 'loading'}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
        onConfirm={handleRemove}
      />
    </section>
  );
}
