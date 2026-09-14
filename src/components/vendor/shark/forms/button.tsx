'use client';

import { ark } from '@ark-ui/react/factory';
import type React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/utils';
import { SharkSpinner } from './spinner';

export const sharkButtonVariants = tv({
  base: [
    'relative inline-flex shrink-0 items-center justify-center gap-2',
    'whitespace-nowrap rounded-lg font-medium text-sm transition-all',
    'outline-none focus-visible:ring-[3px] focus-visible:ring-ring/32',
    'disabled:pointer-events-none disabled:opacity-64',
    'data-disabled:pointer-events-none data-disabled:opacity-64',
    'aria-disabled:pointer-events-none aria-disabled:opacity-64',
    'data-[state=loading]:pointer-events-none',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/24',
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    'motion-reduce:transition-none!',
  ],
  variants: {
    variant: {
      default:
        'border border-transparent bg-primary text-primary-foreground shadow-primary/24 shadow-sm hover:bg-primary/90 focus-visible:border-background',
      outline:
        'border border-input bg-transparent text-foreground shadow-sm/5 hover:bg-accent hover:text-accent-foreground dark:bg-input/32 dark:hover:bg-input/64 focus-visible:border-primary',
      destructive:
        'border border-transparent bg-destructive text-white shadow-destructive/24 shadow-sm hover:bg-destructive/90 focus-visible:border-background focus-visible:ring-destructive-foreground/32',
      secondary:
        'border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:border-primary',
      ghost:
        'border border-transparent hover:bg-accent hover:text-accent-foreground focus-visible:border-primary',
      link: 'border border-transparent text-primary underline-offset-4 hover:underline focus-visible:border-primary',
    },
    size: {
      xs: "h-6 gap-1.5 rounded-sm px-2 text-xs [&_svg:not([class*='size-'])]:size-2.5",
      sm: "h-7 gap-1.5 px-2.5 [&_svg:not([class*='size-'])]:size-3.5",
      md: 'h-8 px-3 py-2',
      lg: 'h-9 px-3.5',
      xl: 'h-10 px-4 text-base',
      'icon-xs': 'size-6 rounded-sm',
      'icon-sm': 'size-7',
      'icon-md': 'size-8',
      'icon-lg': 'size-9',
      'icon-xl': "size-10 [&_svg:not([class*='size-'])]:size-5",
    },
    clickEffect: { true: 'active:not-aria-[haspopup]:scale-[0.98]' },
    pill: { true: 'rounded-full' },
  },
  defaultVariants: { variant: 'default', size: 'md', clickEffect: true, pill: false },
});

export interface SharkButtonProps
  extends React.ComponentProps<typeof ark.button>,
    VariantProps<typeof sharkButtonVariants> {
  clickEffect?: boolean;
  isLoading?: boolean;
}

export const SharkButton = (props: SharkButtonProps) => {
  const {
    variant = 'default',
    size = 'md',
    clickEffect = true,
    pill = false,
    isLoading = false,
    className,
    children,
    ...rest
  } = props;

  return (
    <ark.button
      aria-busy={isLoading}
      aria-disabled={isLoading}
      className={cn(sharkButtonVariants({ variant, size, clickEffect, pill }), className)}
      data-size={size}
      data-slot="shark-button"
      data-state={isLoading ? 'loading' : 'idle'}
      data-variant={variant}
      type="button"
      {...rest}
    >
      {isLoading ? (
        <>
          <span aria-hidden className="invisible">
            {children}
          </span>
          <span className="sr-only">{children}</span>
          <span className="absolute inset-0 flex items-center justify-center">
            <SharkSpinner aria-hidden />
          </span>
        </>
      ) : (
        children
      )}
    </ark.button>
  );
};
