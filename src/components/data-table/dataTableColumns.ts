import { type ColumnDef, type RowData } from '@tanstack/react-table';

import { highlightText } from './dataTableHighlight';
import type { DataTableColumn, DataTableProps } from './DataTable.types';

export function getVisibleDataTableColumns<T extends RowData>(
  columns: DataTableColumn<T>[],
  settings: DataTableProps<T>['settings']
) {
  return settings?.columnVisibility
    ? columns.filter((column) => settings.columnVisibility?.visibleColumnIds.includes(column.id))
    : columns;
}

export function createDataTableColumns<T extends RowData>(
  columns: DataTableColumn<T>[],
  searchQuery: string | undefined,
  searchHighlightColumnIds: string[] | undefined
): ColumnDef<Record<string, never>, T>[] {
  return columns.map((column) => {
    const shouldHighlight =
      Boolean(searchQuery?.trim()) &&
      (!searchHighlightColumnIds || searchHighlightColumnIds.includes(column.id));
    const highlight = (value: string) =>
      shouldHighlight ? highlightText(value, searchQuery) : value;

    return {
      id: column.id,
      header: () => column.header,
      accessorFn: column.accessor,
      cell: ({ row }) =>
        column.cell?.(row.original, { highlight }) ??
        highlight(String(column.accessor(row.original) ?? '')),
    };
  });
}
