'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { UsersDataTable } from '@/components/users2/UsersDataTable';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchUsers, deleteUser } from '@/features/users/usersThunks';
import { fetchCustomerOptions } from '@/features/customers';
import { buildUserQuery, mapSortingToApi, parseSortingFromParams } from '@/utils/usersQuery';
import { useUsersTableColumns } from '@/components/users2/useUsersTableColumns';
import { useUsersTableData } from '@/components/users2/useUsersTableData';
import { useUsersTableStore } from '@/components/users2/useUsersTableStore';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { resetDeleteState } from '@/features/users/usersSlice';
import { useAuthorization } from '@/features/auth/useAuthorization';

function getInitialPagination(params: URLSearchParams) {
  const initialPage = Number(params.get('page'));
  const initialLimit = Number(params.get('limit'));
  return {
    pageIndex: Number.isFinite(initialPage) && initialPage > 0 ? initialPage - 1 : 0,
    pageSize: Number.isFinite(initialLimit) && initialLimit > 0 ? initialLimit : 10,
  };
}

export function UsersTableContainer() {
  const { t, hydrated, i18n } = useTranslationHydrated('users');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { hasPermission } = useAuthorization();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const {
    entities,
    status,
    error,
    pagination,
    delete: deleteState,
  } = useAppSelector((state) => state.users);
  const authUser = useAppSelector((state) => state.auth.user);
  const customerOptions = useAppSelector((state) => state.customers.options);
  const customerId = searchParams.get('customer_id');
  const isInternalStaffParam = searchParams.get('is_internal_staff');
  const isInternalStaff =
    isInternalStaffParam === 'true' ? true : isInternalStaffParam === 'false' ? false : null;

  const paginationState = useUsersTableStore((state) => state.pagination);
  const sorting = useUsersTableStore((state) => state.sorting);
  const columnVisibility = useUsersTableStore((state) => state.columnVisibility);
  const globalFilter = useUsersTableStore((state) => state.globalFilter);
  const debouncedFilter = useUsersTableStore((state) => state.debouncedFilter);
  const deleteTarget = useUsersTableStore((state) => state.deleteTarget);
  const initialized = useUsersTableStore((state) => state.initialized);

  const setPaginationState = useUsersTableStore((state) => state.setPagination);
  const setSorting = useUsersTableStore((state) => state.setSorting);
  const setColumnVisibility = useUsersTableStore((state) => state.setColumnVisibility);
  const setGlobalFilter = useUsersTableStore((state) => state.setGlobalFilter);
  const setDebouncedFilter = useUsersTableStore((state) => state.setDebouncedFilter);
  const setDeleteTarget = useUsersTableStore((state) => state.setDeleteTarget);
  const syncFromUrl = useUsersTableStore((state) => state.syncFromUrl);
  const resetTableStore = useUsersTableStore((state) => state.reset);
  const { showSnackbar } = useSnackbar();

  useEffect(() => () => resetTableStore(), [resetTableStore]);

  useEffect(() => {
    if (deleteState.status === 'succeeded' && deleteState.targetId) {
      showSnackbar({
        message:
          deleteState.message ??
          t('delete.success', { defaultValue: 'Usuario eliminado correctamente.' }),
        severity: 'success',
      });
      setDeleteTarget(null);
      dispatch(resetDeleteState());
      void dispatch(
        fetchUsers({
          page: paginationState.pageIndex + 1,
          limit: paginationState.pageSize,
          itemsPerPage: paginationState.pageSize,
          search: debouncedFilter,
          customerId,
          isInternalStaff,
          sorts: mapSortingToApi(sorting),
        })
      );
    } else if (deleteState.status === 'failed') {
      showSnackbar({
        message:
          deleteState.error ??
          t('delete.error', { defaultValue: 'No fue posible eliminar al usuario.' }),
        severity: 'error',
      });
      dispatch(resetDeleteState());
    }
  }, [
    customerId,
    debouncedFilter,
    deleteState,
    dispatch,
    paginationState.pageIndex,
    paginationState.pageSize,
    setDeleteTarget,
    showSnackbar,
    sorting,
    t,
    isInternalStaff,
  ]);

  const dateFormatter = useMemo(() => {
    const fallback = i18n.options.fallbackLng;
    const fallbackLang = Array.isArray(fallback)
      ? fallback[0]
      : typeof fallback === 'string'
        ? fallback
        : 'es';
    const locale = hydrated ? i18n.language : fallbackLang;
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  }, [hydrated, i18n.language, i18n.options.fallbackLng]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedFilter(globalFilter.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [globalFilter, setDebouncedFilter]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const nextPagination = getInitialPagination(params);
    const nextFilter = params.get('search') ?? '';
    const nextSorting = parseSortingFromParams(params);

    syncFromUrl({
      pagination: nextPagination,
      sorting: nextSorting,
      globalFilter: nextFilter,
      debouncedFilter: nextFilter.trim(),
    });
  }, [searchParamsString, syncFromUrl]);

  useEffect(() => {
    if (customerOptions.status === 'idle') {
      void dispatch(fetchCustomerOptions());
    }
  }, [customerOptions.status, dispatch]);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    void dispatch(
      fetchUsers({
        page: paginationState.pageIndex + 1,
        limit: paginationState.pageSize,
        itemsPerPage: paginationState.pageSize,
        search: debouncedFilter,
        customerId,
        isInternalStaff,
        sorts: mapSortingToApi(sorting),
      })
    );
  }, [
    debouncedFilter,
    customerId,
    dispatch,
    paginationState.pageIndex,
    paginationState.pageSize,
    sorting,
    initialized,
    isInternalStaff,
  ]);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    const baseParams = new URLSearchParams(searchParamsString);
    const nextParams = buildUserQuery({
      pageIndex: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      search: globalFilter,
      customerId,
      isInternalStaff,
      sorting,
      baseParams,
    });

    const nextQuery = nextParams.toString();
    if (nextQuery === searchParamsString) {
      return;
    }

    router.replace(`${pathname}?${nextQuery}`, { scroll: false });
  }, [
    globalFilter,
    customerId,
    paginationState.pageIndex,
    paginationState.pageSize,
    pathname,
    router,
    searchParamsString,
    sorting,
    initialized,
    isInternalStaff,
  ]);

  useEffect(() => {
    if (!pagination || !initialized) {
      return;
    }

    const totalPages = Math.max(1, pagination.totalPages);
    const maxPageIndex = Math.max(0, totalPages - 1);
    const serverPageSize = pagination.perPage;

    setPaginationState((current) => {
      const nextPageIndex = current.pageIndex > maxPageIndex ? maxPageIndex : current.pageIndex;
      const nextPageSize = serverPageSize > 0 ? serverPageSize : current.pageSize;

      if (nextPageIndex === current.pageIndex && nextPageSize === current.pageSize) {
        return current;
      }

      return { pageIndex: nextPageIndex, pageSize: nextPageSize };
    });
  }, [initialized, pagination, setPaginationState]);

  const tableData = useUsersTableData(entities);

  const currentRole = authUser?.systemRole ?? null;
  const canInviteUsers = hasPermission('USER_REGISTRATION_INVITATIONS', 'CREATE');
  const canUpdateUsers = hasPermission('USERS', 'UPDATE');
  const canDeleteUsers = hasPermission('USERS', 'DELETE');

  const columns = useUsersTableColumns({
    t,
    dateFormatter,
    currentRole,
    currentUserId: authUser?.id ?? null,
    canInviteUsers,
    canUpdateUsers,
    canDeleteUsers,
    onDelete: (user) => setDeleteTarget(user),
  });

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnVisibility,
      globalFilter,
      pagination: paginationState,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPaginationState,
    autoResetAll: false,
    autoResetPageIndex: false,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: pagination?.totalPages ?? -1,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const isLoading = status === 'loading';

  const paginationSummary = pagination
    ? t('pagination', {
        page: pagination.page,
        pages: pagination.totalPages,
        total: pagination.total,
      })
    : null;

  return (
    <UsersDataTable
      table={table}
      isLoading={isLoading}
      error={error}
      canInvite={canInviteUsers}
      onInviteClick={() => router.push('/dashboard/users/invite')}
      title={t('title')}
      inviteLabel={t('actions.inviteShort')}
      inviteAriaLabel={t('actions.openInvite')}
      paginationSummary={paginationSummary}
      searchPlaceholder={t('actions.searchPlaceholder') ?? 'Buscar usuarios'}
      columnLabel={t('actions.manageColumns') ?? 'Columnas'}
      customerFilter={{
        options: customerOptions.items,
        customerId,
        placeholder: t('filters.customerPlaceholder'),
        loading: customerOptions.status === 'loading',
        onChange: (nextCustomerId) => {
          const nextParams = new URLSearchParams(searchParamsString);
          if (nextCustomerId) {
            nextParams.set('customer_id', nextCustomerId);
          } else {
            nextParams.delete('customer_id');
          }
          nextParams.set('page', '1');
          router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
        },
      }}
      staffFilter={{
        value: isInternalStaff,
        options: [
          { value: '', label: t('filters.allStaff') },
          { value: 'true', label: t('filters.internalStaff') },
          { value: 'false', label: t('filters.externalStaff') },
        ],
        onChange: (nextIsInternalStaff) => {
          const nextParams = new URLSearchParams(searchParamsString);
          if (nextIsInternalStaff === null) {
            nextParams.delete('is_internal_staff');
          } else {
            nextParams.set('is_internal_staff', String(nextIsInternalStaff));
          }
          nextParams.set('page', '1');
          router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
        },
      }}
      deleteDialog={{
        open: Boolean(deleteTarget),
        user: deleteTarget,
        onOpenChange: (open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        },
        onConfirm: () => {
          if (!deleteTarget) {
            return;
          }
          void dispatch(deleteUser({ id: deleteTarget.id }));
        },
        isLoading: deleteState.status === 'loading',
        labels: {
          title: t('confirmDelete.title'),
          description: t('confirmDelete.description', {
            name: deleteTarget?.fullName ?? deleteTarget?.email ?? '—',
          }),
          warning: t('confirmDelete.warning') ?? 'Esta acción no se puede deshacer.',
          cancel: t('confirmDelete.cancel'),
          confirm: t('confirmDelete.confirm'),
        },
      }}
      tableLabels={{
        noData: customerId ? t('empty.customerFiltered') : t('empty.default'),
        pagination: {
          previous: t('actions.previous') ?? 'Anterior',
          next: t('actions.next') ?? 'Siguiente',
        },
      }}
    />
  );
}
