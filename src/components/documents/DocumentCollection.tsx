'use client';

import { ChevronDown, Folder, FolderOpen, Paperclip } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Transition } from 'motion/react';
import type { ReactNode } from 'react';

import { ResourceFormFrame, ResourceFormSection } from '@/components/resource-form';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type DocumentCollectionProps = {
  children: ReactNode;
  title: ReactNode;
};

type DocumentCollectionListProps = {
  children: ReactNode;
  className?: string;
};

type DocumentCollectionItemProps = {
  action?: ReactNode;
  attachmentsId: string;
  children?: ReactNode;
  expanded: boolean;
  hasFiles: boolean;
  fileSummary: ReactNode;
  onExpandedChange: (expanded: boolean) => void;
  referenceLabel?: ReactNode;
  referenceNumber?: ReactNode;
  title: ReactNode;
  closeLabel: string;
  openLabel: string;
};

/** A compact, reusable document inventory for resource detail views. */
function DocumentCollection({ children, title }: DocumentCollectionProps) {
  return (
    <ResourceFormFrame
      contentSurface={{ base: 'bare', md: 'inset' }}
      density={{ base: 'compact', md: 'comfortable' }}
      dividers="hidden"
      headerDensity="compact"
      mode="read"
      surface={{ base: 'bare', md: 'card' }}
      title={title}
    >
      <DocumentCollectionList>{children}</DocumentCollectionList>
    </ResourceFormFrame>
  );
}

/** The document-row host for use inside an existing ResourceFormFrame. */
function DocumentCollectionList({ children, className }: DocumentCollectionListProps) {
  return <div className={cn('@container divide-y divide-border/70', className)}>{children}</div>;
}

function DocumentCollectionItem({
  action,
  attachmentsId,
  children,
  expanded,
  hasFiles,
  fileSummary,
  onExpandedChange,
  referenceLabel,
  referenceNumber,
  title,
  closeLabel,
  openLabel,
}: DocumentCollectionItemProps) {
  const toggleLabel = expanded ? closeLabel : openLabel;
  const prefersReducedMotion = useReducedMotion();
  const contentTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <ResourceFormSection
      className={cn('transition-colors', expanded && 'bg-muted/20')}
      density="none"
      surface="bare"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-3 py-2.5 sm:px-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              aria-controls={attachmentsId}
              aria-expanded={expanded}
              className="group/document-row relative grid min-w-0 cursor-pointer grid-cols-1 gap-y-1 rounded-lg px-1.5 py-1.5 pr-10 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 @[42rem]:grid-cols-[minmax(0,1fr)_9rem_9rem] @[42rem]:gap-x-5"
              onClick={() => onExpandedChange(!expanded)}
              type="button"
            >
              <span className="flex min-w-0 items-center gap-3">
                <DocumentFolder expanded={expanded} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {title}
                  </span>
                </span>
              </span>
              <span className="flex min-w-0 items-center gap-2 px-1.5 text-xs text-muted-foreground @[42rem]:px-0">
                {referenceNumber ? (
                  <span className="flex min-w-0 items-center gap-1.5">
                    {referenceLabel ? <span>{referenceLabel}</span> : null}
                    <span className="truncate font-mono text-xs font-normal text-foreground">
                      {referenceNumber}
                    </span>
                  </span>
                ) : null}
              </span>
              <span className="flex min-w-0 items-center px-1.5 @[42rem]:px-0">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium',
                    hasFiles
                      ? 'border border-border/70 bg-muted/50 text-foreground'
                      : 'border border-dashed border-border/80 text-muted-foreground'
                  )}
                >
                  {hasFiles ? <Paperclip aria-hidden="true" className="size-3" /> : null}
                  {fileSummary}
                </span>
              </span>
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  'absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground transition-transform duration-200',
                  expanded && 'rotate-180'
                )}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>{toggleLabel}</TooltipContent>
        </Tooltip>
        {action ? <div className="flex items-center justify-end">{action}</div> : null}
      </div>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden border-t border-border/70"
            exit={{ height: 0, opacity: 0 }}
            id={attachmentsId}
            initial={{ height: 0, opacity: 0 }}
            transition={contentTransition}
          >
            <motion.div
              animate={{ y: 0 }}
              className="px-5 py-4 sm:px-7"
              initial={{ y: prefersReducedMotion ? 0 : -6 }}
              transition={contentTransition}
            >
              <div className="max-w-xl space-y-3">{children}</div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ResourceFormSection>
  );
}

function DocumentFolder({ expanded }: { expanded: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative grid size-12 shrink-0 place-items-center rounded-xl transition-colors',
        expanded ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
      )}
    >
      <Folder
        className={cn(
          'absolute size-6 transition-all duration-200 ease-out',
          expanded
            ? '-translate-y-1 -rotate-6 scale-90 opacity-0'
            : 'group-hover/document-row:-translate-y-0.5 group-hover/document-row:scale-105'
        )}
      />
      <FolderOpen
        className={cn(
          'absolute size-6 translate-y-1 -rotate-6 scale-90 opacity-0 transition-all duration-200 ease-out',
          expanded && 'translate-y-0 rotate-0 scale-100 opacity-100'
        )}
      />
    </span>
  );
}

export { DocumentCollection, DocumentCollectionItem, DocumentCollectionList };
export type { DocumentCollectionItemProps, DocumentCollectionListProps, DocumentCollectionProps };
