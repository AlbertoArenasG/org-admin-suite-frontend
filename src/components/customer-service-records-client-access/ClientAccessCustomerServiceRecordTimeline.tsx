'use client';

import { useTranslation } from 'react-i18next';

import { ProcessTimeline, type ProcessTimelineItem } from '@/components/process-timeline';
import type {
  ClientAccessCustomerServiceRecordDetail,
  ClientAccessStatusMaterialization,
} from '@/features/customer-service-records-client-access';

type ClientAccessCustomerServiceRecordTimelineProps = {
  record: ClientAccessCustomerServiceRecordDetail;
};

export function ClientAccessCustomerServiceRecordTimeline({
  record,
}: ClientAccessCustomerServiceRecordTimelineProps) {
  const { i18n, t } = useTranslation('clientAccessServices');
  const items: ProcessTimelineItem[] = [
    {
      date: record.customerDelivery.receivedAt
        ? formatTimelineDate(record.customerDelivery.receivedAt, i18n.language)
        : t('detail.timeline.noDate'),
      id: 'received-from-customer',
      state: record.customerDelivery.receivedAt ? 'completed' : 'pending',
      title: t('detail.timeline.receivedFromCustomer'),
    },
  ];
  const deliveryDate =
    record.customerDelivery.deliveredToCustomerAt ?? record.customerDelivery.estimatedDeliveryAt;

  if (deliveryDate) {
    const deliveredToCustomer = Boolean(record.customerDelivery.deliveredToCustomerAt);
    items.push({
      date: formatTimelineDate(deliveryDate, i18n.language),
      id: 'customer-delivery',
      pulse: shouldPulseMaterialization(record.customerDelivery.statusMaterialization),
      state: deliveredToCustomer ? 'completed' : 'active',
      status: deliveredToCustomer
        ? undefined
        : record.customerDelivery.statusMaterialization
          ? {
              color: record.customerDelivery.statusMaterialization.colorHex,
              label: record.customerDelivery.statusMaterialization.name,
            }
          : undefined,
      title: t('detail.timeline.customerDelivery'),
    });
  }

  return <ProcessTimeline ariaLabel={t('detail.timeline.label')} items={items} />;
}

function shouldPulseMaterialization(materialization: ClientAccessStatusMaterialization | null) {
  if (!materialization) return false;

  return (
    materialization.source.code === 'POLICY' ||
    (materialization.source.code === 'SYSTEM' && materialization.code === 'OVERDUE')
  );
}

function formatTimelineDate(value: string, locale: string) {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) return '—';

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
