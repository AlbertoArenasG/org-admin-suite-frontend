'use client';

import { cn } from '@/lib/utils';
import styles from '@/components/ui/skeleton.module.css';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(styles.root, className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
