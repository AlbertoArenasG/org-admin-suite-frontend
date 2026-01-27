'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ProvidersToolbar } from '@/components/providers/ProvidersToolbar';
import { ProvidersSkeletonGrid } from '@/components/providers/ProvidersSkeletonGrid';
import { ProvidersEmptyState } from '@/components/providers/ProvidersEmptyState';
import { ProvidersPagination } from '@/components/providers/ProvidersPagination';
import { ProviderCard, type ProviderCardLabels } from '@/components/providers/ProviderCard';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchProviders } from '@/features/providers/providersThunks';
import { resetProvidersState } from '@/features/providers/providersSlice';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const DEFAULT_PAGE_SIZE = 12;

export function ProvidersListContainer() {
  const { t, hydrated, i18n } = useTranslationHydrated('common');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, status, error, pagination } = useAppSelector((state) => state.providers);

  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

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
    },
    [dispatch]
  );

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
        return t('providers.card.notAvailable');
      }
      try {
        return dateFormatter.format(new Date(value));
      } catch {
        return t('providers.card.notAvailable');
      }
    },
    [dateFormatter, t]
  );

  const cardLabels: ProviderCardLabels = useMemo(
    () => ({
      notAvailable: t('providers.card.notAvailable'),
      actions: {
        viewDetail: t('providers.card.viewDetail'),
      },
      metadata: {
        createdAt: t('providers.card.createdAt'),
        updatedAt: t('providers.card.updatedAt'),
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
    ? t('providers.list.loadingSummary')
    : totalItems > 0
      ? t('providers.list.range', { from: startIndex, to: endIndex, total: totalItems })
      : t('providers.list.emptySummary');

  const paginationSummary = pagination
    ? t('providers.pagination.summary', {
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

  return (
    <div className="flex flex-col gap-6">
      <ProvidersToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder={t('providers.filters.searchPlaceholder') ?? 'Buscar proveedores...'}
        clearLabel={t('providers.filters.clear') ?? 'Limpiar búsqueda'}
        summary={rangeLabel}
        actions={
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            onClick={() => router.push('/dashboard/providers/new')}
          >
            <Plus className="size-4" aria-hidden />
            {t('providers.create.action')}
          </Button>
        }
      />

      {isError ? (
        <Alert
          variant="destructive"
          className="rounded-3xl border border-destructive/50 bg-destructive/5"
        >
          <AlertTitle>{t('providers.errors.loadFailed')}</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-3 text-sm text-destructive">
            {error ?? t('providers.errors.generic')}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start"
              onClick={handleRetry}
            >
              <RefreshCw className="size-4" aria-hidden />
              {t('providers.errors.retry')}
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <ProvidersSkeletonGrid items={6} />
      ) : isEmpty ? (
        <ProvidersEmptyState message={t('providers.empty')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-2">
          {items.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              labels={cardLabels}
              formatDate={formatDate}
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
            previous: t('providers.pagination.previous') ?? 'Anterior',
            next: t('providers.pagination.next') ?? 'Siguiente',
          }}
        />
      ) : null}
    </div>
  );
}
