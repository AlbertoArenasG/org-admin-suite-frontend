import * as React from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type ResourceFormMode = 'read' | 'edit';
export type ResourceFormStatus = 'idle' | 'loading' | 'saving' | 'error';

type ResourceFormFrameProps = Omit<React.ComponentProps<typeof Card>, 'title'> & {
  mode: ResourceFormMode;
  status?: ResourceFormStatus;
  title: React.ReactNode;
  description?: React.ReactNode;
  feedback?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

function ResourceFormFrame({
  actions,
  children,
  className,
  description,
  feedback,
  mode,
  status = 'idle',
  title,
  ...props
}: ResourceFormFrameProps) {
  const isBusy = status === 'loading' || status === 'saving';

  return (
    <Card
      aria-busy={isBusy || undefined}
      className={cn('gap-0 py-0', className)}
      data-mode={mode}
      data-slot="resource-form-frame"
      data-status={status}
      {...props}
    >
      <CardHeader className="gap-1 border-b px-6 py-5">
        <h2 className="leading-none font-semibold">{title}</h2>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-4 px-6 py-5">
        {feedback ? <div data-slot="resource-form-feedback">{feedback}</div> : null}
        {children}
      </CardContent>
      {actions ? <CardFooter className="border-t px-6 py-4">{actions}</CardFooter> : null}
    </Card>
  );
}

export { ResourceFormFrame };
export type { ResourceFormFrameProps };
