'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { UsersTableUser } from '@/components/users2/types';

interface UsersDeleteDialogProps {
  open: boolean;
  user: UsersTableUser | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  labels: {
    title: string;
    description: string;
    warning: string;
    cancel: string;
    confirm: string;
  };
}

export function UsersDeleteDialog({
  open,
  user,
  onOpenChange,
  onConfirm,
  labels,
}: UsersDeleteDialogProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{labels.title}</SheetTitle>
          <SheetDescription>{labels.description}</SheetDescription>
        </SheetHeader>
        <Alert variant="destructive" className="mt-2">
          <AlertTitle>{labels.warning}</AlertTitle>
          <AlertDescription>{user?.email}</AlertDescription>
        </Alert>
        <SheetFooter className="mt-auto flex-col gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {labels.cancel}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {labels.confirm}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
