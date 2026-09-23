'use client';

import * as React from 'react';
import { Expand, Shrink } from 'lucide-react';
import { tableFeatures, useTable, type ColumnDef, type RowData } from '@tanstack/react-table';

import { DataTableChrome } from './DataTableChrome';
import { DataTableContent } from './DataTableContent';
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
          <DataTableContent
            table={table}
            visibleColumns={visibleColumns}
            columnWidths={columnWidths}
            selection={selection}
            hasDetails={hasDetails}
            getRowActions={getRowActions}
            sorting={sorting}
            labels={labels}
            tableHeaderClassName={tableHeaderClassName}
            loading={loading}
            renderLoading={renderLoading}
            expansion={expansion}
            renderDetail={renderDetail}
            getRowVisual={getRowVisual}
            totalColumnCount={totalColumnCount}
            hasActiveCriteria={hasActiveCriteria}
            renderEmpty={renderEmpty}
            onClearCriteria={onClearCriteria}
            padding={padding}
            onColumnWidthChange={setWidth}
            onSelectionChange={toggleSelection}
            onExpansionChange={toggleExpansion}
          />
        </DataTableResultsRegion>
      )}
      {pagination && !loading ? (
        <DataTablePagination ref={paginationRef} pagination={pagination} labels={labels} />
      ) : null}
    </section>
  );
}
