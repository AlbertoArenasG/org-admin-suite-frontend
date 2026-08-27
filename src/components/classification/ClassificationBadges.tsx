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

function ClassificationBadge({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          aria-label={label}
          className={`inline-flex size-7 items-center justify-center rounded-full border shadow-xs transition-transform duration-150 hover:scale-105 ${className}`}
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
        <ClassificationBadge
          label={labels.internalStaff}
          className="border-primary-200 bg-primary-50 text-primary-700"
        >
          <Microscope className="size-3.5" aria-hidden="true" />
        </ClassificationBadge>
      ) : null}
      {isAdministrator ? (
        <ClassificationBadge
          label={labels.administrator}
          className="border-[var(--privilege-200)] bg-[var(--privilege-50)] text-[var(--privilege-700)]"
        >
          <UserStar className="size-3.5" aria-hidden="true" />
        </ClassificationBadge>
      ) : null}
    </span>
  );
}
