'use client';

import * as React from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Expand,
  Info,
  MessageSquareText,
  RefreshCw,
  Search,
  Settings2,
  Shrink,
  SlidersHorizontal,
  X,
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type DataTableColumn<T extends RowData> = {
  id: string;
  header: React.ReactNode;
  ariaLabel?: string;
  accessor: (row: T) => unknown;
  cell?: (row: T, context: { highlight: (value: string) => React.ReactNode }) => React.ReactNode;
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
  compact?: boolean;
};

type TableHeader = {
  title?: React.ReactNode;
  actions?: React.ReactNode;
};

type DataTableLabels = {
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
};

const defaultLabels: DataTableLabels = {
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
    trigger?: 'chevron' | 'information' | 'feedback';
    ariaLabel?: string;
  };
  getRowVisual?: (
    row: T
  ) => { indicatorClassName?: string; indicatorColor?: string; className?: string } | undefined;
  searchHighlight?: { query: string; columnIds?: string[] };
  getRowActions?: (row: T) => React.ReactNode;
  fullscreen?: { enterLabel: string; exitLabel: string; onChange?: (active: boolean) => void };
  labels?: Partial<DataTableLabels>;
};

const features = tableFeatures({});

function DataTableSettingsMenu<T extends RowData>({
  settings,
  rowLayout,
  columns,
  labels,
}: {
  settings: DataTableProps<T>['settings'];
  rowLayout: DataTableProps<T>['rowLayout'];
  columns: DataTableColumn<T>[];
  labels: DataTableLabels;
}) {
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
    settingsPlacement = 'header',
    rowLayout = 'single-line',
    density = 'comfortable',
    scrollRegion,
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
    labels: labelsOverride,
  } = props;
  const labels = { ...defaultLabels, ...labelsOverride };
  const rootRef = React.useRef<HTMLElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const chromeRef = React.useRef<HTMLDivElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const paginationRef = React.useRef<HTMLElement>(null);
  const [nativeFullscreen, setNativeFullscreen] = React.useState(false);
  const [fallbackFullscreen, setFallbackFullscreen] = React.useState(false);
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>({});
  const [availableResultsHeight, setAvailableResultsHeight] = React.useState<number | null>(null);
  const visibleColumns = settings?.columnVisibility
    ? columns.filter((column) => settings.columnVisibility?.visibleColumnIds.includes(column.id))
    : columns;
  const tableColumns = React.useMemo<ColumnDef<typeof features, T>[]>(
    () =>
      visibleColumns.map((column) => {
        const shouldHighlight =
          Boolean(searchHighlight?.query.trim()) &&
          (!searchHighlight?.columnIds || searchHighlight.columnIds.includes(column.id));
        const highlight = (value: string) =>
          shouldHighlight ? highlightText(value, searchHighlight?.query) : value;

        return {
          id: column.id,
          header: () => column.header,
          accessorFn: column.accessor,
          cell: ({ row }) =>
            column.cell?.(row.original, { highlight }) ??
            highlight(String(column.accessor(row.original) ?? '')),
        };
      }),
    [visibleColumns, searchHighlight?.columnIds, searchHighlight?.query]
  );
  const table = useTable({ features, data: rows, columns: tableColumns, getRowId });
  const isFullscreen = nativeFullscreen || fallbackFullscreen;
  const sticky = typeof stickyHeader === 'object' ? stickyHeader : undefined;
  const scrollRegionDesktopOnly = Boolean(scrollRegion?.desktopOnly);
  const stickyDesktopOnly = sticky?.desktopOnly ?? scrollRegionDesktopOnly;
  const usesAvailableHeight = scrollRegion?.maxHeight === 'available';
  const hasDetails = Boolean(renderDetail && expansion);
  const totalColumnCount =
    visibleColumns.length + (selection ? 1 : 0) + (hasDetails ? 1 : 0) + (getRowActions ? 1 : 0);
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
  const scrollRegionMaxHeight =
    scrollRegion?.maxHeight === 'available'
      ? (availableResultsHeight ?? undefined)
      : scrollRegion?.maxHeight;
  const scrollRegionOverscrollClass =
    scrollRegion?.overscrollBehavior === 'none' ? 'overscroll-y-none' : 'overscroll-y-contain';
  const scrollRegionDesktopOverscrollClass =
    scrollRegion?.overscrollBehavior === 'none'
      ? 'md:overscroll-y-none'
      : 'md:overscroll-y-contain';
  const resultsClassName = isFullscreen
    ? 'flex-1 overflow-auto overscroll-y-contain'
    : scrollRegion
      ? scrollRegionDesktopOnly
        ? `overflow-x-auto md:overflow-auto ${scrollRegionDesktopOverscrollClass} md:max-h-(--data-table-results-max-height)`
        : `overflow-auto ${scrollRegionOverscrollClass}`
      : 'overflow-x-auto';
  const tableHeaderClassName = isFullscreen
    ? 'sticky top-0 z-10 bg-muted/95 backdrop-blur'
    : stickyHeader
      ? stickyDesktopOnly
        ? 'bg-muted/70 md:sticky md:top-0 md:z-10 md:bg-muted/95 md:backdrop-blur'
        : 'sticky top-0 z-10 bg-muted/95 backdrop-blur'
      : 'bg-muted/70';

  React.useLayoutEffect(() => {
    if (!usesAvailableHeight || isFullscreen) {
      setAvailableResultsHeight(null);
      return;
    }

    const resultsElement = resultsRef.current;
    if (!resultsElement) return;
    const scrollViewport = resultsElement.closest<HTMLElement>(
      '[data-dashboard-scroll-owner], [data-dashboard-scroll-viewport]'
    );

    const updateAvailableHeight = () => {
      const resultsTop = resultsElement.getBoundingClientRect().top;
      const viewportBottom = scrollViewport?.getBoundingClientRect().bottom ?? window.innerHeight;
      const viewportPaddingBottom = scrollViewport
        ? Number.parseFloat(window.getComputedStyle(scrollViewport).paddingBottom) || 0
        : 0;
      const paginationHeight = paginationRef.current?.getBoundingClientRect().height ?? 0;
      const nextHeight = Math.max(
        0,
        Math.floor(viewportBottom - viewportPaddingBottom - resultsTop - paginationHeight)
      );

      setAvailableResultsHeight((current) => (current === nextHeight ? current : nextHeight));
    };

    updateAvailableHeight();
    const observer = new ResizeObserver(updateAvailableHeight);
    observer.observe(resultsElement);
    if (chromeRef.current) observer.observe(chromeRef.current);
    if (paginationRef.current) observer.observe(paginationRef.current);
    if (scrollViewport) observer.observe(scrollViewport);
    scrollViewport?.addEventListener('scroll', updateAvailableHeight, { passive: true });
    window.addEventListener('resize', updateAvailableHeight);

    return () => {
      observer.disconnect();
      scrollViewport?.removeEventListener('scroll', updateAvailableHeight);
      window.removeEventListener('resize', updateAvailableHeight);
    };
  }, [isFullscreen, loading, pagination, usesAvailableHeight]);

  return (
    <section
      ref={rootRef}
      className={`w-full rounded-xl border border-border bg-card shadow-sm ${isFullscreen ? 'fixed inset-0 z-50 flex h-dvh flex-col rounded-none' : ''}`}
    >
      {header?.title || header?.actions || fullscreen || toolbar ? (
        <div ref={chromeRef}>
          {header?.title || header?.actions || fullscreen ? (
            <div className="flex min-h-14 items-center gap-3 border-b px-4 py-3">
              {header?.title ? (
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{header.title}</div>
                  {loading ? (
                    <RefreshCw
                      aria-label={labels.loading}
                      className="size-4 animate-spin text-muted-foreground"
                    />
                  ) : null}
                </div>
              ) : null}
              <div className="ml-auto flex items-center gap-2">
                {header?.actions}
                {settingsPlacement === 'header' ? (
                  <DataTableSettingsMenu
                    settings={settings}
                    rowLayout={rowLayout}
                    columns={columns}
                    labels={labels}
                  />
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
            <div
              className={`flex flex-wrap items-center gap-3 border-b ${toolbar.compact ? 'p-2' : 'p-4'}`}
            >
              {toolbar.leading}
              {toolbar.search ? (
                <div className="flex min-w-52 flex-1 items-center gap-2 rounded-md border bg-background px-3 py-2">
                  <Search className="size-4 text-muted-foreground" />
                  <input
                    value={toolbar.search.value}
                    onChange={(event) => toolbar.search?.onChange(event.target.value)}
                    placeholder={toolbar.search.placeholder}
                    aria-label={toolbar.search.ariaLabel ?? toolbar.search.placeholder}
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                  {toolbar.search.value ? (
                    <button
                      type="button"
                      onClick={() => toolbar.search?.onChange('')}
                      className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={labels.clearSearch}
                    >
                      <X className="size-4" />
                    </button>
                  ) : null}
                </div>
              ) : null}
              {toolbar.filters ? (
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-muted-foreground" />
                  {toolbar.filters}
                </div>
              ) : null}
              {toolbar.trailing}
              {settingsPlacement === 'toolbar' ? (
                <DataTableSettingsMenu
                  settings={settings}
                  rowLayout={rowLayout}
                  columns={columns}
                  labels={labels}
                />
              ) : null}
            </div>
          ) : null}
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
        <div aria-live="polite" aria-label={labels.loadingResults}>
          {loadingContent}
        </div>
      ) : (
        <div
          ref={resultsRef}
          className={`min-h-0 ${resultsClassName}`}
          style={
            scrollRegion && !isFullscreen
              ? scrollRegionDesktopOnly
                ? ({
                    '--data-table-results-max-height':
                      scrollRegionMaxHeight === undefined
                        ? undefined
                        : `${scrollRegionMaxHeight}px`,
                    scrollMarginTop: sticky?.offset,
                  } as React.CSSProperties)
                : { maxHeight: scrollRegionMaxHeight, scrollMarginTop: sticky?.offset }
              : undefined
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
            <thead className={tableHeaderClassName}>
              <tr>
                {selection ? (
                  <th className="border-b px-3 py-3">
                    <input
                      aria-label={labels.selectAllRows}
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
                            {visual?.indicatorClassName || visual?.indicatorColor ? (
                              <span
                                aria-hidden
                                className={`absolute inset-y-0 left-0 w-1 ${visual.indicatorClassName}`}
                                style={
                                  visual.indicatorColor
                                    ? { backgroundColor: visual.indicatorColor }
                                    : undefined
                                }
                              />
                            ) : null}
                            <input
                              aria-label={labels.selectRow(row.id)}
                              type="checkbox"
                              disabled={!(selection.isRowSelectable?.(row.original) ?? true)}
                              checked={selection.selectedRowIds.includes(row.id)}
                              onChange={(event) => toggleSelection(row.id, event.target.checked)}
                            />
                          </td>
                        ) : null}
                        {hasDetails ? (
                          <td className="relative px-3">
                            {(visual?.indicatorClassName || visual?.indicatorColor) &&
                            !selection ? (
                              <span
                                aria-hidden
                                className={`absolute inset-y-0 left-0 w-1 ${visual.indicatorClassName}`}
                                style={
                                  visual.indicatorColor
                                    ? { backgroundColor: visual.indicatorColor }
                                    : undefined
                                }
                              />
                            ) : null}
                            {isExpandable ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    aria-expanded={isExpanded}
                                    aria-controls={`detail-${row.id}`}
                                    aria-label={expansion?.ariaLabel ?? labels.additionalDetails}
                                    onClick={() => toggleExpansion(row.id)}
                                    className={
                                      expansion?.trigger === 'feedback'
                                        ? 'relative inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                        : undefined
                                    }
                                  >
                                    {expansion?.trigger === 'information' ? (
                                      <Info className="size-4" />
                                    ) : expansion?.trigger === 'feedback' ? (
                                      <>
                                        <MessageSquareText className="size-4" />
                                        {!isExpanded ? (
                                          <span
                                            aria-hidden
                                            className="absolute right-1 top-1 size-1.5 rounded-full bg-primary"
                                          />
                                        ) : null}
                                      </>
                                    ) : isExpanded ? (
                                      <ChevronDown className="size-4" />
                                    ) : (
                                      <ChevronRight className="size-4" />
                                    )}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  {expansion?.ariaLabel ?? labels.additionalDetails}
                                </TooltipContent>
                              </Tooltip>
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
                              {(visual?.indicatorClassName || visual?.indicatorColor) &&
                              !selection &&
                              !hasDetails &&
                              isFirstDataCell ? (
                                <span
                                  aria-hidden
                                  className={`absolute inset-y-0 left-0 w-1 ${visual.indicatorClassName}`}
                                  style={
                                    visual.indicatorColor
                                      ? { backgroundColor: visual.indicatorColor }
                                      : undefined
                                  }
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
                          <td colSpan={totalColumnCount} className="border-b bg-muted/30 p-4">
                            {renderDetail?.(row.original)}
                          </td>
                        </tr>
                      ) : null}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={totalColumnCount} className="p-12 text-center text-muted-foreground">
                    {renderEmpty?.({ filtered: hasActiveCriteria, onClearCriteria }) ??
                      (hasActiveCriteria ? (
                        <>
                          <p>{labels.noResultsForCriteria}</p>
                          {onClearCriteria ? (
                            <button
                              type="button"
                              onClick={onClearCriteria}
                              className="mt-2 underline"
                            >
                              {labels.clearCriteria}
                            </button>
                          ) : null}
                        </>
                      ) : (
                        labels.noResults
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
          ref={paginationRef}
          aria-label={labels.pagination}
          className="flex flex-col gap-4 border-t px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
            {pagination.onPerPageChange ? (
              <label className="flex items-center gap-2">
                {labels.rowsPerPage}
                <select
                  aria-label={labels.rowsPerPage}
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
              {labels.paginationSummary({
                from: Math.min((pagination.page - 1) * pagination.perPage + 1, pagination.total),
                to: Math.min(pagination.page * pagination.perPage, pagination.total),
                total: pagination.total,
              })}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1">
            <button
              type="button"
              aria-label={labels.previousPage}
              disabled={pagination.page <= 1}
              onClick={() => pagination.onChange(pagination.page - 1)}
              className="inline-flex h-8 items-center gap-1 rounded-md border px-2 disabled:opacity-50"
            >
              <ChevronLeft className="size-4" />
              <span className="hidden sm:inline">{labels.previousPage}</span>
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
              aria-label={labels.nextPage}
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => pagination.onChange(pagination.page + 1)}
              className="inline-flex h-8 items-center gap-1 rounded-md border px-2 disabled:opacity-50"
            >
              <span className="hidden sm:inline">{labels.nextPage}</span>
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
      <mark key={index} className="data-table-search-highlight rounded-sm px-0.5">
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
