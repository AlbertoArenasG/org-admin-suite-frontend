import { RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';

import type { DataTableHeader as DataTableHeaderConfig, DataTableLabels } from './DataTable.types';

type DataTableHeaderProps = {
  header?: DataTableHeaderConfig;
  loading: boolean;
  labels: DataTableLabels;
  settingsMenu?: ReactNode;
  fullscreenControl?: ReactNode;
};

export function DataTableHeader({
  header,
  loading,
  labels,
  settingsMenu,
  fullscreenControl,
}: DataTableHeaderProps) {
  if (!header?.title && !header?.actions && !fullscreenControl) return null;

  return (
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
        {settingsMenu}
        {fullscreenControl}
      </div>
    </div>
  );
}
