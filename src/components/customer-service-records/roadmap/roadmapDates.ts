import type { TimelineRecord } from '@/features/customer-service-records';

export function civilDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}

export function span(start: string | null, end: string | null) {
  const first = start ?? end;
  if (!first) return null;
  const last = end && end >= first ? end : first;
  return { startAt: civilDate(first), endAt: civilDate(last) };
}

export function recordLabel(record: TimelineRecord) {
  return `${record.serviceNumber} · ${record.assets.map((asset) => asset.name).join(', ') || record.serviceType}`;
}

export const neutralColor = 'var(--muted-foreground)';
