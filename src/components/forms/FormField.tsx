'use client';

import {
  createContext,
  useContext,
  useId,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { cn } from '@/lib/utils';

type FormFieldOrientation = 'vertical' | 'horizontal' | 'responsive';

const FormFieldLabelContext = createContext<string | undefined>(undefined);

type FormFieldProps = ComponentPropsWithoutRef<'div'> & {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  orientation?: FormFieldOrientation;
};

function FormField({
  children,
  className,
  description,
  error,
  htmlFor,
  label,
  orientation = 'vertical',
  ...props
}: FormFieldProps) {
  const labelId = useId();

  return (
    <FormFieldLabelContext.Provider value={labelId}>
      <Field
        className={cn('min-w-0', className)}
        data-slot="form-field"
        data-invalid={Boolean(error) || undefined}
        orientation={orientation}
        {...props}
      >
        {htmlFor ? (
          <FieldLabel id={labelId} htmlFor={htmlFor}>
            {label}
          </FieldLabel>
        ) : (
          <FieldTitle id={labelId}>{label}</FieldTitle>
        )}
        <FieldContent>
          {children}
          {description ? <FieldDescription>{description}</FieldDescription> : null}
          {error ? <FieldError>{error}</FieldError> : null}
        </FieldContent>
      </Field>
    </FormFieldLabelContext.Provider>
  );
}

function useFormFieldLabelId() {
  return useContext(FormFieldLabelContext);
}

type FormReadValueProps = ComponentPropsWithoutRef<'div'> & {
  children: ReactNode;
};

function FormReadValue({ children, className, ...props }: FormReadValueProps) {
  return (
    <div
      className={cn(
        'min-h-9 min-w-0 break-words rounded-md border border-transparent bg-muted/50 px-3 py-2 text-sm text-foreground',
        className
      )}
      data-slot="form-read-value"
      {...props}
    >
      {children}
    </div>
  );
}

type FormValueChipsProps = {
  items: readonly string[];
  emptyLabel?: ReactNode;
  maxVisible?: number;
};

function FormValueChips({ emptyLabel = '—', items, maxVisible = 2 }: FormValueChipsProps) {
  if (!items.length) {
    return <>{emptyLabel}</>;
  }

  const visibleItems = items.slice(0, maxVisible);
  const hiddenItems = items.length - visibleItems.length;

  return (
    <span className="flex min-w-0 items-center gap-1 overflow-hidden">
      {visibleItems.map((item) => (
        <span
          className="max-w-28 shrink-0 truncate rounded-md border bg-background/70 px-2 py-1 text-xs font-medium sm:max-w-40"
          key={item}
          title={item}
        >
          {item}
        </span>
      ))}
      {hiddenItems > 0 ? (
        <span className="shrink-0 rounded-md border bg-background/70 px-2 py-1 text-xs font-medium">
          +{hiddenItems}
        </span>
      ) : null}
    </span>
  );
}

export { FormField, FormReadValue, FormValueChips, useFormFieldLabelId };
export type { FormFieldOrientation, FormFieldProps, FormReadValueProps, FormValueChipsProps };
