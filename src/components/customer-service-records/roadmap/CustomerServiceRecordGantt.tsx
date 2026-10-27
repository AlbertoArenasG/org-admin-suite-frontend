'use client';
import { useMemo } from 'react';
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
  type GanttFeature,
} from '@/components/vendor/kibo-ui/gantt';
import type { TimelineRecord } from '@/features/customer-service-records';
import { civilDate, neutralColor, recordLabel, span } from './roadmapDates';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

type Item = GanttFeature & {
  recordId: string;
  serviceNumber: string;
  customerName: string;
  equipmentNames: string[];
  kind: 'customer' | 'provider';
};

export function CustomerServiceRecordGantt({
  records,
  from,
  to,
  scale,
}: {
  records: TimelineRecord[];
  from: string;
  to: string;
  scale: 'week' | 'month';
}) {
  const { t, i18n } = useTranslationHydrated('customerServiceRecords');
  const focusDate = useMemo(() => civilDate(from), [from]);
  const highlightedWeek = useMemo(
    () => (scale === 'week' ? { from: civilDate(from), to: civilDate(to) } : undefined),
    [from, to, scale]
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
    const grouped = new Map<string, { id: string; name: string; items: Item[] }>();
    for (const record of records) {
      const key = record.customer.id;
      const group = grouped.get(key) ?? { id: key, name: record.customer.name, items: [] };
      const base = {
        name: recordLabel(record),
        recordId: record.id,
        serviceNumber: record.serviceNumber,
        customerName: record.customer.name,
        equipmentNames: record.assets.map((asset) => asset.name),
      };
      const customerSpan = span(
        record.customerDelivery.receivedAt,
        record.customerDelivery.estimatedDeliveryAt
      );
      if (customerSpan)
        group.items.push({
          ...base,
          ...customerSpan,
          id: `${record.id}-customer`,
          kind: 'customer',
          status: {
            id: 'customer',
            name: t('roadmap.customerPeriod'),
            color: record.customerDelivery.statusMaterialization?.colorHex ?? neutralColor,
          },
        });
      const providerSpan = span(
        record.provider?.deliveredAt ?? null,
        record.provider?.returnedAt ?? record.provider?.estimatedReturnAt ?? null
      );
      if (providerSpan)
        group.items.push({
          ...base,
          ...providerSpan,
          id: `${record.id}-provider`,
          kind: 'provider',
          status: {
            id: 'provider',
            name: t('roadmap.providerPeriod'),
            color: record.provider?.statusMaterialization?.colorHex ?? neutralColor,
          },
        });
      if (group.items.length) grouped.set(key, group);
    }
    return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [records, t]);
  return (
    <div
      role="region"
      className="h-[60dvh] min-h-80 overflow-hidden rounded-md border md:h-full md:min-h-0 md:flex-1"
      aria-label={t('roadmap.gantt')}
    >
      <GanttProvider
        key={`${from.slice(0, 4)}-${scale}`}
        range="monthly"
        zoom={scale === 'week' ? 500 : 100}
        focusDate={focusDate}
        showWeekGuides={scale === 'week'}
        highlightedWeek={highlightedWeek}
        locale={i18n.language.startsWith('es') ? 'es' : 'en'}
      >
        <GanttSidebar itemLabel={t('roadmap.service')} periodLabel={t('roadmap.period')}>
          {groups.map((group) => (
            <GanttSidebarGroup key={group.id} name={group.name}>
              {group.items.map((item) => (
                <Link
                  key={item.id}
                  href={`/dashboard/customer-service-records/${item.recordId}`}
                  className="flex h-9 items-center gap-2 truncate px-3 text-xs hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: item.status.color }}
                  />
                  <span className="truncate">
                    {item.name} ·{' '}
                    {item.kind === 'provider'
                      ? t('roadmap.providerPeriod')
                      : t('roadmap.customerPeriod')}
                  </span>
                </Link>
              ))}
            </GanttSidebarGroup>
          ))}
        </GanttSidebar>
        <GanttTimeline>
          <GanttHeader />
          <GanttFeatureList>
            {groups.map((group) => (
              <GanttFeatureListGroup key={group.id}>
                {group.items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/dashboard/customer-service-records/${item.recordId}`}
                    aria-label={accessibleLabel(item)}
                    className="block h-9 focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <GanttFeatureItem
                      {...item}
                      tooltip={
                        <div className="space-y-2">
                          <p className="border-b border-background/20 pb-1 font-semibold">
                            {item.serviceNumber} · {item.status.name}
                          </p>
                          <dl className="space-y-1">
                            <div>
                              <dt className="text-background/70">{t('roadmap.customer')}</dt>
                              <dd className="break-words">{item.customerName}</dd>
                            </div>
                            <div>
                              <dt className="text-background/70">{t('roadmap.equipment')}</dt>
                              <dd className="break-words">{equipmentNames(item)}</dd>
                            </div>
                            <div>
                              <dt className="text-background/70">{t('roadmap.dates')}</dt>
                              <dd>{periodDates(item)}</dd>
                            </div>
                          </dl>
                        </div>
                      }
                    >
                      <span className="truncate">{item.name}</span>
                    </GanttFeatureItem>
                  </Link>
                ))}
              </GanttFeatureListGroup>
            ))}
          </GanttFeatureList>
          <GanttToday label={t('roadmap.today')} />
        </GanttTimeline>
      </GanttProvider>
    </div>
  );
}
