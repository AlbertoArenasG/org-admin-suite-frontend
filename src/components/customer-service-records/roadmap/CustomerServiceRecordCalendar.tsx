'use client';
import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  CalendarBody,
  CalendarHeader,
  CalendarProvider,
  useCalendarMonth,
  useCalendarYear,
} from '@/components/vendor/kibo-ui/calendar';
import type { TimelineRecord } from '@/features/customer-service-records';
import { civilDate, neutralColor, recordLabel } from './roadmapDates';
import { useTranslationHydrated } from '@/hooks/useTranslationHydrated';

function CalendarGrid({
  records,
  from,
  scale,
}: {
  records: TimelineRecord[];
  from: string;
  scale: 'week' | 'month';
}) {
  const [, setMonth] = useCalendarMonth();
  const [, setYear] = useCalendarYear();
  const { t, i18n } = useTranslationHydrated('customerServiceRecords');
  const start = useMemo(() => civilDate(from), [from]);
  useEffect(() => {
    setMonth(start.getMonth() as 0);
    setYear(start.getFullYear());
  }, [setMonth, setYear, start]);
  const events = useMemo(
    () =>
      records.flatMap((record) => {
        const result: Array<{
          id: string;
          recordId: string;
          name: string;
          startAt: Date;
          endAt: Date;
          status: { id: string; name: string; color: string };
        }> = [];
        for (const [kind, date] of [
          ['received', record.customerDelivery.receivedAt],
          ['delivery', record.customerDelivery.estimatedDeliveryAt],
        ] as const) {
          if (!date) continue;
          const at = civilDate(date);
          result.push({
            id: `${record.id}-${kind}`,
            recordId: record.id,
            name: `${kind === 'received' ? t('roadmap.received') : t('roadmap.delivery')}: ${recordLabel(record)}`,
            startAt: at,
            endAt: at,
            status: {
              id: kind,
              name: kind,
              color: record.customerDelivery.statusMaterialization?.colorHex ?? neutralColor,
            },
          });
        }
        return result;
      }),
    [records, t]
  );
  return (
    <CalendarProvider locale={i18n.language} startDay={1}>
      <div className="overflow-x-auto rounded-md border">
        <div className="min-w-[700px]">
          <CalendarHeader />
          <CalendarBody
            features={events}
            today={new Date()}
            weekStart={scale === 'week' ? start : undefined}
          >
            {({ feature }) => (
              <Link
                href={`/dashboard/customer-service-records/${events.find((item) => item.id === feature.id)?.recordId}`}
                key={feature.id}
                className="mb-1 flex items-start gap-1 rounded px-1 py-0.5 text-xs hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span
                  className="mt-1 size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: feature.status.color }}
                />
                <span className="break-words">{feature.name}</span>
              </Link>
            )}
          </CalendarBody>
        </div>
      </div>
    </CalendarProvider>
  );
}

export function CustomerServiceRecordCalendar(props: {
  records: TimelineRecord[];
  from: string;
  scale: 'week' | 'month';
}) {
  return <CalendarGrid {...props} />;
}
