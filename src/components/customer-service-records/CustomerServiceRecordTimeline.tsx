'use client';

import { useTranslation } from 'react-i18next';

import { ProcessTimeline, type ProcessTimelineItem } from '@/components/process-timeline';
import type {
  CustomerServiceRecordDerivedStatus,
  CustomerServiceRecordDetail,
} from '@/features/customer-service-records';

type CustomerServiceRecordTimelineProps = {
  record: CustomerServiceRecordDetail;
};

export function CustomerServiceRecordTimeline({ record }: CustomerServiceRecordTimelineProps) {
  const { i18n, t } = useTranslation('customerServiceRecords');
  const items: ProcessTimelineItem[] = [
    {
      date: formatTimelineDate(record.requestedAt, i18n.language),
      id: 'requested',
      state: 'completed',
      title: t('detail.timeline.requested'),
    },
  ];

  if (record.customerDelivery.receivedAt) {
    items.push({
      date: formatTimelineDate(record.customerDelivery.receivedAt, i18n.language),
      id: 'received-from-customer',
      state: 'completed',
      title: t('detail.timeline.receivedFromCustomer'),
    });
  } else {
    items.push({
      date: t('detail.timeline.noDate'),
      id: 'received-from-customer',
      state: 'pending',
      title: t('detail.timeline.receivedFromCustomer'),
    });
  }

  if (record.provider?.deliveredToProviderAt) {
    items.push({
      date: formatTimelineDate(record.provider.deliveredToProviderAt, i18n.language),
      id: 'delivered-to-provider',
      state: 'completed',
      title: t('detail.timeline.deliveredToProvider'),
    });
  }

  const providerReturnDate =
    record.provider?.returnedFromProviderAt ?? record.provider?.estimatedReturnAt;
  if (providerReturnDate) {
    const returnedFromProvider = Boolean(record.provider?.returnedFromProviderAt);
    items.push({
      date: formatTimelineDate(providerReturnDate, i18n.language),
      id: 'provider-return',
      pulse: shouldPulseMaterialization(record.provider?.statusMaterialization),
      state: returnedFromProvider ? 'completed' : 'active',
      status: returnedFromProvider
        ? undefined
        : record.provider?.statusMaterialization
          ? {
              color: record.provider.statusMaterialization.colorHex,
              label: record.provider.statusMaterialization.name,
            }
          : undefined,
      title: t('detail.timeline.providerReturn'),
    });
  }

  const customerDeliveryDate =
    record.customerDelivery.deliveredToCustomerAt ?? record.customerDelivery.estimatedDeliveryAt;
  if (customerDeliveryDate) {
    const deliveredToCustomer = Boolean(record.customerDelivery.deliveredToCustomerAt);
    items.push({
      date: formatTimelineDate(customerDeliveryDate, i18n.language),
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

function shouldPulseMaterialization(
  materialization: CustomerServiceRecordDerivedStatus | null | undefined
) {
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
