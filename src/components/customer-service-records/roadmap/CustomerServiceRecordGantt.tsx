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

type Item = GanttFeature & { recordId: string; kind: 'customer' | 'provider' };

export function CustomerServiceRecordGantt({
  records,
  from,
}: {
  records: TimelineRecord[];
  from: string;
}) {
  const { t, i18n } = useTranslationHydrated('customerServiceRecords');
  const focusDate = useMemo(() => civilDate(from), [from]);
  const groups = useMemo(() => {
    const grouped = new Map<string, { id: string; name: string; items: Item[] }>();
    for (const record of records) {
      const key = record.customer.id;
      const group = grouped.get(key) ?? { id: key, name: record.customer.name, items: [] };
      const base = { name: recordLabel(record), recordId: record.id };
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
      className="h-[min(65vh,680px)] min-h-80 overflow-hidden rounded-md border"
      aria-label={t('roadmap.gantt')}
    >
      <GanttProvider
        key={from.slice(0, 4)}
        range="daily"
        zoom={70}
        focusDate={focusDate}
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
                    aria-label={`${item.name} · ${item.status.name}`}
                    className="block h-9 focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <GanttFeatureItem {...item}>
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
