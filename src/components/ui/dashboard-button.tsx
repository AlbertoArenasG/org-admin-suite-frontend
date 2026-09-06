import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const dashboardButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent text-sm font-medium outline-none [transition-duration:var(--button-transition-duration)] [transition-property:color,background-color,border-color,box-shadow] [transition-timing-function:var(--button-transition-easing)] disabled:pointer-events-none disabled:opacity-[var(--button-disabled-opacity)] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:[box-shadow:0_0_0_var(--button-focus-outline-width)_var(--button-focus-outline-color)] aria-invalid:border-[var(--button-destructive-surface)]",
  {
    variants: {
      variant: {
        default:
          'bg-[var(--button-primary-surface)] text-[var(--button-primary-foreground)] hover:bg-[var(--button-primary-hover-surface)]',
        destructive:
          'bg-[var(--button-destructive-surface)] text-[var(--button-destructive-foreground)] hover:bg-[var(--button-destructive-hover-surface)]',
        outline:
          'border-[var(--button-outline-border)] bg-[var(--button-outline-surface)] text-[var(--button-outline-foreground)] shadow-xs hover:border-[var(--button-outline-hover-border)] hover:bg-[var(--button-outline-hover-surface)]',
        secondary:
          'border-[var(--button-secondary-border)] bg-[var(--button-secondary-surface)] text-[var(--button-secondary-foreground)] hover:border-[var(--button-secondary-hover-border)] hover:bg-[var(--button-secondary-hover-surface)]',
        ghost:
          'bg-[var(--button-ghost-surface)] text-[var(--button-ghost-foreground)] hover:bg-[var(--button-ghost-hover-surface)] hover:text-[var(--button-ghost-hover-foreground)]',
        link: 'text-[var(--button-link-foreground)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function DashboardButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof dashboardButtonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="dashboard-button"
      className={cn(dashboardButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { DashboardButton, dashboardButtonVariants };
