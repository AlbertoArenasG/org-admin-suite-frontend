'use client';

import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Expand,
  Info,
  MessageSquareText,
  Shrink,
} from 'lucide-react';
import {
  flexRender,
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
} from '@tanstack/react-table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DataTableChrome } from './DataTableChrome';
import { DataTablePagination } from './DataTablePagination';
import { DataTableResultsRegion } from './DataTableResultsRegion';
import { highlightText } from './dataTableHighlight';
import { defaultDataTableLabels } from './DataTable.types';
import type { DataTableColumn, DataTableProps } from './DataTable.types';

export type { DataTableColumn, DataTableProps } from './DataTable.types';

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
  const labels = { ...defaultDataTableLabels, ...labelsOverride };
  const rootRef = React.useRef<HTMLElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const chromeRef = React.useRef<HTMLDivElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const paginationRef = React.useRef<HTMLElement>(null);
  const [nativeFullscreen, setNativeFullscreen] = React.useState(false);
  const [fallbackFullscreen, setFallbackFullscreen] = React.useState(false);
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>({});
  const [availableResultsHeight, setAvailableResultsHeight] = React.useState<number | null>(null);
  const reduceMotion = useReducedMotion();
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
      <DataTableChrome
        ref={chromeRef}
        header={header}
        toolbar={toolbar}
        loading={loading}
        settings={settings}
        settingsPlacement={settingsPlacement}
        rowLayout={rowLayout}
        columns={columns}
        labels={labels}
        fullscreenControl={
          fullscreen ? (
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
          ) : undefined
        }
      />
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
        <DataTableResultsRegion
          ref={resultsRef}
          className={resultsClassName}
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
                    const SortIcon =
                      direction === 'asc'
                        ? ArrowUp
                        : direction === 'desc'
                          ? ArrowDown
                          : ArrowUpDown;
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
                      {hasDetails ? (
                        <tr id={`detail-${row.id}`}>
                          <td
                            colSpan={totalColumnCount}
                            className={isExpanded ? 'border-b bg-muted p-0' : 'p-0'}
                          >
                            <AnimatePresence initial={false}>
                              {isExpanded ? (
                                <motion.div
                                  className="overflow-hidden"
                                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                                  animate={
                                    reduceMotion ? undefined : { height: 'auto', opacity: 1 }
                                  }
                                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                                  transition={
                                    reduceMotion ? undefined : { duration: 0.26, ease: 'easeOut' }
                                  }
                                >
                                  <div className="p-4">{renderDetail?.(row.original)}</div>
                                </motion.div>
                              ) : null}
                            </AnimatePresence>
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
        </DataTableResultsRegion>
      )}
      {pagination && !loading ? (
        <DataTablePagination ref={paginationRef} pagination={pagination} labels={labels} />
      ) : null}
    </section>
  );
}
