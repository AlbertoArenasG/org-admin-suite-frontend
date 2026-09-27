import type { ReactNode } from 'react';

import { Input } from '@/components/ui/input';

const intervalUnits = ['years', 'months', 'weeks', 'days'] as const;

export type FormIntervalUnit = (typeof intervalUnits)[number];

export type FormIntervalValue = Record<FormIntervalUnit, number>;

export type FormIntervalLabels = Record<FormIntervalUnit, string>;

type FormIntervalDisplayProps = {
  emptyLabel?: ReactNode;
  labels: FormIntervalLabels;
  value: FormIntervalValue;
};

type FormIntervalInputProps = {
  disabled?: boolean;
  errors?: Partial<Record<FormIntervalUnit, ReactNode>>;
  idPrefix: string;
  labels: FormIntervalLabels;
  onValueChange: (value: FormIntervalValue) => void;
  value: FormIntervalValue;
};

function FormIntervalDisplay({ emptyLabel = '—', labels, value }: FormIntervalDisplayProps) {
  const parts = intervalUnits.flatMap((unit) => {
    const amount = value[unit];
    return amount > 0 ? [`${amount} ${labels[unit]}`] : [];
  });

  return <>{parts.length ? parts.join(', ') : emptyLabel}</>;
}

function FormIntervalInput({
  disabled = false,
  errors,
  idPrefix,
  labels,
  onValueChange,
  value,
}: FormIntervalInputProps) {
  return (
    <div className="grid max-w-xl grid-cols-2 gap-2 sm:grid-cols-4" data-slot="form-interval-input">
      {intervalUnits.map((unit) => {
        const id = `${idPrefix}-${unit}`;
        const error = errors?.[unit];

        return (
          <div className="min-w-0" key={unit}>
            <label className="relative block" htmlFor={id}>
              <Input
                aria-invalid={Boolean(error) || undefined}
                className="h-9 pr-12 text-center tabular-nums"
                disabled={disabled}
                id={id}
                min={0}
                onChange={(event) => {
                  const amount = Number(event.target.value) || 0;
                  onValueChange({ ...value, [unit]: Math.max(0, amount) });
                }}
                step={1}
                type="number"
                value={value[unit]}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[11px] font-medium text-muted-foreground"
              >
                {labels[unit]}
              </span>
            </label>
            {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

export { FormIntervalDisplay, FormIntervalInput };
export type { FormIntervalDisplayProps, FormIntervalInputProps };
