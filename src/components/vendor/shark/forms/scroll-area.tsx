'use client';

import { ScrollArea as ArkScrollArea, useScrollAreaContext } from '@ark-ui/react/scroll-area';
import type React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/utils';

export const useSharkScrollArea = useScrollAreaContext;

const scrollAreaVariants = tv({
  base: ['h-full rounded-[inherit] outline-none scrollbar-none'],
  variants: {
    scrollFade: {
      true: [
        'mask-t-from-[calc(100%-var(--fade-size))] mask-b-from-[calc(100%-var(--fade-size))]',
        'data-at-top:mask-t-from-100% data-at-bottom:mask-b-from-100% transition-shadow',
        'motion-reduce:transition-none!',
      ],
    },
  },
  defaultVariants: { scrollFade: false },
});

interface SharkScrollAreaProps
  extends React.ComponentProps<typeof ArkScrollArea.Root>,
    VariantProps<typeof scrollAreaVariants> {}

export const SharkScrollArea = ({
  scrollFade = false,
  className,
  children,
  ...props
}: SharkScrollAreaProps) => (
  <ArkScrollArea.Root
    className={cn('size-full min-h-0 [--fade-size:1.5rem]', className)}
    data-slot="shark-scroll-area"
    {...props}
  >
    <ArkScrollArea.Viewport
      className={scrollAreaVariants({ scrollFade })}
      data-slot="shark-scroll-area-viewport"
    >
      <ArkScrollArea.Content data-slot="shark-scroll-area-content">
        {children}
      </ArkScrollArea.Content>
    </ArkScrollArea.Viewport>
    <SharkScrollAreaScrollbar orientation="vertical" />
    <SharkScrollAreaScrollbar orientation="horizontal" />
    <ArkScrollArea.Corner data-slot="shark-scroll-area-corner" />
  </ArkScrollArea.Root>
);

export const SharkScrollAreaScrollbar = ({
  orientation,
  className,
  ...props
}: React.ComponentProps<typeof ArkScrollArea.Scrollbar>) => (
  <ArkScrollArea.Scrollbar
    className={cn(
      'm-1 flex bg-transparent opacity-0 transition-opacity delay-300',
      'data-[orientation=vertical]:w-1.5 data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:flex-col',
      'data-hover:opacity-100 data-hover:delay-0 data-hover:duration-100 data-scrolling:opacity-100 data-scrolling:delay-0 data-scrolling:duration-100',
      'motion-reduce:transition-none!',
      className
    )}
    data-slot="shark-scroll-area-scrollbar"
    orientation={orientation}
    {...props}
  >
    <ArkScrollArea.Thumb
      className="relative flex-1 rounded-full bg-foreground/20"
      data-slot="shark-scroll-area-thumb"
    />
  </ArkScrollArea.Scrollbar>
);
