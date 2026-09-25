'use client';

import type { CustomerServiceRecordCreateValues } from '@/features/customer-service-records';

type CustomerServiceRecordCreateSummaryProps = {
  values: CustomerServiceRecordCreateValues;
  serviceTypes: Array<{ value: string; label: string }>;
  customers: Array<{ value: string; label: string }>;
  customerUsers: Array<{ value: string; label: string }>;
  labels: {
    requestSection: string;
    assetSection: string;
    serviceType: string;
    requestedAt: string;
    customer: string;
    customerUsers: string;
    asset: string;
    identifier: string;
    brand: string;
    model: string;
    serialNumber: string;
    none: string;
  };
};

type SummaryItem = {
  label: string;
  value: string;
};

function SummarySection({ items, title }: { items: SummaryItem[]; title: string }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <dl className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <div className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-x-4" key={item.label}>
            <dt className="text-muted-foreground">{item.label}</dt>
            <dd className="min-w-0 break-words font-medium text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function CustomerServiceRecordCreateSummary({
  customerUsers,
  customers,
  labels,
  serviceTypes,
  values,
}: CustomerServiceRecordCreateSummaryProps) {
  const serviceType = serviceTypes.find((option) => option.value === values.serviceTypeCode)?.label;
  const customer = customers.find((option) => option.value === values.customerId)?.label;
  const users = customerUsers
    .filter((option) => values.customerUserIds.includes(option.value))
    .map((option) => option.label);

  return (
    <div className="space-y-6">
      <SummarySection
        title={labels.requestSection}
        items={[
          { label: labels.serviceType, value: serviceType ?? labels.none },
          { label: labels.requestedAt, value: values.requestedAt },
          { label: labels.customer, value: customer ?? labels.none },
          { label: labels.customerUsers, value: users.join(', ') || labels.none },
        ]}
      />
      <SummarySection
        title={labels.assetSection}
        items={[
          { label: labels.asset, value: values.asset.name },
          { label: labels.identifier, value: values.asset.identifier },
          { label: labels.brand, value: values.asset.brand },
          { label: labels.model, value: values.asset.model },
          { label: labels.serialNumber, value: values.asset.serialNumber },
        ]}
      />
    </div>
  );
}
