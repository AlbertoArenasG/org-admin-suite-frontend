import type { RowData } from '@tanstack/react-table';
import { forwardRef, type ReactNode } from 'react';

import { DataTableHeader } from './DataTableHeader';
import { DataTableSettingsMenu } from './DataTableSettingsMenu';
import { DataTableToolbar } from './DataTableToolbar';
import type { DataTableColumn, DataTableLabels, DataTableProps } from './DataTable.types';

type DataTableChromeProps<T extends RowData> = {
  header?: DataTableProps<T>['header'];
  toolbar?: DataTableProps<T>['toolbar'];
  loading: boolean;
  settings: DataTableProps<T>['settings'];
  settingsPlacement: 'header' | 'toolbar';
  rowLayout: DataTableProps<T>['rowLayout'];
  columns: DataTableColumn<T>[];
  labels: DataTableLabels;
  fullscreenControl?: ReactNode;
};

function DataTableChromeComponent<T extends RowData>(
  {
    header,
    toolbar,
    loading,
    settings,
    settingsPlacement,
    rowLayout,
    columns,
    labels,
    fullscreenControl,
  }: DataTableChromeProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  if (!header?.title && !header?.actions && !fullscreenControl && !toolbar) return null;

  const settingsMenu = (
    <DataTableSettingsMenu
      settings={settings}
      rowLayout={rowLayout}
      columns={columns}
      labels={labels}
    />
  );

  return (
    <div ref={ref}>
      <DataTableHeader
        header={header}
        loading={loading}
        labels={labels}
        settingsMenu={settingsPlacement === 'header' ? settingsMenu : undefined}
        fullscreenControl={fullscreenControl}
      />
      {toolbar ? (
        <DataTableToolbar
          toolbar={toolbar}
          labels={labels}
          settingsMenu={settingsPlacement === 'toolbar' ? settingsMenu : undefined}
        />
      ) : null}
    </div>
  );
}

export const DataTableChrome = forwardRef(DataTableChromeComponent) as <T extends RowData>(
  props: DataTableChromeProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReactNode;
