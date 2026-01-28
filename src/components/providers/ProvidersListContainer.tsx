'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ProvidersToolbar } from '@/components/providers/ProvidersToolbar';
import { ProvidersSkeletonGrid } from '@/components/providers/ProvidersSkeletonGrid';
import { ProvidersEmptyState } from '@/components/providers/ProvidersEmptyState';
import { ProvidersPagination } from '@/components/providers/ProvidersPagination';
import { ProviderCard, type ProviderCardLabels } from '@/components/providers/ProviderCard';
import type { Provider } from '@/features/providers/providersSlice';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { deleteProvider, fetchProviders } from '@/features/providers/providersThunks';
import { resetProviderDelete, resetProvidersState } from '@/features/providers/providersSlice';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSnackbar } from '@/components/providers/useSnackbarStore';

const DEFAULT_PAGE_SIZE = 12;

export function ProvidersListContainer() {
  const { t, hydrated, i18n } = useTranslationHydrated('providers');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    items,
    status,
    error,
    pagination,
    delete: deleteState,
  } = useAppSelector((state) => state.providers);
  const { showSnackbar } = useSnackbar();

  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Provider | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    void dispatch(
      fetchProviders({
        page,
        limit: DEFAULT_PAGE_SIZE,
        search: debouncedSearch || undefined,
      })
    );
  }, [dispatch, page, debouncedSearch]);

  useEffect(() => {
    if (!pagination) {
      return;
    }
    const totalPages = Math.max(1, pagination.totalPages);
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [pagination, page]);

  useEffect(
    () => () => {
      dispatch(resetProvidersState());
      dispatch(resetProviderDelete());
    },
    [dispatch]
  );

  useEffect(() => {
    if (deleteState.status === 'succeeded' && deleteState.lastDeletedId) {
      showSnackbar({
        message:
          deleteState.message ??
          t('delete.success', { defaultValue: 'Proveedor eliminado correctamente.' }),
        severity: 'success',
      });
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      dispatch(resetProviderDelete());
    } else if (deleteState.status === 'failed' && deleteState.error) {
      showSnackbar({
        message: deleteState.error,
        severity: 'error',
      });
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      dispatch(resetProviderDelete());
    }
  }, [deleteState, dispatch, showSnackbar, t]);

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

  const formatDate = useCallback(
    (value: string | null) => {
      if (!value) {
        return t('card.notAvailable');
      }
      try {
        return dateFormatter.format(new Date(value));
      } catch {
        return t('card.notAvailable');
      }
    },
    [dateFormatter, t]
  );

  const cardLabels: ProviderCardLabels = useMemo(
    () => ({
      notAvailable: t('card.notAvailable'),
      actions: {
        viewDetail: t('card.viewDetail'),
        edit: t('detail.actions.edit'),
        delete: t('detail.actions.delete'),
      },
      metadata: {
        createdAt: t('card.createdAt'),
        updatedAt: t('card.updatedAt'),
      },
    }),
    [t]
  );

  const currentPage = pagination?.page ?? page;
  const totalPages = pagination?.totalPages ?? Math.max(1, page);
  const perPage = pagination?.perPage ?? DEFAULT_PAGE_SIZE;
  const totalItems = pagination?.total ?? 0;
  const startIndex = totalItems ? (currentPage - 1) * perPage + 1 : 0;
  const endIndex = totalItems ? Math.min(currentPage * perPage, totalItems) : 0;

  const isInitialLoad = status === 'idle' && !pagination && !items.length;
  const isLoading = status === 'loading' || isInitialLoad;
  const isError = status === 'failed';
  const isEmpty = !isLoading && status === 'succeeded' && items.length === 0;

  const rangeLabel = isLoading
    ? t('list.loadingSummary')
    : totalItems > 0
      ? t('list.range', { from: startIndex, to: endIndex, total: totalItems })
      : t('list.emptySummary');

  const paginationSummary = pagination
    ? t('pagination.summary', {
        page: pagination.page,
        pages: pagination.totalPages,
        total: pagination.total,
      })
    : null;

  const handlePageChange = (nextPage: number) => {
    setPage(Math.max(1, nextPage));
  };

  const handleRetry = useCallback(() => {
    void dispatch(
      fetchProviders({
        page,
        limit: DEFAULT_PAGE_SIZE,
        search: debouncedSearch || undefined,
      })
    );
  }, [dispatch, page, debouncedSearch]);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) {
      return;
    }
    void dispatch(deleteProvider({ id: deleteTarget.id }));
  }, [deleteTarget, dispatch]);

  return (
    <div className="flex flex-col gap-6">
      <ProvidersToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder={t('filters.searchPlaceholder') ?? 'Buscar proveedores...'}
        clearLabel={t('filters.clear') ?? 'Limpiar búsqueda'}
        summary={rangeLabel}
        actions={
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            onClick={() => router.push('/dashboard/providers/new')}
          >
            <Plus className="size-4" aria-hidden />
            {t('create.action')}
          </Button>
        }
      />

      {isError ? (
        <Alert
          variant="destructive"
          className="rounded-3xl border border-destructive/50 bg-destructive/5"
        >
          <AlertTitle>{t('errors.loadFailed')}</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-3 text-sm text-destructive">
            {error ?? t('errors.generic')}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start"
              onClick={handleRetry}
            >
              <RefreshCw className="size-4" aria-hidden />
              {t('errors.retry')}
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <ProvidersSkeletonGrid items={6} />
      ) : isEmpty ? (
        <ProvidersEmptyState message={t('empty')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {items.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              labels={cardLabels}
              formatDate={formatDate}
              onEdit={(item) => router.push(`/dashboard/providers/${item.id}/edit`)}
              onDelete={(item) => {
                setDeleteTarget(item);
                setDeleteDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {items.length > 0 && !isLoading ? (
        <ProvidersPagination
          page={currentPage}
          totalPages={totalPages}
          summary={paginationSummary}
          onPageChange={handlePageChange}
          labels={{
            previous: t('pagination.previous') ?? 'Anterior',
            next: t('pagination.next') ?? 'Siguiente',
          }}
        />
      ) : null}

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('delete.title')}</DialogTitle>
            <DialogDescription>
              {t('delete.description', {
                name: deleteTarget?.companyName ?? deleteTarget?.providerCode ?? '—',
              })}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{t('delete.warning')}</p>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteState.status === 'loading'}
            >
              {t('delete.cancel')}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteState.status === 'loading'}
            >
              {deleteState.status === 'loading' ? t('delete.processing') : t('delete.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
