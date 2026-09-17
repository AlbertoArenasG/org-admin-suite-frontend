import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

export type MutationRecovery = {
  title: React.ReactNode;
  message?: React.ReactNode;
  guidance: React.ReactNode;
};

type MutationRecoveryProps = MutationRecovery & Omit<React.ComponentProps<'div'>, 'title'>;

function MutationRecovery({
  className,
  guidance,
  message,
  title,
  ...props
}: MutationRecoveryProps) {
  return (
    <div
      className={cn('min-w-0 max-w-md text-sm', className)}
      data-slot="mutation-recovery"
      role="alert"
      {...props}
    >
      <div className="flex items-start gap-2">
        <span
          className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full"
          style={{
            backgroundColor: 'color-mix(in oklch, var(--feedback-error) 20%, transparent)',
            color: 'var(--feedback-error)',
          }}
        >
          <X aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="font-medium text-[var(--feedback-error)]">{title}</p>
          {message ? (
            <p className="mt-0.5 max-h-20 overflow-y-auto pr-1 leading-5 text-foreground">
              {message}
            </p>
          ) : null}
          <p className="mt-0.5 leading-5 text-muted-foreground">{guidance}</p>
        </div>
      </div>
    </div>
  );
}

export { MutationRecovery };
export type { MutationRecoveryProps };
