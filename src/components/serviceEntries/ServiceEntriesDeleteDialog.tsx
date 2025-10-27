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
import type { ServiceEntriesTableRow } from '@/components/serviceEntries/useServiceEntriesTableData';

interface ServiceEntriesDeleteDialogProps {
  open: boolean;
  entry: ServiceEntriesTableRow | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
  labels: {
    title: string;
    description: string;
    warning: string;
    cancel: string;
    confirm: string;
  };
}

export function ServiceEntriesDeleteDialog({
  open,
  entry,
  onOpenChange,
  onConfirm,
  isLoading,
  labels,
}: ServiceEntriesDeleteDialogProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{labels.title}</SheetTitle>
          <SheetDescription>{labels.description}</SheetDescription>
        </SheetHeader>
        <Alert variant="destructive" className="mt-2">
          <AlertTitle>{labels.warning}</AlertTitle>
          <AlertDescription>{entry?.companyName}</AlertDescription>
        </Alert>
        <SheetFooter className="mt-auto flex-col gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {labels.cancel}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {labels.confirm}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
