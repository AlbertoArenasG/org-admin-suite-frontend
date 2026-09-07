import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import styles from './DashboardButton.module.css';

const dashboardButtonVariants = cva(styles.root, {
  variants: {
    variant: {
      default: styles.default,
      destructive: styles.destructive,
      outline: styles.outline,
      secondary: styles.secondary,
      ghost: styles.ghost,
      link: styles.link,
    },
    size: {
      default: styles.defaultSize,
      sm: styles.small,
      lg: styles.large,
      icon: styles.icon,
      'icon-sm': styles.iconSmall,
      'icon-lg': styles.iconLarge,
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

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
