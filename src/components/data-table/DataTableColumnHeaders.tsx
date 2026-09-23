import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { flexRender, type ReactTable } from '@tanstack/react-table';
import type { RowData, TableFeatures } from '@tanstack/table-core';

import type { DataTableColumn, DataTableLabels, DataTableProps } from './DataTable.types';

type DataTableColumnHeadersProps<T extends RowData, TFeatures extends TableFeatures> = {
  table: ReactTable<TFeatures, T>;
  visibleColumns: DataTableColumn<T>[];
  selection?: DataTableProps<T>['selection'];
  hasDetails: boolean;
  getRowActions?: DataTableProps<T>['getRowActions'];
  sorting?: DataTableProps<T>['sorting'];
  labels: DataTableLabels;
  columnWidths: Record<string, number>;
  onColumnWidthChange: (column: DataTableColumn<T>, width: number) => void;
  className: string;
};

export function DataTableColumnHeaders<T extends RowData, TFeatures extends TableFeatures>({
  table,
  visibleColumns,
  selection,
  hasDetails,
  getRowActions,
  sorting,
  labels,
  columnWidths,
  onColumnWidthChange,
  className,
}: DataTableColumnHeadersProps<T, TFeatures>) {
  const selectableRows = table
    .getRowModel()
    .rows.filter((row) => selection?.isRowSelectable?.(row.original) ?? true);
  const allSelected =
    selectableRows.length > 0 &&
    selectableRows.every((row) => selection?.selectedRowIds.includes(row.id));

  return (
    <thead className={className}>
      <tr>
        {selection ? (
          <th className="border-b px-3 py-3">
            <input
              aria-label={labels.selectAllRows}
              type="checkbox"
              checked={allSelected}
              onChange={(event) =>
                selection.onChange(event.target.checked ? selectableRows.map((row) => row.id) : [])
              }
            />
          </th>
        ) : null}
        {hasDetails ? <th className="border-b" /> : null}
        {table
          .getHeaderGroups()
          .flatMap((group) => group.headers)
          .map((header) => {
            const column = visibleColumns.find((item) => item.id === header.column.id);
            if (!column) return null;
            const direction = sorting?.columnId === column.id ? sorting.direction : undefined;
            const SortIcon =
              direction === 'asc' ? ArrowUp : direction === 'desc' ? ArrowDown : ArrowUpDown;
            const width =
              columnWidths[column.id] ?? column.width?.initial ?? column.width?.min ?? 80;
            return (
              <th
                key={header.id}
                scope="col"
                aria-sort={
                  direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'
                }
                className={`relative border-b px-4 py-3 font-medium ${column.align === 'end' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}
              >
                {column.sorting?.enabled ? (
                  <button
                    type="button"
                    onClick={() => {
                      const next =
                        direction === 'asc'
                          ? { columnId: column.id, direction: 'desc' as const }
                          : direction === 'desc'
                            ? null
                            : { columnId: column.id, direction: 'asc' as const };
                      sorting?.onChange(next);
                    }}
                    className="inline-flex items-center gap-1"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <SortIcon
                      className={`size-3.5 ${direction ? 'text-foreground' : 'text-muted-foreground'}`}
                    />
                  </button>
                ) : (
                  flexRender(header.column.columnDef.header, header.getContext())
                )}
                {column.width?.resizable && column.width.min && column.width.max ? (
                  <span
                    role="separator"
                    aria-label={labels.resizeColumn(column.ariaLabel ?? column.id)}
                    aria-orientation="vertical"
                    aria-valuemin={column.width.min}
                    aria-valuemax={column.width.max}
                    aria-valuenow={width}
                    tabIndex={0}
                    className="absolute right-0 top-1/2 h-6 w-3 -translate-y-1/2 cursor-col-resize touch-none border-r border-transparent focus:border-primary focus:outline-none"
                    onPointerDown={(event) => {
                      const startX = event.clientX;
                      const target = event.currentTarget;
                      target.setPointerCapture(event.pointerId);
                      const move = (moveEvent: PointerEvent) =>
                        onColumnWidthChange(column, width + moveEvent.clientX - startX);
                      const end = () => {
                        window.removeEventListener('pointermove', move);
                        window.removeEventListener('pointerup', end);
                      };
                      window.addEventListener('pointermove', move);
                      window.addEventListener('pointerup', end);
                    }}
                    onKeyDown={(event) => {
                      const step = event.shiftKey ? 48 : 16;
                      if (event.key === 'ArrowLeft') {
                        event.preventDefault();
                        onColumnWidthChange(column, width - step);
                      } else if (event.key === 'ArrowRight') {
                        event.preventDefault();
                        onColumnWidthChange(column, width + step);
                      } else if (event.key === 'Home') {
                        event.preventDefault();
                        onColumnWidthChange(column, column.width?.min ?? 80);
                      } else if (event.key === 'End') {
                        event.preventDefault();
                        onColumnWidthChange(column, column.width?.max ?? 960);
                      }
                    }}
                  />
                ) : null}
              </th>
            );
          })}
        {getRowActions ? <th className="border-b" /> : null}
      </tr>
    </thead>
  );
}
