'use client';

import type { ReactNode } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type DestructiveConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  subject?: ReactNode;
  cancelLabel: string;
  confirmLabel: string;
  loadingLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
};

export function DestructiveConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  subject,
  cancelLabel,
  confirmLabel,
  loadingLabel,
  isPending = false,
  onConfirm,
}: DestructiveConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {subject ? (
          <Alert variant="destructive">
            <AlertDescription>{subject}</AlertDescription>
          </Alert>
        ) : null}
        <DialogFooter className="mt-6 gap-2 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            loading={isPending}
            loadingLabel={loadingLabel ?? confirmLabel}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
