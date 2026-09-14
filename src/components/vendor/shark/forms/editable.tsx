'use client';

import { Editable as ArkEditable, useEditableContext } from '@ark-ui/react/editable';
import type React from 'react';
import { cn } from '@/lib/utils';
import { type SharkButtonProps, sharkButtonVariants } from './button';

export const useSharkEditable = useEditableContext;

export interface SharkEditableProps extends React.ComponentProps<typeof ArkEditable.Root> {
  orientation?: 'horizontal' | 'vertical';
}

export const SharkEditable = ({
  orientation = 'horizontal',
  className,
  ...props
}: SharkEditableProps) => (
  <ArkEditable.Root
    className={cn(
      'group/shark-editable relative flex w-full items-center gap-2 data-[orientation=vertical]:items-end',
      className
    )}
    data-orientation={orientation}
    data-slot="shark-editable"
    {...props}
  />
);

export const SharkEditableArea = ({
  className,
  ...props
}: React.ComponentProps<typeof ArkEditable.Area>) => (
  <ArkEditable.Area
    className={cn('w-full', className)}
    data-slot="shark-editable-area"
    {...props}
  />
);

export type SharkEditableInputProps = Omit<React.ComponentProps<typeof ArkEditable.Input>, 'size'>;

export const SharkEditableInput = (props: SharkEditableInputProps) => (
  <ArkEditable.Input data-slot="shark-editable-input" {...props} />
);

interface SharkEditablePreviewProps extends React.ComponentProps<typeof ArkEditable.Preview> {
  size?: SharkButtonProps['size'];
  variant?: SharkButtonProps['variant'];
}

export const SharkEditablePreview = ({
  variant = 'outline',
  size = 'md',
  className,
  ...props
}: SharkEditablePreviewProps) => (
  <ArkEditable.Preview
    className={cn(
      sharkButtonVariants({ variant, size, clickEffect: false }),
      'w-full justify-start whitespace-pre-wrap px-3 font-normal text-base sm:text-sm',
      'dark:hover:bg-input/32 data-placeholder-shown:text-muted-foreground',
      className
    )}
    data-slot="shark-editable-preview"
    {...props}
  />
);

export const SharkEditableControl = ({
  className,
  ...props
}: React.ComponentProps<typeof ArkEditable.Control>) => (
  <ArkEditable.Control
    className={cn(
      'inline-flex items-center gap-2 group-data-[orientation=vertical]/shark-editable:flex-col',
      className
    )}
    data-slot="shark-editable-control"
    {...props}
  />
);

export const SharkEditableEditTrigger = (
  props: React.ComponentProps<typeof ArkEditable.EditTrigger>
) => <ArkEditable.EditTrigger data-slot="shark-editable-edit-trigger" {...props} />;
export const SharkEditableCancelTrigger = (
  props: React.ComponentProps<typeof ArkEditable.CancelTrigger>
) => <ArkEditable.CancelTrigger data-slot="shark-editable-cancel-trigger" {...props} />;
export const SharkEditableSubmitTrigger = (
  props: React.ComponentProps<typeof ArkEditable.SubmitTrigger>
) => <ArkEditable.SubmitTrigger data-slot="shark-editable-submit-trigger" {...props} />;
