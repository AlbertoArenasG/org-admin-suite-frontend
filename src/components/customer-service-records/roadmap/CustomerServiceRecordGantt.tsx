'use client';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { endOfWeek, startOfWeek } from 'date-fns';
import Link from 'next/link';
import {
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttTimeline,
  GanttToday,
  useGanttFeatureGeometry,
  type GanttFeature,
} from '@/components/vendor/kibo-ui/gantt';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { TimelineRecord } from '@/features/customer-service-records';
import { civilDate, neutralColor, recordLabel, span } from './roadmapDates';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type Item = GanttFeature & {
  recordId: string;
  serviceNumber: string;
  customerName: string;
  equipmentNames: string[];
  providerName: string | null;
  kind: 'customer' | 'provider';
};

type RecordRow = { id: string; main: Item; provider?: Item };
type GanttRowEntry =
  | { kind: 'header'; id: string; name: string; height: 36 }
  | { kind: 'record'; id: string; row: RecordRow; height: number }
  | { kind: 'gap'; id: string; height: 16 };

function ProviderBranch({
  parent,
  provider,
  label,
  dates,
}: {
  parent: Item;
  provider: Item;
  label: string;
  dates: string;
}) {
  const parentGeometry = useGanttFeatureGeometry(parent.startAt, parent.endAt);
  const providerGeometry = useGanttFeatureGeometry(provider.startAt, provider.endAt);
  const rootX = parentGeometry.left - 12;
  const lineLeft = Math.min(rootX, providerGeometry.left);
  const branchLabel = `${label}${provider.providerName ? ` · ${provider.providerName}` : ''}`;

  return (
    <div className="relative h-6">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-0 overflow-visible opacity-60"
        style={{
          left: lineLeft,
          width: Math.max(1, Math.abs(providerGeometry.left - rootX)),
          height: 24,
          color: provider.status.color,
        }}
      >
        <path
          d={`M ${parentGeometry.left - lineLeft} -18 H ${rootX - lineLeft} V 14 H ${providerGeometry.left - lineLeft}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/dashboard/customer-service-records/${provider.recordId}`}
            aria-label={`${provider.serviceNumber} · ${branchLabel} · ${dates}`}
            className="absolute top-2 flex h-3.5 items-center overflow-hidden rounded-full border border-border/60 border-l-[3px] px-1.5 text-[10px] leading-none text-foreground shadow-sm hover:brightness-95 focus-visible:outline-2 focus-visible:outline-primary"
            style={{
              left: providerGeometry.left,
              width: providerGeometry.width,
              borderLeftColor: provider.status.color,
              backgroundColor: `color-mix(in srgb, ${provider.status.color} 18%, var(--background))`,
            }}
          >
            <span className="truncate">{provider.providerName ?? label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="top">
          {branchLabel} · {dates}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function CustomerServiceRecordGantt({
  records,
  from,
  scale,
  navigationToken,
  visibleDate,
  scrollBounds,
  onViewportChange,
}: {
  records: TimelineRecord[];
  from: string;
  scale: 'week' | 'month';
  navigationToken: number;
  visibleDate: Date;
  scrollBounds?: { from: Date; to: Date };
  onViewportChange: (viewport: { from: Date; to: Date }) => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<{ id: string; offset: number } | null>(null);
  const [verticalViewport, setVerticalViewport] = useState({ top: 0, height: 800 });
  const handleVerticalViewportChange = useCallback((next: { top: number; height: number }) => {
    setVerticalViewport((current) =>
      Math.floor(current.top / 150) === Math.floor(next.top / 150) && current.height === next.height
        ? current
        : next
    );
  }, []);
  const { t, i18n } = useTranslationHydrated('customerServiceRecords');
  const focusDate = useMemo(() => civilDate(from), [from]);
  const highlightedWeek = useMemo(
    () =>
      scale === 'week'
        ? {
            from: startOfWeek(visibleDate, { weekStartsOn: 1 }),
            to: endOfWeek(visibleDate, { weekStartsOn: 1 }),
          }
        : undefined,
    [visibleDate, scale]
  );
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }),
    [i18n.language]
  );
  const periodDates = (item: Item) => {
    const start = dateFormatter.format(item.startAt);
    const end = dateFormatter.format(item.endAt);
    return `${start}${start === end ? '' : ` – ${end}`}`;
  };
  const equipmentNames = (item: Item) => item.equipmentNames.join(', ') || '—';
  const accessibleLabel = (item: Item) =>
    `${item.serviceNumber} · ${item.status.name} · ${t('roadmap.customer')}: ${item.customerName} · ${t('roadmap.equipment')}: ${equipmentNames(item)} · ${t('roadmap.dates')}: ${periodDates(item)}`;
  const groups = useMemo(() => {
    const grouped = new Map<string, { id: string; name: string; rows: RecordRow[] }>();
    for (const record of records) {
      const key = record.customer.id;
      const group = grouped.get(key) ?? { id: key, name: record.customer.name, rows: [] };
      let customer: Item | undefined;
      let provider: Item | undefined;
      const base = {
        name: recordLabel(record),
        recordId: record.id,
        serviceNumber: record.serviceNumber,
        customerName: record.customer.name,
        equipmentNames: record.assets.map((asset) => asset.name),
        providerName: record.provider?.name ?? null,
      };
      const customerSpan = span(
        record.customerDelivery.receivedAt,
        record.customerDelivery.estimatedDeliveryAt
      );
      if (customerSpan)
        customer = {
          ...base,
          ...customerSpan,
          id: `${record.id}-customer`,
          kind: 'customer',
          status: {
            id: 'customer',
            name: t('roadmap.customerPeriod'),
            color: record.customerDelivery.statusMaterialization?.colorHex ?? neutralColor,
          },
        };
      const providerSpan = span(
        record.provider?.deliveredAt ?? null,
        record.provider?.returnedAt ?? record.provider?.estimatedReturnAt ?? null
      );
      if (providerSpan)
        provider = {
          ...base,
          ...providerSpan,
          id: `${record.id}-provider`,
          kind: 'provider',
          status: {
            id: 'provider',
            name: t('roadmap.providerPeriod'),
            color: record.provider?.statusMaterialization?.colorHex ?? neutralColor,
          },
        };
      if (customer || provider) {
        const main = customer ?? provider;
        if (!main) continue;
        group.rows.push({ id: record.id, main, provider });
        grouped.set(key, group);
      }
    }
    return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [records, t]);
  const layout = useMemo(() => {
    const offsets = new Map<string, number>();
    const entries: GanttRowEntry[] = [];
    const tops: number[] = [];
    let total = 0;
    const push = (entry: GanttRowEntry) => {
      tops.push(total);
      entries.push(entry);
      total += entry.height;
    };
    groups.forEach((group, index) => {
      if (index) push({ kind: 'gap', id: `gap-${group.id}`, height: 16 });
      push({ kind: 'header', id: group.id, name: group.name, height: 36 });
      for (const row of group.rows) {
        offsets.set(row.id, 60 + total);
        push({
          kind: 'record',
          id: row.id,
          row,
          height: 36 + (row.main.kind === 'customer' && row.provider ? 24 : 0),
        });
      }
    });
    return { entries, tops, offsets, total };
  }, [groups]);
  const window = useMemo(() => {
    if (!layout.entries.length) return { first: 0, last: -1, top: 0, bottom: 0 };
    const from = Math.max(0, verticalViewport.top - 60 - 600);
    const to = verticalViewport.top + verticalViewport.height - 60 + 600;
    let low = 0;
    let high = layout.entries.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (layout.tops[mid] + layout.entries[mid].height < from) low = mid + 1;
      else high = mid;
    }
    const first = Math.min(low, layout.entries.length - 1);
    low = first;
    high = layout.entries.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (layout.tops[mid] <= to) low = mid + 1;
      else high = mid;
    }
    const last = Math.max(first, low - 1);
    return {
      first: Math.max(0, first),
      last,
      top: first > 0 ? layout.tops[first] : 0,
      bottom: last >= 0 ? layout.total - layout.tops[last] - layout.entries[last].height : 0,
    };
  }, [layout, verticalViewport]);
  useLayoutEffect(() => {
    const frame = frameRef.current;
    const scroll = frame?.querySelector<HTMLElement>('.gantt');
    const anchor = anchorRef.current;
    const newTop = anchor ? layout.offsets.get(anchor.id) : undefined;
    if (scroll && newTop !== undefined && anchor) {
      scroll.scrollTop = newTop - anchor.offset;
      handleVerticalViewportChange({ top: scroll.scrollTop, height: scroll.clientHeight });
    }
    anchorRef.current = null;
    return () => {
      const currentScroll = frame?.querySelector<HTMLElement>('.gantt');
      if (!currentScroll) return;
      const top = currentScroll.getBoundingClientRect().top;
      const row = Array.from(
        currentScroll.querySelectorAll<HTMLElement>('[data-gantt-row-id]')
      ).find((element) => element.getBoundingClientRect().bottom > top + 60);
      if (row?.dataset.ganttRowId) {
        anchorRef.current = {
          id: row.dataset.ganttRowId,
          offset: row.getBoundingClientRect().top - top,
        };
      }
    };
  }, [groups, handleVerticalViewportChange, layout]);
  const visibleEntries = layout.entries.slice(window.first, window.last + 1);
  const spacer = (height: number) =>
    height > 0 ? <div aria-hidden="true" style={{ height }} /> : null;
  return (
    <div
      ref={frameRef}
      role="region"
      className="h-[60dvh] min-h-80 overflow-hidden rounded-md border md:h-full md:min-h-0 md:flex-1"
      aria-label={t('roadmap.gantt')}
    >
      <GanttProvider
        key={`${from.slice(0, 4)}-${scale}-${navigationToken}`}
        range="monthly"
        zoom={scale === 'week' ? 500 : 100}
        focusDate={focusDate}
        scrollBounds={scrollBounds}
        onViewportChange={onViewportChange}
        onVerticalViewportChange={handleVerticalViewportChange}
        showWeekGuides={scale === 'week'}
        highlightedWeek={highlightedWeek}
        locale={i18n.language.startsWith('es') ? 'es' : 'en'}
      >
        <GanttSidebar itemLabel={t('roadmap.service')} periodLabel={t('roadmap.period')}>
          <div>
            {spacer(window.top)}
            {visibleEntries.map((entry) => {
              if (entry.kind === 'gap')
                return <div key={entry.id} aria-hidden="true" style={{ height: entry.height }} />;
              if (entry.kind === 'header')
                return (
                  <GanttSidebarGroup key={entry.id} name={entry.name}>
                    {null}
                  </GanttSidebarGroup>
                );
              const { row } = entry;
              return (
                <div key={row.id}>
                  <Link
                    data-gantt-row-id={row.id}
                    href={`/dashboard/customer-service-records/${row.id}`}
                    className="flex h-9 items-center gap-2 truncate px-3 text-xs hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: row.main.status.color }}
                    />
                    <span className="truncate">
                      {row.main.name}
                      {row.main.kind === 'provider' ? ` · ${t('roadmap.providerPeriod')}` : ''}
                    </span>
                  </Link>
                  {row.main.kind === 'customer' && row.provider && (
                    <Link
                      href={`/dashboard/customer-service-records/${row.id}`}
                      className="flex h-6 items-center truncate pl-7 pr-3 text-[11px] text-muted-foreground hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      {t('roadmap.providerPeriod')}
                      {row.provider.providerName ? ` · ${row.provider.providerName}` : ''}
                    </Link>
                  )}
                </div>
              );
            })}
            {spacer(window.bottom)}
          </div>
        </GanttSidebar>
        <GanttTimeline>
          <GanttHeader />
          <GanttFeatureList>
            <div>
              {spacer(window.top)}
              {visibleEntries.map((entry) => {
                if (entry.kind === 'gap')
                  return <div key={entry.id} aria-hidden="true" style={{ height: entry.height }} />;
                if (entry.kind === 'header')
                  return <GanttFeatureListGroup key={entry.id}>{null}</GanttFeatureListGroup>;
                const { row } = entry;
                return (
                  <div key={row.id} className="relative">
                    <Link
                      href={`/dashboard/customer-service-records/${row.id}`}
                      aria-label={`${accessibleLabel(row.main)}${row.main.kind === 'customer' && row.provider ? ` · ${t('roadmap.providerPeriod')}: ${periodDates(row.provider)}` : ''}`}
                      className="block h-9 focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <GanttFeatureItem
                        {...row.main}
                        tooltip={
                          <div className="space-y-2">
                            <p className="border-b border-background/20 pb-1 font-semibold">
                              {row.main.serviceNumber} · {row.main.status.name}
                            </p>
                            <dl className="space-y-1">
                              <div>
                                <dt className="text-background/70">{t('roadmap.customer')}</dt>
                                <dd className="break-words">{row.main.customerName}</dd>
                              </div>
                              <div>
                                <dt className="text-background/70">{t('roadmap.equipment')}</dt>
                                <dd className="break-words">{equipmentNames(row.main)}</dd>
                              </div>
                              <div>
                                <dt className="text-background/70">{t('roadmap.dates')}</dt>
                                <dd>{periodDates(row.main)}</dd>
                              </div>
                              {row.provider && (
                                <div>
                                  <dt className="text-background/70">
                                    {t('roadmap.providerPeriod')}
                                    {row.provider.providerName
                                      ? ` · ${row.provider.providerName}`
                                      : ''}
                                  </dt>
                                  <dd>{periodDates(row.provider)}</dd>
                                </div>
                              )}
                            </dl>
                          </div>
                        }
                      >
                        <span className="truncate">{row.main.name}</span>
                      </GanttFeatureItem>
                    </Link>
                    {row.main.kind === 'customer' && row.provider && (
                      <ProviderBranch
                        parent={row.main}
                        provider={row.provider}
                        label={t('roadmap.providerPeriod')}
                        dates={periodDates(row.provider)}
                      />
                    )}
                  </div>
                );
              })}
              {spacer(window.bottom)}
            </div>
          </GanttFeatureList>
          <GanttToday label={t('roadmap.today')} />
        </GanttTimeline>
      </GanttProvider>
    </div>
  );
}
