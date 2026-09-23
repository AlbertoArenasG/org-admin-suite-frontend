import type { ReactTable } from '@tanstack/react-table';
import type { RowData, TableFeatures } from '@tanstack/table-core';

import { DataTableBody } from './DataTableBody';
import { DataTableColumnHeaders } from './DataTableColumnHeaders';
import type { DataTableColumn, DataTableLabels, DataTableProps } from './DataTable.types';

type DataTableContentProps<T extends RowData, TFeatures extends TableFeatures> = {
  table: ReactTable<TFeatures, T>;
  visibleColumns: DataTableColumn<T>[];
  columnWidths: Record<string, number>;
  selection?: DataTableProps<T>['selection'];
  hasDetails: boolean;
  getRowActions?: DataTableProps<T>['getRowActions'];
  sorting?: DataTableProps<T>['sorting'];
  labels: DataTableLabels;
  tableHeaderClassName: string;
  loading: boolean;
  renderLoading?: DataTableProps<T>['renderLoading'];
  expansion?: DataTableProps<T>['expansion'];
  renderDetail?: DataTableProps<T>['renderDetail'];
  getRowVisual?: DataTableProps<T>['getRowVisual'];
  totalColumnCount: number;
  hasActiveCriteria: boolean;
  renderEmpty?: DataTableProps<T>['renderEmpty'];
  onClearCriteria?: DataTableProps<T>['onClearCriteria'];
  padding: string;
  onColumnWidthChange: (column: DataTableColumn<T>, width: number) => void;
  onSelectionChange: (rowId: string, checked: boolean) => void;
  onExpansionChange: (rowId: string) => void;
};

export function DataTableContent<T extends RowData, TFeatures extends TableFeatures>({
  table,
  visibleColumns,
  columnWidths,
  selection,
  hasDetails,
  getRowActions,
  sorting,
  labels,
  tableHeaderClassName,
  loading,
  renderLoading,
  expansion,
  renderDetail,
  getRowVisual,
  totalColumnCount,
  hasActiveCriteria,
  renderEmpty,
  onClearCriteria,
  padding,
  onColumnWidthChange,
  onSelectionChange,
  onExpansionChange,
}: DataTableContentProps<T, TFeatures>) {
  return (
    <table className="w-full min-w-[44rem] table-fixed text-left text-sm">
      <colgroup>
        {selection ? <col className="w-12" /> : null}
        {hasDetails ? <col className="w-12" /> : null}
        {visibleColumns.map((column) => (
          <col
            key={column.id}
            style={{ width: columnWidths[column.id] ?? column.width?.initial }}
          />
        ))}
        {getRowActions ? <col className="w-14" /> : null}
      </colgroup>
      <DataTableColumnHeaders
        table={table}
        visibleColumns={visibleColumns}
        selection={selection}
        hasDetails={hasDetails}
        getRowActions={getRowActions}
        sorting={sorting}
        labels={labels}
        columnWidths={columnWidths}
        onColumnWidthChange={onColumnWidthChange}
        className={tableHeaderClassName}
      />
      <DataTableBody
        table={table}
        visibleColumns={visibleColumns}
        loading={loading}
        renderLoading={renderLoading}
        selection={selection}
        hasDetails={hasDetails}
        expansion={expansion}
        renderDetail={renderDetail}
        getRowVisual={getRowVisual}
        getRowActions={getRowActions}
        totalColumnCount={totalColumnCount}
        hasActiveCriteria={hasActiveCriteria}
        renderEmpty={renderEmpty}
        onClearCriteria={onClearCriteria}
        labels={labels}
        padding={padding}
        onSelectionChange={onSelectionChange}
        onExpansionChange={onExpansionChange}
      />
    </table>
  );
}
