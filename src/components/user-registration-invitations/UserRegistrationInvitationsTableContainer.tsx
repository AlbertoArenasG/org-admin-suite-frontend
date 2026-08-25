'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { useAuthorization } from '@/features/auth';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import {
  fetchUserRegistrationInvitations,
  resendUserRegistrationInvitation,
  revokeUserRegistrationInvitation,
  type UserRegistrationInvitationMutationError,
  type UserRegistrationInvitationStatus,
} from '@/features/user-registration-invitations';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import {
  buildUserRegistrationInvitationsQuery,
  mapUserRegistrationInvitationSortingToApi,
  parseUserRegistrationInvitationSortingFromParams,
} from '@/utils/userRegistrationInvitationsQuery';
import { UserRegistrationInvitationsDataTable } from './UserRegistrationInvitationsDataTable';
import {
  type UserRegistrationInvitationAction,
  UserRegistrationInvitationActionDialog,
} from './UserRegistrationInvitationActionDialog';
import { useUserRegistrationInvitationsTableColumns } from './useUserRegistrationInvitationsTableColumns';
import { useUserRegistrationInvitationsTableData } from './useUserRegistrationInvitationsTableData';
import { useUserRegistrationInvitationsTableStore } from './useUserRegistrationInvitationsTableStore';
import type { UserRegistrationInvitationsTableRow } from './types';

function getInitialPagination(params: URLSearchParams) {
  const page = Number(params.get('page'));
  const limit = Number(params.get('limit'));

  return {
    pageIndex: Number.isFinite(page) && page > 0 ? page - 1 : 0,
    pageSize: Number.isFinite(limit) && limit > 0 ? limit : 10,
  };
}

function parseStatus(value: string | null): UserRegistrationInvitationStatus | null {
  return value === 'PENDING' || value === 'CONSUMED' || value === 'REVOKED' ? value : null;
}

function isMutationError(error: unknown): error is UserRegistrationInvitationMutationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string' &&
    'status' in error
  );
}

export function UserRegistrationInvitationsTableContainer() {
  const { t, hydrated, i18n } = useTranslationHydrated('userRegistrationInvitations');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const { hasPermission } = useAuthorization();
  const { showSnackbar } = useSnackbar();
  const [actionTarget, setActionTarget] = useState<{
    action: UserRegistrationInvitationAction;
    invitation: UserRegistrationInvitationsTableRow;
  } | null>(null);

  const listState = useAppSelector((state) => state.userRegistrationInvitations.list);
  const mutationsState = useAppSelector((state) => state.userRegistrationInvitations.mutations);
  const pagination = useUserRegistrationInvitationsTableStore((state) => state.pagination);
  const sorting = useUserRegistrationInvitationsTableStore((state) => state.sorting);
  const columnVisibility = useUserRegistrationInvitationsTableStore(
    (state) => state.columnVisibility
  );
  const globalFilter = useUserRegistrationInvitationsTableStore((state) => state.globalFilter);
  const debouncedFilter = useUserRegistrationInvitationsTableStore(
    (state) => state.debouncedFilter
  );
  const filters = useUserRegistrationInvitationsTableStore((state) => state.filters);
  const initialized = useUserRegistrationInvitationsTableStore((state) => state.initialized);
  const setPagination = useUserRegistrationInvitationsTableStore((state) => state.setPagination);
  const setSorting = useUserRegistrationInvitationsTableStore((state) => state.setSorting);
  const setColumnVisibility = useUserRegistrationInvitationsTableStore(
    (state) => state.setColumnVisibility
  );
  const setDebouncedFilter = useUserRegistrationInvitationsTableStore(
    (state) => state.setDebouncedFilter
  );
  const syncFromUrl = useUserRegistrationInvitationsTableStore((state) => state.syncFromUrl);
  const resetTableStore = useUserRegistrationInvitationsTableStore((state) => state.reset);

  const canRead = hasPermission('USER_REGISTRATION_INVITATIONS', 'READ');
  const canCreate = hasPermission('USER_REGISTRATION_INVITATIONS', 'CREATE');
  const canResend = hasPermission('USER_REGISTRATION_INVITATIONS', 'RESEND');
  const canRevoke = hasPermission('USER_REGISTRATION_INVITATIONS', 'REVOKE');

  useEffect(() => () => resetTableStore(), [resetTableStore]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const parsedSorting = parseUserRegistrationInvitationSortingFromParams(params);

    syncFromUrl({
      pagination: getInitialPagination(params),
      sorting: parsedSorting.length ? parsedSorting : [{ id: 'createdAt', desc: true }],
      globalFilter: params.get('search') ?? '',
      debouncedFilter: (params.get('search') ?? '').trim(),
      filters: {
        status: parseStatus(params.get('status')),
      },
    });
  }, [searchParamsString, syncFromUrl]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedFilter(globalFilter.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [globalFilter, setDebouncedFilter]);

  useEffect(() => {
    if (!initialized || !canRead) {
      return;
    }

    void dispatch(
      fetchUserRegistrationInvitations({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        itemsPerPage: pagination.pageSize,
        search: debouncedFilter,
        filters,
        sorts: mapUserRegistrationInvitationSortingToApi(sorting),
      })
    );
  }, [canRead, debouncedFilter, dispatch, filters, initialized, pagination, sorting]);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    const nextParams = buildUserRegistrationInvitationsQuery({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      search: globalFilter,
      sorting,
      filters,
      baseParams: new URLSearchParams(searchParamsString),
    });

    if (nextParams.toString() !== searchParamsString) {
      router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
    }
  }, [
    filters,
    globalFilter,
    initialized,
    pagination,
    pathname,
    router,
    searchParamsString,
    sorting,
  ]);

  useEffect(() => {
    if (!initialized || !listState.totalPages) {
      return;
    }

    const maxPageIndex = Math.max(0, listState.totalPages - 1);
    const pageSize = listState.perPage > 0 ? listState.perPage : pagination.pageSize;

    setPagination((current) => {
      const pageIndex = Math.min(current.pageIndex, maxPageIndex);
      return current.pageIndex === pageIndex && current.pageSize === pageSize
        ? current
        : { pageIndex, pageSize };
    });
  }, [initialized, listState.perPage, listState.totalPages, pagination.pageSize, setPagination]);

  const fallback = i18n.options.fallbackLng;
  const fallbackLanguage = Array.isArray(fallback)
    ? fallback[0]
    : typeof fallback === 'string'
      ? fallback
      : 'es';
  const locale = hydrated ? i18n.language : fallbackLanguage;
  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }),
    [locale]
  );
  const dateTimeFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }),
    [locale]
  );

  const tableData = useUserRegistrationInvitationsTableData(listState.items);
  const fetchCurrentPage = () => {
    if (!canRead) {
      return;
    }

    void dispatch(
      fetchUserRegistrationInvitations({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        itemsPerPage: pagination.pageSize,
        search: debouncedFilter,
        filters,
        sorts: mapUserRegistrationInvitationSortingToApi(sorting),
      })
    );
  };
  const isRowActionLoading = (invitationId: string) =>
    (mutationsState.resend.status === 'loading' &&
      mutationsState.resend.targetId === invitationId) ||
    (mutationsState.revoke.status === 'loading' && mutationsState.revoke.targetId === invitationId);
  const actionIsLoading = actionTarget
    ? isRowActionLoading(actionTarget.invitation.invitationId)
    : false;
  const handleActionConfirm = async () => {
    if (!actionTarget) {
      return;
    }

    const { action, invitation } = actionTarget;

    try {
      const result = await dispatch(
        action === 'resend'
          ? resendUserRegistrationInvitation({ invitationId: invitation.invitationId })
          : revokeUserRegistrationInvitation({ invitationId: invitation.invitationId })
      ).unwrap();

      showSnackbar({
        message:
          result.message ??
          t(action === 'resend' ? 'feedback.resendSuccess' : 'feedback.revokeSuccess'),
        severity: 'success',
      });
      setActionTarget(null);
    } catch (error) {
      const mutationError = isMutationError(error) ? error : null;
      const requiresReconciliation = mutationError?.status === 404 || mutationError?.status === 409;

      showSnackbar({
        message:
          mutationError?.message ??
          t(action === 'resend' ? 'feedback.resendError' : 'feedback.revokeError'),
        severity: 'error',
      });

      if (requiresReconciliation) {
        setActionTarget(null);
        fetchCurrentPage();
      }
    }
  };
  const columns = useUserRegistrationInvitationsTableColumns({
    t,
    dateFormatter,
    dateTimeFormatter,
    canResend,
    canRevoke,
    isRowActionLoading,
    onResend: (invitation) => setActionTarget({ action: 'resend', invitation }),
    onRevoke: (invitation) => setActionTarget({ action: 'revoke', invitation }),
  });
  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnVisibility,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    autoResetAll: false,
    autoResetPageIndex: false,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: listState.totalPages || -1,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const hasActiveQuery = Boolean(globalFilter.trim() || filters.status);
  return (
    <>
      <UserRegistrationInvitationsDataTable
        table={table}
        isLoading={listState.status === 'loading'}
        error={canRead ? listState.error : t('feedback.readRestricted')}
        onRetry={fetchCurrentPage}
        onCreateClick={() => router.push('/dashboard/users/invite')}
        canCreate={canCreate}
        title={t('title')}
        description={t('description')}
        createLabel={t('actions.createShort')}
        createAriaLabel={t('actions.create')}
        paginationSummary={
          canRead && listState.totalPages > 0
            ? t('pagination', {
                page: listState.page,
                pages: listState.totalPages,
                total: listState.total,
              })
            : null
        }
        noData={hasActiveQuery ? t('empty.filtered') : t('empty.title')}
        errorTitle={t('feedback.listError')}
        retryLabel={t('actions.retry')}
        toolbarLabels={{
          searchPlaceholder: t('actions.searchPlaceholder'),
          statusPlaceholder: t('filters.allStatuses'),
          statuses: {
            PENDING: t('filters.PENDING'),
            CONSUMED: t('filters.CONSUMED'),
            REVOKED: t('filters.REVOKED'),
          },
          clearFilters: t('filters.clear'),
          columnLabel: t('actions.manageColumns'),
        }}
        tableLabels={{
          previous: t('actions.previous'),
          next: t('actions.next'),
        }}
      />
      <UserRegistrationInvitationActionDialog
        action={actionTarget?.action ?? null}
        invitation={actionTarget?.invitation ?? null}
        isLoading={actionIsLoading}
        onOpenChange={(open) => {
          if (!open) {
            setActionTarget(null);
          }
        }}
        onConfirm={handleActionConfirm}
        labels={{
          resend: {
            title: t('dialogs.resend.title'),
            description: (email) => t('dialogs.resend.description', { email }),
            confirm: t('dialogs.resend.confirm'),
          },
          revoke: {
            title: t('dialogs.revoke.title'),
            description: (email) => t('dialogs.revoke.description', { email }),
            warning: t('dialogs.revoke.warning'),
            confirm: t('dialogs.revoke.confirm'),
          },
          cancel: t('dialogs.cancel'),
        }}
      />
    </>
  );
}
