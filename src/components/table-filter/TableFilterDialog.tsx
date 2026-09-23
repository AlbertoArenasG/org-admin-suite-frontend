'use client';

import { Filter, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import type { TableFilterDialogLabels, TableFilterRenderState } from './types';

interface TableFilterDialogProps<TValue> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: TValue;
  createDraft: (value: TValue) => TValue;
  createEmptyValue: () => TValue;
  isEqual: (left: TValue, right: TValue) => boolean;
  hasActiveCriteria: (value: TValue) => boolean;
  onApply: (value: TValue) => void;
  labels: TableFilterDialogLabels;
  children: (state: TableFilterRenderState<TValue>) => ReactNode;
  className?: string;
}

export function TableFilterDialog<TValue>({
  open,
  onOpenChange,
  value,
  createDraft,
  createEmptyValue,
  isEqual,
  hasActiveCriteria,
  onApply,
  labels,
  children,
  className,
}: TableFilterDialogProps<TValue>) {
  const [draft, setDraft] = useState(() => createDraft(value));
  const previousOpen = useRef(open);

  useEffect(() => {
    if (open && !previousOpen.current) {
      setDraft(createDraft(value));
    }

    previousOpen.current = open;
  }, [createDraft, open, value]);

  const isDirty = !isEqual(draft, value);
  const primaryLabel = hasActiveCriteria(draft) ? labels.apply : labels.showAll;

  const updateDraft = (updater: (current: TValue) => TValue) => setDraft(updater);

  const handleApply = () => {
    if (!isDirty) return;

    onApply(draft);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:w-full',
          className
        )}
      >
        <DialogHeader className="shrink-0 space-y-0 px-4 pb-3 pt-4 text-left sm:px-5 sm:pt-5">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Filter className="size-4" aria-hidden="true" />
            {labels.title}
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto px-4 pb-4 sm:px-5">
          {children({ draft, setDraft: updateDraft, isDirty })}
        </div>

        <DialogFooter className="shrink-0 border-t border-border/60 bg-card px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:space-x-0 sm:px-5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-2 self-start"
            onClick={() => setDraft(createEmptyValue())}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            {labels.clear}
          </Button>

          <div className="flex flex-row justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              {labels.cancel}
            </Button>
            <Button
              type="button"
              size="sm"
              className="gap-2 transition-[background-color,color,box-shadow] duration-200"
              disabled={!isDirty}
              aria-label={labels.applyAriaLabel ?? primaryLabel}
              onClick={handleApply}
            >
              {primaryLabel}
              <span aria-hidden="true">→</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
