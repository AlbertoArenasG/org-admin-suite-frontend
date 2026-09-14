'use client';

import { Drawer as ArkDrawer, DrawerContext, useDrawerContext } from '@ark-ui/react/drawer';
import { ark } from '@ark-ui/react/factory';
import { Portal } from '@ark-ui/react/portal';
import { XIcon } from 'lucide-react';
import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { cn } from '@/lib/utils';
import { SharkScrollArea } from './scroll-area';

export const useSharkDrawer = useDrawerContext;

const DrawerModalContext = React.createContext<{ modal: boolean }>({ modal: true });

export const SharkDrawerProvider = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ArkDrawer.Indent>) => (
  <ArkDrawer.Stack>
    <ArkDrawer.IndentBackground
      className="fixed inset-0 z-50 bg-background opacity-0 pointer-events-none transition-opacity duration-300 ease-in data-[state=open]:opacity-[calc(0.1*(1-var(--drawer-swipe-progress,0)))] motion-reduce:transition-none!"
      data-slot="shark-drawer-indent-background"
    />
    <ArkDrawer.Indent
      className={cn(
        'transition-[border-radius,transform] duration-300 ease-in-out will-change-transform data-active:rounded-[calc(1rem*(1-var(--drawer-swipe-progress,0)))]',
        'data-active:transform-[scale(calc(0.98+(0.02*var(--drawer-swipe-progress))))_translateY(calc(0.5rem*(1-var(--drawer-swipe-progress))))] motion-reduce:transition-none!',
        className
      )}
      data-slot="shark-drawer-indent"
      {...props}
    >
      {children}
    </ArkDrawer.Indent>
  </ArkDrawer.Stack>
);

export const SharkDrawer = ({
  modal = true,
  lazyMount = true,
  unmountOnExit = true,
  ...props
}: React.ComponentProps<typeof ArkDrawer.Root>) => (
  <DrawerModalContext.Provider value={{ modal }}>
    <ArkDrawer.Root
      data-slot="shark-drawer"
      lazyMount={lazyMount}
      modal={modal}
      unmountOnExit={unmountOnExit}
      {...props}
    />
  </DrawerModalContext.Provider>
);

export const SharkDrawerTrigger = (props: React.ComponentProps<typeof ArkDrawer.Trigger>) => (
  <ArkDrawer.Trigger data-slot="shark-drawer-trigger" {...props} />
);
export const SharkDrawerClose = (props: React.ComponentProps<typeof ArkDrawer.CloseTrigger>) => (
  <ArkDrawer.CloseTrigger data-slot="shark-drawer-close" {...props} />
);

const drawerPositionerVariants = tv({
  base: [
    'fixed inset-0 z-50 flex w-screen items-end justify-center overflow-hidden',
    'data-[swipe-direction=left]:items-stretch data-[swipe-direction=left]:justify-start',
    'data-[swipe-direction=right]:items-stretch data-[swipe-direction=right]:justify-end',
  ],
  variants: {
    variant: {
      default: '',
      inset: [
        'px-0 sm:px-4',
        'data-[swipe-direction=down]:pb-0 sm:data-[swipe-direction=down]:pb-4',
        'data-[swipe-direction=left]:py-0 sm:data-[swipe-direction=left]:py-4',
        'data-[swipe-direction=right]:py-0 sm:data-[swipe-direction=right]:py-4',
      ],
    },
  },
  defaultVariants: { variant: 'default' },
});

interface SharkDrawerPositionerProps
  extends React.ComponentProps<typeof ArkDrawer.Positioner>,
    VariantProps<typeof drawerPositionerVariants> {}

export const SharkDrawerPositioner = ({
  variant = 'default',
  className,
  ...props
}: SharkDrawerPositionerProps) => (
  <ArkDrawer.Positioner
    className={cn(drawerPositionerVariants({ variant }), className)}
    data-slot="shark-drawer-positioner"
    {...props}
  />
);

const drawerContentVariants = tv({
  base: [
    'group/shark-drawer relative z-[calc(50+var(--layer-index,0))] flex min-h-0 w-full flex-col bg-popover text-popover-foreground shadow-lg/5 outline-none',
    'touch-none data-swiping:select-none data-swiping:transition-none data-dragging:transition-none',
    'transition-[transform,scale,opacity] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none!',
    'data-[swipe-direction=down]:max-h-[96svh] data-[swipe-direction=down]:rounded-t-2xl',
    'data-[swipe-direction=down]:data-[state=open]:animate-drawer-slide-in-bottom data-[swipe-direction=down]:data-[state=closed]:animate-drawer-slide-out-bottom',
    'data-[swipe-direction=left]:h-full data-[swipe-direction=left]:max-h-none data-[swipe-direction=left]:max-w-md data-[swipe-direction=left]:rounded-e-2xl',
    'data-[swipe-direction=left]:data-[state=open]:animate-drawer-slide-in-left data-[swipe-direction=left]:data-[state=closed]:animate-drawer-slide-out-left',
    'data-[swipe-direction=right]:h-full data-[swipe-direction=right]:max-h-none data-[swipe-direction=right]:max-w-md data-[swipe-direction=right]:rounded-s-2xl',
    'data-[swipe-direction=right]:data-[state=open]:animate-drawer-slide-in-right data-[swipe-direction=right]:data-[state=closed]:animate-drawer-slide-out-right',
  ],
  variants: { variant: { default: '', inset: 'sm:rounded-2xl sm:border' } },
  defaultVariants: { variant: 'default' },
});

interface SharkDrawerContentProps
  extends React.ComponentProps<typeof ArkDrawer.Content>,
    VariantProps<typeof drawerContentVariants> {
  showBar?: boolean;
  showCloseButton?: boolean;
}

export const SharkDrawerContent = ({
  variant = 'default',
  showBar = true,
  showCloseButton = false,
  className,
  children,
  ...props
}: SharkDrawerContentProps) => {
  const { modal } = React.useContext(DrawerModalContext);

  return (
    <Portal>
      {modal && (
        <ArkDrawer.Backdrop
          className="fixed inset-0 z-50 bg-black/32 backdrop-blur-xs data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none!"
          data-slot="shark-drawer-backdrop"
        />
      )}
      <DrawerContext>
        {() => (
          <SharkDrawerPositioner variant={variant}>
            <ArkDrawer.Content
              className={cn(drawerContentVariants({ variant }), className)}
              data-slot="shark-drawer-content"
              {...props}
            >
              {showBar && <SharkDrawerGrabber />}
              {children}
              {showCloseButton && (
                <SharkDrawerClose
                  aria-label="Cerrar"
                  className="absolute right-4 top-4 inline-flex size-7 items-center justify-center rounded-lg border border-transparent opacity-64 transition hover:bg-accent hover:text-accent-foreground hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/32"
                >
                  <XIcon aria-hidden className="size-4" />
                </SharkDrawerClose>
              )}
            </ArkDrawer.Content>
          </SharkDrawerPositioner>
        )}
      </DrawerContext>
    </Portal>
  );
};

export const SharkDrawerGrabber = ({
  className,
  ...props
}: React.ComponentProps<typeof ArkDrawer.Grabber>) => (
  <ArkDrawer.Grabber
    className={cn(
      'flex w-full shrink-0 cursor-grab touch-none select-none items-center justify-center py-5 active:cursor-grabbing sm:hidden',
      className
    )}
    data-slot="shark-drawer-grabber"
    {...props}
  >
    <ArkDrawer.GrabberIndicator
      className="h-1 w-10 rounded-full bg-muted-foreground/32"
      data-slot="shark-drawer-grabber-indicator"
    />
  </ArkDrawer.Grabber>
);

interface SharkDrawerHeaderProps extends React.ComponentProps<typeof ark.div> {
  title?: string;
  description?: string;
}
export const SharkDrawerHeader = ({
  title,
  description,
  className,
  children,
  ...props
}: SharkDrawerHeaderProps) => (
  <ark.div
    className={cn('flex shrink-0 flex-col gap-2 p-6 text-center', className)}
    data-slot="shark-drawer-header"
    {...props}
  >
    {title && (
      <ArkDrawer.Title className="text-center font-semibold text-lg leading-none">
        {title}
      </ArkDrawer.Title>
    )}
    {description && (
      <ArkDrawer.Description className="text-center text-muted-foreground text-sm">
        {description}
      </ArkDrawer.Description>
    )}
    {!title && typeof children === 'string' ? (
      <ArkDrawer.Title className="text-center font-semibold text-lg leading-none">
        {children}
      </ArkDrawer.Title>
    ) : (
      children
    )}
  </ark.div>
);

export const SharkDrawerBody = ({
  scrollFade = false,
  className,
  ...props
}: React.ComponentProps<typeof ark.div> & { scrollFade?: boolean }) => (
  <SharkScrollArea className="min-h-0 flex-1 touch-pan-y" scrollFade={scrollFade}>
    <ark.div
      className={cn('p-6 pt-0 text-center', className)}
      data-slot="shark-drawer-body"
      {...props}
    />
  </SharkScrollArea>
);

export const SharkDrawerFooter = ({
  className,
  ...props
}: React.ComponentProps<typeof ark.div>) => (
  <ark.div
    className={cn('flex shrink-0 flex-col-reverse gap-2 border-t bg-muted/48 px-6 py-4', className)}
    data-slot="shark-drawer-footer"
    {...props}
  />
);
