'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StepperStepStatus = 'pending' | 'completed' | 'error';

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  status?: StepperStepStatus;
}

export interface StepperNavigationContext {
  currentStep: StepperStep;
  currentIndex: number;
  targetStep: StepperStep;
  targetIndex: number;
}

export interface StepperProps {
  steps: readonly StepperStep[];
  value: string;
  onValueChange: (stepId: string, context: StepperNavigationContext) => void;
  canNavigateTo?: (context: StepperNavigationContext) => boolean;
  className?: string;
  ariaLabel?: string;
}

const STEP_STATES = {
  active: 'bg-primary',
  completed: 'bg-primary',
  error: 'bg-destructive',
  pending: 'bg-muted group-hover:bg-muted/80',
} as const;

const STEP_ICON_STATES = {
  active: 'text-primary-foreground',
  completed: 'text-primary-foreground',
  error: 'text-destructive-foreground',
  pending: 'text-muted-foreground',
} as const;

export function Stepper({
  steps,
  value,
  onValueChange,
  canNavigateTo,
  className,
  ariaLabel = 'Progreso del formulario',
}: StepperProps) {
  const prefersReducedMotion = useReducedMotion();
  const activeIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === value)
  );

  if (steps.length === 0) return null;

  const edgeOffset = 100 / (steps.length * 2);
  const progress = steps.length === 1 ? 0 : activeIndex / (steps.length - 1);
  const progressWidth = 100 - edgeOffset * 2;
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 120, damping: 20 };

  const createNavigationContext = (targetIndex: number): StepperNavigationContext => ({
    currentStep: steps[activeIndex],
    currentIndex: activeIndex,
    targetStep: steps[targetIndex],
    targetIndex,
  });

  const handleStepClick = (targetIndex: number) => {
    const targetStep = steps[targetIndex];
    const context = createNavigationContext(targetIndex);
    const isAllowed = canNavigateTo ? canNavigateTo(context) : targetIndex <= activeIndex;

    if (targetStep.disabled || !isAllowed || targetIndex === activeIndex) return;
    onValueChange(targetStep.id, context);
  };

  return (
    <nav aria-label={ariaLabel} className={cn('w-full overflow-x-auto py-3', className)}>
      <div
        className="relative min-w-max px-1"
        style={{ minWidth: `${Math.max(24, steps.length * 7)}rem` }}
      >
        {steps.length > 1 ? (
          <>
            <div
              aria-hidden="true"
              className="absolute top-5 h-0.5 bg-border"
              style={{ left: `${edgeOffset}%`, right: `${edgeOffset}%` }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute top-5 h-0.5 origin-left bg-primary"
              style={{ left: `${edgeOffset}%`, right: `${edgeOffset}%` }}
              initial={false}
              animate={{ scaleX: progress }}
              transition={transition}
            />
            <motion.span
              aria-hidden="true"
              className="absolute top-[1.06rem] size-2 rounded-full bg-primary"
              initial={false}
              animate={{ left: `${edgeOffset + progressWidth * progress}%` }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 160, damping: 24 }
              }
            />
          </>
        ) : null}

        <ol className="relative flex items-start justify-between">
          {steps.map((step, index) => {
            const isActive = index === activeIndex;
            const derivedStatus: StepperStepStatus = index < activeIndex ? 'completed' : 'pending';
            const status =
              step.status === 'error'
                ? 'error'
                : isActive
                  ? 'active'
                  : (step.status ?? derivedStatus);
            const Icon = step.icon;
            const context = createNavigationContext(index);
            const isAllowed = canNavigateTo ? canNavigateTo(context) : index <= activeIndex;
            const isInteractive = !step.disabled && isAllowed && !isActive;

            return (
              <li
                key={step.id}
                className="flex min-w-28 flex-1 flex-col items-center gap-2 px-1 text-center"
              >
                <button
                  type="button"
                  onClick={() => handleStepClick(index)}
                  aria-current={isActive ? 'step' : undefined}
                  aria-disabled={!isInteractive && !isActive ? true : undefined}
                  disabled={step.disabled || !isAllowed}
                  className={cn(
                    'group relative z-10 flex size-10 items-center justify-center rounded-full transition-colors duration-300',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isInteractive ? 'cursor-pointer' : 'cursor-default'
                  )}
                >
                  <span
                    className={cn(
                      'absolute inset-0 rounded-full transition-colors duration-300',
                      STEP_STATES[status]
                    )}
                  />
                  {isActive && !prefersReducedMotion ? (
                    <motion.span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-0 rounded-full ring-2',
                        status === 'error' ? 'ring-destructive/50' : 'ring-primary/50'
                      )}
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: [1, 1.45, 1], opacity: [1, 0.2, 1] }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                      }}
                    />
                  ) : null}
                  <motion.span
                    className={cn(
                      'relative flex items-center justify-center',
                      STEP_ICON_STATES[status]
                    )}
                    animate={{ scale: isActive ? 1.1 : 1 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 320, damping: 18 }
                    }
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {status === 'completed' ? (
                        <motion.span
                          key="completed"
                          initial={{ scale: 0, rotate: -90, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          exit={{ scale: 0, rotate: 90, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                        >
                          <Check className="size-5" strokeWidth={3} />
                        </motion.span>
                      ) : Icon ? (
                        <motion.span
                          key="icon"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                        >
                          <Icon className="size-5" />
                        </motion.span>
                      ) : (
                        <span className="text-sm font-semibold">{index + 1}</span>
                      )}
                    </AnimatePresence>
                  </motion.span>
                </button>
                <span
                  className={cn(
                    'text-xs font-medium transition-colors duration-300',
                    status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                  )}
                >
                  {step.label}
                </span>
                {step.description ? <span className="sr-only">{step.description}</span> : null}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
