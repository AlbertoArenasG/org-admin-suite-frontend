import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

type ProcessTimelineItemState = 'active' | 'completed' | 'pending';

type ProcessTimelineItem = {
  id: string;
  date: ReactNode;
  title: ReactNode;
  state: ProcessTimelineItemState;
  pulse?: boolean;
  status?: {
    label: ReactNode;
    color?: string;
  };
};

type ProcessTimelineProps = {
  ariaLabel: string;
  className?: string;
  items: readonly ProcessTimelineItem[];
};

function ProcessTimeline({ ariaLabel, className, items }: ProcessTimelineProps) {
  if (!items.length) return null;

  return (
    <ol aria-label={ariaLabel} className={cn('space-y-0', className)}>
      {items.map((item, index) => {
        const isPending = item.state === 'pending';
        const isCompleted = item.state === 'completed';
        const isActive = item.state === 'active';
        const shouldPulse = isActive && item.pulse && Boolean(item.status?.color);

        return (
          <li className="relative flex gap-2 pb-4 last:pb-0" key={item.id}>
            {index < items.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-[0.5625rem] top-[1.125rem] w-px bg-border"
              />
            ) : null}
            <span
              aria-hidden="true"
              className={cn(
                'relative z-10 mt-px flex size-[1.125rem] shrink-0 items-center justify-center rounded-full border-2',
                isCompleted && 'border-muted-foreground bg-muted-foreground text-background',
                isActive && 'border-muted-foreground/60 bg-background',
                isPending && 'border-muted-foreground/30 bg-background text-muted-foreground'
              )}
              style={shouldPulse ? { borderColor: item.status?.color } : undefined}
            >
              {isCompleted ? <Check className="size-2.5" strokeWidth={3} /> : null}
              {shouldPulse ? (
                <span
                  className="absolute -inset-0.5 rounded-full border animate-ping motion-reduce:animate-none"
                  style={{ borderColor: item.status?.color }}
                />
              ) : null}
            </span>
            <div className="min-w-0 text-xs leading-4">
              <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                <span className="text-[0.6875rem] font-normal italic text-muted-foreground">
                  {item.date}
                </span>
                <span className="font-medium text-foreground/85">{item.title}</span>
                {item.status ? (
                  <span
                    className="rounded border px-1.25 py-0.5 text-[0.5625rem] font-medium leading-none"
                    style={
                      item.status.color
                        ? { borderColor: item.status.color, color: item.status.color }
                        : undefined
                    }
                  >
                    {item.status.label}
                  </span>
                ) : null}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export { ProcessTimeline };
export type { ProcessTimelineItem, ProcessTimelineItemState, ProcessTimelineProps };
