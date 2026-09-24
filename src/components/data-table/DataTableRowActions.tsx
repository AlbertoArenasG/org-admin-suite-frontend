import { MoreVertical } from 'lucide-react';
import type { RowData } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { DataTableLabels, DataTableRowAction } from './DataTable.types';

type DataTableRowActionsProps<T extends RowData> = {
  row: T;
  actions: DataTableRowAction<T>[];
  labels: DataTableLabels;
};

export function DataTableRowActions<T extends RowData>({
  row,
  actions,
  labels,
}: DataTableRowActionsProps<T>) {
  if (!actions.length) return null;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={labels.rowActions}
              className="cursor-pointer"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">{labels.rowActions}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.id}
            variant={action.variant}
            onSelect={() => action.onSelect(row)}
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
