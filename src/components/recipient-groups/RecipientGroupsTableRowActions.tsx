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
import type { RecipientGroupsTableRow } from '@/components/recipient-groups/types';

interface RecipientGroupsTableRowActionsProps {
  recipientGroup: RecipientGroupsTableRow;
  canUpdate: boolean;
  canDelete: boolean;
  onDelete: (recipientGroup: RecipientGroupsTableRow) => void;
  labels: {
    menu: string;
    view: string;
    edit: string;
    delete: string;
  };
}

export function RecipientGroupsTableRowActions({
  recipientGroup,
  canUpdate,
  canDelete,
  onDelete,
  labels,
}: RecipientGroupsTableRowActionsProps) {
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
          <Link href={`/dashboard/recipient-groups/${recipientGroup.recipientGroupId}`}>
            {labels.view}
          </Link>
        </DropdownMenuItem>
        {canUpdate ? (
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/recipient-groups/${recipientGroup.recipientGroupId}/edit`}>
              {labels.edit}
            </Link>
          </DropdownMenuItem>
        ) : null}
        {canDelete ? (
          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
              onDelete(recipientGroup);
            }}
          >
            {labels.delete}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
