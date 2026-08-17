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

import type { ExpirationStatusPoliciesTableRow } from '@/components/expiration-status-policies/types';

interface ExpirationStatusPoliciesTableRowActionsProps {
  policy: ExpirationStatusPoliciesTableRow;
  canUpdate: boolean;
  canDelete: boolean;
  onDelete: (policy: ExpirationStatusPoliciesTableRow) => void;
  labels: {
    menu: string;
    view: string;
    edit: string;
    delete: string;
  };
}

export function ExpirationStatusPoliciesTableRowActions({
  policy,
  canUpdate,
  canDelete,
  onDelete,
  labels,
}: ExpirationStatusPoliciesTableRowActionsProps) {
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
          <Link href={`/dashboard/expiration-status-policies/${policy.expirationStatusPolicyId}`}>
            {labels.view}
          </Link>
        </DropdownMenuItem>
        {canUpdate ? (
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/expiration-status-policies/${policy.expirationStatusPolicyId}/edit`}
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
