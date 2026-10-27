'use client';
import { useEffect } from 'react';
import { differenceInCalendarMonths, differenceInCalendarWeeks } from 'date-fns';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  GanttChartSquare,
  KanbanSquare,
  List,
  Table2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DashboardContentReveal, DashboardTableWorkspace } from '@/components/dashboard-shell';
import { CustomerServiceRecordsContainer } from '../CustomerServiceRecordsContainer';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';
import { CustomerServiceRecordCalendar } from './CustomerServiceRecordCalendar';
import { CustomerServiceRecordGantt } from './CustomerServiceRecordGantt';
import { CustomerServiceRecordRoadmapList } from './CustomerServiceRecordRoadmapList';
import {
  useCustomerServiceRecordRoadmapStore,
  type RoadmapView,
} from './useCustomerServiceRecordRoadmapStore';
import { useCustomerServiceRecordTimeline } from './useCustomerServiceRecordTimeline';
import { civilDate } from './roadmapDates';

const views = [
  { id: 'table', icon: Table2 },
  { id: 'calendar', icon: CalendarDays },
  { id: 'gantt', icon: GanttChartSquare },
  { id: 'list', icon: List },
  { id: 'kanban', icon: KanbanSquare },
] as const;

export function CustomerServiceRecordsRoadmap() {
  useEffect(() => {
    void useCustomerServiceRecordRoadmapStore.persist.rehydrate();
  }, []);
  const { t, i18n, hydrated } = useTranslationHydrated('customerServiceRecords');
  const view = useCustomerServiceRecordRoadmapStore((state) => state.view);
  const scale = useCustomerServiceRecordRoadmapStore((state) => state.scale);
  const setView = useCustomerServiceRecordRoadmapStore((state) => state.setView);
  const setScale = useCustomerServiceRecordRoadmapStore((state) => state.setScale);
  const move = useCustomerServiceRecordRoadmapStore((state) => state.move);
  const today = useCustomerServiceRecordRoadmapStore((state) => state.today);
  const { timeline, range, key, refetch } = useCustomerServiceRecordTimeline();
  const temporal = view === 'gantt' || view === 'calendar';
  const ready = timeline.status === 'succeeded' && timeline.key === key;
  const currentDate = new Date();
  const weekEnd = civilDate(range.to);
  const weekStartLabel = new Intl.DateTimeFormat(i18n.language, {
    day: 'numeric',
    month: 'short',
    ...(range.start.getFullYear() !== weekEnd.getFullYear() ? { year: 'numeric' as const } : {}),
  }).format(range.start);
  const weekEndLabel = new Intl.DateTimeFormat(i18n.language, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(weekEnd);
  const periodLabel =
    scale === 'week'
      ? `${t('roadmap.week')} ${weekStartLabel} – ${weekEndLabel}`
      : `${t('roadmap.month')}: ${new Intl.DateTimeFormat(i18n.language, {
          month: 'long',
          year: 'numeric',
        }).format(range.start)}`;
  const relativeOffset =
    scale === 'week'
      ? differenceInCalendarWeeks(range.start, currentDate, { weekStartsOn: 1 })
      : differenceInCalendarMonths(range.start, currentDate);
  const relativeLabel = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' }).format(
    relativeOffset,
    scale === 'week' ? 'week' : 'month'
  );
  const previousPeriodLabel = t(
    scale === 'week' ? 'roadmap.previousWeek' : 'roadmap.previousMonth'
  );
  const nextPeriodLabel = t(scale === 'week' ? 'roadmap.nextWeek' : 'roadmap.nextMonth');
  return (
    <DashboardTableWorkspace
      padding={view === 'table' ? 'default' : 'none'}
      contentClassName={view === 'table' ? 'mx-auto max-w-[1600px]' : undefined}
    >
      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col text-foreground ${view === 'gantt' ? 'overflow-hidden' : 'overflow-visible'}`}
      >
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b px-3 py-1">
          <h1 className="text-sm font-medium text-muted-foreground">{t('roadmap.title')}</h1>
          <div
            role="group"
            aria-label={t('roadmap.views')}
            className="flex flex-wrap gap-0.5 rounded-md bg-muted p-0.5"
          >
            {views.map(({ id, icon: Icon }) => (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label={t(`roadmap.${id}`)}
                    aria-pressed={view === id}
                    aria-controls="roadmap-panel"
                    onClick={() => setView(id as RoadmapView)}
                    className="inline-flex size-8 items-center justify-center rounded hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary aria-pressed:bg-background aria-pressed:shadow-sm"
                  >
                    <Icon aria-hidden="true" className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={6}>
                  {t(`roadmap.${id}`)}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
        {temporal && (
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={scale === 'week' ? 'default' : 'outline'}
                onClick={() => setScale('week')}
              >
                {t('roadmap.week')}
              </Button>
              <Button
                size="sm"
                variant={scale === 'month' ? 'default' : 'outline'}
                onClick={() => setScale('month')}
              >
                {t('roadmap.month')}
              </Button>
            </div>
            <div className="flex min-w-0 max-w-full flex-wrap items-center justify-end gap-1">
              {hydrated && (
                <span className="mr-1 text-xs text-muted-foreground first-letter:uppercase">
                  {relativeLabel}
                </span>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label={previousPeriodLabel}
                    onClick={() => move(-1)}
                  >
                    <ChevronLeft />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{previousPeriodLabel}</TooltipContent>
              </Tooltip>
              <span
                aria-live="polite"
                className="order-first w-full text-center text-sm font-semibold tabular-nums first-letter:uppercase sm:order-none sm:mx-1 sm:w-auto"
              >
                {periodLabel}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label={nextPeriodLabel}
                    onClick={() => move(1)}
                  >
                    <ChevronRight />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{nextPeriodLabel}</TooltipContent>
              </Tooltip>
              <Button variant="outline" size="sm" onClick={today}>
                {t('roadmap.today')}
              </Button>
            </div>
          </div>
        )}
        <div
          id="roadmap-panel"
          className={
            view === 'table'
              ? 'min-w-0'
              : view === 'gantt'
                ? 'flex min-h-0 min-w-0 flex-1 flex-col py-2 md:px-3'
                : 'min-w-0 py-2 md:min-h-0 md:flex-1 md:overflow-y-auto md:px-3'
          }
        >
          {temporal && (timeline.status === 'loading' || timeline.key !== key) && (
            <p role="status" className="p-6 text-sm">
              {t('roadmap.loading')}
            </p>
          )}
          {temporal && timeline.status === 'failed' && timeline.key === key && (
            <div role="alert" className="space-y-3 rounded-md border p-6">
              <p>{timeline.error}</p>
              <Button onClick={() => void refetch()}>{t('roadmap.retry')}</Button>
            </div>
          )}
          {temporal && ready && timeline.items.length === 0 && (
            <p className="rounded-md border p-6 text-sm">{t('roadmap.empty')}</p>
          )}
          {temporal &&
            ready &&
            timeline.items.length > 0 &&
            (view === 'gantt' ? (
              <DashboardContentReveal key="gantt" className="min-h-0 flex-1">
                <CustomerServiceRecordGantt
                  records={timeline.items}
                  from={range.from}
                  to={range.to}
                  scale={scale}
                />
              </DashboardContentReveal>
            ) : (
              <DashboardContentReveal key="calendar">
                <CustomerServiceRecordCalendar
                  records={timeline.items}
                  from={range.from}
                  scale={scale}
                />
              </DashboardContentReveal>
            ))}
          {view === 'list' && <CustomerServiceRecordRoadmapList mode="list" />}
          {view === 'kanban' && <CustomerServiceRecordRoadmapList mode="kanban" />}
          {view === 'table' && <CustomerServiceRecordsContainer />}
        </div>
      </div>
    </DashboardTableWorkspace>
  );
}
