'use client';
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
  const { t, i18n } = useTranslationHydrated('customerServiceRecords');
  const view = useCustomerServiceRecordRoadmapStore((state) => state.view);
  const scale = useCustomerServiceRecordRoadmapStore((state) => state.scale);
  const setView = useCustomerServiceRecordRoadmapStore((state) => state.setView);
  const setScale = useCustomerServiceRecordRoadmapStore((state) => state.setScale);
  const move = useCustomerServiceRecordRoadmapStore((state) => state.move);
  const today = useCustomerServiceRecordRoadmapStore((state) => state.today);
  const { timeline, range, key, refetch } = useCustomerServiceRecordTimeline();
  const temporal = view === 'gantt' || view === 'calendar';
  const ready = timeline.status === 'succeeded' && timeline.key === key;
  const periodLabel =
    scale === 'week'
      ? `${new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short' }).format(range.start)} – ${new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' }).format(civilDate(range.to))}`
      : new Intl.DateTimeFormat(i18n.language, { month: 'long', year: 'numeric' }).format(
          range.start
        );
  return (
    <div className="min-w-0 flex-1 overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-1">
        <h1 className="text-sm font-medium text-muted-foreground">{t('roadmap.title')}</h1>
        <div
          role="group"
          aria-label={t('roadmap.views')}
          className="flex flex-wrap gap-0.5 rounded-md bg-muted p-0.5"
        >
          {views.map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              aria-controls="roadmap-panel"
              onClick={() => setView(id as RoadmapView)}
              className="inline-flex min-h-8 items-center gap-1.5 rounded px-2 text-sm hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary aria-pressed:bg-background aria-pressed:shadow-sm"
            >
              <Icon className="size-4" />
              <span>{t(`roadmap.${id}`)}</span>
            </button>
          ))}
        </div>
      </div>
      {temporal && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
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
          <div className="flex flex-wrap items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t('roadmap.previous')}
              onClick={() => move(-1)}
            >
              <ChevronLeft />
            </Button>
            <span
              aria-live="polite"
              className="mx-1 min-w-[11rem] text-center text-sm font-semibold capitalize tabular-nums sm:min-w-[16rem]"
            >
              {periodLabel}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t('roadmap.next')}
              onClick={() => move(1)}
            >
              <ChevronRight />
            </Button>
            <Button variant="outline" size="sm" onClick={today}>
              {t('roadmap.today')}
            </Button>
          </div>
        </div>
      )}
      <div id="roadmap-panel" className="min-w-0 p-3 md:p-4">
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
            <CustomerServiceRecordGantt
              records={timeline.items}
              from={range.from}
              to={range.to}
              scale={scale}
            />
          ) : (
            <CustomerServiceRecordCalendar
              records={timeline.items}
              from={range.from}
              scale={scale}
            />
          ))}
        {view === 'list' && <CustomerServiceRecordRoadmapList mode="list" />}
        {view === 'kanban' && <CustomerServiceRecordRoadmapList mode="kanban" />}
        {view === 'table' && <CustomerServiceRecordsContainer />}
      </div>
    </div>
  );
}
