'use client';

import { useMemo, type ComponentProps, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

function FieldSet({ className, ...props }: ComponentProps<'fieldset'>) {
  return (
    <fieldset className={cn('flex flex-col gap-6', className)} data-slot="field-set" {...props} />
  );
}

function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
  return (
    <legend
      className={cn(
        'mb-3 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base',
        className
      )}
      data-slot="field-legend"
      data-variant={variant}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'group/field-group @container/field-group flex w-full flex-col gap-7',
        className
      )}
      data-slot="field-group"
      {...props}
    />
  );
}

const fieldVariants = cva(
  'group/field flex w-full min-w-0 gap-3 data-[invalid=true]:text-destructive',
  {
    variants: {
      orientation: {
        vertical: 'flex-col [&>*]:w-full [&>.sr-only]:w-auto',
        horizontal:
          'flex-row items-center [&>[data-slot=field-label]]:flex-auto has-[>[data-slot=field-content]]:items-start',
        responsive:
          'flex-col @md/field-group:grid @md/field-group:grid-cols-[var(--field-label-width,14rem)_minmax(0,1fr)] @md/field-group:items-start [&>*]:w-full @md/field-group:[&>*]:w-auto [&>.sr-only]:w-auto',
      },
    },
    defaultVariants: { orientation: 'vertical' },
  }
);

function Field({
  className,
  orientation,
  ...props
}: ComponentProps<'div'> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      className={cn(fieldVariants({ orientation }), className)}
      data-orientation={orientation}
      data-slot="field"
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'group/field-content flex min-w-0 flex-1 flex-col gap-1.5 leading-snug',
        className
      )}
      data-slot="field-content"
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: ComponentProps<typeof Label>) {
  return (
    <Label
      className={cn('group/field-label w-fit shrink-0 leading-snug', className)}
      data-slot="field-label"
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex w-fit shrink-0 items-center gap-2 text-sm leading-snug font-medium',
        className
      )}
      data-slot="field-title"
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn('text-sm leading-normal text-muted-foreground', className)}
      data-slot="field-description"
      {...props}
    />
  );
}

function FieldSeparator({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('relative -my-2 h-5 text-sm', className)}
      data-slot="field-separator"
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children ? (
        <span className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground">
          {children}
        </span>
      ) : null}
    </div>
  );
}

function FieldError({
  children,
  className,
  errors,
  ...props
}: ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>;
  children?: ReactNode;
}) {
  const content = useMemo(() => {
    if (children) return children;
    const messages = errors?.map((error) => error?.message).filter(Boolean);
    if (!messages?.length) return null;
    return [...new Set(messages)].join(', ');
  }, [children, errors]);

  if (!content) return null;

  return (
    <div
      className={cn('text-sm font-normal text-destructive', className)}
      data-slot="field-error"
      role="alert"
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
export type { VariantProps };
