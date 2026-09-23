import type { RowData } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { DataTableColumn, DataTableLabels, DataTableProps } from './DataTable.types';

type DataTableSettingsMenuProps<T extends RowData> = {
  settings: DataTableProps<T>['settings'];
  rowLayout: DataTableProps<T>['rowLayout'];
  columns: DataTableColumn<T>[];
  labels: DataTableLabels;
};

export function DataTableSettingsMenu<T extends RowData>({
  settings,
  rowLayout,
  columns,
  labels,
}: DataTableSettingsMenuProps<T>) {
  if (!settings?.density && !settings?.columnVisibility) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={labels.settings}
          title={labels.settings}
          className="inline-flex size-9 items-center justify-center rounded-md border"
        >
          <Settings2 className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{labels.settings}</DropdownMenuLabel>
        </DropdownMenuGroup>
        {settings.density && rowLayout === 'single-line' ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={settings.density.value}
              onValueChange={(value) =>
                settings.density?.onChange(value as 'compact' | 'comfortable')
              }
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {labels.density}
              </DropdownMenuLabel>
              <DropdownMenuRadioItem value="compact">{labels.compact}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="comfortable">
                {labels.comfortable}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </>
        ) : null}
        {settings.columnVisibility ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {labels.displayColumns}
              </DropdownMenuLabel>
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={settings.columnVisibility?.visibleColumnIds.includes(column.id)}
                  disabled={column.visibility?.hideable === false}
                  onCheckedChange={(checked) => {
                    const current = settings.columnVisibility?.visibleColumnIds ?? [];
                    settings.columnVisibility?.onChange(
                      checked ? [...current, column.id] : current.filter((id) => id !== column.id)
                    );
                  }}
                >
                  {column.ariaLabel ??
                    (typeof column.header === 'string' ? column.header : column.id)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
