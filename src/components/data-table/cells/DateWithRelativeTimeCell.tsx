type DateWithRelativeTimeCellProps = {
  value: string | Date | null | undefined;
  dateFormatter: Intl.DateTimeFormat;
  emptyLabel: string;
  label?: string;
  referenceDate?: Date;
};

type RelativeUnit = Intl.RelativeTimeFormatUnit;

function toDate(value: string | Date) {
  if (value instanceof Date) return value;
  return new Date(`${value}T00:00:00.000Z`);
}

function relativeValue(value: Date, referenceDate: Date) {
  const valueUtc = Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
  const referenceUtc = Date.UTC(
    referenceDate.getUTCFullYear(),
    referenceDate.getUTCMonth(),
    referenceDate.getUTCDate()
  );
  const days = Math.round((valueUtc - referenceUtc) / 86_400_000);
  const absoluteDays = Math.abs(days);

  if (absoluteDays < 7) return { value: days, unit: 'day' as RelativeUnit };
  if (absoluteDays < 31) return { value: Math.round(days / 7), unit: 'week' as RelativeUnit };
  if (absoluteDays < 365) return { value: Math.round(days / 30), unit: 'month' as RelativeUnit };
  return { value: Math.round(days / 365), unit: 'year' as RelativeUnit };
}

export function DateWithRelativeTimeCell({
  value,
  dateFormatter,
  emptyLabel,
  label,
  referenceDate = new Date(),
}: DateWithRelativeTimeCellProps) {
  if (!value) return emptyLabel;

  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return emptyLabel;

  const relative = relativeValue(date, referenceDate);
  const relativeFormatter = new Intl.RelativeTimeFormat(dateFormatter.resolvedOptions().locale, {
    numeric: 'auto',
    style: 'long',
  });

  return (
    <div className="space-y-0.5">
      <time className="text-foreground" dateTime={date.toISOString()}>
        {label ? `${label}: ` : null}
        {dateFormatter.format(date)}
      </time>
      <p className="text-xs text-muted-foreground">
        {relativeFormatter.format(relative.value, relative.unit)}
      </p>
    </div>
  );
}
