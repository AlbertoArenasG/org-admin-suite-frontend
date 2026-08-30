'use client';

import type { CustomerServiceRecordDerivedStatus } from '@/features/customer-service-records';

interface CustomerServiceRecordSemaphoreBadgeProps {
  materialization: CustomerServiceRecordDerivedStatus | null;
  neutralLabel: string;
}

export function CustomerServiceRecordSemaphoreBadge({
  materialization,
  neutralLabel,
}: CustomerServiceRecordSemaphoreBadgeProps) {
  if (!materialization) {
    return <span className="text-sm text-muted-foreground">{neutralLabel}</span>;
  }

  return (
    <span
      className="inline-flex max-w-full items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm"
      style={{
        borderColor: `${materialization.colorHex}80`,
        backgroundColor: `${materialization.colorHex}1f`,
        color: materialization.colorHex,
      }}
      title={materialization.name}
    >
      <span
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: materialization.colorHex }}
        aria-hidden="true"
      />
      <span className="truncate">{materialization.name}</span>
    </span>
  );
}
