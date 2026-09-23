'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { CustomerServiceRecordListItem } from '@/features/customer-service-records';

type CustomerServiceRecordsObservationsLabels = {
  general: string;
  assets: string;
};

export function hasCustomerServiceRecordObservations(row: CustomerServiceRecordListItem) {
  return (
    Boolean(row.observations?.trim()) ||
    row.assets.some((asset) => Boolean(asset.observations?.trim()))
  );
}

export function CustomerServiceRecordsObservationsDetail({
  row,
  labels,
}: {
  row: CustomerServiceRecordListItem;
  labels: CustomerServiceRecordsObservationsLabels;
}) {
  const assetsWithObservations = row.assets.filter((asset) => asset.observations?.trim());
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="max-w-3xl space-y-5 text-sm"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reduceMotion ? undefined : { duration: 0.24, ease: 'easeOut' }}
    >
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
              <article key={asset.assetId} className="border-l-2 border-primary/40 pl-3">
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
    </motion.div>
  );
}
