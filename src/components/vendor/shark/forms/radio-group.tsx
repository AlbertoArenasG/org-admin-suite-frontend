'use client';

import { RadioGroup as ArkRadioGroup, useRadioGroupContext } from '@ark-ui/react/radio-group';
import type React from 'react';

import { SharkFieldLabel } from '@/components/vendor/shark/forms/field';
import { cn } from '@/lib/utils';

export const useSharkRadioGroup = useRadioGroupContext;

export const SharkRadioGroup = (props: React.ComponentProps<typeof ArkRadioGroup.Root>) => {
  const { className, children, ...rest } = props;

  return (
    <ArkRadioGroup.Root
      className={cn(
        'flex flex-col gap-3',
        'data-invalid:text-destructive dark:data-invalid:text-destructive-foreground',
        className
      )}
      data-slot="shark-radio-group"
      {...rest}
    >
      {children}
    </ArkRadioGroup.Root>
  );
};

export const SharkRadioGroupItem = (props: React.ComponentProps<typeof ArkRadioGroup.Item>) => {
  const { tabIndex, className, children, ...rest } = props;

  return (
    <ArkRadioGroup.Item
      className={cn('inline-flex items-center gap-2', 'data-disabled:opacity-64', className)}
      data-slot="shark-radio-group-item"
      {...rest}
    >
      <ArkRadioGroup.ItemControl
        className={cn(
          'relative',
          'inline-flex shrink-0 items-center justify-center',
          'size-4',
          'border border-input shadow-xs/5',
          'bg-input/30',
          'rounded-full',
          'before:size-1.5 before:rounded-full',
          'data-focus-visible:border-primary data-focus-visible:ring-[3px] data-focus-visible:ring-ring/32 data-focus-visible:ring-offset-1 data-focus-visible:ring-offset-background',
          'data-focus-visible:data-invalid:border-destructive/64 data-focus-visible:data-invalid:ring-destructive/48',
          'data-invalid:border-destructive data-invalid:text-destructive data-invalid:ring-[3px] data-invalid:ring-destructive/24',
          'dark:data-invalid:border-destructive-foreground dark:data-invalid:text-destructive dark:data-invalid:ring-destructive-foreground/20',
          'data-[state=checked]:bg-primary data-[state=checked]:before:bg-primary-foreground',
          'data-invalid:data-[state=checked]:bg-transparent data-invalid:data-[state=checked]:before:bg-destructive-foreground'
        )}
        data-slot="shark-radio-group-item-control"
      />

      <SharkRadioGroupText>{children}</SharkRadioGroupText>

      <ArkRadioGroup.ItemHiddenInput tabIndex={tabIndex} />
    </ArkRadioGroup.Item>
  );
};

export const SharkRadioGroupText = (props: React.ComponentProps<typeof ArkRadioGroup.ItemText>) => {
  const { className, children, ...rest } = props;

  return (
    <SharkFieldLabel asChild className={className}>
      <ArkRadioGroup.ItemText data-slot="shark-radio-group-item-text" {...rest}>
        {children}
      </ArkRadioGroup.ItemText>
    </SharkFieldLabel>
  );
};

export const SharkRadioGroupLabel = (props: React.ComponentProps<typeof ArkRadioGroup.Label>) => {
  const { className, children, ...rest } = props;

  return (
    <SharkFieldLabel asChild className={className}>
      <ArkRadioGroup.Label data-slot="shark-radio-group-label" {...rest}>
        {children}
      </ArkRadioGroup.Label>
    </SharkFieldLabel>
  );
};
