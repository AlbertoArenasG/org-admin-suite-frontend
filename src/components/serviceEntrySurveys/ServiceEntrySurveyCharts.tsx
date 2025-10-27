'use client';

import { useMemo } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import type {
  ServiceEntrySurveyStats,
  SurveyRatingValue,
} from '@/features/serviceEntrySurveys/serviceEntrySurveysThunks';
import { SURVEY_RATING_VALUES } from '@/features/publicServiceEntry/constants';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { SERVICE_ENTRY_SURVEY_RATING_COLORS } from '@/components/serviceEntrySurveys/constants';

interface ServiceEntrySurveyChartsProps {
  stats: ServiceEntrySurveyStats | null;
  loading: boolean;
  error: string | null;
}

export function ServiceEntrySurveyCharts({ stats, loading, error }: ServiceEntrySurveyChartsProps) {
  const { t } = useTranslationHydrated('common');

  const template = stats?.templates?.[0] ?? null;

  const ratingQuestions = useMemo(
    () => template?.question_stats?.filter((question) => question.type === 'RATING') ?? [],
    [template]
  );

  // const textQuestions = useMemo(
  //   () => template?.question_stats?.filter((question) => question.type === 'TEXT') ?? [],
  //   [template]
  // );

  const dataset = useMemo(() => {
    return ratingQuestions.map((question) => {
      const distribution =
        question.rating_distribution ?? ({} as Partial<Record<SurveyRatingValue, number>>);
      const entry: Record<string, string | number> = {
        question:
          t(`serviceEntrySurveys.chart.labels.${question.question_id}`, {
            defaultValue: question.question_id,
          }) ?? question.question_id,
      };
      SURVEY_RATING_VALUES.forEach((rating) => {
        entry[rating] = distribution[rating] ?? 0;
      });
      return entry;
    });
  }, [ratingQuestions, t]);

  const series = useMemo(
    () =>
      SURVEY_RATING_VALUES.map((rating) => ({
        dataKey: rating,
        label: t(`publicServiceEntry.survey.answers.${rating}`),
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
        gap: '1.5rem',
      }}
      className="p-6"
    >
      <div className="space-y-1">
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>
          {t('serviceEntrySurveys.stats.title')}
        </Typography>
        <Typography variant="body2" color="text.foreground">
          {loading
            ? t('serviceEntrySurveys.stats.loading')
            : error
              ? error
              : t('serviceEntrySurveys.stats.summary', {
                  count: stats?.total_responses ?? 0,
                })}
        </Typography>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Typography variant="body2" color="text.foreground">
            {t('serviceEntrySurveys.stats.loading')}
          </Typography>
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center">
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-6">
          <div className="-mx-4 overflow-x-auto px-4">
            <div className="min-w-[520px]">
              <BarChart
                dataset={dataset}
                xAxis={[{ scaleType: 'band', dataKey: 'question' }]}
                series={series}
                height={300}
                margin={{ left: 32, right: 16, top: 16, bottom: 48 }}
                sx={{
                  '& .MuiChartsAxis-tickLabel': {
                    fill: 'var(--foreground)',
                  },
                  '& .MuiChartsAxis-label': {
                    fill: 'var(--foreground)',
                  },
                  '& .MuiChartsAxis-line': {
                    stroke: 'var(--foreground) !important',
                  },
                  '& .MuiChartsAxis-tick line': {
                    stroke: 'var(--foreground) !important',
                  },
                  '& .MuiChartsLegend-root text': {
                    fill: 'var(--foreground)',
                  },
                  '& .MuiChartsLegend-root .MuiChartsLegend-label': {
                    color: 'var(--foreground)',
                    fill: 'var(--foreground)',
                  },
                  '& .MuiChartsLegend-root .MuiTypography-root': {
                    color: 'var(--foreground)',
                    fill: 'var(--foreground)',
                  },
                }}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    {t('serviceEntrySurveys.stats.questionSummary')}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    {t('serviceEntrySurveys.stats.responseCount')}
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    {t('serviceEntrySurveys.stats.averageRating')}
                  </th>
                  {SURVEY_RATING_VALUES.map((rating) => (
                    <th
                      key={rating}
                      className="px-4 py-3 text-left font-medium text-muted-foreground"
                    >
                      {t(`publicServiceEntry.survey.answers.${rating}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ratingQuestions.map((question) => {
                  const distribution =
                    question.rating_distribution ??
                    ({} as Partial<Record<SurveyRatingValue, number>>);
                  return (
                    <tr key={question.question_id} className="border-b border-border/40">
                      <td className="px-4 py-3 font-medium text-foreground">
                        {t(`serviceEntrySurveys.chart.labels.${question.question_id}`, {
                          defaultValue: question.question_text,
                        })}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{question.response_count}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {question.average_rating != null ? question.average_rating.toFixed(2) : '—'}
                      </td>
                      {SURVEY_RATING_VALUES.map((rating) => (
                        <td key={rating} className="px-4 py-3 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block h-2.5 w-6 rounded-full"
                              style={{
                                backgroundColor: SERVICE_ENTRY_SURVEY_RATING_COLORS[rating],
                              }}
                            />
                            <span>{distribution[rating] ?? 0}</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* {textQuestions.length ? (
            <div className="space-y-3">
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {t('serviceEntrySurveys.stats.textResponses')}
              </Typography>
              <div className="grid gap-3 md:grid-cols-2">
                {textQuestions.map((question) => (
                  <div
                    key={question.question_id}
                    className="rounded-2xl border border-border/60 bg-card/60 p-4"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {question.question_text}
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      {(question.responses ?? []).length ? (
                        question.responses!.map((response, index) => (
                          <li
                            key={`${question.question_id}-${index}`}
                            className="rounded-xl border border-border/40 bg-muted/40 px-3 py-2"
                          >
                            {response}
                          </li>
                        ))
                      ) : (
                        <li className="rounded-xl border border-dashed border-border/40 bg-muted/20 px-3 py-2">
                          {t('serviceEntrySurveys.stats.noData')}
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : null} */}
        </div>
      )}
    </Paper>
  );
}
