'use client';

import { useEffect, useMemo, useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import {
  fetchServiceEntrySurveyStats,
  type ServiceEntrySurveyStats,
  type SurveyRatingValue,
} from '@/features/serviceEntrySurveys/serviceEntrySurveysThunks';
import { SURVEY_RATING_VALUES } from '@/features/publicServiceEntry/constants';
import Link from 'next/link';
import { SERVICE_ENTRY_SURVEY_RATING_COLORS } from '@/components/serviceEntrySurveys/constants';

const currentYear = new Date().getFullYear();
const startOfYear = `${currentYear}-01-01`;
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const formattedTomorrow = tomorrow.toISOString().split('T')[0];

const DEFAULT_FROM = startOfYear;
const DEFAULT_TO = formattedTomorrow;

export function ServiceEntrySurveyStatsCard() {
  const { t } = useTranslationHydrated('serviceEntrySurveys');
  const dispatch = useAppDispatch();
  const statsState = useAppSelector((state) => state.serviceEntrySurveys.stats);
  const [filtersApplied, setFiltersApplied] = useState(false);

  useEffect(() => {
    if (!filtersApplied) {
      setFiltersApplied(true);
      void dispatch(
        fetchServiceEntrySurveyStats({
          from: DEFAULT_FROM,
          to: DEFAULT_TO,
          templateId: 'service-entry-calibration-survey-v5',
          templateVersion: 5,
        })
      );
    }
  }, [dispatch, filtersApplied]);

  const template = statsState.data?.templates?.[0] ?? null;
  type QuestionStat = ServiceEntrySurveyStats['templates'][number]['question_stats'][number];
  const questionStats = useMemo<QuestionStat[]>(
    () => template?.question_stats?.filter((question) => question.type === 'RATING') ?? [],
    [template]
  );

  const dataset = useMemo(() => {
    return questionStats.map((question) => {
      const distribution =
        question.rating_distribution ?? ({} as Partial<Record<SurveyRatingValue, number>>);
      const item: Record<string, string | number> = {
        question: t(`chart.labels.${question.question_id}`, {
          defaultValue: question.question_id,
        }),
      };
      SURVEY_RATING_VALUES.forEach((rating) => {
        item[rating] = distribution[rating] ?? 0;
      });
      return item;
    });
  }, [questionStats, t]);

  const series = useMemo(
    () =>
      SURVEY_RATING_VALUES.map((rating) => ({
        dataKey: rating,
        label: t(`publicServiceEntry:survey.answers.${rating}`),
        stack: 'ratings',
        color: SERVICE_ENTRY_SURVEY_RATING_COLORS[rating],
      })),
    [t]
  );

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '24px',
        border: '1px solid var(--surface-border)',
        bgcolor: 'var(--surface-bg)',
        color: 'var(--foreground)',
        boxShadow: 'var(--surface-shadow)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="h-full p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>
            {t('dashboardCard.title')}
          </Typography>
          <Typography variant="body2" color="text.foreground">
            {t('dashboardCard.subtitle', {
              count: statsState.data?.total_responses ?? 0,
            })}
          </Typography>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/service-entries/surveys">{t('dashboardCard.viewAll')}</Link>
        </Button>
      </div>

      <div className="mt-6 flex-1">
        {statsState.status === 'loading' ? (
          <Typography variant="body2" color="text.foreground">
            {t('stats.loading')}
          </Typography>
        ) : dataset.length ? (
          <div className="-mx-2 h-full overflow-x-auto px-2">
            <div className="min-w-[360px]">
              <BarChart
                dataset={dataset}
                xAxis={[{ scaleType: 'band', dataKey: 'question' }]}
                series={series}
                height={260}
                margin={{ left: 40, right: 16, top: 20, bottom: 60 }}
                sx={{
                  '& .MuiChartsAxis-tickLabel': {
                    fill: 'var(--foreground) !important',
                  },
                  '& .MuiChartsAxis-label': {
                    fill: 'var(--foreground) !important',
                  },
                  '& .MuiChartsAxis-line': {
                    stroke: 'var(--foreground) !important',
                  },
                  '& .MuiChartsAxis-tick line': {
                    stroke: 'var(--foreground) !important',
                  },
                  '& .MuiChartsAxis-tick': {
                    stroke: 'var(--foreground) !important',
                    fill: 'var(--foreground) !important',
                  },
                  '& .MuiChartsLegend-root text': {
                    fill: 'var(--foreground) !important',
                  },
                  '& .MuiChartsLegend-root .MuiChartsLegend-label': {
                    color: 'var(--foreground) !important',
                    fill: 'var(--foreground) !important',
                  },
                  '& .MuiChartsLegend-root .MuiTypography-root': {
                    color: 'var(--foreground) !important',
                    fill: 'var(--foreground) !important',
                  },
                }}
              />
            </div>
          </div>
        ) : (
          <Typography variant="body2" color="text.foreground">
            {statsState.error ?? t('stats.noData')}
          </Typography>
        )}
      </div>
    </Paper>
  );
}
