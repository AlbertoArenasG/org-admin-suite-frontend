'use client';

import { useEffect, useMemo } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { PageBreadcrumbs } from '@/components/shared/PageBreadcrumbs';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
  fetchServiceEntrySurveyList,
  fetchServiceEntrySurveyStats,
} from '@/features/serviceEntrySurveys/serviceEntrySurveysThunks';
import { useServiceEntrySurveysStore } from '@/stores/useServiceEntrySurveysStore';
import { ServiceEntrySurveyFilters } from '@/components/serviceEntrySurveys/ServiceEntrySurveyFilters';
import { ServiceEntrySurveyCharts } from '@/components/serviceEntrySurveys/ServiceEntrySurveyCharts';
import { ServiceEntrySurveyTableContainer } from '@/components/serviceEntrySurveys/ServiceEntrySurveyTableContainer';

export default function ServiceEntrySurveysPage() {
  const { t } = useTranslationHydrated('common');
  const dispatch = useAppDispatch();

  const filters = useServiceEntrySurveysStore((state) => state.filters);
  const pagination = useServiceEntrySurveysStore((state) => state.pagination);
  const activeTab = useServiceEntrySurveysStore((state) => state.activeTab);
  const setActiveTab = useServiceEntrySurveysStore((state) => state.setActiveTab);

  const statsState = useAppSelector((state) => state.serviceEntrySurveys.stats);

  const templates = statsState.data?.templates ?? [];

  useEffect(() => {
    void dispatch(
      fetchServiceEntrySurveyStats({
        from: filters.allDates ? null : filters.from,
        to: filters.allDates ? null : filters.to,
        templateId: filters.templateId,
        templateVersion: filters.templateVersion ?? undefined,
      })
    );
  }, [
    dispatch,
    filters.from,
    filters.to,
    filters.templateId,
    filters.templateVersion,
    filters.allDates,
  ]);

  useEffect(() => {
    void dispatch(
      fetchServiceEntrySurveyList({
        from: filters.allDates ? null : filters.from,
        to: filters.allDates ? null : filters.to,
        templateId: filters.templateId,
        templateVersion: filters.templateVersion ?? undefined,
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        search: filters.search,
      })
    );
  }, [
    dispatch,
    filters.from,
    filters.to,
    filters.templateId,
    filters.templateVersion,
    filters.allDates,
    filters.search,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  const handleRefresh = () => {
    void dispatch(
      fetchServiceEntrySurveyList({
        from: filters.allDates ? null : filters.from,
        to: filters.allDates ? null : filters.to,
        templateId: filters.templateId,
        templateVersion: filters.templateVersion ?? undefined,
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        search: filters.search,
      })
    );
    void dispatch(
      fetchServiceEntrySurveyStats({
        from: filters.from,
        to: filters.to,
        templateId: filters.templateId,
        templateVersion: filters.templateVersion ?? undefined,
      })
    );
  };

  const statsError = statsState.status === 'failed' ? (statsState.error ?? null) : null;

  const chartTabLabel = useMemo(() => t('serviceEntrySurveys.tabs.stats'), [t]);
  const listTabLabel = useMemo(() => t('serviceEntrySurveys.tabs.list'), [t]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex h-16 items-center gap-3 rounded-3xl border border-border/60 bg-card/80 px-4 shadow-sm backdrop-blur-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumbs
            segments={[
              { label: t('breadcrumbs.dashboard'), href: '/dashboard', hideOnDesktop: true },
              { label: t('serviceEntries.breadcrumb'), href: '/dashboard/service-entries' },
              { label: t('serviceEntrySurveys.title') },
            ]}
          />
        </div>
      </header>

      <ServiceEntrySurveyFilters
        templates={templates.map((template) => ({
          templateId: template.template_id,
          templateVersion: template.template_version,
          templateName: template.template_name,
        }))}
        onRefresh={handleRefresh}
      />

      <Box sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={(_event, value: 'stats' | 'list') => setActiveTab(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={chartTabLabel} value="stats" />
          <Tab label={listTabLabel} value="list" />
        </Tabs>
      </Box>

      {activeTab === 'stats' ? (
        <ServiceEntrySurveyCharts
          stats={statsState.data}
          loading={statsState.status === 'loading'}
          error={statsError}
        />
      ) : (
        <ServiceEntrySurveyTableContainer />
      )}
    </div>
  );
}
