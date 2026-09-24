import type { RowData } from '@tanstack/react-table';

import type { DataTableColumn, DataTableProps } from './DataTable.types';

type DataTableLoadingRowsProps<T extends RowData> = {
  visibleColumns: DataTableColumn<T>[];
  selection?: DataTableProps<T>['selection'];
  hasDetails: boolean;
  rowActions?: DataTableProps<T>['rowActions'];
  renderLoading?: DataTableProps<T>['renderLoading'];
};

export function DataTableLoadingRows<T extends RowData>({
  visibleColumns,
  selection,
  hasDetails,
  rowActions,
  renderLoading,
}: DataTableLoadingRowsProps<T>) {
  return Array.from({ length: 5 }).map((_, index) => (
    <tr key={index}>
      {selection ? <td /> : null}
      {hasDetails ? <td /> : null}
      {visibleColumns.map((column) => (
        <td key={column.id} className="border-b px-4 py-4">
          {renderLoading?.(column.id, index) ?? (
            <div className="h-4 animate-pulse rounded bg-muted" />
          )}
        </td>
      ))}
      {rowActions ? <td /> : null}
    </tr>
  ));
}
