'use client';

import { DndContext, MouseSensor, useDraggable, useSensor } from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { useMouse, useThrottle } from '@uidotdev/usehooks';
import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  endOfDay,
  endOfMonth,
  format,
  formatDate,
  formatDistance,
  getDaysInMonth,
  isSameDay,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { atom, useAtom } from 'jotai';
import throttle from 'lodash.throttle';
import { es, enUS } from 'date-fns/locale';
import { PlusIcon, TrashIcon } from 'lucide-react';
import type {
  CSSProperties,
  FC,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  RefObject,
} from 'react';
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';

const draggingAtom = atom(false);
const scrollXAtom = atom(0);

export const useGanttDragging = () => useAtom(draggingAtom);
export const useGanttScrollX = () => useAtom(scrollXAtom);

export type GanttStatus = {
  id: string;
  name: string;
  color: string;
};

export type GanttFeature = {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  status: GanttStatus;
  lane?: string; // Optional: features with the same lane will share a row
};

export type GanttMarkerProps = {
  id: string;
  date: Date;
  label: string;
};

export type Range = 'daily' | 'monthly' | 'quarterly';

export type TimelineData = {
  year: number;
  quarters: {
    months: {
      days: number;
    }[];
  }[];
}[];

export type GanttContextProps = {
  locale: 'es' | 'en';
  zoom: number;
  range: Range;
  columnWidth: number;
  sidebarWidth: number;
  headerHeight: number;
  rowHeight: number;
  onAddItem: ((date: Date) => void) | undefined;
  placeholderLength: number;
  timelineData: TimelineData;
  ref: RefObject<HTMLDivElement | null> | null;
  scrollToFeature?: (feature: GanttFeature) => void;
  showWeekGuides?: boolean;
  highlightedWeek?: { from: Date; to: Date };
};

const getsDaysIn = (range: Range) => {
  // For when range is daily
  let fn: (date: Date) => number = () => 1;

  if (range === 'monthly' || range === 'quarterly') {
    fn = getDaysInMonth;
  }

  return fn;
};

const getDifferenceIn = (range: Range) => {
  let fn = differenceInDays;

  if (range === 'monthly' || range === 'quarterly') {
    fn = differenceInMonths;
  }

  return fn;
};

const getInnerDifferenceIn = (range: Range) => {
  let fn = differenceInHours;

  if (range === 'monthly' || range === 'quarterly') {
    fn = differenceInDays;
  }

  return fn;
};

const getStartOf = (range: Range) => {
  let fn = startOfDay;

  if (range === 'monthly' || range === 'quarterly') {
    fn = startOfMonth;
  }

  return fn;
};

const getEndOf = (range: Range) => {
  let fn = endOfDay;

  if (range === 'monthly' || range === 'quarterly') {
    fn = endOfMonth;
  }

  return fn;
};

const getAddRange = (range: Range) => {
  let fn = addDays;

  if (range === 'monthly' || range === 'quarterly') {
    fn = addMonths;
  }

  return fn;
};

const getDateByMousePosition = (context: GanttContextProps, mouseX: number) => {
  const timelineStartDate = new Date(context.timelineData[0].year, 0, 1);
  const columnWidth = (context.columnWidth * context.zoom) / 100;
  const offset = Math.floor(mouseX / columnWidth);
  const daysIn = getsDaysIn(context.range);
  const addRange = getAddRange(context.range);
  const month = addRange(timelineStartDate, offset);
  const daysInMonth = daysIn(month);
  const pixelsPerDay = Math.round(columnWidth / daysInMonth);
  const dayOffset = Math.floor((mouseX % columnWidth) / pixelsPerDay);
  const actualDate = addDays(month, dayOffset);

  return actualDate;
};

const createInitialTimelineData = (today: Date) => {
  return [-1, 0, 1].map((offset) => createTimelineYear(today.getFullYear() + offset));
};

const createTimelineYear = (year: number): TimelineData[number] => ({
  year,
  quarters: Array.from({ length: 4 }, (_, quarterIndex) => ({
    months: Array.from({ length: 3 }, (_, monthIndex) => ({
      days: getDaysInMonth(new Date(year, quarterIndex * 3 + monthIndex, 1)),
    })),
  })),
});

const getOffset = (
  date: Date,
  timelineStartDate: Date,
  context: Pick<GanttContextProps, 'range' | 'columnWidth' | 'zoom'>
) => {
  const parsedColumnWidth = (context.columnWidth * context.zoom) / 100;
  const differenceIn = getDifferenceIn(context.range);
  const startOf = getStartOf(context.range);
  const fullColumns = differenceIn(startOf(date), timelineStartDate);

  if (context.range === 'daily') {
    return parsedColumnWidth * fullColumns;
  }

  const partialColumns = date.getDate() - 1;
  const daysInMonth = getDaysInMonth(date);
  const pixelsPerDay = parsedColumnWidth / daysInMonth;

  return fullColumns * parsedColumnWidth + partialColumns * pixelsPerDay;
};

const getWidth = (startAt: Date, endAt: Date | null, context: GanttContextProps) => {
  const parsedColumnWidth = (context.columnWidth * context.zoom) / 100;

  if (!endAt) {
    return parsedColumnWidth * 2;
  }
  const timelineStart = new Date(context.timelineData[0]?.year ?? startAt.getFullYear(), 0, 1);
  const endOffset = getOffset(addDays(endAt, 1), timelineStart, context);
  const startOffset = getOffset(startAt, timelineStart, context);
  return Math.max(context.range === 'daily' ? 1 : 12, endOffset - startOffset);
};

const calculateInnerOffset = (date: Date, range: Range, columnWidth: number) => {
  const startOf = getStartOf(range);
  const endOf = getEndOf(range);
  const differenceIn = getInnerDifferenceIn(range);
  const startOfRange = startOf(date);
  const endOfRange = endOf(date);
  const totalRangeDays = differenceIn(endOfRange, startOfRange);
  const dayOfMonth = date.getDate();

  return (dayOfMonth / totalRangeDays) * columnWidth;
};

const GanttContext = createContext<GanttContextProps>({
  locale: 'en',
  zoom: 100,
  range: 'monthly',
  columnWidth: 50,
  headerHeight: 60,
  sidebarWidth: 300,
  rowHeight: 36,
  onAddItem: undefined,
  placeholderLength: 2,
  timelineData: [],
  ref: null,
  scrollToFeature: undefined,
});

export type GanttContentHeaderProps = {
  renderHeaderItem: (index: number) => ReactNode;
  title: string;
  columns: number;
};

export const GanttContentHeader: FC<GanttContentHeaderProps> = ({
  title,
  columns,
  renderHeaderItem,
}) => {
  const id = useId();

  return (
    <div
      className="sticky top-0 z-20 grid w-full shrink-0 bg-background/90 backdrop-blur-sm"
      style={{ height: 'var(--gantt-header-height)' }}
    >
      <div>
        <div
          className="sticky inline-flex whitespace-nowrap px-3 py-2 text-muted-foreground text-xs"
          style={{
            left: 'var(--gantt-sidebar-width)',
          }}
        >
          <p>{title}</p>
        </div>
      </div>
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: `repeat(${columns}, var(--gantt-column-width))`,
        }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <div
            className="shrink-0 border-border/50 border-b py-1 text-center text-xs"
            key={`${id}-${index}`}
          >
            {renderHeaderItem(index)}
          </div>
        ))}
      </div>
    </div>
  );
};

const DailyHeader: FC = () => {
  const gantt = useContext(GanttContext);

  return gantt.timelineData.map((year) =>
    year.quarters
      .flatMap((quarter) => quarter.months)
      .map((month, index) => (
        <div className="relative flex flex-col" key={`${year.year}-${index}`}>
          <GanttContentHeader
            columns={month.days}
            renderHeaderItem={(item: number) => (
              <div className="flex items-center justify-center gap-1">
                <p>{format(addDays(new Date(year.year, index, 1), item), 'd')}</p>
                <p className="text-muted-foreground">
                  {format(addDays(new Date(year.year, index, 1), item), 'EEEEE', {
                    locale: gantt.locale === 'es' ? es : enUS,
                  })}
                </p>
              </div>
            )}
            title={format(new Date(year.year, index, 1), 'MMMM yyyy', {
              locale: gantt.locale === 'es' ? es : enUS,
            })}
          />
          <GanttColumns
            columns={month.days}
            isColumnSecondary={(item: number) =>
              [0, 6].includes(addDays(new Date(year.year, index, 1), item).getDay())
            }
          />
        </div>
      ))
  );
};

const MonthlyHeader: FC = () => {
  const gantt = useContext(GanttContext);

  return gantt.timelineData.map((year) => (
    <div className="relative flex flex-col" key={year.year}>
      <GanttContentHeader
        columns={year.quarters.flatMap((quarter) => quarter.months).length}
        renderHeaderItem={(item: number) => {
          const monthName = format(new Date(year.year, item, 1), 'MMM', {
            locale: gantt.locale === 'es' ? es : enUS,
          });
          if (!gantt.showWeekGuides) return <p>{monthName}</p>;
          const lastDay = getDaysInMonth(new Date(year.year, item, 1));
          return (
            <div className="relative flex items-center justify-between px-3 text-muted-foreground">
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5 bg-border" />
              <span className="font-medium text-foreground">{monthName}</span>
              <span
                className="absolute -translate-x-1/2"
                style={{ left: `${(14 / lastDay) * 100}%` }}
              >
                15
              </span>
              <span>{lastDay}</span>
            </div>
          );
        }}
        title={`${year.year}`}
      />
      {gantt.showWeekGuides ? (
        <div
          className="grid h-full w-full"
          style={{ gridTemplateColumns: 'repeat(12, var(--gantt-column-width))' }}
        >
          {Array.from({ length: 12 }, (_, month) => {
            const days = getDaysInMonth(new Date(year.year, month, 1));
            const selected = gantt.highlightedWeek;
            const monthStart = new Date(year.year, month, 1);
            const monthEnd = new Date(year.year, month, days, 23, 59, 59);
            const overlaps = selected && selected.from <= monthEnd && selected.to >= monthStart;
            const first = overlaps && selected.from > monthStart ? selected.from.getDate() : 1;
            const last = overlaps && selected.to < monthEnd ? selected.to.getDate() : days;

            return (
              <div className="relative h-full" key={`${year.year}-${month}`}>
                <GanttColumn index={month} />
                {overlaps && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 bg-primary/8"
                    style={{
                      left: `${((first - 1) / days) * 100}%`,
                      width: `${((last - first + 1) / days) * 100}%`,
                    }}
                  />
                )}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-0.5 bg-border"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 border-l border-border/30"
                  style={{ left: `${(14 / days) * 100}%` }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <GanttColumns columns={year.quarters.flatMap((quarter) => quarter.months).length} />
      )}
    </div>
  ));
};

const QuarterlyHeader: FC = () => {
  const gantt = useContext(GanttContext);

  return gantt.timelineData.map((year) =>
    year.quarters.map((quarter, quarterIndex) => (
      <div className="relative flex flex-col" key={`${year.year}-${quarterIndex}`}>
        <GanttContentHeader
          columns={quarter.months.length}
          renderHeaderItem={(item: number) => (
            <p>{format(new Date(year.year, quarterIndex * 3 + item, 1), 'MMM')}</p>
          )}
          title={`Q${quarterIndex + 1} ${year.year}`}
        />
        <GanttColumns columns={quarter.months.length} />
      </div>
    ))
  );
};

const headers: Record<Range, FC> = {
  daily: DailyHeader,
  monthly: MonthlyHeader,
  quarterly: QuarterlyHeader,
};

export type GanttHeaderProps = {
  className?: string;
};

export const GanttHeader: FC<GanttHeaderProps> = ({ className }) => {
  const gantt = useContext(GanttContext);
  const Header = headers[gantt.range];

  return (
    <div className={cn('-space-x-px flex h-full w-max divide-x divide-border/50', className)}>
      <Header />
    </div>
  );
};

export type GanttSidebarItemProps = {
  feature: GanttFeature;
  onSelectItem?: (id: string) => void;
  className?: string;
};

export const GanttSidebarItem: FC<GanttSidebarItemProps> = ({
  feature,
  onSelectItem,
  className,
}) => {
  const gantt = useContext(GanttContext);
  const tempEndAt =
    feature.endAt && isSameDay(feature.startAt, feature.endAt)
      ? addDays(feature.endAt, 1)
      : feature.endAt;
  const duration = tempEndAt
    ? formatDistance(feature.startAt, tempEndAt)
    : `${formatDistance(feature.startAt, new Date())} so far`;

  const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      // Scroll to the feature in the timeline
      gantt.scrollToFeature?.(feature);
      // Call the original onSelectItem callback
      onSelectItem?.(feature.id);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Enter') {
      // Scroll to the feature in the timeline
      gantt.scrollToFeature?.(feature);
      // Call the original onSelectItem callback
      onSelectItem?.(feature.id);
    }
  };

  return (
    <div
      className={cn(
        'relative flex items-center gap-2.5 p-2.5 text-xs hover:bg-secondary',
        className
      )}
      key={feature.id}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      // biome-ignore lint/a11y/useSemanticElements: "This is a clickable item"
      role="button"
      style={{
        height: 'var(--gantt-row-height)',
      }}
      tabIndex={0}
    >
      {/* <Checkbox onCheckedChange={handleCheck} className="shrink-0" /> */}
      <div
        className="pointer-events-none h-2 w-2 shrink-0 rounded-full"
        style={{
          backgroundColor: feature.status.color,
        }}
      />
      <p className="pointer-events-none flex-1 truncate text-left font-medium">{feature.name}</p>
      <p className="pointer-events-none text-muted-foreground">{duration}</p>
    </div>
  );
};

export const GanttSidebarHeader: FC<{ itemLabel?: string; periodLabel?: string }> = ({
  itemLabel = 'Items',
  periodLabel = 'Period',
}) => (
  <div
    className="sticky top-0 z-10 flex shrink-0 items-end justify-between gap-2.5 border-border/50 border-b bg-background/90 p-2.5 font-medium text-muted-foreground text-xs backdrop-blur-sm"
    style={{ height: 'var(--gantt-header-height)' }}
  >
    {/* <Checkbox className="shrink-0" /> */}
    <p className="flex-1 truncate text-left">{itemLabel}</p>
    <p className="shrink-0">{periodLabel}</p>
  </div>
);

export type GanttSidebarGroupProps = {
  children: ReactNode;
  name: string;
  className?: string;
};

export const GanttSidebarGroup: FC<GanttSidebarGroupProps> = ({ children, name, className }) => (
  <div className={className}>
    <p
      className="w-full truncate p-2.5 text-left font-medium text-muted-foreground text-xs"
      style={{ height: 'var(--gantt-row-height)' }}
    >
      {name}
    </p>
    <div className="divide-y divide-border/50">{children}</div>
  </div>
);

export type GanttSidebarProps = {
  children: ReactNode;
  className?: string;
  itemLabel?: string;
  periodLabel?: string;
};

export const GanttSidebar: FC<GanttSidebarProps> = ({
  children,
  className,
  itemLabel,
  periodLabel,
}) => (
  <div
    className={cn(
      'sticky left-0 z-30 h-max min-h-full overflow-clip border-border/50 border-r bg-background/90 backdrop-blur-md',
      className
    )}
    data-roadmap-ui="gantt-sidebar"
  >
    <GanttSidebarHeader itemLabel={itemLabel} periodLabel={periodLabel} />
    <div className="space-y-4">{children}</div>
  </div>
);

export type GanttAddFeatureHelperProps = {
  top: number;
  className?: string;
};

export const GanttAddFeatureHelper: FC<GanttAddFeatureHelperProps> = ({ top, className }) => {
  const [scrollX] = useGanttScrollX();
  const gantt = useContext(GanttContext);
  const [mousePosition, mouseRef] = useMouse<HTMLDivElement>();

  const handleClick = () => {
    const ganttRect = gantt.ref?.current?.getBoundingClientRect();
    const x = mousePosition.x - (ganttRect?.left ?? 0) + scrollX - gantt.sidebarWidth;
    const currentDate = getDateByMousePosition(gantt, x);

    gantt.onAddItem?.(currentDate);
  };

  return (
    <div
      className={cn('absolute top-0 w-full px-0.5', className)}
      ref={mouseRef}
      style={{
        marginTop: -gantt.rowHeight / 2,
        transform: `translateY(${top}px)`,
      }}
    >
      <button
        className="flex h-full w-full items-center justify-center rounded-md border border-dashed p-2"
        onClick={handleClick}
        type="button"
      >
        <PlusIcon className="pointer-events-none select-none text-muted-foreground" size={16} />
      </button>
    </div>
  );
};

export type GanttColumnProps = {
  index: number;
  isColumnSecondary?: (item: number) => boolean;
};

export const GanttColumn: FC<GanttColumnProps> = ({ index, isColumnSecondary }) => {
  const gantt = useContext(GanttContext);
  const [dragging] = useGanttDragging();
  const [hovering, setHovering] = useState(false);
  const [pointerY, setPointerY] = useState(0);

  const handleMouseEnter = () => setHovering(true);
  const handleMouseLeave = () => setHovering(false);

  const top = useThrottle(pointerY, 10);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: "This is a clickable column"
    // biome-ignore lint/nursery/noNoninteractiveElementInteractions: "This is a clickable column"
    <div
      className={cn(
        'group relative h-full overflow-hidden',
        isColumnSecondary?.(index) ? 'bg-secondary' : ''
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerMove={(event) =>
        setPointerY(event.clientY - event.currentTarget.getBoundingClientRect().top)
      }
    >
      {!dragging && hovering && gantt.onAddItem ? <GanttAddFeatureHelper top={top} /> : null}
    </div>
  );
};

export type GanttColumnsProps = {
  columns: number;
  isColumnSecondary?: (item: number) => boolean;
};

export const GanttColumns: FC<GanttColumnsProps> = ({ columns, isColumnSecondary }) => {
  const id = useId();

  return (
    <div
      className="divide grid h-full w-full divide-x divide-border/50"
      style={{
        gridTemplateColumns: `repeat(${columns}, var(--gantt-column-width))`,
      }}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <GanttColumn index={index} isColumnSecondary={isColumnSecondary} key={`${id}-${index}`} />
      ))}
    </div>
  );
};

export type GanttCreateMarkerTriggerProps = {
  onCreateMarker: (date: Date) => void;
  className?: string;
};

export const GanttCreateMarkerTrigger: FC<GanttCreateMarkerTriggerProps> = ({
  onCreateMarker,
  className,
}) => {
  const gantt = useContext(GanttContext);
  const [pointerX, setPointerX] = useState(0);
  const x = useThrottle(pointerX, 10);

  const date = getDateByMousePosition(gantt, x);

  const handleClick = () => onCreateMarker(date);

  return (
    <div
      className={cn(
        'group pointer-events-none absolute top-0 left-0 h-full w-full select-none overflow-visible',
        className
      )}
      onPointerMove={(event) =>
        setPointerX(event.clientX - event.currentTarget.getBoundingClientRect().left)
      }
    >
      <div
        className="-ml-2 pointer-events-auto sticky top-6 z-20 flex w-4 flex-col items-center justify-center gap-1 overflow-visible opacity-0 group-hover:opacity-100"
        style={{ transform: `translateX(${x}px)` }}
      >
        <button
          className="z-50 inline-flex h-4 w-4 items-center justify-center rounded-full bg-card"
          onClick={handleClick}
          type="button"
        >
          <PlusIcon className="text-muted-foreground" size={12} />
        </button>
        <div className="whitespace-nowrap rounded-full border border-border/50 bg-background/90 px-2 py-1 text-foreground text-xs backdrop-blur-lg">
          {formatDate(date, 'MMM dd, yyyy')}
        </div>
      </div>
    </div>
  );
};

export type GanttFeatureDragHelperProps = {
  featureId: GanttFeature['id'];
  direction: 'left' | 'right';
  date: Date | null;
};

export const GanttFeatureDragHelper: FC<GanttFeatureDragHelperProps> = ({
  direction,
  featureId,
  date,
}) => {
  const [, setDragging] = useGanttDragging();
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `feature-drag-helper-${featureId}`,
  });

  const isPressed = Boolean(attributes['aria-pressed']);

  useEffect(() => setDragging(isPressed), [isPressed, setDragging]);

  return (
    <div
      className={cn(
        'group -translate-y-1/2 !cursor-col-resize absolute top-1/2 z-[3] h-full w-6 rounded-md outline-none',
        direction === 'left' ? '-left-2.5' : '-right-2.5'
      )}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <div
        className={cn(
          '-translate-y-1/2 absolute top-1/2 h-[80%] w-1 rounded-sm bg-muted-foreground opacity-0 transition-all',
          direction === 'left' ? 'left-2.5' : 'right-2.5',
          direction === 'left' ? 'group-hover:left-0' : 'group-hover:right-0',
          isPressed && (direction === 'left' ? 'left-0' : 'right-0'),
          'group-hover:opacity-100',
          isPressed && 'opacity-100'
        )}
      />
      {date && (
        <div
          className={cn(
            '-translate-x-1/2 absolute top-10 hidden whitespace-nowrap rounded-lg border border-border/50 bg-background/90 px-2 py-1 text-foreground text-xs backdrop-blur-lg group-hover:block',
            isPressed && 'block'
          )}
        >
          {format(date, 'MMM dd, yyyy')}
        </div>
      )}
    </div>
  );
};

export type GanttFeatureItemCardProps = Pick<GanttFeature, 'id'> & {
  children?: ReactNode;
  readOnly?: boolean;
  color?: string;
  tooltip?: ReactNode;
};

export const GanttFeatureItemCard: FC<GanttFeatureItemCardProps> = ({
  id,
  children,
  readOnly = false,
  color,
  tooltip,
}) => {
  const [, setDragging] = useGanttDragging();
  const { attributes, listeners, setNodeRef } = useDraggable({ id, disabled: readOnly });
  const isPressed = Boolean(attributes['aria-pressed']);

  useEffect(() => setDragging(isPressed), [isPressed, setDragging]);

  const card = (
    <Card
      className="h-full w-full rounded-md border-l-4 bg-background p-2 text-xs shadow-sm"
      style={{ borderLeftColor: color }}
    >
      <div
        className={cn(
          'flex h-full w-full items-center justify-between gap-2 text-left',
          isPressed && 'cursor-grabbing'
        )}
        {...(readOnly ? {} : attributes)}
        {...(readOnly ? {} : listeners)}
        ref={setNodeRef}
      >
        {children}
      </div>
    </Card>
  );

  if (!tooltip) return card;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{card}</TooltipTrigger>
      <TooltipContent className="max-w-80 text-left" side="top">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};

export type GanttFeatureItemProps = GanttFeature & {
  onMove?: (id: string, startDate: Date, endDate: Date | null) => void;
  children?: ReactNode;
  className?: string;
  tooltip?: ReactNode;
};

export const GanttFeatureItem: FC<GanttFeatureItemProps> = ({
  onMove,
  children,
  className,
  tooltip,
  ...feature
}) => {
  const [scrollX] = useGanttScrollX();
  const gantt = useContext(GanttContext);
  const timelineStartDate = useMemo(
    () => new Date(gantt.timelineData.at(0)?.year ?? 0, 0, 1),
    [gantt.timelineData]
  );
  const [startAt, setStartAt] = useState<Date>(feature.startAt);
  const [endAt, setEndAt] = useState<Date | null>(feature.endAt);

  // Memoize expensive calculations
  const width = useMemo(() => getWidth(startAt, endAt, gantt), [startAt, endAt, gantt]);
  const offset = useMemo(
    () => getOffset(startAt, timelineStartDate, gantt),
    [startAt, timelineStartDate, gantt]
  );

  const addRange = useMemo(() => getAddRange(gantt.range), [gantt.range]);
  const [mousePosition] = useMouse<HTMLDivElement>();

  const [previousMouseX, setPreviousMouseX] = useState(0);
  const [previousStartAt, setPreviousStartAt] = useState(startAt);
  const [previousEndAt, setPreviousEndAt] = useState(endAt);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const handleItemDragStart = useCallback(() => {
    setPreviousMouseX(mousePosition.x);
    setPreviousStartAt(startAt);
    setPreviousEndAt(endAt);
  }, [mousePosition.x, startAt, endAt]);

  const handleItemDragMove = useCallback(() => {
    const currentDate = getDateByMousePosition(gantt, mousePosition.x);
    const originalDate = getDateByMousePosition(gantt, previousMouseX);
    const delta =
      gantt.range === 'daily'
        ? getDifferenceIn(gantt.range)(currentDate, originalDate)
        : getInnerDifferenceIn(gantt.range)(currentDate, originalDate);
    const newStartDate = addDays(previousStartAt, delta);
    const newEndDate = previousEndAt ? addDays(previousEndAt, delta) : null;

    setStartAt(newStartDate);
    setEndAt(newEndDate);
  }, [gantt, mousePosition.x, previousMouseX, previousStartAt, previousEndAt]);

  const onDragEnd = useCallback(
    () => onMove?.(feature.id, startAt, endAt),
    [onMove, feature.id, startAt, endAt]
  );

  const handleLeftDragMove = useCallback(() => {
    const ganttRect = gantt.ref?.current?.getBoundingClientRect();
    const x = mousePosition.x - (ganttRect?.left ?? 0) + scrollX - gantt.sidebarWidth;
    const newStartAt = getDateByMousePosition(gantt, x);

    setStartAt(newStartAt);
  }, [gantt, mousePosition.x, scrollX]);

  const handleRightDragMove = useCallback(() => {
    const ganttRect = gantt.ref?.current?.getBoundingClientRect();
    const x = mousePosition.x - (ganttRect?.left ?? 0) + scrollX - gantt.sidebarWidth;
    const newEndAt = getDateByMousePosition(gantt, x);

    setEndAt(newEndAt);
  }, [gantt, mousePosition.x, scrollX]);

  return (
    <div
      className={cn('relative flex w-max min-w-full py-0.5', className)}
      style={{ height: 'var(--gantt-row-height)' }}
    >
      <div
        className="pointer-events-auto absolute top-0.5"
        style={{
          height: 'calc(var(--gantt-row-height) - 4px)',
          width: Math.round(width),
          left: Math.round(offset),
        }}
      >
        {onMove && (
          <DndContext
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={onDragEnd}
            onDragMove={handleLeftDragMove}
            sensors={[mouseSensor]}
          >
            <GanttFeatureDragHelper date={startAt} direction="left" featureId={feature.id} />
          </DndContext>
        )}
        <DndContext
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={onDragEnd}
          onDragMove={handleItemDragMove}
          onDragStart={handleItemDragStart}
          sensors={[mouseSensor]}
        >
          <GanttFeatureItemCard
            id={feature.id}
            readOnly={!onMove}
            color={feature.status.color}
            tooltip={tooltip}
          >
            {children ?? <p className="flex-1 truncate text-xs">{feature.name}</p>}
          </GanttFeatureItemCard>
        </DndContext>
        {onMove && (
          <DndContext
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={onDragEnd}
            onDragMove={handleRightDragMove}
            sensors={[mouseSensor]}
          >
            <GanttFeatureDragHelper
              date={endAt ?? addRange(startAt, 2)}
              direction="right"
              featureId={feature.id}
            />
          </DndContext>
        )}
      </div>
    </div>
  );
};

export type GanttFeatureListGroupProps = {
  children: ReactNode;
  className?: string;
};

export const GanttFeatureListGroup: FC<GanttFeatureListGroupProps> = ({ children, className }) => (
  <div className={className} style={{ paddingTop: 'var(--gantt-row-height)' }}>
    {children}
  </div>
);

export const useGanttFeatureGeometry = (startAt: Date, endAt: Date) => {
  const gantt = useContext(GanttContext);
  const timelineStart = new Date(gantt.timelineData[0]?.year ?? startAt.getFullYear(), 0, 1);
  return {
    left: Math.round(getOffset(startAt, timelineStart, gantt)),
    width: Math.round(getWidth(startAt, endAt, gantt)),
  };
};

export type GanttFeatureRowProps = {
  features: GanttFeature[];
  onMove?: (id: string, startAt: Date, endAt: Date | null) => void;
  children?: (feature: GanttFeature) => ReactNode;
  className?: string;
};

export const GanttFeatureRow: FC<GanttFeatureRowProps> = ({
  features,
  onMove,
  children,
  className,
}) => {
  // Sort features by start date to handle potential overlaps
  const sortedFeatures = [...features].sort((a, b) => a.startAt.getTime() - b.startAt.getTime());

  // Calculate sub-row positions for overlapping features using a proper algorithm
  const featureWithPositions = [];
  const subRowEndTimes: Date[] = []; // Track when each sub-row becomes free

  for (const feature of sortedFeatures) {
    let subRow = 0;

    // Find the first sub-row that's free (doesn't overlap)
    while (subRow < subRowEndTimes.length && subRowEndTimes[subRow] > feature.startAt) {
      subRow++;
    }

    // Update the end time for this sub-row
    if (subRow === subRowEndTimes.length) {
      subRowEndTimes.push(feature.endAt);
    } else {
      subRowEndTimes[subRow] = feature.endAt;
    }

    featureWithPositions.push({ ...feature, subRow });
  }

  const maxSubRows = Math.max(1, subRowEndTimes.length);
  const subRowHeight = 36; // Base row height

  return (
    <div
      className={cn('relative', className)}
      style={{
        height: `${maxSubRows * subRowHeight}px`,
        minHeight: 'var(--gantt-row-height)',
      }}
    >
      {featureWithPositions.map((feature) => (
        <div
          className="absolute w-full"
          key={feature.id}
          style={{
            top: `${feature.subRow * subRowHeight}px`,
            height: `${subRowHeight}px`,
          }}
        >
          <GanttFeatureItem {...feature} onMove={onMove}>
            {children ? (
              children(feature)
            ) : (
              <p className="flex-1 truncate text-xs">{feature.name}</p>
            )}
          </GanttFeatureItem>
        </div>
      ))}
    </div>
  );
};

export type GanttFeatureListProps = {
  className?: string;
  children: ReactNode;
};

export const GanttFeatureList: FC<GanttFeatureListProps> = ({ className, children }) => (
  <div
    className={cn('absolute top-0 left-0 h-full w-max space-y-4', className)}
    style={{ marginTop: 'var(--gantt-header-height)' }}
  >
    {children}
  </div>
);

export const GanttMarker: FC<
  GanttMarkerProps & {
    onRemove?: (id: string) => void;
    className?: string;
  }
> = memo(({ label, date, id, onRemove, className }) => {
  const gantt = useContext(GanttContext);
  const differenceIn = useMemo(() => getDifferenceIn(gantt.range), [gantt.range]);
  const timelineStartDate = useMemo(
    () => new Date(gantt.timelineData.at(0)?.year ?? 0, 0, 1),
    [gantt.timelineData]
  );

  // Memoize expensive calculations
  const offset = useMemo(
    () => differenceIn(date, timelineStartDate),
    [differenceIn, date, timelineStartDate]
  );
  const innerOffset = useMemo(
    () => calculateInnerOffset(date, gantt.range, (gantt.columnWidth * gantt.zoom) / 100),
    [date, gantt.range, gantt.columnWidth, gantt.zoom]
  );

  const handleRemove = useCallback(() => onRemove?.(id), [onRemove, id]);

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-20 flex h-full select-none flex-col items-center justify-center overflow-visible"
      style={{
        width: 0,
        transform: `translateX(calc(var(--gantt-column-width) * ${offset} + ${innerOffset}px))`,
      }}
    >
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              'group pointer-events-auto sticky top-0 flex select-auto flex-col flex-nowrap items-center justify-center whitespace-nowrap rounded-b-md bg-card px-2 py-1 text-foreground text-xs',
              className
            )}
          >
            {label}
            <span className="max-h-[0] overflow-hidden opacity-80 transition-all group-hover:max-h-[2rem]">
              {formatDate(date, 'MMM dd, yyyy')}
            </span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {onRemove ? (
            <ContextMenuItem
              className="flex items-center gap-2 text-destructive"
              onClick={handleRemove}
            >
              <TrashIcon size={16} />
              Remove marker
            </ContextMenuItem>
          ) : null}
        </ContextMenuContent>
      </ContextMenu>
      <div className={cn('h-full w-px bg-card', className)} />
    </div>
  );
});

GanttMarker.displayName = 'GanttMarker';

export type GanttProviderProps = {
  locale?: 'es' | 'en';
  range?: Range;
  zoom?: number;
  focusDate?: Date;
  scrollBounds?: { from: Date; to: Date };
  onViewportChange?: (viewport: { from: Date; to: Date }) => void;
  onVerticalViewportChange?: (viewport: { top: number; height: number }) => void;
  showWeekGuides?: boolean;
  highlightedWeek?: { from: Date; to: Date };
  onAddItem?: (date: Date) => void;
  children: ReactNode;
  className?: string;
};

export const GanttProvider: FC<GanttProviderProps> = ({
  locale = 'en',
  zoom = 100,
  range = 'monthly',
  focusDate,
  scrollBounds,
  onViewportChange,
  onVerticalViewportChange,
  showWeekGuides = false,
  highlightedWeek,
  onAddItem,
  children,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [timelineData, setTimelineData] = useState<TimelineData>(
    createInitialTimelineData(focusDate ?? new Date())
  );
  const [, setScrollX] = useGanttScrollX();
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const lastFocusedDate = useRef<number | null>(null);
  const pendingScrollShift = useRef(0);
  const extendingTimeline = useRef(false);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement || !focusDate || !timelineData.length) return;
    if (lastFocusedDate.current === focusDate.getTime()) return;
    const offset = getOffset(focusDate, new Date(timelineData[0].year, 0, 1), {
      zoom,
      range,
      columnWidth: range === 'monthly' ? 150 : 50,
    });
    scrollElement.scrollLeft = Math.max(0, offset);
    setScrollX(scrollElement.scrollLeft);
    lastFocusedDate.current = focusDate.getTime();
  }, [focusDate, range, zoom, locale, sidebarWidth, timelineData, onAddItem, setScrollX]);

  const headerHeight = 60;
  const rowHeight = 36;
  let columnWidth = 50;

  if (range === 'monthly') {
    columnWidth = 150;
  } else if (range === 'quarterly') {
    columnWidth = 100;
  }

  useLayoutEffect(() => {
    if (!extendingTimeline.current) return;
    const scrollElement = scrollRef.current;
    if (scrollElement && pendingScrollShift.current) {
      scrollElement.scrollLeft += pendingScrollShift.current;
      setScrollX(scrollElement.scrollLeft);
    }
    pendingScrollShift.current = 0;
    extendingTimeline.current = false;
  }, [timelineData, setScrollX]);

  // Memoize CSS variables to prevent unnecessary re-renders
  const cssVariables = useMemo(
    () =>
      ({
        '--gantt-zoom': `${zoom}`,
        '--gantt-column-width': `${(zoom / 100) * columnWidth}px`,
        '--gantt-header-height': `${headerHeight}px`,
        '--gantt-row-height': `${rowHeight}px`,
        '--gantt-sidebar-width': `${sidebarWidth}px`,
      }) as CSSProperties,
    [zoom, columnWidth, sidebarWidth]
  );

  useEffect(() => {
    if (focusDate) return;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft =
        scrollRef.current.scrollWidth / 2 - scrollRef.current.clientWidth / 2;
      setScrollX(scrollRef.current.scrollLeft);
    }
  }, [focusDate, setScrollX]);

  // Update sidebar width when DOM is ready
  useEffect(() => {
    const updateSidebarWidth = () => {
      const sidebarElement = scrollRef.current?.querySelector('[data-roadmap-ui="gantt-sidebar"]');
      const newWidth = sidebarElement ? 300 : 0;
      setSidebarWidth(newWidth);
    };

    // Update immediately
    updateSidebarWidth();

    // Also update on resize or when children change
    const observer = new MutationObserver(updateSidebarWidth);
    if (scrollRef.current) {
      observer.observe(scrollRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const updateScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
      let bounded = scrollLeft;
      if (scrollBounds && timelineData.length) {
        const timelineStart = new Date(timelineData[0].year, 0, 1);
        const geometry = {
          zoom,
          range,
          columnWidth,
        };
        const min = getOffset(scrollBounds.from, timelineStart, geometry);
        const end = getOffset(addDays(scrollBounds.to, 1), timelineStart, geometry);
        const visibleWidth = Math.max(0, clientWidth - sidebarWidth);
        const max = Math.max(min, end - visibleWidth);
        bounded = Math.min(max, Math.max(min, scrollLeft));
        if (bounded !== scrollLeft) scrollElement.scrollLeft = bounded;
        setScrollX(bounded);
      } else {
        setScrollX(scrollLeft);
      }

      if (onViewportChange && timelineData.length && range === 'monthly') {
        const monthWidth = (columnWidth * zoom) / 100;
        const firstMonth = new Date(timelineData[0].year, 0, 1);
        const atOffset = (offset: number) => {
          const monthIndex = Math.floor(offset / monthWidth);
          const month = addMonths(firstMonth, monthIndex);
          const days = getDaysInMonth(month);
          const fraction = (offset - monthIndex * monthWidth) / monthWidth;
          return new Date(
            month.getFullYear(),
            month.getMonth(),
            Math.min(days, Math.floor(fraction * days) + 1),
            12
          );
        };
        onViewportChange({
          from: atOffset(bounded),
          to: atOffset(bounded + Math.max(0, clientWidth - sidebarWidth)),
        });
      }
      onVerticalViewportChange?.({
        top: scrollElement.scrollTop,
        height: scrollElement.clientHeight,
      });

      if (bounded === 0 && !extendingTimeline.current) {
        // Extend timelineData to the past
        const firstYear = timelineData[0]?.year;

        if (!firstYear) {
          return;
        }

        const newTimelineData: TimelineData = [createTimelineYear(firstYear - 1), ...timelineData];
        if (newTimelineData.length > 5) newTimelineData.pop();

        extendingTimeline.current = true;
        pendingScrollShift.current = (12 * columnWidth * zoom) / 100;
        setTimelineData(newTimelineData);
      } else if (bounded + clientWidth >= scrollWidth && !extendingTimeline.current) {
        // Extend timelineData to the future
        const lastYear = timelineData.at(-1)?.year;

        if (!lastYear) {
          return;
        }

        const newTimelineData: TimelineData = [...timelineData, createTimelineYear(lastYear + 1)];
        if (newTimelineData.length > 5) {
          newTimelineData.shift();
          pendingScrollShift.current = -(12 * columnWidth * zoom) / 100;
        }

        extendingTimeline.current = true;
        setTimelineData(newTimelineData);
      }
    };
    const throttledScroll = throttle(updateScroll, 100);
    const handleScroll = scrollBounds ? updateScroll : throttledScroll;
    scrollElement.addEventListener('scroll', handleScroll);
    updateScroll();

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
      throttledScroll.cancel();
    };
  }, [
    timelineData,
    setScrollX,
    scrollBounds,
    zoom,
    range,
    columnWidth,
    sidebarWidth,
    onViewportChange,
    onVerticalViewportChange,
  ]);

  const scrollToFeature = useCallback(
    (feature: GanttFeature) => {
      const scrollElement = scrollRef.current;
      if (!scrollElement) {
        return;
      }

      // Calculate timeline start date from timelineData
      const timelineStartDate = new Date(timelineData[0].year, 0, 1);

      // Calculate the horizontal offset for the feature's start date
      const offset = getOffset(feature.startAt, timelineStartDate, {
        zoom,
        range,
        columnWidth,
      });

      // Scroll to align the feature's start with the right side of the sidebar
      const targetScrollLeft = Math.max(0, offset);

      scrollElement.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
      });
    },
    [timelineData, zoom, range, columnWidth]
  );

  return (
    <GanttContext.Provider
      value={{
        locale,
        zoom,
        range,
        headerHeight,
        columnWidth,
        sidebarWidth,
        rowHeight,
        onAddItem,
        timelineData,
        placeholderLength: 2,
        ref: scrollRef,
        scrollToFeature,
        showWeekGuides,
        highlightedWeek,
      }}
    >
      <div
        className={cn(
          'gantt relative isolate grid h-full w-full flex-none select-none overflow-auto rounded-sm bg-secondary',
          range,
          className
        )}
        ref={scrollRef}
        style={{
          ...cssVariables,
          gridTemplateColumns: 'var(--gantt-sidebar-width) 1fr',
        }}
      >
        {children}
      </div>
    </GanttContext.Provider>
  );
};

export type GanttTimelineProps = {
  children: ReactNode;
  className?: string;
};

export const GanttTimeline: FC<GanttTimelineProps> = ({ children, className }) => (
  <div className={cn('relative flex h-full w-max flex-none overflow-clip', className)}>
    {children}
  </div>
);

export type GanttTodayProps = {
  className?: string;
  label?: string;
};

export const GanttToday: FC<GanttTodayProps> = ({ className, label = 'Today' }) => {
  const date = useMemo(() => new Date(), []);
  const gantt = useContext(GanttContext);
  const differenceIn = useMemo(() => getDifferenceIn(gantt.range), [gantt.range]);
  const timelineStartDate = useMemo(
    () => new Date(gantt.timelineData.at(0)?.year ?? 0, 0, 1),
    [gantt.timelineData]
  );

  // Memoize expensive calculations
  const offset = useMemo(
    () => differenceIn(date, timelineStartDate),
    [differenceIn, date, timelineStartDate]
  );
  const innerOffset = useMemo(
    () => calculateInnerOffset(date, gantt.range, (gantt.columnWidth * gantt.zoom) / 100),
    [date, gantt.range, gantt.columnWidth, gantt.zoom]
  );

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-20 flex h-full select-none flex-col items-center justify-center overflow-visible"
      style={{
        width: 0,
        transform: `translateX(calc(var(--gantt-column-width) * ${offset} + ${innerOffset}px))`,
      }}
    >
      <div
        className={cn(
          'group pointer-events-auto sticky top-0 flex select-auto flex-col flex-nowrap items-center justify-center whitespace-nowrap rounded-b-md bg-card px-2 py-1 text-foreground text-xs',
          className
        )}
      >
        {label}
        <span className="max-h-[0] overflow-hidden opacity-80 transition-all group-hover:max-h-[2rem]">
          {formatDate(date, 'MMM dd, yyyy')}
        </span>
      </div>
      <div className={cn('h-full w-px bg-card', className)} />
    </div>
  );
};
