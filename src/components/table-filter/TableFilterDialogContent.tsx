'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

type TableFilterDialogContentProps = DialogPrimitive.DialogContentProps & {
  showCloseButton?: boolean;
};

export function TableFilterDialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: TableFilterDialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition" />
      <DialogPrimitive.Content
        className={clsx(
          'fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col gap-0 overflow-hidden rounded-3xl border border-border/70 bg-card p-0 shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/60 sm:w-full',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
