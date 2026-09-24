import type { ReactTable } from '@tanstack/react-table';
import type { RowData, TableFeatures } from '@tanstack/table-core';

import { DataTableEmptyState } from './DataTableEmptyState';
import { DataTableLoadingRows } from './DataTableLoadingRows';
import { DataTableRow } from './DataTableRow';
import type { DataTableColumn, DataTableLabels, DataTableProps } from './DataTable.types';

type DataTableBodyProps<T extends RowData, TFeatures extends TableFeatures> = {
  table: ReactTable<TFeatures, T>;
  visibleColumns: DataTableColumn<T>[];
  loading: boolean;
  renderLoading?: DataTableProps<T>['renderLoading'];
  selection?: DataTableProps<T>['selection'];
  hasDetails: boolean;
  expansion?: DataTableProps<T>['expansion'];
  renderDetail?: DataTableProps<T>['renderDetail'];
  getRowVisual?: DataTableProps<T>['getRowVisual'];
  rowActions?: DataTableProps<T>['rowActions'];
  totalColumnCount: number;
  hasActiveCriteria: boolean;
  renderEmpty?: DataTableProps<T>['renderEmpty'];
  onClearCriteria?: DataTableProps<T>['onClearCriteria'];
  labels: DataTableLabels;
  padding: string;
  onSelectionChange: (rowId: string, checked: boolean) => void;
  onExpansionChange: (rowId: string) => void;
};

export function DataTableBody<T extends RowData, TFeatures extends TableFeatures>({
  table,
  visibleColumns,
  loading,
  renderLoading,
  selection,
  hasDetails,
  expansion,
  renderDetail,
  getRowVisual,
  rowActions,
  totalColumnCount,
  hasActiveCriteria,
  renderEmpty,
  onClearCriteria,
  labels,
  padding,
  onSelectionChange,
  onExpansionChange,
}: DataTableBodyProps<T, TFeatures>) {
  const tableRows = table.getRowModel().rows;

  return (
    <tbody>
      {loading ? (
        <DataTableLoadingRows
          visibleColumns={visibleColumns}
          selection={selection}
          hasDetails={hasDetails}
          rowActions={rowActions}
          renderLoading={renderLoading}
        />
      ) : tableRows.length ? (
        tableRows.map((row) => (
          <DataTableRow
            key={row.id}
            row={row}
            visibleColumns={visibleColumns}
            selection={selection}
            hasDetails={hasDetails}
            expansion={expansion}
            renderDetail={renderDetail}
            getRowVisual={getRowVisual}
            rowActions={rowActions}
            totalColumnCount={totalColumnCount}
            labels={labels}
            padding={padding}
            onSelectionChange={onSelectionChange}
            onExpansionChange={onExpansionChange}
          />
        ))
      ) : (
        <DataTableEmptyState
          totalColumnCount={totalColumnCount}
          hasActiveCriteria={hasActiveCriteria}
          renderEmpty={renderEmpty}
          onClearCriteria={onClearCriteria}
          labels={labels}
        />
      )}
    </tbody>
  );
}
