'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';
import type { ServiceEntrySurveyTableRow } from '@/components/serviceEntrySurveys/useServiceEntrySurveyTableData';
import { PUBLIC_SURVEY_QUESTIONS } from '@/features/publicServiceEntry/constants';
import {
  SERVICE_ENTRY_SURVEY_RATING_CLASSES,
  isSurveyRatingValue,
} from '@/components/serviceEntrySurveys/constants';

interface UseServiceEntrySurveyTableColumnsParams {
  t: TFunction<'serviceEntrySurveys', undefined>;
  dateFormatter: Intl.DateTimeFormat;
}

export function useServiceEntrySurveyTableColumns({
  t,
  dateFormatter,
}: UseServiceEntrySurveyTableColumnsParams) {
  return useMemo<ColumnDef<ServiceEntrySurveyTableRow>[]>(
    () => [
      {
        id: 'serviceInfo',
        header: t('table.columns.serviceInfo'),
        cell: ({ row }) => {
          const data = row.original;
          return (
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-base font-semibold text-foreground">{data.companyName}</span>
                <span className="rounded-full border border-border/50 bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground">
                  {data.categoryName}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="font-mono uppercase tracking-wide text-foreground/70">
                  {t('table.labels.serviceOrder', {
                    serviceOrder: data.serviceOrder,
                  })}
                </span>
                <span>{t('table.labels.contact', { contact: data.contactName })}</span>
                <span className="break-all">
                  {t('table.labels.email', { email: data.contactEmail })}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'submittedAt',
        header: t('table.columns.submittedAt'),
        cell: ({ getValue }) => {
          const value = getValue<string>();
          const date = new Date(value);
          if (Number.isNaN(date.getTime())) {
            return value;
          }
          return (
            <span className="whitespace-nowrap text-sm text-foreground/80">
              {dateFormatter.format(date)}
            </span>
          );
        },
      },
      {
        id: 'ratings',
        header: t('table.columns.ratings'),
        cell: ({ row }) => {
          const ratings = row.original.ratings;
          return (
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              {PUBLIC_SURVEY_QUESTIONS.map((question) => {
                const value = ratings[question.id];
                const label = t(`chart.labels.${question.id}`, {
                  defaultValue: question.id,
                });

                if (!value) {
                  return (
                    <div
                      key={question.id}
                      className="flex flex-col gap-1 rounded-xl border border-border/50 bg-muted/40 px-3 py-2"
                    >
                      <span className="text-xs font-medium text-muted-foreground">{label}</span>
                      <span className="text-sm text-muted-foreground">—</span>
                    </div>
                  );
                }

                const ratingLabel = t(`publicServiceEntry:survey.answers.${value}`, {
                  defaultValue: value,
                });

                return (
                  <div
                    key={question.id}
                    className="flex flex-col gap-1 rounded-xl border border-border/50 bg-muted/40 px-3 py-2"
                  >
                    <span className="text-xs font-medium text-muted-foreground">{label}</span>
                    <span
                      className={`inline-flex w-max rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                        value && isSurveyRatingValue(value)
                          ? SERVICE_ENTRY_SURVEY_RATING_CLASSES[value]
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {ratingLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        },
      },
      {
        accessorKey: 'observations',
        header: t('table.columns.observations'),
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return value ? (
            <p className="max-w-xs text-sm leading-6 text-foreground/90">{value}</p>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          );
        },
      },
    ],
    [dateFormatter, t]
  );
}
