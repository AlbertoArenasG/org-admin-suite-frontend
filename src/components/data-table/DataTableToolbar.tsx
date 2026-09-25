import { Search, SlidersHorizontal, X } from 'lucide-react';

import type {
  DataTableLabels,
  DataTableToolbar as DataTableToolbarConfig,
} from './DataTable.types';

type DataTableToolbarProps = {
  toolbar: DataTableToolbarConfig;
  labels: DataTableLabels;
  settingsMenu?: React.ReactNode;
};

export function DataTableToolbar({ toolbar, labels, settingsMenu }: DataTableToolbarProps) {
  return (
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
      {settingsMenu}
      {toolbar.primaryActions}
    </div>
  );
}
