'use client';

import { ark } from '@ark-ui/react/factory';
import { Field as ArkField, useFieldContext as useArkFieldContext } from '@ark-ui/react/field';
import { Fieldset as ArkFieldset } from '@ark-ui/react/fieldset';
import type React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';
import { SharkSeparator } from '@/components/vendor/shark/forms/separator';

export const useSharkField = useArkFieldContext;

const fieldVariants = tv({
  base: [
    'group/field',
    'w-full',
    'flex gap-2',
    'data-invalid:text-destructive',
    'dark:data-invalid:text-destructive-foreground',
  ],
  variants: {
    orientation: {
      vertical: ['flex-col *:w-full [&>.sr-only]:w-auto'],
      horizontal: [
        'flex-row items-center',
        '*:data-[slot=field-label]:flex-auto',
        'has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      ],
      responsive: [
        'flex-col *:w-full [&>.sr-only]:w-auto',
        '@md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto',
        '@md/field-group:*:data-[slot=field-label]:flex-auto',
        '@md/field-group:has-[>[data-slot=field-content]]:items-start',
        '@md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      ],
    },
    reverse: {
      true: [
        'data-[orientation=horizontal]:flex-row-reverse',
        'data-[orientation=vertical]:flex-col-reverse',
        'data-[orientation=responsive]:flex-col-reverse',
        'data-[orientation=responsive]:@md/field-group:flex-row-reverse',
      ],
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    reverse: false,
  },
});

interface SharkFieldProps
  extends React.ComponentProps<typeof ArkField.Root>,
    VariantProps<typeof fieldVariants> {}

export const SharkField = (props: SharkFieldProps) => {
  const { orientation = 'vertical', reverse = false, className, ...rest } = props;

  return (
    <ArkField.Root
      className={cn(fieldVariants({ orientation, reverse }), className)}
      data-orientation={orientation}
      data-slot="shark-field"
      {...rest}
    />
  );
};

export const SharkFieldSet = (props: React.ComponentProps<typeof ArkFieldset.Root>) => {
  const { className, ...rest } = props;

  return (
    <ArkFieldset.Root
      className={cn(
        'flex flex-col gap-6',
        'has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
        className
      )}
      data-slot="shark-field-set"
      {...rest}
    />
  );
};

interface SharkFieldLegendProps extends React.ComponentProps<typeof ArkFieldset.Legend> {
  variant?: 'legend' | 'label';
}

export const SharkFieldLegend = (props: SharkFieldLegendProps) => {
  const { variant = 'legend', className, ...rest } = props;

  return (
    <ArkFieldset.Legend
      className={cn(
        'mb-3 font-medium',
        'data-[variant=legend]:text-base',
        'data-[variant=label]:text-sm',
        className
      )}
      data-slot="shark-field-legend"
      data-variant={variant}
      {...rest}
    />
  );
};

export const SharkFieldGroup = (props: React.ComponentProps<typeof ark.div>) => {
  const { className, ...rest } = props;

  return (
    <ark.div
      className={cn(
        'group/field-group @container/field-group',
        'flex w-full flex-col gap-4',
        'data-[data-slot=checkbox-group]:gap-3',
        '*:data-[slot=field-group]:gap-4',
        className
      )}
      data-slot="shark-field-group"
      {...rest}
    />
  );
};

export const SharkFieldContent = (props: React.ComponentProps<typeof ark.div>) => {
  const { className, ...rest } = props;

  return (
    <ark.div
      className={cn(
        'group/field-content',
        'flex flex-1 flex-col gap-1.5',
        'leading-snug',
        className
      )}
      data-slot="shark-field-content"
      {...rest}
    />
  );
};

export const SharkFieldLabel = (props: React.ComponentProps<typeof ArkField.Label>) => {
  const { className, ...rest } = props;

  return (
    <ArkField.Label
      className={cn(
        'group/field-label peer/field-label',
        'select-none font-medium text-sm leading-snug',
        'flex w-fit gap-1',
        'has-[>[data-slot=shark-field]]:w-full has-[>[data-slot=shark-field]]:flex-col has-[>[data-slot=shark-field]]:rounded-xl has-[>[data-slot=shark-field]]:border *:data-[slot=shark-field]:p-2.5',
        'has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5',
        'group-data-disabled/field:opacity-64',
        'dark:has-data-[state=checked]:bg-primary/10',
        className
      )}
      data-slot="shark-field-label"
      {...rest}
    />
  );
};

export const SharkFieldRequiredIndicator = (props: React.ComponentProps<typeof ark.span>) => {
  const { className, children, ...rest } = props;

  return (
    <ArkField.RequiredIndicator
      aria-hidden
      className={cn(
        'select-none text-destructive text-sm',
        'dark:text-destructive-foreground',
        className
      )}
      data-slot="shark-field-required-indicator"
      {...rest}
    >
      {children ?? '*'}
    </ArkField.RequiredIndicator>
  );
};

export const SharkFieldTitle = (props: React.ComponentProps<typeof ark.div>) => {
  const { className, ...rest } = props;

  return (
    <ark.div
      className={cn(
        'w-fit',
        'flex items-center gap-2',
        'font-medium text-sm leading-snug',
        'group-data-[disabled=true]/field:opacity-64',
        className
      )}
      data-slot="shark-field-title"
      {...rest}
    />
  );
};

export const SharkFieldDescription = (props: React.ComponentProps<typeof ark.p>) => {
  const { className, ...rest } = props;

  return (
    <ark.p
      className={cn(
        'pointer-events-none',
        'font-normal text-muted-foreground text-sm leading-normal',
        'group-has-data-[orientation=horizontal]/field:text-balance',
        '@md/field-group:group-data-[orientation=responsive]/field:text-balance',
        'nth-last-2:-mt-1 last:mt-0 [[data-variant=legend]+&]:-mt-1.5',
        'in-[[data-slot=shark-field]:has([data-slot=radio-group-item])]:ms-6 in-[[data-slot=shark-field]:has([data-slot=radio-group-item])]:-mt-1.5!',
        '[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
        className
      )}
      data-slot="shark-field-description"
      {...rest}
    />
  );
};

export const SharkFieldSeparator = (props: React.ComponentProps<typeof ark.div>) => {
  const { className, children, ...rest } = props;

  return (
    <ark.div
      className={cn(
        'relative',
        'h-5',
        '-my-2 group-data-[variant=outline]/field-group:-mb-2',
        'text-sm',
        className
      )}
      data-content={!!children}
      data-slot="shark-field-separator"
      {...rest}
    >
      <SharkSeparator className="absolute inset-0 top-1/2" />

      {!!children && (
        <span
          className={cn(
            'relative block',
            'w-fit',
            'mx-auto px-2',
            'bg-background',
            'text-muted-foreground text-sm'
          )}
        >
          {children}
        </span>
      )}
    </ark.div>
  );
};

export const SharkFieldHelper = (props: React.ComponentProps<typeof ArkField.HelperText>) => {
  const { className, ...rest } = props;

  return (
    <ArkField.HelperText
      className={cn('text-muted-foreground text-sm', className)}
      data-slot="shark-field-helper"
      {...rest}
    />
  );
};

export const SharkFieldError = (props: React.ComponentProps<typeof ArkField.ErrorText>) => {
  const { className, ...rest } = props;

  return (
    <ArkField.ErrorText
      className={cn(
        'font-normal text-destructive text-sm',
        'dark:text-destructive-foreground',
        className
      )}
      data-slot="shark-field-error"
      {...rest}
    />
  );
};
