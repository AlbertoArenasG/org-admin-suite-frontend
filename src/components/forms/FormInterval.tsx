import { useEffect, useState, type ReactNode } from 'react';

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
  const [inputValues, setInputValues] = useState(() => toInputValues(value));
  const valueKey = intervalUnits.map((unit) => value[unit]).join(',');

  useEffect(() => {
    setInputValues(toInputValues(value));
  }, [valueKey, value]);

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
                className="h-9 px-2 pr-12 text-left tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                disabled={disabled}
                id={id}
                min={0}
                onBlur={() => {
                  if (inputValues[unit] !== '') return;

                  setInputValues((currentValues) => ({ ...currentValues, [unit]: '0' }));
                  onValueChange({ ...value, [unit]: 0 });
                }}
                onChange={(event) => {
                  const nextInputValue = event.target.value;
                  setInputValues((currentValues) => ({
                    ...currentValues,
                    [unit]: nextInputValue,
                  }));

                  if (nextInputValue === '') return;

                  const amount = Math.max(0, Number(nextInputValue));
                  if (!Number.isFinite(amount)) return;

                  setInputValues((currentValues) => ({
                    ...currentValues,
                    [unit]: String(amount),
                  }));
                  onValueChange({ ...value, [unit]: amount });
                }}
                step={1}
                type="number"
                value={inputValues[unit]}
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

function toInputValues(value: FormIntervalValue) {
  return Object.fromEntries(intervalUnits.map((unit) => [unit, String(value[unit])])) as Record<
    FormIntervalUnit,
    string
  >;
}

export { FormIntervalDisplay, FormIntervalInput };
export type { FormIntervalDisplayProps, FormIntervalInputProps };
