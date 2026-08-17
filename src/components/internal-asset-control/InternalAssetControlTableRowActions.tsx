'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { InternalAssetControlTableRow } from '@/components/internal-asset-control/types';

interface InternalAssetControlTableRowActionsProps {
  record: InternalAssetControlTableRow;
  canUpdate: boolean;
  canDelete: boolean;
  onDelete: (record: InternalAssetControlTableRow) => void;
  labels: {
    menu: string;
    view: string;
    edit: string;
    delete: string;
  };
}

export function InternalAssetControlTableRowActions({
  record,
  canUpdate,
  canDelete,
  onDelete,
  labels,
}: InternalAssetControlTableRowActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">{labels.menu}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link
            href={`/dashboard/internal-asset-control/${record.internalAssetMaintenanceRecordId}`}
          >
            {labels.view}
          </Link>
        </DropdownMenuItem>
        {canUpdate ? (
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/internal-asset-control/${record.internalAssetMaintenanceRecordId}/edit`}
            >
              {labels.edit}
            </Link>
          </DropdownMenuItem>
        ) : null}
        {canDelete ? (
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => {
              setOpen(false);
              onDelete(record);
            }}
          >
            {labels.delete}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
