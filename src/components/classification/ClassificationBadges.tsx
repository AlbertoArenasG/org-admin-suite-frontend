'use client';

import { Microscope, UserStar } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ClassificationBadgeLabels {
  group: string;
  internalStaff: string;
  administrator: string;
}

interface ClassificationBadgesProps {
  isInternalStaff: boolean;
  systemRole?: string | null;
  labels: ClassificationBadgeLabels;
  className?: string;
}

function ClassificationBadge({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          aria-label={label}
          className="inline-flex size-7 items-center justify-center rounded-md border border-border/70 bg-muted/60 text-foreground shadow-xs"
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={6}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function ClassificationBadges({
  isInternalStaff,
  systemRole,
  labels,
  className,
}: ClassificationBadgesProps) {
  const isAdministrator = systemRole === 'ADMIN';

  if (!isInternalStaff && !isAdministrator) {
    return null;
  }

  return (
    <span
      aria-label={labels.group}
      className={`inline-flex items-center gap-1.5 ${className ?? ''}`}
    >
      {isInternalStaff ? (
        <ClassificationBadge label={labels.internalStaff}>
          <Microscope className="size-4 text-primary" aria-hidden="true" />
        </ClassificationBadge>
      ) : null}
      {isAdministrator ? (
        <ClassificationBadge label={labels.administrator}>
          <UserStar className="size-4" aria-hidden="true" />
        </ClassificationBadge>
      ) : null}
    </span>
  );
}
