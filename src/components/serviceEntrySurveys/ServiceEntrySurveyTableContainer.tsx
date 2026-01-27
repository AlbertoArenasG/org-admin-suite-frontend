'use client';

import { useEffect, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useServiceEntrySurveyTableData } from '@/components/serviceEntrySurveys/useServiceEntrySurveyTableData';
import { useServiceEntrySurveyTableColumns } from '@/components/serviceEntrySurveys/useServiceEntrySurveyTableColumns';
import { ServiceEntrySurveyDataTable } from '@/components/serviceEntrySurveys/ServiceEntrySurveyDataTable';
import { useServiceEntrySurveysStore } from '@/stores/useServiceEntrySurveysStore';
import {
  PUBLIC_SURVEY_QUESTIONS,
  SURVEY_RATING_VALUES,
} from '@/features/publicServiceEntry/constants';

export function ServiceEntrySurveyTableContainer() {
  const { t, hydrated, i18n } = useTranslationHydrated('serviceEntrySurveys');
  const listState = useAppSelector((state) => state.serviceEntrySurveys.list);

  const paginationState = useServiceEntrySurveysStore((state) => state.pagination);
  const setPagination = useServiceEntrySurveysStore((state) => state.setPagination);

  const tableData = useServiceEntrySurveyTableData(listState.items);

  const dateFormatter = useMemo(() => {
    const fallback = i18n.options.fallbackLng;
    const fallbackLang = Array.isArray(fallback)
      ? fallback[0]
      : typeof fallback === 'string'
        ? fallback
        : 'es';
    const locale = hydrated ? i18n.language : fallbackLang;
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' });
  }, [hydrated, i18n.language, i18n.options.fallbackLng]);

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return dateFormatter.format(date);
  };

  const columns = useServiceEntrySurveyTableColumns({ t, dateFormatter });

  const ratingQuestions = useMemo(
    () =>
      PUBLIC_SURVEY_QUESTIONS.map((question) => ({
        id: question.id,
        label: t(`chart.labels.${question.id}`, {
          defaultValue: question.id,
        }),
      })),
    [t]
  );

  const ratingValueLabels = useMemo(
    () =>
      SURVEY_RATING_VALUES.reduce<Record<string, string>>((acc, value) => {
        acc[value] = t(`publicServiceEntry:survey.answers.${value}`, { defaultValue: value });
        return acc;
      }, {}),
    [t]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      pagination: paginationState,
    },
    onPaginationChange: (updater) =>
      setPagination((current) => (typeof updater === 'function' ? updater(current) : updater)),
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: listState.pagination?.totalPages ?? -1,
  });

  useEffect(() => {
    if (!listState.pagination) {
      return;
    }
    const { totalPages, perPage, page } = listState.pagination;
    setPagination((current) => {
      const pageIndex = Math.min(totalPages > 0 ? totalPages - 1 : 0, page - 1);
      const pageSize = perPage > 0 ? perPage : current.pageSize;
      if (pageIndex === current.pageIndex && pageSize === current.pageSize) {
        return current;
      }
      return { pageIndex, pageSize };
    });
  }, [listState.pagination, setPagination]);

  const paginationSummary = listState.pagination
    ? t('table.pagination', {
        page: listState.pagination.page,
        pages: listState.pagination.totalPages,
        total: listState.pagination.total,
      })
    : null;

  return (
    <ServiceEntrySurveyDataTable
      table={table}
      isLoading={listState.status === 'loading'}
      error={listState.error}
      paginationSummary={paginationSummary}
      title={t('table.title')}
      labels={{
        empty: t('table.noData'),
        pagination: {
          previous: t('table.actions.previous'),
          next: t('table.actions.next'),
        },
        fields: {
          submittedAt: t('table.columns.submittedAt'),
          ratings: t('table.columns.ratings'),
          observations: t('table.columns.observations'),
          serviceOrder: t('table.labels.serviceOrderShort'),
          contact: t('table.labels.contactShort'),
          email: t('table.labels.emailShort'),
        },
      }}
      ratingQuestions={ratingQuestions}
      ratingValueLabels={ratingValueLabels}
      formatDate={formatDate}
    />
  );
}
