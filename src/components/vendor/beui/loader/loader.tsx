'use client';

// Adapted from https://beui.dev/components/motion/loader (MIT).

import { motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';

export type BeuiLoaderVariant = 'bars' | 'dot-matrix' | 'dither';

export type BeuiLoaderProps = {
  className?: string;
  label: string;
  size?: number;
  speed?: number;
  variant?: BeuiLoaderVariant;
};

const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
const BAYER_4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/** Isolated BeUI motion loader with the product-approved variants only. */
export function BeuiLoader({
  className,
  label,
  size = 32,
  speed = 1,
  variant = 'dither',
}: BeuiLoaderProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <span
      aria-label={label}
      className={cn('inline-flex items-center justify-center', className)}
      role="status"
    >
      {variant === 'bars' ? <Bars reduce={reduce} size={size} speed={speed} /> : null}
      {variant === 'dot-matrix' ? <DotMatrix reduce={reduce} size={size} speed={speed} /> : null}
      {variant === 'dither' ? <Dither reduce={reduce} size={size} speed={speed} /> : null}
      <span className="sr-only">{label}</span>
    </span>
  );
}

type LoaderPartProps = {
  reduce: boolean;
  size: number;
  speed: number;
};

function Bars({ reduce, size, speed }: LoaderPartProps) {
  const bar = size * 0.16;

  return (
    <span className="flex items-center" style={{ gap: size * 0.1, height: size }}>
      {[0, 1, 2, 3].map((index) => (
        <motion.span
          animate={reduce ? { opacity: [0.4, 1, 0.4] } : { scaleY: [0.3, 1, 0.3] }}
          className="rounded-full bg-current"
          key={index}
          style={{ height: size, originY: 1, width: bar }}
          transition={{
            delay: index * speed * 0.12,
            duration: speed,
            ease: EASE_IN_OUT,
            repeat: Infinity,
          }}
        />
      ))}
    </span>
  );
}

function DotMatrix({ reduce, size, speed }: LoaderPartProps) {
  const cells = Array.from({ length: 9 }, (_, index) => index);
  const gap = size * 0.14;
  const dot = (size - gap * 2) / 3;

  return (
    <span className="grid" style={{ gap, gridTemplateColumns: `repeat(3, ${dot}px)` }}>
      {cells.map((index) => {
        const x = index % 3;
        const y = Math.floor(index / 3);
        const delay = ((x + y) / 4) * speed;

        return (
          <motion.span
            animate={
              reduce ? { opacity: [0.3, 1, 0.3] } : { opacity: [0.2, 1, 0.2], scale: [0.7, 1, 0.7] }
            }
            className="rounded-full bg-current"
            key={index}
            style={{ height: dot, width: dot }}
            transition={{ delay, duration: speed, ease: EASE_IN_OUT, repeat: Infinity }}
          />
        );
      })}
    </span>
  );
}

function Dither({ reduce, size, speed }: LoaderPartProps) {
  const gap = Math.max(1, size * 0.05);
  const cell = (size - gap * 3) / 4;

  return (
    <span className="grid" style={{ gap, gridTemplateColumns: `repeat(4, ${cell}px)` }}>
      {BAYER_4.map((order, index) => (
        <motion.span
          animate={reduce ? { opacity: [0.3, 1, 0.3] } : { opacity: [0.1, 1, 0.1] }}
          className="bg-current"
          key={index}
          style={{ height: cell, width: cell }}
          transition={{
            delay: (order / BAYER_4.length) * speed,
            duration: speed,
            ease: EASE_IN_OUT,
            repeat: Infinity,
          }}
        />
      ))}
    </span>
  );
}
