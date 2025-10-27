'use client';

import { useMemo } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Separator } from '@/components/ui/separator';
import { useServiceEntrySurveysStore } from '@/stores/useServiceEntrySurveysStore';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { Button } from '@/components/ui/button';

interface TemplateOption {
  templateId: string;
  templateVersion: number;
  templateName: string | null;
}

interface ServiceEntrySurveyFiltersProps {
  templates: TemplateOption[];
  onRefresh?: () => void;
}

export function ServiceEntrySurveyFilters({
  templates,
  onRefresh,
}: ServiceEntrySurveyFiltersProps) {
  const { t } = useTranslationHydrated('common');
  const filters = useServiceEntrySurveysStore((state) => state.filters);
  const pagination = useServiceEntrySurveysStore((state) => state.pagination);
  const setFilters = useServiceEntrySurveysStore((state) => state.setFilters);
  const setPagination = useServiceEntrySurveysStore((state) => state.setPagination);

  const templateOptions = useMemo(() => {
    const uniqueKey = new Set<string>();
    return templates.filter((template) => {
      const key = `${template.templateId}-${template.templateVersion}`;
      if (uniqueKey.has(key)) {
        return false;
      }
      uniqueKey.add(key);
      return true;
    });
  }, [templates]);

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
      }}
      className="flex flex-col gap-4 px-6 py-4"
    >
      <div className="flex flex-col gap-2">
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>
          {t('serviceEntrySurveys.filters.title')}
        </Typography>
        <Typography variant="body2" color="text.foreground">
          {t('serviceEntrySurveys.filters.subtitle')}
        </Typography>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-4">
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-muted-foreground">{t('serviceEntrySurveys.filters.from')}</span>
          <input
            type="date"
            value={filters.from}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                from: event.target.value,
              }))
            }
            className="h-10 rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-muted-foreground">{t('serviceEntrySurveys.filters.to')}</span>
          <input
            type="date"
            value={filters.to}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                to: event.target.value,
              }))
            }
            className="h-10 rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm md:col-span-2">
          <span className="text-muted-foreground">{t('serviceEntrySurveys.filters.template')}</span>
          <select
            value={
              filters.templateId ? `${filters.templateId}:${filters.templateVersion ?? ''}` : ''
            }
            onChange={(event) => {
              const value = event.target.value;
              setFilters((current) => {
                if (!value) {
                  return { ...current, templateId: null, templateVersion: null };
                }
                const [templateId, version] = value.split(':');
                return {
                  ...current,
                  templateId,
                  templateVersion: version ? Number(version) : null,
                };
              });
            }}
            className="h-10 rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">{t('serviceEntrySurveys.filters.templatePlaceholder')}</option>
            {templateOptions.map((template) => (
              <option
                key={`${template.templateId}-${template.templateVersion}`}
                value={`${template.templateId}:${template.templateVersion}`}
              >
                {template.templateName ?? template.templateId}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          {t('serviceEntrySurveys.filters.pageSize')}
          <select
            value={pagination.pageSize}
            onChange={(event) =>
              setPagination(() => ({
                pageIndex: 0,
                pageSize: Number(event.target.value),
              }))
            }
            className="h-10 rounded-lg border border-border/60 bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {[10, 20, 30, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        {onRefresh ? (
          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            className="self-end sm:self-auto"
          >
            {t('serviceEntrySurveys.filters.refresh')}
          </Button>
        ) : null}
      </div>
    </Paper>
  );
}
