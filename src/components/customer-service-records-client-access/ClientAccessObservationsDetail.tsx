'use client';

import { motion, useReducedMotion } from 'motion/react';
import { CalendarDays, PackageCheck } from 'lucide-react';
import type { ClientAccessCustomerServiceRecord } from '@/features/customer-service-records-client-access';

type ClientAccessObservationsLabels = {
  general: string;
  assets: string;
  timeline: string;
  collection: string;
  delivery: string;
  estimatedDelivery: string;
  pending: string;
};

type TimelineEvent = {
  id: 'collection' | 'delivery';
  label: string;
  value: string | null;
  icon: typeof CalendarDays;
};

function TimelineDate({
  value,
  dateFormatter,
  pendingLabel,
}: {
  value: string | null;
  dateFormatter: Intl.DateTimeFormat;
  pendingLabel: string;
}) {
  if (!value) return <span className="text-muted-foreground">{pendingLabel}</span>;

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return <span className="text-muted-foreground">{pendingLabel}</span>;
  }

  return (
    <time dateTime={date.toISOString()} className="text-foreground">
      {dateFormatter.format(date)}
    </time>
  );
}

export function hasClientAccessObservations(row: ClientAccessCustomerServiceRecord) {
  return (
    Boolean(row.observations?.trim()) ||
    row.assets.some((asset) => Boolean(asset.observations?.trim()))
  );
}

export function ClientAccessObservationsDetail({
  row,
  labels,
  dateFormatter,
}: {
  row: ClientAccessCustomerServiceRecord;
  labels: ClientAccessObservationsLabels;
  dateFormatter: Intl.DateTimeFormat;
}) {
  const assetsWithObservations = row.assets.filter((asset) => asset.observations?.trim());
  const reduceMotion = useReducedMotion();
  const deliveredAt = row.customerDelivery.deliveredToCustomerAt;
  const timelineEvents: TimelineEvent[] = [
    {
      id: 'collection',
      label: labels.collection,
      value: row.customerDelivery.receivedAt,
      icon: CalendarDays,
    },
    {
      id: 'delivery',
      label: deliveredAt ? labels.delivery : labels.estimatedDelivery,
      value: deliveredAt ?? row.customerDelivery.estimatedDeliveryAt,
      icon: PackageCheck,
    },
  ];

  return (
    <motion.div
      className="max-w-3xl space-y-5 text-sm"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reduceMotion ? undefined : { duration: 0.24, ease: 'easeOut' }}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start">
        <div className="space-y-5">
          {row.observations?.trim() ? (
            <section className="space-y-1">
              <p className="font-medium text-foreground">{labels.general}</p>
              <p className="whitespace-pre-wrap text-muted-foreground">{row.observations}</p>
            </section>
          ) : null}
          {assetsWithObservations.length ? (
            <section className="space-y-3">
              <p className="font-medium text-foreground">{labels.assets}</p>
              <div className="space-y-3">
                {assetsWithObservations.map((asset) => (
                  <article key={asset.id} className="border-l-2 border-primary/40 pl-3">
                    <p className="font-medium text-foreground">
                      {asset.name} {asset.identifier ? `(${asset.identifier})` : ''}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                      {asset.observations}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="rounded-xl border border-border bg-background/70 p-4">
          <ol className="space-y-5">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              return (
                <motion.li
                  key={event.id}
                  className="relative flex gap-3"
                  initial={reduceMotion ? false : { opacity: 0, x: 8 }}
                  animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={
                    reduceMotion ? undefined : { delay: 0.08 + index * 0.08, duration: 0.2 }
                  }
                >
                  {index < timelineEvents.length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute left-3 top-7 h-7 border-l border-border"
                    />
                  ) : null}
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 space-y-0.5 text-sm">
                    <p className="font-medium text-foreground">{event.label}</p>
                    <TimelineDate
                      value={event.value}
                      dateFormatter={dateFormatter}
                      pendingLabel={labels.pending}
                    />
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </aside>
      </div>
    </motion.div>
  );
}
