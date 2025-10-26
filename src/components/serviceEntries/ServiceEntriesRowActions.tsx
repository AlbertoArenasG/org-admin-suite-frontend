'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Pencil, Trash } from 'lucide-react';

interface ServiceEntriesRowActionsProps {
  entryId: string;
  canManage: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  labels: {
    menu: string;
    view: string;
    edit: string;
    delete: string;
  };
}

export function ServiceEntriesRowActions({
  canManage,
  onView,
  onEdit,
  onDelete,
  labels,
}: ServiceEntriesRowActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full text-muted-foreground hover:text-foreground"
          aria-label={labels.menu}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={onView} className="gap-2">
          <Eye className="size-4" />
          {labels.view}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit} className="gap-2" disabled={!canManage}>
          <Pencil className="size-4" />
          {labels.edit}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="gap-2 text-destructive focus:text-destructive"
          disabled={!canManage}
        >
          <Trash className="size-4" />
          {labels.delete}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
