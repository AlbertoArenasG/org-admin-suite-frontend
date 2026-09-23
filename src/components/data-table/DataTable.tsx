'use client';

import * as React from 'react';
import { Expand, Shrink } from 'lucide-react';
import { tableFeatures, useTable, type RowData } from '@tanstack/react-table';

import { DataTableChrome } from './DataTableChrome';
import { DataTableContent } from './DataTableContent';
import { DataTableErrorState } from './DataTableErrorState';
import { DataTablePagination } from './DataTablePagination';
import { DataTableResultsRegion } from './DataTableResultsRegion';
import { createDataTableColumns, getVisibleDataTableColumns } from './dataTableColumns';
import {
  clampDataTableColumnWidth,
  getDataTableColumnHeadersClassName,
  getDataTableResultsClassName,
  getDataTableRowPadding,
} from './dataTableLayout';
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
  const searchQuery = searchHighlight?.query;
  const searchHighlightColumnIds = searchHighlight?.columnIds;
  const visibleColumns = getVisibleDataTableColumns(columns, settings);
  const tableColumns = React.useMemo(
    () => createDataTableColumns(visibleColumns, searchQuery, searchHighlightColumnIds),
    [visibleColumns, searchHighlightColumnIds, searchQuery]
  );
  const table = useTable({ features, data: rows, columns: tableColumns, getRowId });
  const isFullscreen = nativeFullscreen || fallbackFullscreen;
  const sticky = typeof stickyHeader === 'object' ? stickyHeader : undefined;
  const usesAvailableHeight = scrollRegion?.maxHeight === 'available';
  const hasDetails = Boolean(renderDetail && expansion);
  const totalColumnCount =
    visibleColumns.length + (selection ? 1 : 0) + (hasDetails ? 1 : 0) + (getRowActions ? 1 : 0);
  const padding = getDataTableRowPadding(rowLayout, density);

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
    setColumnWidths((current) => ({
      ...current,
      [column.id]: clampDataTableColumnWidth(column, width),
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
  const resultsClassName = getDataTableResultsClassName({ isFullscreen, scrollRegion });
  const tableHeaderClassName = getDataTableColumnHeadersClassName({
    isFullscreen,
    stickyHeader,
    scrollRegion,
  });

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
      {error ? <DataTableErrorState error={error} /> : null}
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
              ? scrollRegion.desktopOnly
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
