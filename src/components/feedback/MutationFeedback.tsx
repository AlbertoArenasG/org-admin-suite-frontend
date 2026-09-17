'use client';

import { Check, LoaderCircle } from 'lucide-react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';

import { cn } from '@/lib/utils';

export type MutationFeedbackStatus = 'saving' | 'success';

export type MutationFeedback = {
  status: MutationFeedbackStatus;
  title: React.ReactNode;
};

type MutationFeedbackProps = MutationFeedback &
  Omit<HTMLMotionProps<'div'>, 'animate' | 'initial' | 'title' | 'transition'>;

const stateStyles = {
  saving: {
    icon: LoaderCircle,
    tone: 'var(--feedback-loading)',
  },
  success: {
    icon: Check,
    tone: 'var(--feedback-success)',
  },
} as const;

function MutationFeedback({ className, status, title, ...props }: MutationFeedbackProps) {
  const reduceMotion = useReducedMotion();
  const { icon: Icon, tone } = stateStyles[status];

  return (
    <motion.div
      animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
      aria-live="polite"
      className={cn('w-fit max-w-full', className)}
      data-slot="mutation-feedback"
      data-status={status}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.95, y: -6 }}
      role="status"
      transition={reduceMotion ? undefined : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      <div className="w-fit max-w-full overflow-hidden rounded-full bg-[var(--feedback-surface)]">
        <div className="flex h-10 items-center gap-2 pl-2 pr-4">
          <span
            className="flex size-6 shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor: `color-mix(in oklch, ${tone} 20%, transparent)`,
              color: tone,
            }}
          >
            <Icon
              aria-hidden="true"
              className={cn('size-4', status === 'saving' && 'animate-spin')}
            />
          </span>
          <motion.span
            animate={reduceMotion ? undefined : { filter: 'blur(0px)', opacity: 1 }}
            className="text-[0.825rem] leading-4 font-medium capitalize"
            initial={reduceMotion ? false : { filter: 'blur(6px)', opacity: 0 }}
            key={status}
            style={{ color: tone }}
            transition={reduceMotion ? undefined : { duration: 0.6, ease: 'easeOut' }}
          >
            {title}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

export { MutationFeedback };
export type { MutationFeedbackProps };
