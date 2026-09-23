import type { RowData } from '@tanstack/react-table';

import type { DataTableColumn, DataTableProps } from './DataTable.types';

export function clampDataTableColumnWidth<T extends RowData>(
  column: DataTableColumn<T>,
  width: number
) {
  const min = column.width?.min ?? 80;
  const max = column.width?.max ?? 960;
  return Math.min(max, Math.max(min, width));
}

export function getDataTableRowPadding(
  rowLayout: DataTableProps<never>['rowLayout'],
  density: DataTableProps<never>['density']
) {
  return rowLayout === 'multiline' ? 'py-4' : density === 'compact' ? 'py-2' : 'py-4';
}

export function getDataTableResultsClassName({
  isFullscreen,
  scrollRegion,
}: {
  isFullscreen: boolean;
  scrollRegion: DataTableProps<never>['scrollRegion'];
}) {
  const desktopOnly = Boolean(scrollRegion?.desktopOnly);
  const overscrollClass =
    scrollRegion?.overscrollBehavior === 'none' ? 'overscroll-y-none' : 'overscroll-y-contain';
  const desktopOverscrollClass =
    scrollRegion?.overscrollBehavior === 'none'
      ? 'md:overscroll-y-none'
      : 'md:overscroll-y-contain';

  if (isFullscreen) return 'flex-1 overflow-auto overscroll-y-contain';
  if (!scrollRegion) return 'overflow-x-auto';
  if (desktopOnly) {
    return `overflow-x-auto md:overflow-auto ${desktopOverscrollClass} md:max-h-(--data-table-results-max-height)`;
  }
  return `overflow-auto ${overscrollClass}`;
}

export function getDataTableColumnHeadersClassName({
  isFullscreen,
  stickyHeader,
  scrollRegion,
}: {
  isFullscreen: boolean;
  stickyHeader: DataTableProps<never>['stickyHeader'];
  scrollRegion: DataTableProps<never>['scrollRegion'];
}) {
  const sticky = typeof stickyHeader === 'object' ? stickyHeader : undefined;
  const stickyDesktopOnly = sticky?.desktopOnly ?? Boolean(scrollRegion?.desktopOnly);

  if (isFullscreen) return 'sticky top-0 z-10 bg-muted/95 backdrop-blur';
  if (!stickyHeader) return 'bg-muted/70';
  return stickyDesktopOnly
    ? 'bg-muted/70 md:sticky md:top-0 md:z-10 md:bg-muted/95 md:backdrop-blur'
    : 'sticky top-0 z-10 bg-muted/95 backdrop-blur';
}
