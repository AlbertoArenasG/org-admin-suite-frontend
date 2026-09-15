import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type FormFieldProps = ComponentPropsWithoutRef<'div'> & {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
};

function FormField({
  children,
  className,
  description,
  error,
  htmlFor,
  label,
  ...props
}: FormFieldProps) {
  const Label = htmlFor ? 'label' : 'span';

  return (
    <div className={cn('grid min-w-0 gap-2', className)} data-slot="form-field" {...props}>
      <Label className="text-sm font-medium" htmlFor={htmlFor}>
        {label}
      </Label>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
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

export { FormField, FormReadValue, FormValueChips };
export type { FormFieldProps, FormReadValueProps, FormValueChipsProps };
