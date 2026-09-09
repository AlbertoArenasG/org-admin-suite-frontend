'use client';

import * as React from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Expand,
  Info,
  RefreshCw,
  Search,
  Settings2,
  Shrink,
  SlidersHorizontal,
} from 'lucide-react';
import {
  flexRender,
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
} from '@tanstack/react-table';
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

export type DataTableColumn<T extends RowData> = {
  id: string;
  header: React.ReactNode;
  ariaLabel?: string;
  accessor: (row: T) => unknown;
  cell?: (row: T) => React.ReactNode;
  sorting?: { enabled: boolean; apiField: string };
  width?: { initial?: number; min?: number; max?: number; resizable?: boolean };
  align?: 'start' | 'center' | 'end';
  textBehavior?: 'nowrap' | 'wrap' | 'truncate';
  visibility?: { hideable?: boolean };
};

type TableToolbar = {
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    ariaLabel?: string;
  };
  filters?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

type TableHeader = {
  title?: React.ReactNode;
  actions?: React.ReactNode;
};

export type DataTableProps<T extends RowData> = {
  rows: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  loading?: boolean;
  loadingContent?: React.ReactNode;
  renderLoading?: (columnId: string, rowIndex: number) => React.ReactNode;
  error?: { message: string; onRetry?: () => void };
  hasActiveCriteria?: boolean;
  renderEmpty?: (context: { filtered: boolean; onClearCriteria?: () => void }) => React.ReactNode;
  onClearCriteria?: () => void;
  toolbar?: TableToolbar;
  header?: TableHeader;
  settings?: {
    density?: {
      value: 'compact' | 'comfortable';
      onChange: (value: 'compact' | 'comfortable') => void;
    };
    columnVisibility?: { visibleColumnIds: string[]; onChange: (columnIds: string[]) => void };
  };
  rowLayout?: 'single-line' | 'multiline';
  density?: 'compact' | 'comfortable';
  stickyHeader?: { maxHeight?: number; offset?: number } | boolean;
  sorting?: {
    columnId: string;
    direction: 'asc' | 'desc';
    onChange: (next: { columnId: string; direction: 'asc' | 'desc' }) => void;
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
    bulkActions?: React.ReactNode;
  };
  renderDetail?: (row: T) => React.ReactNode;
  expansion?: {
    expandedRowIds: string[];
    onChange: (ids: string[]) => void;
    isRowExpandable?: (row: T) => boolean;
    trigger?: 'chevron' | 'information';
    ariaLabel?: string;
  };
  getRowVisual?: (row: T) => { indicatorClassName?: string; className?: string } | undefined;
  searchHighlight?: { query: string };
  getRowActions?: (row: T) => React.ReactNode;
  fullscreen?: { enterLabel: string; exitLabel: string; onChange?: (active: boolean) => void };
};

const features = tableFeatures({});

export function DataTable<T extends RowData>(props: DataTableProps<T>) {
  const {
    rows,
    columns,
    getRowId,
    loading = false,
    loadingContent,
    renderLoading,
    error,
    hasActiveCriteria = false,
    renderEmpty,
    onClearCriteria,
    toolbar,
    header,
    settings,
    rowLayout = 'single-line',
    density = 'comfortable',
    stickyHeader = false,
    sorting,
    pagination,
    selection,
    renderDetail,
    expansion,
    getRowVisual,
    searchHighlight,
    getRowActions,
    fullscreen,
  } = props;
  const rootRef = React.useRef<HTMLElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [nativeFullscreen, setNativeFullscreen] = React.useState(false);
  const [fallbackFullscreen, setFallbackFullscreen] = React.useState(false);
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>({});
  const visibleColumns = settings?.columnVisibility
    ? columns.filter((column) => settings.columnVisibility?.visibleColumnIds.includes(column.id))
    : columns;
  const tableColumns = React.useMemo<ColumnDef<typeof features, T>[]>(
    () =>
      visibleColumns.map((column) => ({
        id: column.id,
        header: () => column.header,
        accessorFn: column.accessor,
        cell: ({ row }) =>
          column.cell?.(row.original) ??
          highlightText(String(column.accessor(row.original) ?? ''), searchHighlight?.query),
      })),
    [visibleColumns, searchHighlight?.query]
  );
  const table = useTable({ features, data: rows, columns: tableColumns, getRowId });
  const isFullscreen = nativeFullscreen || fallbackFullscreen;
  const sticky = typeof stickyHeader === 'object' ? stickyHeader : undefined;
  const hasDetails = Boolean(renderDetail && expansion);
  const padding = rowLayout === 'multiline' ? 'py-4' : density === 'compact' ? 'py-2' : 'py-4';

  React.useEffect(() => {
    const syncFullscreen = () => {
      const active = document.fullscreenElement === rootRef.current;
      setNativeFullscreen(active);
      if (!active) triggerRef.current?.focus();
      fullscreen?.onChange?.(active);
    };
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, [fullscreen]);

  const toggleFullscreen = async () => {
    if (!fullscreen) return;
    if (document.fullscreenElement === rootRef.current) {
      await document.exitFullscreen();
      return;
    }
    try {
      if (rootRef.current?.requestFullscreen) {
        await rootRef.current.requestFullscreen();
        return;
      }
    } catch {
      // Browser policy can reject native fullscreen; use the documented local fallback.
    }
    setFallbackFullscreen((active) => {
      fullscreen.onChange?.(!active);
      return !active;
    });
  };

  const setWidth = (column: DataTableColumn<T>, width: number) => {
    const min = column.width?.min ?? 80;
    const max = column.width?.max ?? 960;
    setColumnWidths((current) => ({
      ...current,
      [column.id]: Math.min(max, Math.max(min, width)),
    }));
  };
  const toggleExpansion = (rowId: string) =>
    expansion?.onChange(
      expansion.expandedRowIds.includes(rowId)
        ? expansion.expandedRowIds.filter((id) => id !== rowId)
        : [...expansion.expandedRowIds, rowId]
    );
  const toggleSelection = (rowId: string, checked: boolean) =>
    selection?.onChange(
      checked
        ? [...selection.selectedRowIds, rowId]
        : selection.selectedRowIds.filter((id) => id !== rowId)
    );
  const selectableRows = table
    .getRowModel()
    .rows.filter((row) => selection?.isRowSelectable?.(row.original) ?? true);
  const allSelected =
    selectableRows.length > 0 &&
    selectableRows.every((row) => selection?.selectedRowIds.includes(row.id));
  const pageNumbers = pagination ? getPageNumbers(pagination.page, pagination.totalPages) : [];

  return (
    <section
      ref={rootRef}
      className={`w-full rounded-xl border border-border bg-card shadow-sm ${isFullscreen ? 'fixed inset-0 z-50 flex h-dvh flex-col rounded-none' : ''}`}
    >
      {header?.title || header?.actions || fullscreen ? (
        <div className="flex min-h-14 items-center gap-3 border-b px-4 py-3">
          {header?.title ? (
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">{header.title}</div>
              {loading ? (
                <RefreshCw
                  aria-label="Loading"
                  className="size-4 animate-spin text-muted-foreground"
                />
              ) : null}
            </div>
          ) : null}
          <div className="ml-auto flex items-center gap-2">
            {header?.actions}
            {settings?.density || settings?.columnVisibility ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Table settings"
                    title="Table settings"
                    className="inline-flex size-9 items-center justify-center rounded-md border"
                  >
                    <Settings2 className="size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Table settings</DropdownMenuLabel>
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
                          Density
                        </DropdownMenuLabel>
                        <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="comfortable">
                          Comfortable
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </>
                  ) : null}
                  {settings.columnVisibility ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                          Display columns
                        </DropdownMenuLabel>
                        {columns.map((column) => (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            checked={settings.columnVisibility?.visibleColumnIds.includes(
                              column.id
                            )}
                            disabled={column.visibility?.hideable === false}
                            onCheckedChange={(checked) => {
                              const current = settings.columnVisibility?.visibleColumnIds ?? [];
                              settings.columnVisibility?.onChange(
                                checked
                                  ? [...current, column.id]
                                  : current.filter((id) => id !== column.id)
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
            ) : null}
            {fullscreen ? (
              <button
                ref={triggerRef}
                type="button"
                aria-label={isFullscreen ? fullscreen.exitLabel : fullscreen.enterLabel}
                title={isFullscreen ? fullscreen.exitLabel : fullscreen.enterLabel}
                onClick={toggleFullscreen}
                className="inline-flex size-9 items-center justify-center rounded-md border"
              >
                <span className="sr-only">
                  {isFullscreen ? fullscreen.exitLabel : fullscreen.enterLabel}
                </span>
                {isFullscreen ? <Shrink className="size-4" /> : <Expand className="size-4" />}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
      {toolbar ? (
        <div className="flex flex-wrap items-center gap-3 border-b p-4">
          {toolbar.leading}
          {toolbar.search ? (
            <label className="flex min-w-52 flex-1 items-center gap-2 rounded-md border bg-background px-3 py-2">
              <Search className="size-4 text-muted-foreground" />
              <span className="sr-only">
                {toolbar.search.ariaLabel ?? toolbar.search.placeholder}
              </span>
              <input
                value={toolbar.search.value}
                onChange={(event) => toolbar.search?.onChange(event.target.value)}
                placeholder={toolbar.search.placeholder}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
          ) : null}
          {toolbar.filters ? (
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-muted-foreground" />
              {toolbar.filters}
            </div>
          ) : null}
          {toolbar.trailing}
        </div>
      ) : null}
      {selection?.selectedRowIds.length && selection.bulkActions ? (
        <div className="flex items-center gap-3 border-b bg-muted/40 px-4 py-2 text-sm">
          <span>{selection.selectedRowIds.length} selected</span>
          {selection.bulkActions}
        </div>
      ) : null}
      {error ? (
        <div className="m-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <p className="font-medium">{error.message}</p>
          {error.onRetry ? (
            <button type="button" onClick={error.onRetry} className="mt-2 underline">
              Retry
            </button>
          ) : null}
        </div>
      ) : null}
      {loading && loadingContent ? (
        <div aria-live="polite" aria-label="Loading table results">
          {loadingContent}
        </div>
      ) : (
        <div
          className={`min-h-0 ${isFullscreen ? 'flex-1 overflow-auto' : stickyHeader ? 'overflow-auto' : 'overflow-x-auto'}`}
          style={
            sticky ? { maxHeight: sticky.maxHeight, scrollMarginTop: sticky.offset } : undefined
          }
          aria-label="Data table results"
          tabIndex={0}
        >
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
            <thead
              className={
                stickyHeader || isFullscreen
                  ? 'sticky top-0 z-10 bg-muted/95 backdrop-blur'
                  : 'bg-muted/70'
              }
            >
              <tr>
                {selection ? (
                  <th className="border-b px-3 py-3">
                    <input
                      aria-label="Select all rows"
                      type="checkbox"
                      checked={allSelected}
                      onChange={(event) =>
                        selection.onChange(
                          event.target.checked ? selectableRows.map((row) => row.id) : []
                        )
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
                    const direction =
                      sorting?.columnId === column.id ? sorting.direction : undefined;
                    const width =
                      columnWidths[column.id] ?? column.width?.initial ?? column.width?.min ?? 80;
                    return (
                      <th
                        key={header.id}
                        scope="col"
                        aria-sort={
                          direction === 'asc'
                            ? 'ascending'
                            : direction === 'desc'
                              ? 'descending'
                              : 'none'
                        }
                        className={`relative border-b px-4 py-3 font-medium ${column.align === 'end' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}
                      >
                        {column.sorting?.enabled ? (
                          <button
                            type="button"
                            onClick={() =>
                              sorting?.onChange({
                                columnId: column.id,
                                direction: direction === 'asc' ? 'desc' : 'asc',
                              })
                            }
                            className="inline-flex items-center gap-1"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <ChevronsUpDown className="size-3.5 text-muted-foreground" />
                          </button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                        {column.width?.resizable && column.width.min && column.width.max ? (
                          <span
                            role="separator"
                            aria-label={`Resize ${column.ariaLabel ?? column.id} column`}
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
                                setWidth(column, width + moveEvent.clientX - startX);
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
                                setWidth(column, width - step);
                              } else if (event.key === 'ArrowRight') {
                                event.preventDefault();
                                setWidth(column, width + step);
                              } else if (event.key === 'Home') {
                                event.preventDefault();
                                setWidth(column, column.width?.min ?? 80);
                              } else if (event.key === 'End') {
                                event.preventDefault();
                                setWidth(column, column.width?.max ?? 960);
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
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
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
                    {getRowActions ? <td /> : null}
                  </tr>
                ))
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => {
                  const visual = getRowVisual?.(row.original);
                  const isExpandable =
                    hasDetails && (expansion?.isRowExpandable?.(row.original) ?? true);
                  const isExpanded = expansion?.expandedRowIds.includes(row.id) ?? false;
                  return (
                    <React.Fragment key={row.id}>
                      <tr className={`border-b hover:bg-muted/40 ${visual?.className ?? ''}`}>
                        {selection ? (
                          <td className="relative px-3">
                            {visual?.indicatorClassName ? (
                              <span
                                aria-hidden
                                className={`absolute inset-y-0 left-0 w-1 ${visual.indicatorClassName}`}
                              />
                            ) : null}
                            <input
                              aria-label={`Select row ${row.id}`}
                              type="checkbox"
                              disabled={!(selection.isRowSelectable?.(row.original) ?? true)}
                              checked={selection.selectedRowIds.includes(row.id)}
                              onChange={(event) => toggleSelection(row.id, event.target.checked)}
                            />
                          </td>
                        ) : null}
                        {hasDetails ? (
                          <td className="relative px-3">
                            {visual?.indicatorClassName && !selection ? (
                              <span
                                aria-hidden
                                className={`absolute inset-y-0 left-0 w-1 ${visual.indicatorClassName}`}
                              />
                            ) : null}
                            {isExpandable ? (
                              <button
                                type="button"
                                aria-expanded={isExpanded}
                                aria-controls={`detail-${row.id}`}
                                aria-label={expansion?.ariaLabel ?? 'Show additional details'}
                                onClick={() => toggleExpansion(row.id)}
                              >
                                {expansion?.trigger === 'information' ? (
                                  <Info className="size-4" />
                                ) : isExpanded ? (
                                  <ChevronDown className="size-4" />
                                ) : (
                                  <ChevronRight className="size-4" />
                                )}
                              </button>
                            ) : null}
                          </td>
                        ) : null}
                        {row.getAllCells().map((cell) => {
                          const column = visibleColumns.find((item) => item.id === cell.column.id);
                          const isFirstDataCell = cell.column.id === visibleColumns[0]?.id;
                          return (
                            <td
                              key={cell.id}
                              className={`relative px-4 ${padding} align-top ${column?.align === 'end' ? 'text-right' : column?.align === 'center' ? 'text-center' : 'text-left'} ${column?.textBehavior === 'wrap' ? 'break-words whitespace-normal' : column?.textBehavior === 'truncate' ? 'truncate whitespace-nowrap' : 'whitespace-nowrap'}`}
                            >
                              {visual?.indicatorClassName &&
                              !selection &&
                              !hasDetails &&
                              isFirstDataCell ? (
                                <span
                                  aria-hidden
                                  className={`absolute inset-y-0 left-0 w-1 ${visual.indicatorClassName}`}
                                />
                              ) : null}
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          );
                        })}
                        {getRowActions ? (
                          <td className="px-3 text-right">{getRowActions(row.original)}</td>
                        ) : null}
                      </tr>
                      {hasDetails && isExpanded ? (
                        <tr id={`detail-${row.id}`}>
                          <td
                            colSpan={visibleColumns.length + (selection ? 1 : 0) + 2}
                            className="border-b bg-muted/30 p-4"
                          >
                            {renderDetail?.(row.original)}
                          </td>
                        </tr>
                      ) : null}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={
                      visibleColumns.length +
                      (selection ? 1 : 0) +
                      (hasDetails ? 1 : 0) +
                      (getRowActions ? 1 : 0)
                    }
                    className="p-12 text-center text-muted-foreground"
                  >
                    {renderEmpty?.({ filtered: hasActiveCriteria, onClearCriteria }) ??
                      (hasActiveCriteria ? (
                        <>
                          <p>No results match the active criteria.</p>
                          {onClearCriteria ? (
                            <button
                              type="button"
                              onClick={onClearCriteria}
                              className="mt-2 underline"
                            >
                              Clear criteria
                            </button>
                          ) : null}
                        </>
                      ) : (
                        'No results.'
                      ))}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {pagination && !loading ? (
        <nav
          aria-label="Table pagination"
          className="flex flex-col gap-4 border-t px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
            {pagination.onPerPageChange ? (
              <label className="flex items-center gap-2">
                Rows per page
                <select
                  aria-label="Rows per page"
                  value={pagination.perPage}
                  onChange={(event) => pagination.onPerPageChange?.(Number(event.target.value))}
                  className="h-8 rounded-md border bg-background px-2 text-foreground"
                >
                  {(pagination.pageSizes ?? [10, 20, 50, 100]).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <span>
              Showing {Math.min((pagination.page - 1) * pagination.perPage + 1, pagination.total)}-
              {Math.min(pagination.page * pagination.perPage, pagination.total)} of{' '}
              {pagination.total}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1">
            <button
              type="button"
              aria-label="Previous page"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onChange(pagination.page - 1)}
              className="inline-flex h-8 items-center gap-1 rounded-md border px-2 disabled:opacity-50"
            >
              <ChevronLeft className="size-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            {pageNumbers.map((item, index) =>
              item === 'ellipsis' ? (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  aria-current={item === pagination.page ? 'page' : undefined}
                  onClick={() => pagination.onChange(item)}
                  className={`size-8 rounded-md border ${item === pagination.page ? 'border-primary bg-primary text-primary-foreground' : 'bg-background'}`}
                >
                  {item}
                </button>
              )
            )}
            <button
              type="button"
              aria-label="Next page"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => pagination.onChange(pagination.page + 1)}
              className="inline-flex h-8 items-center gap-1 rounded-md border px-2 disabled:opacity-50"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        </nav>
      ) : null}
    </section>
  );
}

function highlightText(value: string, query?: string) {
  const normalizedQuery = query?.trim();
  if (!normalizedQuery) return value;
  const parts = value.split(new RegExp(`(${escapeRegExp(normalizedQuery)})`, 'ig'));
  return parts.map((part, index) =>
    part.toLocaleLowerCase() === normalizedQuery.toLocaleLowerCase() ? (
      <mark
        key={index}
        className="rounded-sm bg-amber-200/70 px-0.5 text-inherit dark:bg-amber-400/30"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getPageNumbers(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  const pages: Array<number | 'ellipsis'> = [1];
  if (currentPage > 3) pages.push('ellipsis');
  for (
    let page = Math.max(2, currentPage - 1);
    page <= Math.min(totalPages - 1, currentPage + 1);
    page += 1
  )
    pages.push(page);
  if (currentPage < totalPages - 2) pages.push('ellipsis');
  pages.push(totalPages);
  return pages;
}
