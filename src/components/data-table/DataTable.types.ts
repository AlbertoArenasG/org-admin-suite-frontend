import type { ReactNode } from 'react';
import type { RowData } from '@tanstack/react-table';

export type DataTableColumn<T extends RowData> = {
  id: string;
  header: ReactNode;
  ariaLabel?: string;
  accessor: (row: T) => unknown;
  cell?: (row: T, context: { highlight: (value: string) => ReactNode }) => ReactNode;
  sorting?: { enabled: boolean; apiField: string };
  width?: { initial?: number; min?: number; max?: number; resizable?: boolean };
  align?: 'start' | 'center' | 'end';
  textBehavior?: 'nowrap' | 'wrap' | 'truncate';
  visibility?: { hideable?: boolean };
};

export type DataTableToolbar = {
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    ariaLabel?: string;
  };
  filters?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  primaryActions?: ReactNode;
  compact?: boolean;
};

export type DataTableHeader = {
  title?: ReactNode;
  actions?: ReactNode;
};

export type DataTableRowAction<T extends RowData> = {
  id: string;
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'destructive';
  isPrimary?: boolean;
  onSelect: (row: T) => void;
};

export type DataTableRowActions<T extends RowData> = {
  getActions: (row: T) => DataTableRowAction<T>[];
};

export type DataTableLabels = {
  loading: string;
  loadingResults: string;
  settings: string;
  density: string;
  compact: string;
  comfortable: string;
  displayColumns: string;
  resizeColumn: (column: string) => string;
  selectAllRows: string;
  selectRow: (rowId: string) => string;
  additionalDetails: string;
  noResults: string;
  noResultsForCriteria: string;
  clearCriteria: string;
  pagination: string;
  rowsPerPage: string;
  paginationSummary: (range: { from: number; to: number; total: number }) => string;
  previousPage: string;
  nextPage: string;
  clearSearch: string;
  rowActions: string;
};

export const defaultDataTableLabels: DataTableLabels = {
  loading: 'Loading',
  loadingResults: 'Loading table results',
  settings: 'Table settings',
  density: 'Density',
  compact: 'Compact',
  comfortable: 'Comfortable',
  displayColumns: 'Display columns',
  resizeColumn: (column) => `Resize ${column} column`,
  selectAllRows: 'Select all rows',
  selectRow: (rowId) => `Select row ${rowId}`,
  additionalDetails: 'Show additional details',
  noResults: 'No results.',
  noResultsForCriteria: 'No results match the active criteria.',
  clearCriteria: 'Clear criteria',
  pagination: 'Table pagination',
  rowsPerPage: 'Rows per page',
  paginationSummary: ({ from, to, total }) => `Showing ${from}-${to} of ${total}`,
  previousPage: 'Previous page',
  nextPage: 'Next page',
  clearSearch: 'Clear search',
  rowActions: 'Row actions',
};

export type DataTableProps<T extends RowData> = {
  rows: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  loading?: boolean;
  loadingContent?: ReactNode;
  renderLoading?: (columnId: string, rowIndex: number) => ReactNode;
  error?: { message: string; onRetry?: () => void };
  hasActiveCriteria?: boolean;
  renderEmpty?: (context: { filtered: boolean; onClearCriteria?: () => void }) => ReactNode;
  onClearCriteria?: () => void;
  toolbar?: DataTableToolbar;
  header?: DataTableHeader;
  settings?: {
    density?: {
      value: 'compact' | 'comfortable';
      onChange: (value: 'compact' | 'comfortable') => void;
    };
    columnVisibility?: { visibleColumnIds: string[]; onChange: (columnIds: string[]) => void };
  };
  settingsPlacement?: 'header' | 'toolbar';
  rowLayout?: 'single-line' | 'multiline';
  density?: 'compact' | 'comfortable';
  scrollRegion?: {
    maxHeight?: number | 'available';
    desktopOnly?: boolean;
    overscrollBehavior?: 'contain' | 'none';
  };
  stickyHeader?: { offset?: number; desktopOnly?: boolean } | boolean;
  sorting?: {
    columnId?: string;
    direction?: 'asc' | 'desc';
    onChange: (next: { columnId: string; direction: 'asc' | 'desc' } | null) => void;
  };
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    onChange: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
    pageSizes?: number[];
  };
  selection?: {
    selectedRowIds: string[];
    onChange: (ids: string[]) => void;
    isRowSelectable?: (row: T) => boolean;
    bulkActions?: ReactNode;
  };
  renderDetail?: (row: T) => ReactNode;
  expansion?: {
    expandedRowIds: string[];
    onChange: (ids: string[]) => void;
    isRowExpandable?: (row: T) => boolean;
    trigger?: 'chevron' | 'information' | 'feedback';
    ariaLabel?: string;
  };
  getRowVisual?: (
    row: T
  ) => { indicatorClassName?: string; indicatorColor?: string; className?: string } | undefined;
  searchHighlight?: { query: string; columnIds?: string[] };
  rowActions?: DataTableRowActions<T>;
  fullscreen?: { enterLabel: string; exitLabel: string; onChange?: (active: boolean) => void };
  labels?: Partial<DataTableLabels>;
};
