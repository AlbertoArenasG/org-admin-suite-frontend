'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';

type DashboardContentRevealProps = Omit<
  HTMLMotionProps<'div'>,
  'animate' | 'initial' | 'transition'
>;

function DashboardContentReveal({ children, ...props }: DashboardContentRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      data-slot="dashboard-content-reveal"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      transition={reduceMotion ? undefined : { duration: 0.4, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { DashboardContentReveal };
export type { DashboardContentRevealProps };
