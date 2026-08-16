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
import type { ContactsTableRow } from '@/components/contacts/types';

interface ContactsTableRowActionsProps {
  contact: ContactsTableRow;
  canUpdate: boolean;
  canDelete: boolean;
  onDelete: (contact: ContactsTableRow) => void;
  labels: {
    menu: string;
    view: string;
    edit: string;
    delete: string;
  };
}

export function ContactsTableRowActions({
  contact,
  canUpdate,
  canDelete,
  onDelete,
  labels,
}: ContactsTableRowActionsProps) {
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
          <Link href={`/dashboard/contacts/${contact.contactId}`}>{labels.view}</Link>
        </DropdownMenuItem>
        {canUpdate ? (
          <DropdownMenuItem asChild disabled={!contact.canMutate}>
            <Link
              href={contact.canMutate ? `/dashboard/contacts/${contact.contactId}/edit` : '#'}
              aria-disabled={!contact.canMutate}
              onClick={(event) => {
                if (!contact.canMutate) {
                  event.preventDefault();
                }
              }}
            >
              {labels.edit}
            </Link>
          </DropdownMenuItem>
        ) : null}
        {canDelete ? (
          <DropdownMenuItem
            variant="destructive"
            disabled={!contact.canMutate}
            onSelect={(event) => {
              if (!contact.canMutate) {
                event.preventDefault();
                return;
              }
              event.preventDefault();
              onDelete(contact);
            }}
          >
            {labels.delete}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
