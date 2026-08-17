'use client';

import Link from 'next/link';
import { EllipsisVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { ExpirationNotificationPoliciesTableRow } from '@/components/expiration-notification-policies/types';

interface ExpirationNotificationPoliciesTableRowActionsProps {
  policy: ExpirationNotificationPoliciesTableRow;
  canUpdate: boolean;
  canDelete: boolean;
  onDelete: (policy: ExpirationNotificationPoliciesTableRow) => void;
  labels: {
    menu: string;
    view: string;
    edit: string;
    delete: string;
  };
}

export function ExpirationNotificationPoliciesTableRowActions({
  policy,
  canUpdate,
  canDelete,
  onDelete,
  labels,
}: ExpirationNotificationPoliciesTableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={labels.menu}
          className="text-muted-foreground hover:text-foreground"
        >
          <EllipsisVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[12rem]">
        <DropdownMenuItem asChild>
          <Link
            href={`/dashboard/expiration-notification-policies/${policy.expirationNotificationPolicyId}`}
          >
            {labels.view}
          </Link>
        </DropdownMenuItem>
        {canUpdate ? (
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/expiration-notification-policies/${policy.expirationNotificationPolicyId}/edit`}
            >
              {labels.edit}
            </Link>
          </DropdownMenuItem>
        ) : null}
        {canDelete ? (
          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
              onDelete(policy);
            }}
          >
            {labels.delete}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
