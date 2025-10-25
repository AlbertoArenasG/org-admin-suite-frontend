'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

interface UsersTableActionsMenuProps {
  canEdit: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
  labels: {
    menu: string;
    edit: string;
    delete: string;
  };
}

export function UsersTableActionsMenu({
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  labels,
}: UsersTableActionsMenuProps) {
  const hasActions = canEdit || canDelete;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          aria-label={labels.menu}
          disabled={!hasActions}
        >
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      {hasActions ? (
        <DropdownMenuContent align="end" className="min-w-[10rem]">
          {canEdit ? (
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                onEdit();
              }}
            >
              <Pencil className="size-4" />
              {labels.edit}
            </DropdownMenuItem>
          ) : null}
          {canDelete ? (
            <DropdownMenuItem
              variant="destructive"
              onSelect={(event) => {
                event.preventDefault();
                onDelete();
              }}
            >
              <Trash2 className="size-4" />
              {labels.delete}
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      ) : null}
    </DropdownMenu>
  );
}
