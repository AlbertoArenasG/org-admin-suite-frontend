import type { ReactElement } from 'react';
import type { RowData } from '@tanstack/react-table';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import type { DataTableRowAction } from './DataTable.types';

type DataTableRowContextMenuProps<T extends RowData> = {
  row: T;
  actions: DataTableRowAction<T>[];
  children: ReactElement;
};

export function DataTableRowContextMenu<T extends RowData>({
  row,
  actions,
  children,
}: DataTableRowContextMenuProps<T>) {
  if (!actions.length) return children;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        {actions.map((action) => (
          <ContextMenuItem
            key={action.id}
            variant={action.variant}
            onSelect={() => action.onSelect(row)}
          >
            {action.icon}
            {action.label}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}
