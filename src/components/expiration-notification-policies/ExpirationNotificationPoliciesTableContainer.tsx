'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { ExpirationNotificationPoliciesDataTable } from '@/components/expiration-notification-policies/ExpirationNotificationPoliciesDataTable';
import { useExpirationNotificationPoliciesTableColumns } from '@/components/expiration-notification-policies/useExpirationNotificationPoliciesTableColumns';
import { useExpirationNotificationPoliciesTableData } from '@/components/expiration-notification-policies/useExpirationNotificationPoliciesTableData';
import { useExpirationNotificationPoliciesTableStore } from '@/components/expiration-notification-policies/useExpirationNotificationPoliciesTableStore';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import { useAuthorization } from '@/features/auth';
import {
  deleteExpirationNotificationPolicy,
  fetchExpirationNotificationPolicies,
  fetchExpirationNotificationPolicyCatalog,
} from '@/features/expiration-notification-policies/expirationNotificationPoliciesThunks';
import { resetExpirationNotificationPolicyMutations } from '@/features/expiration-notification-policies/expirationNotificationPoliciesSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import {
  buildExpirationNotificationPoliciesQuery,
  mapExpirationNotificationPolicySortingToApi,
  parseExpirationNotificationPolicySortingFromParams,
} from '@/utils/expirationNotificationPoliciesQuery';

function getInitialPagination(params: URLSearchParams) {
  const initialPage = Number(params.get('page'));
  const initialLimit = Number(params.get('limit'));
  return {
    pageIndex: Number.isFinite(initialPage) && initialPage > 0 ? initialPage - 1 : 0,
    pageSize: Number.isFinite(initialLimit) && initialLimit > 0 ? initialLimit : 10,
  };
}

export function ExpirationNotificationPoliciesTableContainer() {
  const { t, hydrated, i18n } = useTranslationHydrated('expirationNotificationPolicies');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();

  const listState = useAppSelector((state) => state.expirationNotificationPolicies.list);
  const catalogsState = useAppSelector((state) => state.expirationNotificationPolicies.catalogs);
  const mutationsState = useAppSelector((state) => state.expirationNotificationPolicies.mutations);

  const paginationState = useExpirationNotificationPoliciesTableStore((state) => state.pagination);
  const sorting = useExpirationNotificationPoliciesTableStore((state) => state.sorting);
  const columnVisibility = useExpirationNotificationPoliciesTableStore(
    (state) => state.columnVisibility
  );
  const globalFilter = useExpirationNotificationPoliciesTableStore((state) => state.globalFilter);
  const debouncedFilter = useExpirationNotificationPoliciesTableStore(
    (state) => state.debouncedFilter
  );
  const filters = useExpirationNotificationPoliciesTableStore((state) => state.filters);
  const deleteTarget = useExpirationNotificationPoliciesTableStore((state) => state.deleteTarget);
  const initialized = useExpirationNotificationPoliciesTableStore((state) => state.initialized);

  const setPaginationState = useExpirationNotificationPoliciesTableStore(
    (state) => state.setPagination
  );
  const setSorting = useExpirationNotificationPoliciesTableStore((state) => state.setSorting);
  const setColumnVisibility = useExpirationNotificationPoliciesTableStore(
    (state) => state.setColumnVisibility
  );
  const setDebouncedFilter = useExpirationNotificationPoliciesTableStore(
    (state) => state.setDebouncedFilter
  );
  const setDeleteTarget = useExpirationNotificationPoliciesTableStore(
    (state) => state.setDeleteTarget
  );
  const syncFromUrl = useExpirationNotificationPoliciesTableStore((state) => state.syncFromUrl);
  const resetTableStore = useExpirationNotificationPoliciesTableStore((state) => state.reset);

  const canRead = hasPermission('EXPIRATION_NOTIFICATION_POLICIES', 'READ');
  const canCreate = hasPermission('EXPIRATION_NOTIFICATION_POLICIES', 'CREATE');
  const canUpdate = hasPermission('EXPIRATION_NOTIFICATION_POLICIES', 'UPDATE');
  const canDelete = hasPermission('EXPIRATION_NOTIFICATION_POLICIES', 'DELETE');

  useEffect(() => () => resetTableStore(), [resetTableStore]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const nextPagination = getInitialPagination(params);
    const nextFilter = params.get('search') ?? '';
    const nextSorting = parseExpirationNotificationPolicySortingFromParams(params);
    const nextStatus = params.get('status');

    syncFromUrl({
      pagination: nextPagination,
      sorting: nextSorting.length ? nextSorting : [{ id: 'createdAt', desc: true }],
      globalFilter: nextFilter,
      debouncedFilter: nextFilter.trim(),
      filters: {
        status:
          nextStatus === 'ACTIVE' || nextStatus === 'INACTIVE' || nextStatus === 'DELETED'
            ? nextStatus
            : null,
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
    if (!canRead || catalogsState.status !== 'idle') {
      return;
    }

    void dispatch(fetchExpirationNotificationPolicyCatalog());
  }, [canRead, catalogsState.status, dispatch]);

  useEffect(() => {
    if (!initialized || !canRead) {
      return;
    }

    void dispatch(
      fetchExpirationNotificationPolicies({
        page: paginationState.pageIndex + 1,
        limit: paginationState.pageSize,
        itemsPerPage: paginationState.pageSize,
        search: debouncedFilter,
        filters,
        sorts: mapExpirationNotificationPolicySortingToApi(sorting),
      })
    );
  }, [
    canRead,
    debouncedFilter,
    dispatch,
    filters,
    initialized,
    paginationState.pageIndex,
    paginationState.pageSize,
    sorting,
  ]);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    const baseParams = new URLSearchParams(searchParamsString);
    const nextParams = buildExpirationNotificationPoliciesQuery({
      pageIndex: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      search: globalFilter,
      sorting,
      filters,
      baseParams,
    });

    if (nextParams.toString() === searchParamsString) {
      return;
    }

    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }, [
    filters,
    globalFilter,
    initialized,
    paginationState.pageIndex,
    paginationState.pageSize,
    pathname,
    router,
    searchParamsString,
    sorting,
  ]);

  useEffect(() => {
    if (!initialized || !listState.totalPages) {
      return;
    }

    const totalPages = Math.max(1, listState.totalPages);
    const maxPageIndex = Math.max(0, totalPages - 1);
    const serverPageSize = listState.perPage;

    setPaginationState((current) => {
      const nextPageIndex = current.pageIndex > maxPageIndex ? maxPageIndex : current.pageIndex;
      const nextPageSize = serverPageSize > 0 ? serverPageSize : current.pageSize;

      if (nextPageIndex === current.pageIndex && nextPageSize === current.pageSize) {
        return current;
      }

      return { pageIndex: nextPageIndex, pageSize: nextPageSize };
    });
  }, [initialized, listState.perPage, listState.totalPages, setPaginationState]);

  useEffect(() => {
    if (
      mutationsState.deleteStatus === 'succeeded' &&
      mutationsState.currentExpirationNotificationPolicyId
    ) {
      showSnackbar({
        message:
          mutationsState.message ??
          t('delete.success', {
            defaultValue: 'Política de notificación por vencimiento eliminada correctamente.',
          }),
        severity: 'success',
      });
      setDeleteTarget(null);
      dispatch(resetExpirationNotificationPolicyMutations());
      void dispatch(
        fetchExpirationNotificationPolicies({
          page: paginationState.pageIndex + 1,
          limit: paginationState.pageSize,
          itemsPerPage: paginationState.pageSize,
          search: debouncedFilter,
          filters,
          sorts: mapExpirationNotificationPolicySortingToApi(sorting),
        })
      );
      return;
    }

    if (mutationsState.deleteStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('delete.error', {
            defaultValue: 'No fue posible eliminar la política de notificación por vencimiento.',
          }),
        severity: 'error',
      });
      dispatch(resetExpirationNotificationPolicyMutations());
    }
  }, [
    debouncedFilter,
    dispatch,
    filters,
    mutationsState,
    paginationState.pageIndex,
    paginationState.pageSize,
    setDeleteTarget,
    showSnackbar,
    sorting,
    t,
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

  const tableData = useExpirationNotificationPoliciesTableData(listState.items);

  const columns = useExpirationNotificationPoliciesTableColumns({
    t,
    dateFormatter,
    canUpdate,
    canDelete,
    onDelete: (policy) => setDeleteTarget(policy),
  });

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      pagination: paginationState,
      sorting,
      columnVisibility,
      globalFilter,
    },
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: setPaginationState,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    pageCount: Math.max(listState.totalPages, 1),
  });

  return (
    <ExpirationNotificationPoliciesDataTable
      table={table}
      isLoading={listState.status === 'loading'}
      error={canRead ? listState.error : t('permissions.readRestricted')}
      onCreateClick={() => router.push('/dashboard/expiration-notification-policies/new')}
      canCreate={canCreate}
      title={t('title')}
      createLabel={t('actions.createShort')}
      createAriaLabel={t('actions.create')}
      paginationSummary={
        canRead
          ? t('pagination', {
              page: Math.max(listState.page, 1),
              pages: Math.max(listState.totalPages, 1),
              total: listState.total,
            })
          : null
      }
      searchPlaceholder={t('actions.searchPlaceholder')}
      columnLabel={t('actions.manageColumns')}
      statusPlaceholder={t('filters.statusPlaceholder')}
      statuses={catalogsState.statuses}
      deleteDialog={{
        open: Boolean(deleteTarget),
        policy: deleteTarget,
        onOpenChange: (open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        },
        onConfirm: () => {
          if (!deleteTarget || mutationsState.deleteStatus === 'loading') {
            return;
          }

          void dispatch(
            deleteExpirationNotificationPolicy({
              expirationNotificationPolicyId: deleteTarget.expirationNotificationPolicyId,
            })
          );
        },
        isLoading: mutationsState.deleteStatus === 'loading',
        labels: {
          title: t('confirmDelete.title'),
          description: t('confirmDelete.description', {
            name: deleteTarget?.name ?? '',
          }),
          warning: t('confirmDelete.warning'),
          cancel: t('confirmDelete.cancel'),
          confirm: t('confirmDelete.confirm'),
        },
      }}
      tableLabels={{
        noData: t('empty'),
        pagination: {
          previous: t('actions.previous'),
          next: t('actions.next'),
        },
      }}
    />
  );
}
