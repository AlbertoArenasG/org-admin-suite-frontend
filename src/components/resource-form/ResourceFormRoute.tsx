import * as React from 'react';

import { cn } from '@/lib/utils';

type ResourceFormRouteProps = React.ComponentProps<'div'> & {
  children: React.ReactNode;
};

function ResourceFormRoute({ children, className, ...props }: ResourceFormRouteProps) {
  return (
    <div
      className={cn('flex min-w-0 flex-col gap-6', className)}
      data-slot="resource-form-route"
      {...props}
    >
      {children}
    </div>
  );
}

export { ResourceFormRoute };
export type { ResourceFormRouteProps };
