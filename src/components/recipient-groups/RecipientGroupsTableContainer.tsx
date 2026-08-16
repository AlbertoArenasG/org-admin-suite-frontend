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
import { RecipientGroupsDataTable } from '@/components/recipient-groups/RecipientGroupsDataTable';
import { useRecipientGroupsTableColumns } from '@/components/recipient-groups/useRecipientGroupsTableColumns';
import { useRecipientGroupsTableData } from '@/components/recipient-groups/useRecipientGroupsTableData';
import { useRecipientGroupsTableStore } from '@/components/recipient-groups/useRecipientGroupsTableStore';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAuthorization } from '@/features/auth';
import { useSnackbar } from '@/components/providers/useSnackbarStore';
import {
  deleteRecipientGroup,
  fetchRecipientGroups,
} from '@/features/recipient-groups/recipientGroupsThunks';
import { resetRecipientGroupMutations } from '@/features/recipient-groups/recipientGroupsSlice';
import {
  buildRecipientGroupsQuery,
  mapRecipientGroupSortingToApi,
  parseRecipientGroupSortingFromParams,
} from '@/utils/recipientGroupsQuery';

function getInitialPagination(params: URLSearchParams) {
  const initialPage = Number(params.get('page'));
  const initialLimit = Number(params.get('limit'));
  return {
    pageIndex: Number.isFinite(initialPage) && initialPage > 0 ? initialPage - 1 : 0,
    pageSize: Number.isFinite(initialLimit) && initialLimit > 0 ? initialLimit : 10,
  };
}

export function RecipientGroupsTableContainer() {
  const { t, hydrated, i18n } = useTranslationHydrated('recipientGroups');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuthorization();

  const listState = useAppSelector((state) => state.recipientGroups.list);
  const mutationsState = useAppSelector((state) => state.recipientGroups.mutations);

  const paginationState = useRecipientGroupsTableStore((state) => state.pagination);
  const sorting = useRecipientGroupsTableStore((state) => state.sorting);
  const columnVisibility = useRecipientGroupsTableStore((state) => state.columnVisibility);
  const globalFilter = useRecipientGroupsTableStore((state) => state.globalFilter);
  const debouncedFilter = useRecipientGroupsTableStore((state) => state.debouncedFilter);
  const filters = useRecipientGroupsTableStore((state) => state.filters);
  const deleteTarget = useRecipientGroupsTableStore((state) => state.deleteTarget);
  const initialized = useRecipientGroupsTableStore((state) => state.initialized);

  const setPaginationState = useRecipientGroupsTableStore((state) => state.setPagination);
  const setSorting = useRecipientGroupsTableStore((state) => state.setSorting);
  const setColumnVisibility = useRecipientGroupsTableStore((state) => state.setColumnVisibility);
  const setGlobalFilter = useRecipientGroupsTableStore((state) => state.setGlobalFilter);
  const setDebouncedFilter = useRecipientGroupsTableStore((state) => state.setDebouncedFilter);
  const setDeleteTarget = useRecipientGroupsTableStore((state) => state.setDeleteTarget);
  const syncFromUrl = useRecipientGroupsTableStore((state) => state.syncFromUrl);
  const resetTableStore = useRecipientGroupsTableStore((state) => state.reset);

  const canRead = hasPermission('RECIPIENT_GROUPS', 'READ');
  const canCreate = hasPermission('RECIPIENT_GROUPS', 'CREATE');
  const canUpdate = hasPermission('RECIPIENT_GROUPS', 'UPDATE');
  const canDelete = hasPermission('RECIPIENT_GROUPS', 'DELETE');

  useEffect(() => () => resetTableStore(), [resetTableStore]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const nextPagination = getInitialPagination(params);
    const nextFilter = params.get('search') ?? '';
    const nextSorting = parseRecipientGroupSortingFromParams(params);
    const nextStatus = params.get('status');

    syncFromUrl({
      pagination: nextPagination,
      sorting: nextSorting.length ? nextSorting : [{ id: 'createdAt', desc: true }],
      globalFilter: nextFilter,
      debouncedFilter: nextFilter.trim(),
      filters: {
        status: nextStatus === 'ACTIVE' || nextStatus === 'DELETED' ? nextStatus : null,
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
      fetchRecipientGroups({
        page: paginationState.pageIndex + 1,
        limit: paginationState.pageSize,
        itemsPerPage: paginationState.pageSize,
        search: debouncedFilter,
        filters,
        sorts: mapRecipientGroupSortingToApi(sorting),
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
    const nextParams = buildRecipientGroupsQuery({
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
    if (mutationsState.deleteStatus === 'succeeded' && mutationsState.currentRecipientGroupId) {
      showSnackbar({
        message:
          mutationsState.message ??
          t('delete.success', { defaultValue: 'Grupo eliminado correctamente.' }),
        severity: 'success',
      });
      setDeleteTarget(null);
      dispatch(resetRecipientGroupMutations());
      void dispatch(
        fetchRecipientGroups({
          page: paginationState.pageIndex + 1,
          limit: paginationState.pageSize,
          itemsPerPage: paginationState.pageSize,
          search: debouncedFilter,
          filters,
          sorts: mapRecipientGroupSortingToApi(sorting),
        })
      );
      return;
    }

    if (mutationsState.deleteStatus === 'failed') {
      showSnackbar({
        message:
          mutationsState.error ??
          t('delete.error', { defaultValue: 'No fue posible eliminar el grupo.' }),
        severity: 'error',
      });
      dispatch(resetRecipientGroupMutations());
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

  const tableData = useRecipientGroupsTableData(listState.items);
  const columns = useRecipientGroupsTableColumns({
    t,
    dateFormatter,
    canUpdate,
    canDelete,
    onDelete: (recipientGroup) => setDeleteTarget(recipientGroup),
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
    pageCount: listState.totalPages ?? -1,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <RecipientGroupsDataTable
      table={table}
      isLoading={listState.status === 'loading'}
      error={canRead ? listState.error : t('permissions.readRestricted')}
      onCreateClick={() => router.push('/dashboard/recipient-groups/new')}
      canCreate={canCreate}
      title={t('title')}
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
      searchPlaceholder={t('actions.searchPlaceholder')}
      columnLabel={t('actions.manageColumns')}
      deleteDialog={{
        open: Boolean(deleteTarget),
        recipientGroup: deleteTarget,
        onOpenChange: (open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        },
        onConfirm: () => {
          if (!deleteTarget) {
            return;
          }
          void dispatch(deleteRecipientGroup({ recipientGroupId: deleteTarget.recipientGroupId }));
        },
        isLoading: mutationsState.deleteStatus === 'loading',
        labels: {
          title: t('confirmDelete.title'),
          description: t('confirmDelete.description', {
            name: deleteTarget?.name ?? '—',
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
